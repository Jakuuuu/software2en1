// ============================================
// VENEZUELAN LEGAL CALCULATIONS
// ============================================

import { Resource, LaborResource, LegalConfig, Partida, MaterialResource, EquipmentResource } from '../types';

// ============================================
// MATERIAL WASTE FACTOR CALCULATIONS
// ============================================

/**
 * Calculate effective quantity with waste factor
 * COVENIN 2250-2000 Cap. 4 Art. 12
 */
export const calculateMaterialWithWaste = (
    quantity: number,
    wasteFactor: number
): number => {
    return quantity * (1 + wasteFactor);
};

/**
 * Calculate total cost including waste
 */
export const calculateMaterialTotalWithWaste = (
    quantity: number,
    unitPrice: number,
    wasteFactor: number
): number => {
    const effectiveQuantity = calculateMaterialWithWaste(quantity, wasteFactor);
    return effectiveQuantity * unitPrice;
};

// ============================================
// EQUIPMENT COP (Costo de Posesión y Operación)
// ============================================

/**
 * Calculate COP for owned equipment
 * COVENIN 2250-2000 Cap. 4 Art. 15
 */
export const calculateCOP = (equipment: {
    acquisitionValue: number;
    residualValue: number;
    usefulLifeHours: number;
    interestRate: number;
    insuranceRate: number;
    maintenanceCostPerHour: number;
    operationCostPerHour: number;
}): number => {
    const {
        acquisitionValue,
        residualValue,
        usefulLifeHours,
        interestRate,
        insuranceRate,
        maintenanceCostPerHour,
        operationCostPerHour
    } = equipment;

    // Depreciación = (Valor - Valor Residual) / Vida Útil
    const depreciation = (acquisitionValue - residualValue) / usefulLifeHours;

    // Intereses = (Valor × Tasa × Vida Útil / 2) / Vida Útil
    const interests = (acquisitionValue * interestRate * usefulLifeHours / 2) / usefulLifeHours;

    // Seguros = (Valor × % Seguro) / Vida Útil
    const insurance = (acquisitionValue * insuranceRate) / usefulLifeHours;

    // COP = (Depreciación + Intereses + Seguros) + Mantenimiento + Operación
    const cop = depreciation + interests + insurance + maintenanceCostPerHour + operationCostPerHour;

    return cop;
};

// ============================================
// VENEZUELAN LEGAL CHARGES
// ============================================

/**
 * Calculate LOPCYMAT (Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo)
 * 2% sobre el costo total de materiales
 */
export const calculateLOPCYMAT = (materials: Resource[]): number => {
    const totalMaterials = materials.reduce((sum, m) => sum + m.total, 0);
    return totalMaterials * 0.02;
};

/**
 * Calculate INCES (Instituto Nacional de Capacitación y Educación Socialista)
 * 2% sobre el total de mano de obra
 */
export const calculateINCES = (labor: Resource[]): number => {
    const totalLabor = labor.reduce((sum, l) => sum + l.total, 0);
    return totalLabor * 0.02;
};

/**
 * ============================================
 * FCAS COMPLETO (Factor de Costos Asociados al Salario)
 * ============================================
 * 
 * Calcula TODOS los componentes legales de mano de obra en Venezuela
 * Cumple con: LOTTT, LOPCYMAT, Ley LPH, Decreto 4.298
 */
