"use client";

import React, { useState, useEffect } from 'react';
import { InfoTooltip } from './Tooltip';
import { DollarSign, Wallet, ShieldCheck, Landmark } from 'lucide-react';

interface ValuationCoverProps {
    subtotal: number;
}

const ValuationCover = ({ subtotal }: ValuationCoverProps) => {
    const [amortizationPercent, setAmortizationPercent] = useState(10); // Default 10%
    const [retentionPercent, setRetentionPercent] = useState(5); // Default 5%
    const [ivaPercent, setIvaPercent] = useState(16); // Default 16%

    const amortizationAmount = subtotal * (amortizationPercent / 100);
    const retentionAmount = subtotal * (retentionPercent / 100);

    // Net before IVA (Wait, usually IVA is on the Subtotal, then retentions are deducted from the Payable? Or IVA is calculated on Subtotal?)
    // Standard construction valuation flow:
    // 1. Subtotal (Avance de Obra)
    // 2. + IVA
    // 3. - Amortization (deducted from payment)
    // 4. - Retention (deducted from payment)
    // 5. = Net Payable

    // Let's implement standard flow:
    const ivaAmount = subtotal * (ivaPercent / 100);
    const totalValuation = subtotal + ivaAmount;
    const netPayable = totalValuation - amortizationAmount - retentionAmount;

    return (
        <div className="mt-8 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)] p-8 max-w-lg ml-auto relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            {/* Neon Glow Effect */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-500"></div>

            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center justify-between relative z-10">
                <span className="flex items-center gap-2 text-white tracking-wide">
                    <Wallet className="text-indigo-400" size={24} />
                    Carátula de Valuación
                </span>
                <InfoTooltip
                    content="Resumen financiero de la valuación con IVA, amortizaciones y retenciones. El resultado es el monto neto a pagar."
                    side="left"
                    triggerClassName="text-slate-400 hover:text-white"
                />
            </h3>

            <div className="space-y-6 relative z-10">
                {/* Subtotal */}
                <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-sm uppercase tracking-wider font-medium">Subtotal Obra</span>
                    <span className="text-2xl font-bold text-white font-mono tracking-tight group-hover:text-indigo-200 transition-colors">
                        ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>

                {/* Dynamic Inputs */}
                <div className="bg-black/20 rounded-xl p-4 space-y-4 border border-white/5">
                    {/* IVA */}
                    <div className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <label className="text-sm text-slate-400 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                <DollarSign size={16} />
                            </span>
                            IVA (%)
                            <InfoTooltip
                                content="Impuesto al Valor Agregado que se suma al subtotal de la obra ejecutada."
                                side="top"
                            />
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={ivaPercent}
                                onChange={(e) => setIvaPercent(Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-right text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
                            />
                            <span className="w-28 text-right text-emerald-400 font-mono font-medium">
                                + ${ivaAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Amortización */}
                    <div className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <label className="text-sm text-slate-400 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                                <Landmark size={16} />
                            </span>
                            Amortización (%)
                            <InfoTooltip
                                content="Descuento proporcional del anticipo recibido al inicio del contrato. Se aplica hasta completar el monto del anticipo."
                                side="top"
                            />
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={amortizationPercent}
                                onChange={(e) => setAmortizationPercent(Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-right text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-200"
                            />
                            <span className="w-28 text-right text-amber-500 font-mono font-medium">
                                - ${amortizationAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Retención */}
                    <div className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                        <label className="text-sm text-slate-400 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
                                <ShieldCheck size={16} />
                            </span>
                            Fiel Cump. (%)
                            <InfoTooltip
                                content="Garantía de fiel cumplimiento que se retiene del pago. Se devuelve al finalizar la obra satisfactoriamente."
                                side="top"
                            />
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={retentionPercent}
                                onChange={(e) => setRetentionPercent(Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-right text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-200"
                            />
                            <span className="w-28 text-right text-sky-500 font-mono font-medium">
                                - ${retentionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Net Payable */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-lg font-bold text-white uppercase tracking-widest flex flex-col">
                        Total a Pagar
                        <span className="text-[10px] text-slate-500 font-normal normal-case tracking-normal">Monto neto a recibir</span>
                    </span>
                    <span className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent font-mono shadow-indigo-500/20 drop-shadow-sm">
                        ${netPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ValuationCover;
