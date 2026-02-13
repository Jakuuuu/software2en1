"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, TrendingUp, Download, Info } from 'lucide-react';

interface IndirectCosts {
    administracion: number; // %
    imprevistos: number; // %
    utilidad: number; // %
    aplicarEnCascada: boolean;
}

interface CostBreakdown {
    costoDirecto: number;
    administracion: number;
    imprevistos: number;
    utilidad: number;
    costoTotal: number;
    porcentajeTotal: number;
}

export default function IndirectCostsPage() {
    const [costoDirecto, setCostoDirecto] = useState<number>(0);
    const [config, setConfig] = useState<IndirectCosts>({
        administracion: 10,
        imprevistos: 3,
        utilidad: 12,
        aplicarEnCascada: false
    });

    const calculateCosts = (): CostBreakdown => {
        if (costoDirecto === 0) {
            return {
                costoDirecto: 0,
                administracion: 0,
                imprevistos: 0,
                utilidad: 0,
                costoTotal: 0,
                porcentajeTotal: 0
            };
        }

        let breakdown: CostBreakdown;

        if (config.aplicarEnCascada) {
            // Cálculo en cascada: cada % se aplica sobre el subtotal anterior
            const admin = costoDirecto * (config.administracion / 100);
            const subtotal1 = costoDirecto + admin;

            const imprev = subtotal1 * (config.imprevistos / 100);
            const subtotal2 = subtotal1 + imprev;

            const util = subtotal2 * (config.utilidad / 100);
            const total = subtotal2 + util;

            breakdown = {
                costoDirecto,
                administracion: admin,
                imprevistos: imprev,
                utilidad: util,
                costoTotal: total,
                porcentajeTotal: ((total - costoDirecto) / costoDirecto) * 100
            };
        } else {
            // Cálculo paralelo: todos los % se aplican sobre el costo directo
            const admin = costoDirecto * (config.administracion / 100);
            const imprev = costoDirecto * (config.imprevistos / 100);
            const util = costoDirecto * (config.utilidad / 100);
            const total = costoDirecto + admin + imprev + util;

            breakdown = {
                costoDirecto,
                administracion: admin,
                imprevistos: imprev,
                utilidad: util,
                costoTotal: total,
                porcentajeTotal: config.administracion + config.imprevistos + config.utilidad
            };
        }

        return breakdown;
    };

    const result = calculateCosts();

    const exportToJSON = () => {
        const data = {
            fecha: new Date().toISOString(),
            costoDirecto,
            configuracion: config,
            resultado: result
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `costos_indirectos_${new Date().toISOString().split('T')[0]}.json`;
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
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Calculadora de Costos Indirectos</h1>
                            <p className="text-xs text-slate-500 mt-1">Administración, Imprevistos y Utilidad</p>
                        </div>
                    </div>
                    <Link href="/projects" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-600 font-medium">
                        <ArrowLeft size={16} /> Volver
                    </Link>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Calculadora de Costos Indirectos</p>
                        <p>Calcula Administración, Imprevistos y Utilidad. Puedes aplicar los porcentajes en paralelo (sobre costo directo) o en cascada (acumulativo). Rangos típicos: Admin 8-12%, Imprevistos 2-5%, Utilidad 10-15%.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Panel */}
                    <div className="space-y-6">
                        {/* Costo Directo */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Calculator size={20} className="text-indigo-600" />
                                Costo Directo Base
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Costo Directo Total (USD)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={costoDirecto}
                                    onChange={(e) => setCostoDirecto(parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Suma de materiales + equipos + mano de obra
                                </p>
                            </div>
                        </div>

                        {/* Porcentajes */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Porcentajes de Costos Indirectos</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Administración (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={config.administracion}
                                        onChange={(e) => setConfig({ ...config, administracion: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Rango típico: 8-12%</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Imprevistos (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={config.imprevistos}
                                        onChange={(e) => setConfig({ ...config, imprevistos: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Rango típico: 2-5%</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Utilidad (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={config.utilidad}
                                        onChange={(e) => setConfig({ ...config, utilidad: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Rango típico: 10-15%</p>
                                </div>
                            </div>
                        </div>

                        {/* Método de Cálculo */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Método de Cálculo</h3>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!config.aplicarEnCascada}
                                        onChange={() => setConfig({ ...config, aplicarEnCascada: false })}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium text-slate-900">Paralelo (Recomendado)</div>
                                        <div className="text-sm text-slate-600">Todos los % se aplican sobre el costo directo</div>
                                        <div className="text-xs text-slate-500 mt-1 font-mono">
                                            Total = CD × (1 + Admin% + Imprev% + Util%)
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={config.aplicarEnCascada}
                                        onChange={() => setConfig({ ...config, aplicarEnCascada: true })}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium text-slate-900">En Cascada</div>
                                        <div className="text-sm text-slate-600">Cada % se aplica sobre el subtotal anterior</div>
                                        <div className="text-xs text-slate-500 mt-1 font-mono">
                                            ST1 = CD × (1 + Admin%)<br />
                                            ST2 = ST1 × (1 + Imprev%)<br />
                                            Total = ST2 × (1 + Util%)
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
                            <h3 className="text-sm font-medium opacity-90 mb-2">Costo Total del Proyecto</h3>
                            <div className="text-4xl font-bold mb-4">${result.costoTotal.toFixed(2)}</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="opacity-90">Costo Directo:</span>
                                    <span className="font-semibold">${result.costoDirecto.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-90">Costos Indirectos:</span>
                                    <span className="font-semibold">${(result.costoTotal - result.costoDirecto).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-green-500">
                                    <span className="opacity-90">Incremento Total:</span>
                                    <span className="font-semibold">{result.porcentajeTotal.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Desglose Detallado</h3>
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700">Costo Directo</span>
                                        <span className="text-lg font-bold text-slate-900">${result.costoDirecto.toFixed(2)}</span>
                                    </div>
                                    <div className="text-xs text-slate-500">Base de cálculo</div>
                                </div>

                                <div className="pb-4 border-b border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700">Administración</span>
                                        <span className="text-lg font-bold text-indigo-600">${result.administracion.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Porcentaje aplicado</span>
                                        <span>{config.administracion}%</span>
                                    </div>
                                </div>

                                <div className="pb-4 border-b border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700">Imprevistos</span>
                                        <span className="text-lg font-bold text-orange-600">${result.imprevistos.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Porcentaje aplicado</span>
                                        <span>{config.imprevistos}%</span>
                                    </div>
                                </div>

                                <div className="pb-4 border-b border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700">Utilidad</span>
                                        <span className="text-lg font-bold text-green-600">${result.utilidad.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Porcentaje aplicado</span>
                                        <span>{config.utilidad}%</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-slate-900">TOTAL</span>
                                        <span className="text-2xl font-bold text-green-600">${result.costoTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Breakdown */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Distribución Visual</h3>
                            <div className="space-y-2">
                                {result.costoDirecto > 0 && (
                                    <>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-600">Costo Directo</span>
                                                <span className="font-medium">{((result.costoDirecto / result.costoTotal) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-8 bg-slate-200 rounded overflow-hidden">
                                                <div
                                                    className="h-full bg-slate-600 transition-all duration-300"
                                                    style={{ width: `${(result.costoDirecto / result.costoTotal) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-600">Administración</span>
                                                <span className="font-medium">{((result.administracion / result.costoTotal) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-8 bg-indigo-100 rounded overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-600 transition-all duration-300"
                                                    style={{ width: `${(result.administracion / result.costoTotal) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-600">Imprevistos</span>
                                                <span className="font-medium">{((result.imprevistos / result.costoTotal) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-8 bg-orange-100 rounded overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-600 transition-all duration-300"
                                                    style={{ width: `${(result.imprevistos / result.costoTotal) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-600">Utilidad</span>
                                                <span className="font-medium">{((result.utilidad / result.costoTotal) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-8 bg-green-100 rounded overflow-hidden">
                                                <div
                                                    className="h-full bg-green-600 transition-all duration-300"
                                                    style={{ width: `${(result.utilidad / result.costoTotal) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={exportToJSON}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                        >
                            <Download size={18} />
                            Exportar JSON
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
