"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Info, FileText, Download } from 'lucide-react';

interface FcasComponents {
    salarioBase: number;
    diasTrabajadosAnio: number;
    diasPagadosAnio: number;
    sso: number; // 13.5%
    lph: number; // 3%
    banavih: number; // 1%
    inces: number; // 2%
    vacaciones: number; // 5.77%
    bonoVacacional: number; // Variable
    utilidades: number; // 5.77%
    bonoFinAnio: number; // Variable
    cestaTicketDiario: number; // Bs/día
    dotacionEPP: number; // Anual
    diasFeriados: number; // 4.62%
    antiguedad: number; // Variable
}

interface FcasResult {
    components: FcasComponents;
    totalFactor: number;
    costoTotal: number;
    breakdown: {
        name: string;
        percentage: number;
        amount: number;
        legalRef: string;
    }[];
}

export default function FcasCalculatorPage() {
    const [formData, setFormData] = useState<FcasComponents>({
        salarioBase: 0,
        diasTrabajadosAnio: 260,
        diasPagadosAnio: 365,
        sso: 13.5,
        lph: 3,
        banavih: 1,
        inces: 2,
        vacaciones: 5.77,
        bonoVacacional: 7,
        utilidades: 5.77,
        bonoFinAnio: 15,
        cestaTicketDiario: 0,
        dotacionEPP: 0,
        diasFeriados: 4.62,
        antiguedad: 5
    });

    const calculateFCAS = (): FcasResult => {
        const { salarioBase, diasTrabajadosAnio, diasPagadosAnio } = formData;

        if (salarioBase === 0) {
            return {
                components: formData,
                totalFactor: 0,
                costoTotal: 0,
                breakdown: []
            };
        }

        const salarioDiario = salarioBase / diasTrabajadosAnio;
        const factorDias = diasPagadosAnio / diasTrabajadosAnio;

        const breakdown = [
            {
                name: 'Seguro Social Obligatorio (SSO)',
                percentage: formData.sso,
                amount: salarioBase * (formData.sso / 100),
                legalRef: 'Ley del Seguro Social (Art. 62-65)'
            },
            {
                name: 'Ley Política Habitacional (LPH)',
                percentage: formData.lph,
                amount: salarioBase * (formData.lph / 100),
                legalRef: 'Ley de Política Habitacional (Art. 178)'
            },
            {
                name: 'Banavih',
                percentage: formData.banavih,
                amount: salarioBase * (formData.banavih / 100),
                legalRef: 'Ley BANAVIH (Art. 178)'
            },
            {
                name: 'INCES',
                percentage: formData.inces,
                amount: salarioBase * (formData.inces / 100),
                legalRef: 'Ley INCES (Art. 10-14)'
            },
            {
                name: 'Vacaciones',
                percentage: formData.vacaciones,
                amount: salarioBase * (formData.vacaciones / 100),
                legalRef: 'LOTTT (Art. 190-192)'
            },
            {
                name: 'Bono Vacacional',
                percentage: formData.bonoVacacional,
                amount: salarioBase * (formData.bonoVacacional / 100),
                legalRef: 'LOTTT (Art. 192)'
            },
            {
                name: 'Utilidades',
                percentage: formData.utilidades,
                amount: salarioBase * (formData.utilidades / 100),
                legalRef: 'LOTTT (Art. 131-140)'
            },
            {
                name: 'Bono de Fin de Año',
                percentage: formData.bonoFinAnio,
                amount: salarioBase * (formData.bonoFinAnio / 100),
                legalRef: 'LOTTT (Art. 131)'
            },
            {
                name: 'Cesta Ticket',
                percentage: 0,
                amount: formData.cestaTicketDiario * diasTrabajadosAnio,
                legalRef: 'Ley de Alimentación para Trabajadores'
            },
            {
                name: 'Dotación EPP',
                percentage: 0,
                amount: formData.dotacionEPP,
                legalRef: 'LOPCYMAT (Art. 53-59)'
            },
            {
                name: 'Días Feriados',
                percentage: formData.diasFeriados,
                amount: salarioBase * (formData.diasFeriados / 100),
                legalRef: 'LOTTT (Art. 184-189)'
            },
            {
                name: 'Antigüedad',
                percentage: formData.antiguedad,
                amount: salarioBase * (formData.antiguedad / 100),
                legalRef: 'LOTTT (Art. 141-142)'
            }
        ];

        const totalAmount = breakdown.reduce((sum, item) => sum + item.amount, 0);
        const totalFactor = 1 + (totalAmount / salarioBase);
        const costoTotal = salarioBase * totalFactor;

        return {
            components: formData,
            totalFactor,
            costoTotal,
            breakdown
        };
    };

    const result = calculateFCAS();

    const handleInputChange = (field: keyof FcasComponents, value: number) => {
        setFormData({ ...formData, [field]: value });
    };

    const exportToJSON = () => {
        const data = {
            fecha: new Date().toISOString(),
            configuracion: formData,
            resultado: result
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fcas_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-colors">
                            A
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Calculadora FCAS Avanzada</h1>
                            <p className="text-xs text-slate-500 mt-1">Factor de Costos Asociados al Salario - Venezuela</p>
                        </div>
                    </div>
                    <Link href="/projects" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-600 font-medium">
                        <ArrowLeft size={16} /> Volver
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Calculadora FCAS según normativa venezolana</p>
                        <p>Esta calculadora incluye los 14 componentes del FCAS requeridos para proyectos gubernamentales. Todos los porcentajes están basados en la legislación vigente (LOTTT, LOPCYMAT, Ley del Seguro Social).</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Input Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Salario Base */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Calculator size={20} className="text-indigo-600" />
                                Datos Base
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Salario Base Mensual (USD)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.salarioBase}
                                        onChange={(e) => handleInputChange('salarioBase', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Días Trabajados/Año
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.diasTrabajadosAnio}
                                        onChange={(e) => handleInputChange('diasTrabajadosAnio', parseInt(e.target.value) || 260)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Días Pagados/Año
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.diasPagadosAnio}
                                        onChange={(e) => handleInputChange('diasPagadosAnio', parseInt(e.target.value) || 365)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Aportes Patronales */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Aportes Patronales (%)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">SSO (13.5%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.sso}
                                        onChange={(e) => handleInputChange('sso', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LPH (3%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.lph}
                                        onChange={(e) => handleInputChange('lph', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Banavih (1%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.banavih}
                                        onChange={(e) => handleInputChange('banavih', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">INCES (2%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.inces}
                                        onChange={(e) => handleInputChange('inces', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prestaciones Sociales */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Prestaciones Sociales (%)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Vacaciones (5.77%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.vacaciones}
                                        onChange={(e) => handleInputChange('vacaciones', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bono Vacacional (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.bonoVacacional}
                                        onChange={(e) => handleInputChange('bonoVacacional', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Utilidades (5.77%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.utilidades}
                                        onChange={(e) => handleInputChange('utilidades', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bono Fin de Año (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.bonoFinAnio}
                                        onChange={(e) => handleInputChange('bonoFinAnio', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Días Feriados (4.62%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.diasFeriados}
                                        onChange={(e) => handleInputChange('diasFeriados', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Antigüedad (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.antiguedad}
                                        onChange={(e) => handleInputChange('antiguedad', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Otros Beneficios */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Otros Beneficios (Montos Fijos)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Cesta Ticket Diario (Bs)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.cestaTicketDiario}
                                        onChange={(e) => handleInputChange('cestaTicketDiario', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Dotación EPP Anual (USD)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.dotacionEPP}
                                        onChange={(e) => handleInputChange('dotacionEPP', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-6 text-white shadow-lg">
                            <h3 className="text-sm font-medium opacity-90 mb-2">Factor FCAS Total</h3>
                            <div className="text-4xl font-bold mb-4">{result.totalFactor.toFixed(4)}</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="opacity-90">Salario Base:</span>
                                    <span className="font-semibold">${formData.salarioBase.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-90">Costo Total:</span>
                                    <span className="font-semibold">${result.costoTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-indigo-500">
                                    <span className="opacity-90">Incremento:</span>
                                    <span className="font-semibold">{((result.totalFactor - 1) * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Desglose Detallado</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {result.breakdown.map((item, idx) => (
                                    <div key={idx} className="pb-3 border-b border-slate-100 last:border-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-medium text-slate-900">{item.name}</span>
                                            <span className="text-sm font-bold text-indigo-600">${item.amount.toFixed(2)}</span>
                                        </div>
                                        {item.percentage > 0 && (
                                            <div className="text-xs text-slate-500">{item.percentage}%</div>
                                        )}
                                        <div className="text-xs text-slate-400 mt-1">{item.legalRef}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <button
                                onClick={exportToJSON}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                            >
                                <Download size={18} />
                                Exportar JSON
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
