// ============================================
// COMPLIANCE VALIDATOR
// Validador de cumplimiento para proyectos gubernamentales
// ============================================

import { Partida, MaterialResource, EquipmentResource, LaborResource } from '../types';

export interface ComplianceIssue {
    severity: 'error' | 'warning';
    category: 'materials' | 'equipment' | 'labor' | 'general';
    message: string;
    field?: string;
}

export interface ComplianceResult {
    isCompliant: boolean;
    errors: ComplianceIssue[];
    warnings: ComplianceIssue[];
    score: number; // 0-100
}

/**
 * Validate government project compliance for a Partida
 */
export const validateGovernmentCompliance = (
    partida: Partida,
    isGovernmentProject: boolean = false
): ComplianceResult => {
    const errors: ComplianceIssue[] = [];
    const warnings: ComplianceIssue[] = [];

    if (!isGovernmentProject) {
        // No validation needed for private projects
        return {
            isCompliant: true,
            errors: [],
            warnings: [],
            score: 100
        };
    }

    if (!partida.apu) {
        errors.push({
            severity: 'error',
            category: 'general',
            message: 'APU no definido para esta partida'
        });
        return {
            isCompliant: false,
            errors,
            warnings,
            score: 0
        };
    }

    // Validate Materials
    partida.apu.materials.forEach((material, index) => {
        const mat = material as MaterialResource;

        // Check waste factor
        if (mat.wasteFactor === undefined || mat.wasteFactor === null) {
            errors.push({
                severity: 'error',
                category: 'materials',
                message: `Material "${material.description}" sin factor de desperdicio`,
                field: `materials[${index}].wasteFactor`
            });
        }

        // Check price source
        if (!mat.priceSource || mat.priceSource === 'MANUAL') {
            warnings.push({
                severity: 'warning',
                category: 'materials',
                message: `Material "${material.description}" sin fuente de precio validada`,
                field: `materials[${index}].priceSource`
            });
        }

        // Check supplier for government projects
        if (!mat.supplier) {
            warnings.push({
                severity: 'warning',
                category: 'materials',
                message: `Material "${material.description}" sin proveedor especificado`,
                field: `materials[${index}].supplier`
            });
        }
    });

    // Validate Equipment
    partida.apu.equipment.forEach((equipment, index) => {
        const eq = equipment as EquipmentResource;

        // Check ownership type
        if (!eq.ownershipType) {
            warnings.push({
                severity: 'warning',
                category: 'equipment',
                message: `Equipo "${equipment.description}" sin tipo de propiedad definido`,
                field: `equipment[${index}].ownershipType`
            });
        }

        // Check COP for owned equipment
        if (eq.ownershipType === 'OWNED' && !eq.cop) {
            errors.push({
                severity: 'error',
                category: 'equipment',
                message: `Equipo propio "${equipment.description}" sin COP calculado`,
                field: `equipment[${index}].cop`
            });
        }
    });

    // Validate Labor
    partida.apu.labor.forEach((labor, index) => {
        const lab = labor as LaborResource;

        // Check FCAS
        if (!lab.fcas) {
            errors.push({
                severity: 'error',
                category: 'labor',
                message: `Mano de obra "${labor.description}" sin FCAS completo`,
                field: `labor[${index}].fcas`
            });
        } else {
            // Validate FCAS factor
            if (lab.fcas.totalFactor < 1.45) {
                errors.push({
                    severity: 'error',
                    category: 'labor',
                    message: `Mano de obra "${labor.description}" con FCAS incompleto (factor ${lab.fcas.totalFactor.toFixed(2)} < 1.45)`,
                    field: `labor[${index}].fcas.totalFactor`
                });
            }

            if (lab.fcas.totalFactor > 1.70) {
                warnings.push({
                    severity: 'warning',
                    category: 'labor',
                    message: `Mano de obra "${labor.description}" con FCAS muy alto (factor ${lab.fcas.totalFactor.toFixed(2)} > 1.70)`,
                    field: `labor[${index}].fcas.totalFactor`
                });
            }
        }

        // Check tabulador
        if (!lab.tabulatorSource || lab.tabulatorSource === 'CUSTOM') {
            warnings.push({
                severity: 'warning',
                category: 'labor',
                message: `Mano de obra "${labor.description}" sin tabulador oficial`,
                field: `labor[${index}].tabulatorSource`
            });
        }
    });

    // Calculate compliance score
    const totalChecks =
        partida.apu.materials.length * 3 + // waste, source, supplier
        partida.apu.equipment.length * 2 + // ownership, cop
        partida.apu.labor.length * 2; // fcas, tabulador

    const failedChecks = errors.length;
    const score = totalChecks > 0 ? Math.max(0, ((totalChecks - failedChecks) / totalChecks) * 100) : 100;

    return {
        isCompliant: errors.length === 0,
        errors,
        warnings,
        score: Math.round(score)
    };
};

/**
 * Get compliance summary for display
 */
export const getComplianceSummary = (result: ComplianceResult): string => {
    if (result.isCompliant) {
        return `✅ APU cumple con normativa gubernamental (${result.score}%)`;
    }

    return `⚠️ ${result.errors.length} error(es) de cumplimiento detectados (${result.score}%)`;
};

/**
 * Suggest waste factor based on material description
 */
export const suggestWasteFactor = (materialDescription: string): number => {
    const desc = materialDescription.toLowerCase();

    // Import from tabuladores
    const wasteFactors: Record<string, number> = {
        'bloques': 0.05,
        'bloque': 0.05,
        'ceramica': 0.10,
        'cerámica': 0.10,
        'pintura': 0.07,
        'arena': 0.15,
        'cemento': 0.05,
        'acero': 0.08,
        'madera': 0.10,
        'tuberia': 0.03,
        'cable': 0.05
    };

    for (const [material, factor] of Object.entries(wasteFactors)) {
        if (desc.includes(material)) {
            return factor;
        }
    }

    return 0.05; // Default 5%
};

/**
 * Calculate recommended COP based on equipment type
 */
export const calculateRecommendedCOP = (equipmentType: string): number => {
    const type = equipmentType.toLowerCase();

    // Simplified recommendations (USD/hour)
    if (type.includes('retroexcavadora')) return 12.50;
    if (type.includes('excavadora')) return 15.00;
    if (type.includes('camion') || type.includes('volteo')) return 10.00;
    if (type.includes('mezcladora')) return 3.50;
    if (type.includes('vibrador')) return 2.00;

    return 5.00; // Default
};
