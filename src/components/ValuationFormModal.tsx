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
import { Button } from '@/components/ui/Button';

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
    existingValuations = []
}: ValuationFormModalProps) {
    const [periodStart, setPeriodStart] = useState('');
    const [periodEnd, setPeriodEnd] = useState('');
    const [progress, setProgress] = useState<PartidaProgress[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize progress state
    useEffect(() => {
        if (!partidas) {
            setProgress([]);
            return;
        }

        const initialProgress: PartidaProgress[] = partidas
            .filter(p => !!p)
            .map(p => ({
                partidaId: p.id,
                code: p.code,
                description: p.description,
                unit: p.unit,
                contracted: Number(p.quantity || 0),
                unitPrice: Number(p.unitPrice || 0),
                previousAccumulated: Number(p.previousAccumulated || 0),
                thisValuation: 0,
                remaining: Number(p.quantity || 0) - Number(p.previousAccumulated || 0)
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

    const legalConfig = { ...DEFAULT_LEGAL_CONFIG, ...(project.legalConfig || {}) };
    const currency = project.contract?.currency || 'USD';

    // Calculate potential amortization (same % as advance payment)
    const potentialAmortization = grossAmount * legalConfig.advancePayment;

    // Use utility for all legal calculations
    let totals = {
        iva: 0,
        amortization: 0,
        retentionIVA: 0,
        retentionISLR: 0,
        performanceBond: 0,
        netAmount: 0
    };

    try {
        console.log('Calculating valuation totals:', { grossAmount, legalConfig, potentialAmortization });
        totals = calculateValuationNetAmount(
            grossAmount,
            legalConfig,
            potentialAmortization
        );
    } catch (error) {
        console.error('Error calculating valuation totals:', error);
    }

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
            currency: currency
        };

        onSave(valuation);
    };

    const totalPartidasWithProgress = progress.filter(p => p.thisValuation > 0).length;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900/95 border border-white/10 w-full max-w-[95vw] h-[90vh] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col text-slate-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-md rounded-t-xl sticky top-0 z-30">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></span>
                            Nueva Valuación
                        </h2>
                        <p className="text-slate-400 text-sm font-mono mt-1">
                            {project.name} • {project.code}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                    <div className="space-y-8">
                        {/* Period Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="date"
                                    value={periodStart}
                                    onChange={(e) => setPeriodStart(e.target.value)}
                                    className={`w-full px-4 py-2 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all text-slate-100 scheme-dark ${errors.periodStart ? 'border-red-500/50' : 'border-slate-700/50'}`}
                                />
                                {errors.periodStart && <p className="text-red-400 text-xs mt-1 font-mono">{errors.periodStart}</p>}
                            </div>
                            <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Fecha de Fin
                                </label>
                                <input
                                    type="date"
                                    value={periodEnd}
                                    onChange={(e) => setPeriodEnd(e.target.value)}
                                    className={`w-full px-4 py-2 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all text-slate-100 scheme-dark ${errors.periodEnd ? 'border-red-500/50' : 'border-slate-700/50'}`}
                                />
                                {errors.periodEnd && <p className="text-red-400 text-xs mt-1 font-mono">{errors.periodEnd}</p>}
                            </div>
                            <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm flex flex-col justify-center">
                                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Periodo</div>
                                <div className="text-xl font-bold text-white font-mono tracking-tight">
                                    {periodStart && periodEnd ? Math.max(0, Math.ceil((new Date(periodEnd).getTime() - new Date(periodStart).getTime()) / (1000 * 60 * 60 * 24))) : 0} Días
                                </div>
                            </div>
                        </div>

                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-300 font-mono">{errors.general}</p>
                            </div>
                        )}

                        {/* Partidas Table */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                PROGRESO FÍSICO ({totalPartidasWithProgress} de {partidas.length})
                            </h3>

                            <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50">
                                <div className="overflow-x-auto max-h-[500px]">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 font-mono tracking-wider sticky top-0 z-10 backdrop-blur-md">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Partida</th>
                                                <th className="px-6 py-4 font-medium text-center">Unidad</th>
                                                <th className="px-6 py-4 font-medium text-right">Contratado</th>
                                                <th className="px-6 py-4 font-medium text-right">Acumulado</th>
                                                <th className="px-6 py-4 font-medium text-right">Restante</th>
                                                <th className="px-6 py-4 font-medium text-right bg-emerald-950/20 border-l border-white/5 w-48">
                                                    Esta Valuación
                                                </th>
                                                <th className="px-6 py-4 font-medium text-right">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {progress.map((p) => {
                                                const amount = p.thisValuation * p.unitPrice;
                                                const hasProgress = p.thisValuation > 0;

                                                return (
                                                    <tr key={p.partidaId} className={`hover:bg-white/5 transition-colors group ${hasProgress ? 'bg-emerald-900/10' : ''}`}>
                                                        <td className="px-6 py-4 font-medium text-slate-200 min-w-[300px]">
                                                            <div className="font-mono text-xs text-slate-500 mb-1 bg-slate-800/50 inline-block px-1.5 py-0.5 rounded">{p.code}</div>
                                                            <div className="line-clamp-2" title={p.description}>{p.description}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-slate-400 text-xs">
                                                            {p.unit}
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-mono text-slate-300 text-xs">
                                                            {p.contracted.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-mono text-slate-400 text-xs">
                                                            {p.previousAccumulated.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-mono text-xs">
                                                            <span className={p.remaining > 0 ? 'text-amber-500 font-medium' : 'text-slate-500'}>
                                                                {p.remaining.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right bg-emerald-950/10 border-l border-r border-white/5">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max={p.remaining}
                                                                value={p.thisValuation || ''}
                                                                onChange={(e) => handleProgressChange(p.partidaId, e.target.value)}
                                                                disabled={p.remaining <= 0}
                                                                className={`w-full bg-slate-950/50 border rounded px-3 py-2 text-right font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${p.remaining <= 0 ? 'opacity-50 cursor-not-allowed border-slate-800' :
                                                                        hasProgress ? 'border-emerald-500/50 bg-emerald-950/30' : 'border-slate-700'
                                                                    }`}
                                                                placeholder="0.00"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-mono text-sm">
                                                            <span className={hasProgress ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                                                {formatCurrency(amount, currency)}
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

                        {/* Summary Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                            <div>
                                {/* Space for notes if needed later */}
                            </div>

                            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 space-y-3">
                                <h3 className="font-bold text-slate-200 mb-4 text-lg border-b border-white/10 pb-2">Resumen Financiero</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Monto Bruto</span>
                                    <span className="font-mono text-slate-200">{formatCurrency(grossAmount, currency)}</span>
                                </div>

                                {/* Deductions */}
                                {advancePaymentDeduction > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">(-) Amortización Anticipo</span>
                                        <span className="font-mono text-red-400">-{formatCurrency(advancePaymentDeduction, currency)}</span>
                                    </div>
                                )}

                                {ivaAmount > 0 && (
                                    <>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">(+) IVA</span>
                                            <span className="font-mono text-emerald-400">+{formatCurrency(ivaAmount, currency)}</span>
                                        </div>
                                        {ivaRetention > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">(-) Retención IVA</span>
                                                <span className="font-mono text-red-400">-{formatCurrency(ivaRetention, currency)}</span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {islrRetention > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">(-) Retención ISLR</span>
                                        <span className="font-mono text-red-400">-{formatCurrency(islrRetention, currency)}</span>
                                    </div>
                                )}

                                {guaranteeFund > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">(-) Fondo de Garantía</span>
                                        <span className="font-mono text-red-400">-{formatCurrency(guaranteeFund, currency)}</span>
                                    </div>
                                )}

                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-emerald-400">MONTO NETO A PAGAR</span>
                                    <span className="font-mono text-white text-xl">
                                        {formatCurrency(netAmount, currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 bg-slate-900/50 backdrop-blur-md p-6 rounded-b-xl flex justify-between items-center sticky bottom-0 z-30">
                    <div className="text-sm text-slate-500">
                        {totalPartidasWithProgress > 0 ? (
                            <span className="flex items-center gap-2 text-emerald-400 font-medium">
                                <CheckCircle2 size={16} />
                                {totalPartidasWithProgress} partida{totalPartidasWithProgress !== 1 ? 's' : ''} con avance
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-amber-500">
                                <AlertCircle size={16} />
                                Sin avances registrados
                            </span>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-transparent border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-sm font-medium tracking-wide uppercase"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => handleSubmit('draft')}
                            className="px-6 py-2.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all text-sm font-bold tracking-wide uppercase"
                        >
                            Guardar Borrador
                        </button>
                        <button
                            onClick={() => handleSubmit('submitted')}
                            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] text-sm font-bold tracking-wide uppercase flex items-center gap-2"
                        >
                            Crear Valuación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
