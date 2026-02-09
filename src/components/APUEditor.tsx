"use client";

import React, { useState, useEffect } from 'react';
import { Partida, Resource, APU } from '../types';

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
                <button onClick={addResource} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">+ Agregar</button>
            </h4>
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="text-left p-2">Descripción</th>
                        <th className="text-left p-2 w-16">Unid.</th>
                        <th className="text-right p-2 w-20">Cant.</th>
                        <th className="text-right p-2 w-24">Costo</th>
                        <th className="text-right p-2 w-24">Total</th>
                        <th className="w-8"></th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((res, idx) => (
                        <tr key={res.id} className="border-b border-slate-100">
                            <td className="p-2">
                                <input
                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
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
                                <button onClick={() => removeResource(idx)} className="text-red-400 hover:text-red-600">×</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right text-xs font-bold text-slate-500 mt-1">
                Subtotal: {resources.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
            </div>
        </div>
    );
};

export const APUEditor = ({ partida, onSave, onClose }: APUEditorProps) => {
    const [materials, setMaterials] = useState<Resource[]>(partida.apu?.materials || []);
    const [equipment, setEquipment] = useState<Resource[]>(partida.apu?.equipment || []);
    const [labor, setLabor] = useState<Resource[]>(partida.apu?.labor || []);

    const totalMat = materials.reduce((acc, curr) => acc + curr.total, 0);
    const totalEq = equipment.reduce((acc, curr) => acc + curr.total, 0);
    const totalLab = labor.reduce((acc, curr) => acc + curr.total, 0);
    const newUnitPrice = totalMat + totalEq + totalLab;

    const handleSave = () => {
        const updatedPartida: Partida = {
            ...partida,
            unitPrice: newUnitPrice,
            price: partida.quantity * newUnitPrice,
            apu: {
                materials,
                equipment,
                labor,
                subtotals: {
                    materials: totalMat,
                    equipment: totalEq,
                    labor: totalLab
                },
                legalCharges: {
                    lopcymat: 0, // Can be calculated if needed
                    inces: 0,
                    sso: 0
                },
                directCost: newUnitPrice,
                indirectCosts: {
                    administration: 0,
                    utilities: 0,
                    profit: 0,
                    total: 0
                },
                unitPrice: newUnitPrice
            }
        };
        onSave(updatedPartida);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Análisis de Precio Unitario (APU)</h2>
                        <p className="text-sm text-slate-500">{partida.code} - {partida.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-500">Precio Unitario</div>
                        <div className="text-2xl font-bold text-blue-600">${newUnitPrice.toFixed(2)}</div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <ResourceTable title="Materiales" resources={materials} onChange={setMaterials} />
                    <ResourceTable title="Equipos" resources={equipment} onChange={setEquipment} />
                    <ResourceTable title="Mano de Obra" resources={labor} onChange={setLabor} />
                </div>

                <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-3 sticky bottom-0">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium">Cancelar</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};
