"use client";

import React, { useState } from 'react';
import { Partida, Resource, APUResponse } from '../types';
import { generateAPUPDF } from '../utils/apu-pdf-generator';
import { Bot, FileText, Loader2, Save, X } from 'lucide-react';

interface APUEditorProps {
    partida: Partida;
    onSave: (updatedPartida: Partida) => void;
    onClose: () => void;
}

const ResourceTable = ({ title, resources, onChange }: { title: string, resources: Resource[], onChange: (resources: Resource[]) => void }) => {
    const addResource = () => {
        const newResource: Resource = {
            id: Math.random().toString(36).substr(2, 9),
            description: "",
            unit: "",
            quantity: 0,
            unitPrice: 0,
            total: 0
        };
        onChange([...resources, newResource]);
    };

    const updateResource = (index: number, field: keyof Resource, value: any) => {
        const updated = [...resources];
        updated[index] = { ...updated[index], [field]: value };
        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice') {
            updated[index].total = updated[index].quantity * updated[index].unitPrice;
        }
        onChange(updated);
    };

    const removeResource = (index: number) => {
        const updated = resources.filter((_, i) => i !== index);
        onChange(updated);
    };

    return (
        <div className="mb-6">
            <h4 className="font-semibold text-slate-700 mb-2 flex justify-between items-center">
                {title}
                <button onClick={addResource} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors">+ Agregar</button>
            </h4>
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="text-left p-2 font-medium">Descripción</th>
                        <th className="text-left p-2 w-16 font-medium">Unid.</th>
                        <th className="text-right p-2 w-20 font-medium">Cant.</th>
                        <th className="text-right p-2 w-24 font-medium">Costo</th>
                        <th className="text-right p-2 w-24 font-medium">Total</th>
                        <th className="w-8"></th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((res, idx) => (
                        <tr key={res.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="p-2">
                                <input
                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none placeholder:text-slate-300"
                                    value={res.description}
                                    onChange={(e) => updateResource(idx, 'description', e.target.value)}
                                    placeholder="Descripción del insumo"
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={res.unit}
                                    onChange={(e) => updateResource(idx, 'unit', e.target.value)}
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={res.quantity}
                                    onChange={(e) => updateResource(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                    value={res.unitPrice}
                                    onChange={(e) => updateResource(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                                />
                            </td>
                            <td className="p-2 text-right font-medium text-slate-700">
                                {res.total.toFixed(2)}
                            </td>
                            <td className="p-2 text-center">
                                <button onClick={() => removeResource(idx)} className="text-red-300 hover:text-red-500 transition-colors">×</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right text-xs font-bold text-slate-500 mt-2">
                Subtotal: {resources.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
            </div>
        </div>
    );
};

export const APUEditor = ({ partida, onSave, onClose }: APUEditorProps) => {
    const [materials, setMaterials] = useState<Resource[]>(partida.apu?.materials || []);
    const [equipment, setEquipment] = useState<Resource[]>(partida.apu?.equipment || []);
    const [labor, setLabor] = useState<Resource[]>(partida.apu?.labor || []);

    const [loading, setLoading] = useState(false);
    const [clientType, setClientType] = useState<'GUBERNAMENTAL' | 'PRIVADO'>('PRIVADO');
    const [generatedIncidences, setGeneratedIncidences] = useState<any>(partida.apu?.legalCharges || null);

    const totalMat = materials.reduce((acc, curr) => acc + curr.total, 0);
    const totalEq = equipment.reduce((acc, curr) => acc + curr.total, 0);
    const totalLab = labor.reduce((acc, curr) => acc + curr.total, 0);
    const newUnitPrice = totalMat + totalEq + totalLab; // Simplified for now

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
                        // We could send current resources as context, but for now we regenerate from scratch
                    },
                    clientType
                })
            });

            if (!response.ok) throw new Error('Error en generación');

            const apuData: APUResponse = await response.json();

            // Map response to state
            setMaterials(apuData.analisis_costos.materiales.map(m => ({
                id: Math.random().toString(36).substr(2, 9),
                description: m.descripcion,
                unit: m.unidad,
                quantity: m.cantidad,
                unitPrice: m.precio_unitario,
                total: m.total
            })));

            setEquipment(apuData.analisis_costos.equipos.map(e => ({
                id: Math.random().toString(36).substr(2, 9),
                description: e.descripcion,
                unit: e.unidad,
                quantity: e.cantidad,
                unitPrice: e.precio_unitario,
                total: e.total
            })));

            setLabor(apuData.analisis_costos.mano_obra.map(l => ({
                id: Math.random().toString(36).substr(2, 9),
                description: l.descripcion,
                unit: 'hr', // Defaulting as usually labor is hours/days
                quantity: l.cantidad,
                unitPrice: l.precio_unitario,
                total: l.total,
                category: 'Obrero' // Default
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
                materiales: materials.map(m => ({ descripcion: m.description, unidad: m.unit, cantidad: m.quantity, precio_unitario: m.unitPrice, total: m.total })),
                equipos: equipment.map(e => ({ descripcion: e.description, unidad: e.unit, cantidad: e.quantity, precio_unitario: e.unitPrice, total: e.total })),
                mano_obra: labor.map(l => ({ descripcion: l.description, cantidad: l.quantity, precio_unitario: l.unitPrice, total: l.total }))
            },
            costos_directos: {
                total_materiales: totalMat,
                total_equipos: totalEq,
                total_mano_obra: totalLab,
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
                marco_normativo: ["Decreto 1.399/2026", "COVENIN 2250-2000"],
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
                materials,
                equipment,
                labor,
                subtotals: { materials: totalMat, equipment: totalEq, labor: totalLab },
                legalCharges: generatedIncidences || { lopcymat: 0, inces: 0, sso: 0 },
                directCost: newUnitPrice,
                indirectCosts: { administration: 0, utilities: 0, profit: 0, total: 0 },
                unitPrice: newUnitPrice
            }
        };
        onSave(updatedPartida);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-200">
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
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <ResourceTable title="Materiales" resources={materials} onChange={setMaterials} />
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <ResourceTable title="Equipos" resources={equipment} onChange={setEquipment} />
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <ResourceTable title="Mano de Obra" resources={labor} onChange={setLabor} />
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

