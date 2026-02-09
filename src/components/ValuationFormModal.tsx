"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Calculator, CheckCircle2 } from 'lucide-react';
import { Partida, Project, Valuation } from '@/types';
import { formatCurrency } from '@/utils/currency';
import {
    calculateIVARetention,
    calculateISLRRetention,
    calculateValuationNetAmount
} from '@/utils/calculations';
import { DEFAULT_LEGAL_CONFIG } from '@/hooks/useData';

interface PartidaProgress {
    partidaId: string;
    code: string;
    description: string;
    unit: string;
    contracted: number;
    unitPrice: number;
    previousAccumulated: number;
    thisValuation: number;
    remaining: number;
}

interface ValuationFormModalProps {
    projectId: string;
    project: Project;
    partidas: Partida[];
    onClose: () => void;
    onSave: (valuation: Omit<Valuation, 'id' | 'createdAt' | 'updatedAt'>) => void;
    existingValuations: Valuation[];
}

export default function ValuationFormModal({
    projectId,
    project,
    partidas,
    onClose,
    onSave,
    existingValuations
}: ValuationFormModalProps) {
    const [periodStart, setPeriodStart] = useState('');
    const [periodEnd, setPeriodEnd] = useState('');
    const [progress, setProgress] = useState<PartidaProgress[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize progress state
    useEffect(() => {
        const initialProgress: PartidaProgress[] = partidas.map(p => ({
            partidaId: p.id,
            code: p.code,
            description: p.description,
            unit: p.unit,
            contracted: p.quantity || 0,
            unitPrice: p.unitPrice || 0,
            previousAccumulated: p.previousAccumulated || 0,
            thisValuation: 0,
            remaining: (p.quantity || 0) - (p.previousAccumulated || 0)
        }));
        setProgress(initialProgress);
    }, [partidas]);

    const handleProgressChange = (partidaId: string, value: string) => {
        const numValue = parseFloat(value) || 0;

        setProgress(prev => prev.map(p => {
            if (p.partidaId === partidaId) {
                const newThisValuation = Math.max(0, Math.min(numValue, p.remaining));
                return {
                    ...p,
                    thisValuation: newThisValuation
                };
            }
            return p;
        }));

        // Clear error for this partida
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[partidaId];
            return newErrors;
        });
    };

    // Calculate totals
    const grossAmount = progress.reduce((sum, p) => sum + (p.thisValuation * p.unitPrice), 0);

    const legalConfig = project.legalConfig || DEFAULT_LEGAL_CONFIG;

    // Calculate potential amortization (same % as advance payment)
    const potentialAmortization = grossAmount * legalConfig.advancePayment;

    // Use utility for all legal calculations
    const totals = calculateValuationNetAmount(
        grossAmount,
        legalConfig,
        potentialAmortization
    );

    const {
        iva: ivaAmount,
        amortization: advancePaymentDeduction,
        retentionIVA: ivaRetention,
        retentionISLR: islrRetention,
        performanceBond: guaranteeFund,
        netAmount
    } = totals;

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!periodStart) {
            newErrors.periodStart = 'Fecha de inicio requerida';
        }

        if (!periodEnd) {
            newErrors.periodEnd = 'Fecha de fin requerida';
        }

        if (periodStart && periodEnd && new Date(periodStart) > new Date(periodEnd)) {
            newErrors.periodEnd = 'La fecha de fin debe ser posterior a la de inicio';
        }

        const hasProgress = progress.some(p => p.thisValuation > 0);
        if (!hasProgress) {
            newErrors.general = 'Debe ingresar avance en al menos una partida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (status: Valuation['status'] = 'draft') => {
        if (!validate()) return;

        const valuationNumber = existingValuations.length + 1;

        const valuation: Omit<Valuation, 'id' | 'createdAt' | 'updatedAt'> = {
            projectId,
            number: valuationNumber,
            periodStart: new Date(periodStart),
            periodEnd: new Date(periodEnd),
            status,
            items: progress
                .filter(p => p.thisValuation > 0)
                .map(p => ({
                    partidaId: p.partidaId,
                    quantity: p.thisValuation,
                    unitPrice: p.unitPrice,
                    amount: p.thisValuation * p.unitPrice
                })),
            grossAmount,
            deductions: {
                advancePayment: advancePaymentDeduction,
                ivaRetention,
                islrRetention,
                guaranteeFund
            },
            netAmount,
            currency: project.contract.currency
        };

        onSave(valuation);
    };

    const totalPartidasWithProgress = progress.filter(p => p.thisValuation > 0).length;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Calculator className="text-emerald-600" size={28} />
                            Nueva Valuación
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {project.name} | Valuación #{existingValuations.length + 1}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Period Selection */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <Calendar size={18} className="text-indigo-600" />
                            Período de Valuación
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Fecha Inicio *
                                </label>
                                <input
                                    type="date"
                                    value={periodStart}
                                    onChange={(e) => setPeriodStart(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${errors.periodStart ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                />
                                {errors.periodStart && (
                                    <p className="text-xs text-red-600 mt-1">{errors.periodStart}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Fecha Fin *
                                </label>
                                <input
                                    type="date"
                                    value={periodEnd}
                                    onChange={(e) => setPeriodEnd(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${errors.periodEnd ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                />
                                {errors.periodEnd && (
                                    <p className="text-xs text-red-600 mt-1">{errors.periodEnd}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* General Error */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{errors.general}</p>
                        </div>
                    )}

                    {/* Partidas Progress Table */}
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-3">
                            Avances por Partida ({totalPartidasWithProgress} de {partidas.length})
                        </h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-100 sticky top-0">
                                        <tr>
                                            <th className="text-left p-3 font-semibold text-slate-700 w-24">Código</th>
                                            <th className="text-left p-3 font-semibold text-slate-700">Descripción</th>
                                            <th className="text-center p-3 font-semibold text-slate-700 w-20">Unidad</th>
                                            <th className="text-right p-3 font-semibold text-slate-700 w-24">Contratado</th>
                                            <th className="text-right p-3 font-semibold text-slate-700 w-24">Acumulado</th>
                                            <th className="text-right p-3 font-semibold text-slate-700 w-24">Restante</th>
                                            <th className="text-right p-3 font-semibold text-slate-700 w-32">Esta Valuación</th>
                                            <th className="text-right p-3 font-semibold text-slate-700 w-32">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {progress.map((p, idx) => {
                                            const amount = p.thisValuation * p.unitPrice;
                                            const hasProgress = p.thisValuation > 0;

                                            return (
                                                <tr
                                                    key={p.partidaId}
                                                    className={`border-b border-slate-100 ${hasProgress ? 'bg-emerald-50' : 'hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <td className="p-3">
                                                        <span className="text-xs font-mono text-slate-600">{p.code}</span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="text-slate-700">{p.description}</span>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <span className="text-slate-600">{p.unit}</span>
                                                    </td>
                                                    <td className="p-3 text-right text-slate-600">
                                                        {p.contracted.toFixed(2)}
                                                    </td>
                                                    <td className="p-3 text-right text-slate-600">
                                                        {p.previousAccumulated.toFixed(2)}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <span className={p.remaining > 0 ? 'text-amber-600 font-medium' : 'text-slate-400'}>
                                                            {p.remaining.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max={p.remaining}
                                                            value={p.thisValuation || ''}
                                                            onChange={(e) => handleProgressChange(p.partidaId, e.target.value)}
                                                            disabled={p.remaining <= 0}
                                                            className={`w-full px-2 py-1 border rounded text-right focus:ring-2 focus:ring-emerald-500 ${p.remaining <= 0
                                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                                : hasProgress
                                                                    ? 'border-emerald-500 bg-white font-semibold'
                                                                    : 'border-slate-300'
                                                                }`}
                                                            placeholder="0.00"
                                                        />
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <span className={hasProgress ? 'font-bold text-emerald-600' : 'text-slate-600'}>
                                                            {formatCurrency(amount, project.contract.currency)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-lg p-6 border-2 border-emerald-200">
                        <h3 className="font-bold text-slate-800 mb-4 text-lg">Resumen de Valuación</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-700">Monto Bruto:</span>
                                <span className="font-bold text-lg text-slate-800">
                                    {formatCurrency(grossAmount, project.contract.currency)}
                                </span>
                            </div>

                            {/* Deductions */}
                            <div className="border-t border-emerald-200 pt-3 space-y-2">
                                {advancePaymentDeduction > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">
                                            (-) Amortización Anticipo ({(legalConfig.advancePayment * 100).toFixed(1)}%):
                                        </span>
                                        <span className="font-semibold text-red-600">
                                            -{formatCurrency(advancePaymentDeduction, project.contract.currency)}
                                        </span>
                                    </div>
                                )}

                                {ivaAmount > 0 && (
                                    <>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">
                                                (+) IVA ({(legalConfig.ivaRate * 100).toFixed(0)}%):
                                            </span>
                                            <span className="font-semibold text-emerald-600">
                                                +{formatCurrency(ivaAmount, project.contract.currency)}
                                            </span>
                                        </div>
                                        {ivaRetention > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-600">
                                                    (-) Retención IVA ({(legalConfig.retentionIVA * 100).toFixed(0)}%):
                                                </span>
                                                <span className="font-semibold text-red-600">
                                                    -{formatCurrency(ivaRetention, project.contract.currency)}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {islrRetention > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">
                                            (-) Retención ISLR ({(legalConfig.retentionISLR * 100).toFixed(1)}%):
                                        </span>
                                        <span className="font-semibold text-red-600">
                                            -{formatCurrency(islrRetention, project.contract.currency)}
                                        </span>
                                    </div>
                                )}

                                {guaranteeFund > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">
                                            (-) Fondo de Garantía ({(legalConfig.performanceBond * 100).toFixed(1)}%):
                                        </span>
                                        <span className="font-semibold text-red-600">
                                            -{formatCurrency(guaranteeFund, project.contract.currency)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Net Amount */}
                            <div className="border-t-2 border-emerald-300 pt-3 flex justify-between items-center">
                                <span className="font-bold text-slate-800 text-lg">MONTO NETO A PAGAR:</span>
                                <span className="font-bold text-2xl text-emerald-600">
                                    {formatCurrency(netAmount, project.contract.currency)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                        {totalPartidasWithProgress > 0 ? (
                            <span className="flex items-center gap-2 text-emerald-600">
                                <CheckCircle2 size={16} />
                                {totalPartidasWithProgress} partida{totalPartidasWithProgress !== 1 ? 's' : ''} con avance
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-amber-600">
                                <AlertCircle size={16} />
                                Sin avances registrados
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => handleSubmit('draft')}
                            className="px-5 py-2.5 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
                        >
                            Guardar Borrador
                        </button>
                        <button
                            onClick={() => handleSubmit('submitted')}
                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                        >
                            Crear Valuación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