export const calculateFCAS = (
    baseSalary: number,
    config?: LegalConfig
): {
    workedDays: number;
    paidDays: number;
    sso: number;
    lph: number;
    banavih: number;
    inces: number;
    vacations: number;
    vacationBonus: number;
    utilities: number;
    yearEndBonus: number;
    cestaTicket: number;
    eppDotation: number;
    paidHolidays: number;
    severance: number;
    totalCharges: number;
    totalFactor: number;
    totalCost: number;
} => {
    // Días trabajados vs pagados (LOTTT Art. 173)
    const workedDays = config?.workedDaysPerYear || 260;
    const paidDays = config?.paidDaysPerYear || 365;

    // Cargas sociales sobre salario base
    const sso = baseSalary * (config?.ssoRate || 0.135); // 13.5% SSO Patronal
    const lph = baseSalary * (config?.lphRate || 0.03); // 3% LPH
    const banavih = baseSalary * (config?.banavihRate || 0.01); // 1% Banavih
    const inces = baseSalary * (config?.incesRate || 0.02); // 2% INCES

    // Días adicionales pagados (LOTTT)
    const vacationDays = 15; // LOTTT Art. 190
    const vacations = baseSalary * (vacationDays / workedDays);

    const vacationBonusDays = config?.vacationBonusDays || 7; // LOTTT Art. 192
    const vacationBonus = baseSalary * (vacationBonusDays / workedDays);

    const utilitiesDays = 15; // LOTTT Art. 174 (mínimo)
    const utilities = baseSalary * (utilitiesDays / workedDays);

    const yearEndBonusDays = config?.yearEndBonusDays || 15;
    const yearEndBonus = baseSalary * (yearEndBonusDays / workedDays);

    const paidHolidaysDays = config?.paidHolidaysPerYear || 12;
    const paidHolidays = baseSalary * (paidHolidaysDays / workedDays);

    // Antigüedad (LOTTT Art. 142) - simplificado a 5 días/año
    const severanceDays = config?.severanceDaysPerYear || 5;
    const severance = baseSalary * (severanceDays / workedDays);

    // Beneficios fijos
    // Cesta Ticket (Decreto 4.298) - convertir de Bs a USD si es necesario
    const cestaTicketBs = config?.cestaTicketDaily || 130; // Bs/día
    const exchangeRate = 36.50; // TODO: Obtener de BCV
    const cestaTicketUSD = (cestaTicketBs / exchangeRate) * paidDays;
    const cestaTicket = cestaTicketUSD;

    // Dotación EPP (LOPCYMAT Art. 56) - 2 veces al año
    const eppDotationYearly = config?.eppDotationYearly || 100; // USD/año
    const eppDotation = eppDotationYearly / workedDays;

    // Total de cargas
    const totalCharges = sso + lph + banavih + inces + vacations + vacationBonus +
        utilities + yearEndBonus + cestaTicket + eppDotation +
        paidHolidays + severance;

    // Factor total (cuánto cuesta realmente $1 de salario)
    const totalFactor = 1 + (totalCharges / baseSalary);

    // Costo total
    const totalCost = baseSalary + totalCharges;

    return {
        workedDays,
        paidDays,
        sso,
        lph,
        banavih,
        inces,
        vacations,
        vacationBonus,
        utilities,
        yearEndBonus,
        cestaTicket,
        eppDotation,
        paidHolidays,
        severance,
        totalCharges,
        totalFactor,
        totalCost
    };
};

/**
 * Calculate SSO (Seguro Social Obligatorio) and all social charges
 * LEGACY FUNCTION - Use calculateFCAS for complete calculations
 * Kept for backward compatibility
 */
export const calculateSocialCharges = (
    laborCost: number,
    config?: LegalConfig
): {
    sso: number;
    lph: number;
    inces: number;
    vacations: number;
    utilities: number;
    total: number;
} => {
    const ssoRate = config?.ssoRate ?? 0.135; // 13.5%
    const lphRate = config?.lphRate ?? 0.03; // 3%
    const incesRate = config?.incesRate ?? 0.02; // 2%
    const vacationsRate = config?.vacationsRate ?? 0.15; // 15%
    const utilitiesRate = config?.utilitiesRateMO ?? 0.15; // 15%

    const sso = laborCost * ssoRate;
    const lph = laborCost * lphRate;
    const inces = laborCost * incesRate;
    const vacations = laborCost * vacationsRate;
    const utilities = laborCost * utilitiesRate;

    return {
        sso,
        lph,
        inces,
        vacations,
        utilities,
        total: sso + lph + inces + vacations + utilities
    };
};

/**
 * Calculate total labor cost including social charges
 */
export const calculateLaborWithCharges = (
    labor: Resource[],
    config?: LegalConfig
): { subtotal: number; charges: number; total: number } => {
    const subtotal = labor.reduce((sum, l) => sum + l.total, 0);
    const chargesBreakdown = calculateSocialCharges(subtotal, config);

    return {
        subtotal,
        charges: chargesBreakdown.total,
        total: subtotal + chargesBreakdown.total
    };
};

/**
 * Calculate direct cost (materials + equipment + labor with charges)
 */
export const calculateDirectCost = (
    materials: Resource[],
    equipment: Resource[],
    labor: Resource[],
    config?: LegalConfig
): number => {
    const totalMaterials = materials.reduce((sum, m) => sum + m.total, 0);
    const totalEquipment = equipment.reduce((sum, e) => sum + e.total, 0);
    const laborWithCharges = calculateLaborWithCharges(labor, config);

    // Add LOPCYMAT if configured
    const lopcymat = config?.applyLOPCYMAT ? calculateLOPCYMAT(materials) : 0;

    return totalMaterials + lopcymat + totalEquipment + laborWithCharges.total;
};

