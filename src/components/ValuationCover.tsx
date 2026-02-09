"use client";

import React, { useState, useEffect } from 'react';
import { InfoTooltip } from './Tooltip';

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
        <div className="mt-8 bg-slate-900 text-white rounded-xl shadow-2xl p-8 max-w-lg ml-auto">
            <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-2 flex items-center gap-2">
                Carátula de Valuación
                <InfoTooltip
                    content="Resumen financiero de la valuación con IVA, amortizaciones y retenciones. El resultado es el monto neto a pagar."
                    side="left"
                />
            </h3>

            <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-400">Subtotal Obra</span>
                    <span className="font-semibold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Dynamic Inputs */}
                <div className="py-4 space-y-3 border-t border-slate-800 border-b border-slate-800">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-slate-400 flex items-center gap-1">
                            IVA (%)
                            <InfoTooltip
                                content="Impuesto al Valor Agregado que se suma al subtotal de la obra ejecutada."
                                side="top"
                            />
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={ivaPercent}
                                onChange={(e) => setIvaPercent(Number(e.target.value))}
                                className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-right text-sm focus:outline-none focus:border-blue-500"
                            />
                            <span className="w-24 text-right text-emerald-400">+ ${ivaAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="text-sm text-slate-400 flex items-center gap-1">
                            Amortización Anticipo (%)
                            <InfoTooltip
                                content="Descuento proporcional del anticipo recibido al inicio del contrato. Se aplica hasta completar el monto del anticipo."
                                side="top"
                            />
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={amortizationPercent}
                                onChange={(e) => setAmortizationPercent(Number(e.target.value))}
                                className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-right text-sm focus:outline-none focus:border-blue-500"
                            />
                            <span className="w-24 text-right text-red-400">- ${amortizationAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="text-sm text-slate-400 flex items-center gap-1">
                            Retención Fiel Cump. (%)
                            <InfoTooltip
                                content="Garantía de fiel cumplimiento que se retiene del pago. Se devuelve al finalizar la obra satisfactoriamente."
                                side="top"
                            />
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={retentionPercent}
                                onChange={(e) => setRetentionPercent(Number(e.target.value))}
                                className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-right text-sm focus:outline-none focus:border-blue-500"
                            />
                            <span className="w-24 text-right text-red-400">- ${retentionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Net Payable */}
                <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-blue-400">Total a Pagar</span>
                    <span className="text-2xl font-bold">${netPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    );
};

export default ValuationCover;
