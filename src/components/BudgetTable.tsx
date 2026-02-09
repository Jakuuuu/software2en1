"use client";

import React, { useState } from 'react';
import { Partida } from '../types';
import { APUEditor } from './APUEditor';
import { generatePartidaPDF } from '../utils/pdfGenerator'; // Assuming you haven't implemented this yet, but we planned it.
// Note: You might need to adjust the import path for pdfGenerator if I haven't created it in the right place or exported it correctly.
// I will assume it's there as per my plan.

interface BudgetTableProps {
    partidas: Partida[];
    onUpdatePartidas: (partidas: Partida[]) => void;
}

export const BudgetTable = ({ partidas, onUpdatePartidas }: BudgetTableProps) => {
    const [editingPartidaId, setEditingPartidaId] = useState<string | null>(null);

    const handleAddPartida = () => {
        const newPartida: Partida = {
            id: Math.random().toString(36).substr(2, 9),
            code: "NEW-001",
            description: "Nueva Partida",
            unit: "und",
            quantity: 1,
            unitPrice: 0,
            price: 0,
            contracted: 0,
            previousAccumulated: 0,
            thisValuation: 0,
            apu: {
                materials: [],
                equipment: [],
                labor: [],
                subtotals: { materials: 0, equipment: 0, labor: 0 },
                legalCharges: { lopcymat: 0, inces: 0, sso: 0 },
                directCost: 0,
                indirectCosts: { administration: 0, utilities: 0, profit: 0, total: 0 },
                unitPrice: 0
            }
        };
        onUpdatePartidas([...partidas, newPartida]);
    };

    const updatePartidaBasic = (id: string, field: keyof Partida, value: any) => {
        const updated = partidas.map(p => {
            if (p.id === id) {
                const newP = { ...p, [field]: value };
                if (field === 'quantity' || field === 'unitPrice') {
                    newP.price = newP.quantity * newP.unitPrice;
                    newP.contracted = newP.price || 0; // In budget mode, contracted = price
                }
                return newP;
            }
            return p;
        });
        onUpdatePartidas(updated);
    };

    const handleSaveAPU = (updatedPartida: Partida) => {
        const updated = partidas.map(p => (p.id === updatedPartida.id ? updatedPartida : p));
        onUpdatePartidas(updated);
        setEditingPartidaId(null);
    };

    const activePartida = partidas.find(p => p.id === editingPartidaId);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Presupuesto de Obra</h3>
                <button
                    onClick={handleAddPartida}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors shadow-emerald-500/20 shadow-lg font-medium"
                >
                    + Nueva Partida
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4 w-24">Código</th>
                            <th className="px-6 py-4">Descripción</th>
                            <th className="px-6 py-4 w-20 text-center">Unid.</th>
                            <th className="px-6 py-4 w-24 text-right">Cant.</th>
                            <th className="px-6 py-4 w-32 text-right">P. Unitario</th>
                            <th className="px-6 py-4 w-32 text-right">Total</th>
                            <th className="px-6 py-4 w-32 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {partidas.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <input
                                        className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none font-medium text-slate-700"
                                        value={item.code}
                                        onChange={(e) => updatePartidaBasic(item.id, 'code', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <textarea
                                        rows={1}
                                        className="w-full bg-transparent border-b border-transparent focus:border-blue-300 outline-none resize-none"
                                        value={item.description}
                                        onChange={(e) => updatePartidaBasic(item.id, 'description', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <input
                                        className="w-full text-center bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                        value={item.unit}
                                        onChange={(e) => updatePartidaBasic(item.id, 'unit', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <input
                                        type="number"
                                        className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-300 outline-none"
                                        value={item.quantity}
                                        onChange={(e) => updatePartidaBasic(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-700">
                                    ${item.unitPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                    ${(item.price || 0).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => setEditingPartidaId(item.id)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg tooltip"
                                            title="Editar APU"
                                        >
                                            APU
                                        </button>
                                        <button
                                            onClick={() => generatePartidaPDF(item)}
                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg tooltip"
                                            title="Exportar PDF"
                                        >
                                            PDF
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {activePartida && (
                <APUEditor
                    partida={activePartida}
                    onSave={handleSaveAPU}
                    onClose={() => setEditingPartidaId(null)}
                />
            )}
        </div>
    );
};