/**
 * Calculate indirect costs (administration, utilities, profit)
 */
export const calculateIndirectCosts = (
    directCost: number,
    config?: LegalConfig
): {
    administration: number;
    utilities: number;
    profit: number;
    total: number;
} => {
    const adminRate = config?.administrationRate ?? 0.10; // 10%
    const utilitiesRate = config?.utilitiesRate ?? 0.05; // 5%
    const profitRate = config?.profitRate ?? 0.15; // 15%

    const administration = directCost * adminRate;
    const utilities = directCost * utilitiesRate;
    const profit = directCost * profitRate;

    return {
        administration,
        utilities,
        profit,
        total: administration + utilities + profit
    };
};

/**
 * Calculate unit price (direct cost + indirect costs)
 */
export const calculateUnitPrice = (
    materials: Resource[],
    equipment: Resource[],
    labor: Resource[],
    config?: LegalConfig
): {
    directCost: number;
    indirectCosts: number;
    unitPrice: number;
    breakdown: {
        materials: number;
        equipment: number;
        labor: number;
        lopcymat: number;
        socialCharges: number;
        administration: number;
        utilities: number;
        profit: number;
    };
} => {
    const totalMaterials = materials.reduce((sum, m) => sum + m.total, 0);
    const totalEquipment = equipment.reduce((sum, e) => sum + e.total, 0);
    const laborWithCharges = calculateLaborWithCharges(labor, config);
    const lopcymat = config?.applyLOPCYMAT ? calculateLOPCYMAT(materials) : 0;

    const directCost = totalMaterials + lopcymat + totalEquipment + laborWithCharges.total;
    const indirect = calculateIndirectCosts(directCost, config);

    return {
        directCost,
        indirectCosts: indirect.total,
        unitPrice: directCost + indirect.total,
        breakdown: {
            materials: totalMaterials,
            equipment: totalEquipment,
            labor: laborWithCharges.subtotal,
            lopcymat,
            socialCharges: laborWithCharges.charges,
            administration: indirect.administration,
            utilities: indirect.utilities,
            profit: indirect.profit
        }
    };
};

/**
 * Calculate IVA retention
 * - Contribuyentes especiales: 100%
 * - Contribuyentes ordinarios: 75%
 */
export const calculateIVARetention = (
    subtotal: number,
    ivaRate: number,
    retentionRate: number
): number => {
    const iva = subtotal * ivaRate;
    return iva * retentionRate;
};

/**
 * Calculate ISLR retention (Impuesto Sobre la Renta)
 * Según tabla de porcentajes (1% - 5%)
 */
export const calculateISLRRetention = (
    subtotal: number,
    rate: number
): number => {
    return subtotal * rate;
};

/**
 * Calculate valuation net amount
 */
export const calculateValuationNetAmount = (
    subtotal: number,
    config: LegalConfig,
    advanceAmortization: number = 0
): {
    subtotal: number;
    iva: number;
    amortization: number;
    retentionIVA: number;
    retentionISLR: number;
    performanceBond: number;
    netAmount: number;
} => {
    const iva = subtotal * config.ivaRate;
    const totalWithIVA = subtotal + iva;

    const amortization = config.applyAmortization ? advanceAmortization : 0;
    const retentionIVA = calculateIVARetention(subtotal, config.ivaRate, config.retentionIVA);
    const retentionISLR = calculateISLRRetention(subtotal, config.retentionISLR);
    const performanceBond = subtotal * config.performanceBond;

    const netAmount = totalWithIVA - amortization - retentionIVA - retentionISLR - performanceBond;

    return {
        subtotal,
        iva,
        amortization,
        retentionIVA,
        retentionISLR,
        performanceBond,
        netAmount
    };
};

// ============================================
// VALUATION CALCULATIONS (Legacy compatibility)
// ============================================

export const calculateValuationTotals = (partidas: Partida[]) => {
    let budget = 0;
    let executed = 0; // Previous executed
    let currentTotal = 0;

    partidas.forEach(p => {
        budget += p.contracted;
        executed += p.previousAccumulated;
        currentTotal += p.thisValuation;
    });

    return {
        totalBudget: budget,
        totalExecuted: executed + currentTotal,
        currentValuationTotal: currentTotal
    };
};

export const hasValuationErrors = (partidas: Partida[]) => {
    return partidas.some(p => (p.previousAccumulated + p.thisValuation) > p.contracted);
};
