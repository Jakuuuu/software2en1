"use client";

import React, { useState } from 'react';
import { Partida, Resource, APUResponse, MaterialResource, EquipmentResource, LaborResource, InsumoMaestro, InsumoTipo } from '../types';
import { generateAPUPDF } from '../utils/apu-pdf-generator';
import { validateGovernmentCompliance, getComplianceSummary } from '../utils/compliance-validator';
import { getWasteFactorByDescription } from '../data/tabuladores';
import { calculateMaterialWithWaste, calculateCOP, calculateFCAS } from '../utils/calculations';
import { InsumoSelector } from './InsumoSelector';
import { useInsumos } from '@/hooks/useInsumos';
import { Bot, FileText, Loader2, Save, X, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface APUEditorProps {
    partida: Partida;
    onSave: (updatedPartida: Partida) => void;
    onClose: () => void;
    isGovernmentProject?: boolean;
}

// Helper to format currency
const formatCurrency = (amount: number, currency: 'USD' | 'BS') => {
    return currency === 'USD'
        ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `Bs ${amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ============================================
// MATERIALS TABLE (with waste factor)
// ============================================

const MaterialsTable = ({
    materials,
    onChange,
    isGovernment,
    tasaCambio,
    viewCurrency
}: {
    materials: MaterialResource[],
    onChange: (materials: MaterialResource[]) => void,
    isGovernment: boolean,
    tasaCambio: number,
    viewCurrency: 'USD' | 'BS'
}) => {
    const [showSelector, setShowSelector] = useState(false);

    const importFromInsumo = (insumo: InsumoMaestro) => {
        // Map Spanish source to English source
        let priceSource: MaterialResource['priceSource'] = 'MANUAL';
        if (insumo.fuentePrecio === 'BCV') priceSource = 'MARKET';
        else if (insumo.fuentePrecio === 'MERCADO') priceSource = 'MARKET';
        else if (insumo.fuentePrecio === 'PROVEEDOR') priceSource = 'QUOTATION';
        else if (insumo.fuentePrecio === 'TABULADOR_CIV') priceSource = 'CIV';
        else if (insumo.fuentePrecio === 'MANUAL') priceSource = 'MANUAL';

        const newMaterial: MaterialResource = {
            id: Math.random().toString(36).substr(2, 9),
            description: insumo.descripcion,
            unit: insumo.unidad,
            quantity: 1, // Default quantity
            unitPrice: insumo.precioUnitarioUSD,
            total: insumo.precioUnitarioUSD,
            wasteFactor: insumo.wasteFactorDefault || 0.05,
            effectiveQuantity: 1 * (1 + (insumo.wasteFactorDefault || 0.05)),
            priceSource: priceSource,
            supplier: insumo.proveedor
        };
        onChange([...materials, newMaterial]);
    };
    const addMaterial = () => {
        const newMaterial: MaterialResource = {
            id: Math.random().toString(36).substr(2, 9),
            description: "",
            unit: "",
            quantity: 0,
            unitPrice: 0,
            total: 0,
            wasteFactor: 0.05, // Default 5%
            priceSource: 'MANUAL'
        };
        onChange([...materials, newMaterial]);
    };

    const updateMaterial = (index: number, field: keyof MaterialResource, value: any) => {
        const updated = [...materials];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-suggest waste factor on description change
        if (field === 'description' && value) {
            const suggestedWaste = getWasteFactorByDescription(value);
            updated[index].wasteFactor = suggestedWaste;
        }

        // Recalculate with waste factor
        if (field === 'quantity' || field === 'unitPrice' || field === 'wasteFactor') {
            const wasteFactor = updated[index].wasteFactor || 0;
            const effectiveQty = calculateMaterialWithWaste(updated[index].quantity, wasteFactor);
            updated[index].effectiveQuantity = effectiveQty;
            updated[index].total = effectiveQty * updated[index].unitPrice;
        }

        onChange(updated);
    };

    const removeMaterial = (index: number) => {
        onChange(materials.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-6">
            <h4 className="font-semibold text-slate-700 mb-2 flex justify-between items-center">
                Materiales
                <div className="flex gap-2">
                    <button onClick={addMaterial} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors">+ Manual</button>
                    <button onClick={() => setShowSelector(true)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors">📦 Desde BD</button>
                </div>
            </h4>
            {showSelector && (
                <InsumoSelector
                    tipo="MATERIAL"
                    onSelect={importFromInsumo}
                    onClose={() => setShowSelector(false)}
                />
            )}
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="text-left p-2 font-medium">Descripción</th>
                        <th className="text-left p-2 w-16 font-medium">Unid.</th>
                        <th className="text-right p-2 w-20 font-medium">Cant.</th>
                        {isGovernment && <th className="text-right p-2 w-20 font-medium">Desp.%</th>}
                        <th className="text-right p-2 w-24 font-medium">Costo</th>
                        <th className="text-right p-2 w-24 font-medium">Total</th>
                        <th className="w-8"></th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map((mat, idx) => (
                        <tr key={mat.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="p-2">
                                <input
                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none placeholder:text-slate-300"
                                    value={mat.description}
                                    onChange={(e) => updateMaterial(idx, 'description', e.target.value)}
                                    placeholder="Descripción del material"
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={mat.unit}
                                    onChange={(e) => updateMaterial(idx, 'unit', e.target.value)}
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={mat.quantity}
                                    onChange={(e) => updateMaterial(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                />
                            </td>
                            {isGovernment && (
                                <td className="p-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                        value={(mat.wasteFactor || 0) * 100}
                                        onChange={(e) => updateMaterial(idx, 'wasteFactor', (parseFloat(e.target.value) || 0) / 100)}
                                        title="Factor de desperdicio según COVENIN"
                                    />
                                </td>
                            )}
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={viewCurrency === 'BS' ? (mat.unitPrice * tasaCambio) : mat.unitPrice}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        updateMaterial(idx, 'unitPrice', viewCurrency === 'BS' ? (val / tasaCambio) : val);
                                    }}
                                />
                                <div className="text-[10px] text-right text-slate-400">
                                    {viewCurrency === 'BS' ? 'Bs' : 'USD'}
                                </div>
                            </td>
                            <td className="p-2 text-right font-medium text-slate-700">
                                {formatCurrency(mat.total * (viewCurrency === 'BS' ? tasaCambio : 1), viewCurrency)}
                            </td>
                            <td className="p-2 text-center">
                                <button onClick={() => removeMaterial(idx)} className="text-red-300 hover:text-red-500 transition-colors">×</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right text-xs font-bold text-slate-500 mt-2">
                Subtotal: {formatCurrency(materials.reduce((acc, curr) => acc + curr.total, 0) * (viewCurrency === 'BS' ? tasaCambio : 1), viewCurrency)}
            </div>
        </div>
    );
};

// ============================================
// EQUIPMENT TABLE (with COP)
// ============================================

const EquipmentTable = ({
    equipment,
    onChange,
    isGovernment,
    tasaCambio,
    viewCurrency
}: {
    equipment: EquipmentResource[],
    onChange: (equipment: EquipmentResource[]) => void,
    isGovernment: boolean,
    tasaCambio: number,
    viewCurrency: 'USD' | 'BS'
}) => {
    const [showSelector, setShowSelector] = useState(false);

    const importFromInsumo = (insumo: InsumoMaestro) => {
        const newEquipment: EquipmentResource = {
            id: Math.random().toString(36).substr(2, 9),
            description: insumo.descripcion,
            unit: insumo.unidad,
            quantity: 1, // Default hours
            unitPrice: insumo.precioUnitarioUSD,
            total: insumo.precioUnitarioUSD,
            ownershipType: insumo.ownershipTypeDefault || 'RENTED',
            usefulLifeHours: insumo.usefulLifeHours,
            supplier: insumo.proveedor
        };
        onChange([...equipment, newEquipment]);
    };
    const addEquipment = () => {
        const newEquipment: EquipmentResource = {
            id: Math.random().toString(36).substr(2, 9),
            description: "",
            unit: "hr",
            quantity: 0,
            unitPrice: 0,
            total: 0,
            ownershipType: 'RENTED'
        };
        onChange([...equipment, newEquipment]);
    };

    const updateEquipment = (index: number, field: keyof EquipmentResource, value: any) => {
        const updated = [...equipment];
        updated[index] = { ...updated[index], [field]: value };

        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice') {
            updated[index].total = updated[index].quantity * updated[index].unitPrice;
        }

        onChange(updated);
    };

    const removeEquipment = (index: number) => {
        onChange(equipment.filter((_, i) => i !== index));
    };

    // ... EquipmentTable return ...
    return (
        <div className="mb-6">
            <h4 className="font-semibold text-slate-700 mb-2 flex justify-between items-center">
                Equipos
                <div className="flex gap-2">
                    <button onClick={addEquipment} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors">+ Manual</button>
                    <button onClick={() => setShowSelector(true)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors">📦 Desde BD</button>
                </div>
            </h4>
            {showSelector && (
                <InsumoSelector
                    tipo="EQUIPO"
                    onSelect={importFromInsumo}
                    onClose={() => setShowSelector(false)}
                />
            )}
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="text-left p-2 font-medium">Descripción</th>
                        {isGovernment && <th className="text-left p-2 w-24 font-medium">Tipo</th>}
                        <th className="text-right p-2 w-20 font-medium">Cant.</th>
                        <th className="text-right p-2 w-24 font-medium">Tarifa</th>
                        <th className="text-right p-2 w-24 font-medium">Total</th>
                        <th className="w-8"></th>
                    </tr>
                </thead>
                <tbody>
                    {equipment.map((eq, idx) => (
                        <tr key={eq.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="p-2">
                                <input
                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none placeholder:text-slate-300"
                                    value={eq.description}
                                    onChange={(e) => updateEquipment(idx, 'description', e.target.value)}
                                    placeholder="Descripción del equipo"
                                />
                            </td>
                            {isGovernment && (
                                <td className="p-2">
                                    <select
                                        className="w-full text-xs bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                        value={eq.ownershipType || 'RENTED'}
                                        onChange={(e) => updateEquipment(idx, 'ownershipType', e.target.value as 'RENTED' | 'OWNED')}
                                    >
                                        <option value="RENTED">Alquilado</option>
                                        <option value="OWNED">Propio</option>
                                    </select>
                                </td>
                            )}
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={eq.quantity}
                                    onChange={(e) => updateEquipment(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={viewCurrency === 'BS' ? (eq.unitPrice * tasaCambio) : eq.unitPrice}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        updateEquipment(idx, 'unitPrice', viewCurrency === 'BS' ? (val / tasaCambio) : val);
                                    }}
                                    title={eq.ownershipType === 'OWNED' ? 'Usar COP calculado' : 'Tarifa de alquiler'}
                                />
                                <div className="text-[10px] text-right text-slate-400">
                                    {viewCurrency === 'BS' ? 'Bs' : 'USD'}
                                </div>
                            </td>
                            <td className="p-2 text-right font-medium text-slate-700">
                                {formatCurrency(eq.total * (viewCurrency === 'BS' ? tasaCambio : 1), viewCurrency)}
                            </td>
                            <td className="p-2 text-center">
                                <button onClick={() => removeEquipment(idx)} className="text-red-300 hover:text-red-500 transition-colors">×</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right text-xs font-bold text-slate-500 mt-2">
                Subtotal: {formatCurrency(equipment.reduce((acc, curr) => acc + curr.total, 0) * (viewCurrency === 'BS' ? tasaCambio : 1), viewCurrency)}
            </div>
        </div>
    );
};

// ============================================
// LABOR TABLE (with FCAS display)
// ============================================

const LaborTable = ({
    labor,
    onChange,
    isGovernment,
    tasaCambio,
    viewCurrency
}: {
    labor: LaborResource[],
    onChange: (labor: LaborResource[]) => void,
    isGovernment: boolean,
    tasaCambio: number,
    viewCurrency: 'USD' | 'BS'
}) => {
    const [showSelector, setShowSelector] = useState(false);

    const importFromInsumo = (insumo: InsumoMaestro) => {
        const newLabor: LaborResource = {
            id: Math.random().toString(36).substr(2, 9),
            description: insumo.descripcion,
            unit: insumo.unidad,
            quantity: 1, // Default hours
            unitPrice: insumo.precioUnitarioUSD,
            total: insumo.precioUnitarioUSD,
            category: insumo.categoriaLaboral || 'Obrero',
            specialty: insumo.especialidad
        };
        // Recalculate FCAS if needed (simplified here, ideally would use calculateFCAS)
        onChange([...labor, newLabor]);
    };

    const addLabor = () => {
        const newLabor: LaborResource = {
            id: Math.random().toString(36).substr(2, 9),
            description: "",
            unit: "hr",
            quantity: 0,
            unitPrice: 0,
            total: 0,
            category: 'Obrero'
        };
        onChange([...labor, newLabor]);
    };

    const updateLabor = (index: number, field: keyof LaborResource, value: any) => {
        const updated = [...labor];
        updated[index] = { ...updated[index], [field]: value };

        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice') {
            updated[index].total = updated[index].quantity * updated[index].unitPrice;
        }

        onChange(updated);
    };

    const removeLabor = (index: number) => {
        onChange(labor.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-6">
            <h4 className="font-semibold text-slate-700 mb-2 flex justify-between items-center">
                Mano de Obra
                <div className="flex gap-2">
                    <button onClick={addLabor} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors">+ Manual</button>
                    <button onClick={() => setShowSelector(true)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors">📦 Desde BD</button>
                </div>
            </h4>
            {showSelector && (
                <InsumoSelector
                    tipo="MANO_OBRA"
                    onSelect={importFromInsumo}
                    onClose={() => setShowSelector(false)}
                />
            )}
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="text-left p-2 font-medium">Descripción</th>
                        <th className="text-right p-2 w-20 font-medium">Cant.</th>
                        <th className="text-right p-2 w-24 font-medium">Jornal</th>
                        {isGovernment && <th className="text-right p-2 w-20 font-medium">FCAS</th>}
                        <th className="text-right p-2 w-24 font-medium">Total</th>
                        <th className="w-8"></th>
                    </tr>
                </thead>
                <tbody>
                    {labor.map((lab, idx) => (
                        <tr key={lab.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="p-2">
                                <input
                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none placeholder:text-slate-300"
                                    value={lab.description}
                                    onChange={(e) => updateLabor(idx, 'description', e.target.value)}
                                    placeholder="Descripción de mano de obra"
                                />
                                {lab.category && <div className="text-[10px] text-slate-400">{lab.category} {lab.specialty && `• ${lab.specialty}`}</div>}
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={lab.quantity}
                                    onChange={(e) => updateLabor(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={viewCurrency === 'BS' ? (lab.unitPrice * tasaCambio) : lab.unitPrice}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        updateLabor(idx, 'unitPrice', viewCurrency === 'BS' ? (val / tasaCambio) : val);
                                    }}
                                />
                                <div className="text-[10px] text-right text-slate-400">
                                    {viewCurrency === 'BS' ? 'Bs' : 'USD'}
                                </div>
                            </td>
                            {isGovernment && (
                                <td className="p-2 text-right text-xs text-slate-600" title="Factor de Costos Asociados al Salario">
                                    {lab.fcas ? `${lab.fcas.totalFactor.toFixed(2)}x` : '1.55x'}
                                </td>
                            )}
                            <td className="p-2 text-right font-medium text-slate-700">
                                {formatCurrency(lab.total * (viewCurrency === 'BS' ? tasaCambio : 1), viewCurrency)}
                            </td>
                            <td className="p-2 text-center">
                                <button onClick={() => removeLabor(idx)} className="text-red-300 hover:text-red-500 transition-colors">×</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right text-xs font-bold text-slate-500 mt-2">
                Subtotal: {formatCurrency(labor.reduce((acc, curr) => acc + curr.total, 0) * (viewCurrency === 'BS' ? tasaCambio : 1), viewCurrency)}
            </div>
        </div>
    );
};

// ============================================
// COMPLIANCE VALIDATOR COMPONENT
// ============================================

const ComplianceValidator = ({ partida, isGovernment }: { partida: Partida, isGovernment: boolean }) => {
    if (!isGovernment) return null;

    const result = validateGovernmentCompliance(partida, isGovernment);

    if (result.isCompliant) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium text-sm">{getComplianceSummary(result)}</span>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-800">⚠️ Incumplimientos Detectados ({result.score}%)</h4>
            </div>
            <ul className="text-sm text-red-700 space-y-1 ml-7">
                {result.errors.map((error, i) => (
                    <li key={i}>• {error.message}</li>
                ))}
            </ul>
            {result.warnings.length > 0 && (
                <>
                    <h5 className="font-semibold text-yellow-800 mt-3 mb-1 text-sm">Advertencias:</h5>
                    <ul className="text-sm text-yellow-700 space-y-1 ml-7">
                        {result.warnings.map((warning, i) => (
                            <li key={i}>• {warning.message}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

// ============================================
// MAIN APU EDITOR
// ============================================

export const APUEditor = ({ partida, onSave, onClose, isGovernmentProject = false }: APUEditorProps) => {
    const { tasaCambio } = useInsumos();
    const [viewCurrency, setViewCurrency] = useState<'USD' | 'BS'>('USD');

    const [materials, setMaterials] = useState<MaterialResource[]>((partida.apu?.materials as MaterialResource[]) || []);
    const [equipment, setEquipment] = useState<EquipmentResource[]>((partida.apu?.equipment as EquipmentResource[]) || []);
    const [labor, setLabor] = useState<LaborResource[]>((partida.apu?.labor as LaborResource[]) || []);

    const [loading, setLoading] = useState(false);
    const [clientType, setClientType] = useState<'GUBERNAMENTAL' | 'PRIVADO'>(isGovernmentProject ? 'GUBERNAMENTAL' : 'PRIVADO');
    const [generatedIncidences, setGeneratedIncidences] = useState<any>(partida.apu?.legalCharges || null);

    const totalMat = materials.reduce((acc, curr) => acc + curr.total, 0);
    const totalEq = equipment.reduce((acc, curr) => acc + curr.total, 0);
    const totalLab = labor.reduce((acc, curr) => acc + curr.total, 0); // Base labor cost

    // Calculate FCAS Amount (for Government projects)
    const totalFCAS = labor.reduce((acc, curr) => {
        // If FCAS is not calculated for this item, use a default factor (e.g. 1.55 or 0 if strictly manual)
        // However, for accuracy, we should check if isGovernment is true.
        if (!isGovernmentProject) return 0;

        const factor = curr.fcas?.totalFactor || 1.55;
        // FCAS Amount = (Base * Factor) - Base
        return acc + (curr.total * factor) - curr.total;
    }, 0);

    const newUnitPrice = totalMat + totalEq + totalLab + totalFCAS;

    const handleGenerateAI = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/apu/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    partida: {
                        code: partida.code,
                        description: partida.description,
                        unit: partida.unit,
                        quantity: partida.quantity
                    },
                    clientType
                })
            });

            if (!response.ok) throw new Error('Error en generación');

            const apuData: APUResponse = await response.json();

            // Map to new types
            setMaterials(apuData.analisis_costos.materiales.map(m => ({
                id: Math.random().toString(36).substr(2, 9),
                description: m.descripcion,
                unit: m.unidad,
                quantity: m.cantidad,
                unitPrice: m.precio_unitario,
                total: m.total,
                wasteFactor: getWasteFactorByDescription(m.descripcion),
                priceSource: 'MANUAL' as const
            })));

            setEquipment(apuData.analisis_costos.equipos.map(e => ({
                id: Math.random().toString(36).substr(2, 9),
                description: e.descripcion,
                unit: 'hr',
                quantity: e.cantidad,
                unitPrice: e.precio_unitario,
                total: e.total,
                ownershipType: 'RENTED' as const
            })));

            setLabor(apuData.analisis_costos.mano_obra.map(l => ({
                id: Math.random().toString(36).substr(2, 9),
                description: l.descripcion,
                unit: 'hr',
                quantity: l.cantidad,
                unitPrice: l.precio_unitario,
                total: l.total,
                category: 'Obrero' as const
            })));

            if (apuData.incidencias) {
                setGeneratedIncidences(apuData.incidencias);
            }

        } catch (error) {
            console.error(error);
            alert('Error al generar con IA. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const reconstructAPUResponse = (): APUResponse => {
        return {
            codigo_covenin: partida.code,
            descripcion: partida.description,
            unidad: partida.unit,
            analisis_costos: {
                materiales: materials.map(m => ({
                    descripcion: m.description,
                    unidad: m.unit,
                    cantidad: m.effectiveQuantity || m.quantity,
                    precio_unitario: m.unitPrice,
                    total: m.total
                })),
                equipos: equipment.map(e => ({
                    descripcion: e.description,
                    unidad: e.unit,
                    cantidad: e.quantity,
                    precio_unitario: e.unitPrice,
                    total: e.total
                })),
                mano_obra: labor.map(l => ({
                    descripcion: l.description,
                    cantidad: l.quantity,
                    precio_unitario: l.unitPrice,
                    total: l.total,
                    fcas_factor: isGovernmentProject ? (l.fcas?.totalFactor || 1.55) : 1
                }))
            },
            costos_directos: {
                total_materiales: totalMat,
                total_equipos: totalEq,
                total_mano_obra: totalLab,
                total_fcas: isGovernmentProject ? totalFCAS : 0,
                subtotal_directo: newUnitPrice
            },
            incidencias: generatedIncidences || { laborales: [], total_incidencias: 0 },
            resumen: {
                costo_directo_total: newUnitPrice,
                costos_administrativos: 0,
                utilidad: 0,
                precio_unitario: newUnitPrice
            },
            certificacion_legal: clientType === 'GUBERNAMENTAL' ? {
                marco_normativo: ["Decreto 1.399/2026", "COVENIN 2250-2000", "LOTTT"],
                fecha: new Date().toISOString()
            } : undefined
        };
    };

    const handleDownloadPDF = () => {
        try {
            const apuData = reconstructAPUResponse();
            generateAPUPDF(apuData, clientType);
        } catch (error) {
            console.error("PDF Error:", error);
            alert("Error al generar el PDF");
        }
    };

    const handleSave = () => {
        const updatedPartida: Partida = {
            ...partida,
            unitPrice: newUnitPrice,
            price: partida.quantity * newUnitPrice,
            apu: {
                materials: materials as Resource[],
                equipment: equipment as Resource[],
                labor: labor as Resource[],
                subtotals: { materials: totalMat, equipment: totalEq, labor: totalLab },
                legalCharges: generatedIncidences || { lopcymat: 0, inces: 0, sso: 0 },
                directCost: newUnitPrice,
                indirectCosts: { administration: 0, utilities: 0, profit: 0, total: 0 },
                unitPrice: newUnitPrice
            }
        };
        onSave(updatedPartida);
    };

    const isGovernment = clientType === 'GUBERNAMENTAL';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10 gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-slate-800">Análisis de Precio Unitario</h2>
                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-mono">{partida.code}</span>
                        </div>
                        <p className="text-sm text-slate-500 truncate max-w-2xl">{partida.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={clientType}
                            onChange={(e) => setClientType(e.target.value as any)}
                            className="text-sm border border-slate-300 rounded-lg px-2 py-2 bg-slate-50 focus:border-blue-500 outline-none"
                        >
                            <option value="PRIVADO">Cliente Privado</option>
                            <option value="GUBERNAMENTAL">Ente Gubernamental</option>
                        </select>

                        <button
                            onClick={handleGenerateAI}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 font-medium shadow-md shadow-indigo-500/20 disabled:opacity-70 transition-all"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                            {loading ? 'Generando...' : 'Autocompletar con IA'}
                        </button>

                        <div className="text-right border-l pl-4 border-slate-200">
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Precio Unitario</div>
                            <div className="text-2xl font-bold text-slate-900">${newUnitPrice.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
                    {/* Compliance Validator */}
                    {isGovernment && (
                        <div className="mb-4">
                            <ComplianceValidator partida={{ ...partida, apu: { materials: materials as Resource[], equipment: equipment as Resource[], labor: labor as Resource[], subtotals: { materials: totalMat, equipment: totalEq, labor: totalLab }, legalCharges: { lopcymat: 0, inces: 0, sso: 0 }, directCost: newUnitPrice, indirectCosts: { administration: 0, utilities: 0, profit: 0, total: 0 }, unitPrice: newUnitPrice } }} isGovernment={isGovernment} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <MaterialsTable
                                materials={materials}
                                onChange={setMaterials}
                                isGovernment={isGovernment}
                                tasaCambio={tasaCambio.valor}
                                viewCurrency={viewCurrency}
                            />
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <EquipmentTable
                                equipment={equipment}
                                onChange={setEquipment}
                                isGovernment={isGovernment}
                                tasaCambio={tasaCambio.valor}
                                viewCurrency={viewCurrency}
                            />
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <LaborTable
                                labor={labor}
                                onChange={setLabor}
                                isGovernment={isGovernment}
                                tasaCambio={tasaCambio.valor}
                                viewCurrency={viewCurrency}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-white rounded-b-xl flex justify-between items-center sticky bottom-0">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-medium border border-transparent hover:border-slate-200"
                    >
                        <FileText className="w-4 h-4" />
                        Descargar PDF
                    </button>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">Cancelar</button>
                        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 transition-all">
                            <Save className="w-4 h-4" />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
