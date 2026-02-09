"use client";

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Partida } from '../types';

export type { Partida };

interface ValuationTableProps {
    partidas: Partida[];
    onUpdate: (id: string, newValue: number) => void;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const ValuationTable = ({ partidas, onUpdate }: ValuationTableProps) => {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-100 mt-6">
            <table className="min-w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 font-medium">Descripción</th>
                        <th className="px-6 py-4 font-medium text-right">Contratado</th>
                        <th className="px-6 py-4 font-medium text-right">Acum. Anterior</th>
                        <th className="px-6 py-4 font-medium text-right bg-blue-50/50">Esta Valuación</th>
                        <th className="px-6 py-4 font-medium text-right">Total Acumulado</th>
                        <th className="px-6 py-4 font-medium text-right">Por Ejecutar</th>
                    </tr>
                </thead>
                <tbody>
                    {partidas.map((item) => {
                        const totalAccumulated = item.previousAccumulated + item.thisValuation;
                        const toExecute = item.contracted - totalAccumulated;
                        const isOverBudget = totalAccumulated > item.contracted;

                        return (
                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{item.description}</td>
                                <td className="px-6 py-4 text-right">${item.contracted.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">${item.previousAccumulated.toLocaleString()}</td>

                                {/* Editable Cell */}
                                <td className={cn(
                                    "px-6 py-4 text-right relative",
                                    isOverBudget ? "bg-red-50" : "bg-blue-50/30"
                                )}>
                                    <input
                                        type="number"
                                        value={item.thisValuation || ''}
                                        onChange={(e) => onUpdate(item.id, parseFloat(e.target.value) || 0)}
                                        className={cn(
                                            "w-full text-right bg-transparent border-b border-slate-300 focus:outline-none focus:border-blue-500 transition-colors p-1",
                                            isOverBudget && "text-red-600 font-bold border-red-500 focus:border-red-600"
                                        )}
                                        placeholder="0.00"
                                    />
                                    {isOverBudget && (
                                        <span className="absolute bottom-1 right-6 text-[10px] text-red-500 font-semibold">
                                            Excede Contrato via Block
                                        </span>
                                    )}
                                </td>

                                <td className={cn(
                                    "px-6 py-4 text-right font-medium",
                                    isOverBudget ? "text-red-600" : "text-slate-700"
                                )}>
                                    ${totalAccumulated.toLocaleString()}
                                </td>
                                <td className={cn(
                                    "px-6 py-4 text-right",
                                    toExecute < 0 ? "text-red-600 font-bold" : "text-emerald-600"
                                )}>
                                    ${toExecute.toLocaleString()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ValuationTable;
