"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Database, Globe } from 'lucide-react';
import { useInsumos } from '@/hooks/useInsumos';
import { searchInsumosReference } from '@/data/insumosReference';
import { InsumoMaestro, InsumoTipo } from '@/types';

interface InsumoSelectorProps {
    tipo: InsumoTipo;
    onSelect: (insumo: InsumoMaestro) => void;
    onClose: () => void;
}

export const InsumoSelector: React.FC<InsumoSelectorProps> = ({ tipo, onSelect, onClose }) => {
    const { searchInsumos } = useInsumos();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoria, setCategoria] = useState('');
    const [localInsumos, setLocalInsumos] = useState<InsumoMaestro[]>([]);
    const [referenceInsumos, setReferenceInsumos] = useState<InsumoMaestro[]>([]);

    useEffect(() => {
        // Buscar en BD local
        const localResults = searchInsumos(searchQuery, tipo, categoria || undefined);
        setLocalInsumos(localResults);

        // Buscar en BD referencia
        const refResults = searchInsumosReference(searchQuery, tipo, categoria || undefined);
        setReferenceInsumos(refResults);
    }, [searchQuery, tipo, categoria, searchInsumos]);

    const getTipoLabel = () => {
        switch (tipo) {
            case 'MATERIAL': return 'Material';
            case 'EQUIPO': return 'Equipo';
            case 'MANO_OBRA': return 'Mano de Obra';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Seleccionar {getTipoLabel()}
                        </h3>
                        <p className="text-xs text-slate-500">
                            Buscando en tu Base de Datos y en Referencia de Mercado
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 py-4 border-b border-slate-200 bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por descripción, código o categoría..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50">
                    <div className="p-6 space-y-6">
                        {/* 1. Resultados Locales */}
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3 px-1">
                                <Database size={16} className="text-indigo-600" />
                                Mi Base de Datos ({localInsumos.length})
                            </h4>

                            {localInsumos.length === 0 ? (
                                <div className="text-sm text-slate-400 italic px-4 py-2 bg-white rounded border border-slate-100">
                                    No se encontraron resultados en tu base de datos local.
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="text-left p-3 font-medium text-slate-600">Código</th>
                                                <th className="text-left p-3 font-medium text-slate-600">Descripción</th>
                                                <th className="text-right p-3 font-medium text-slate-600 w-24">Precio</th>
                                                <th className="w-20"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {localInsumos.map((insumo) => (
                                                <tr key={insumo.id} className="hover:bg-indigo-50/30 transition-colors group">
                                                    <td className="p-3 font-mono text-slate-500 text-xs">{insumo.codigo}</td>
                                                    <td className="p-3">
                                                        <div className="font-medium text-slate-900">{insumo.descripcion}</div>
                                                        <div className="text-xs text-slate-500">{insumo.categoria} • {insumo.unidad}</div>
                                                    </td>
                                                    <td className="p-3 text-right font-medium text-slate-700">
                                                        ${insumo.precioUnitarioUSD.toFixed(2)}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={() => { onSelect(insumo); onClose(); }}
                                                            className="px-3 py-1 bg-white border border-indigo-200 text-indigo-600 rounded hover:bg-indigo-600 hover:text-white text-xs font-medium transition-colors"
                                                        >
                                                            Usar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* 2. Resultados de Referencia */}
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3 px-1 mt-6 border-t border-slate-200 pt-6">
                                <Globe size={16} className="text-green-600" />
                                Referencia de Mercado ({referenceInsumos.length})
                            </h4>

                            {referenceInsumos.length === 0 ? (
                                <div className="text-sm text-slate-400 italic px-4 py-2 bg-white rounded border border-slate-100">
                                    No se encontraron resultados en la referencia de mercado.
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-green-50/30 border-b border-green-100">
                                            <tr>
                                                <th className="text-left p-3 font-medium text-slate-600">Código Ref.</th>
                                                <th className="text-left p-3 font-medium text-slate-600">Descripción</th>
                                                <th className="text-right p-3 font-medium text-slate-600 w-24">Ref. USD</th>
                                                <th className="w-20"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-50">
                                            {referenceInsumos.map((insumo) => (
                                                <tr key={insumo.id} className="hover:bg-green-50/30 transition-colors group">
                                                    <td className="p-3 font-mono text-slate-400 text-xs">{insumo.codigo}</td>
                                                    <td className="p-3">
                                                        <div className="font-medium text-slate-900">{insumo.descripcion}</div>
                                                        <div className="text-xs text-slate-500">{insumo.categoria} • {insumo.unidad}</div>
                                                    </td>
                                                    <td className="p-3 text-right font-medium text-green-700 relative group-hover:font-bold">
                                                        ${insumo.precioUnitarioUSD.toFixed(2)}
                                                        {insumo.precioUnitarioBs > 0 && (
                                                            <div className="absolute top-0 right-0 -mt-2 mr-2 bg-green-100 text-green-800 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                                                                Ref. Mercado
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={() => { onSelect(insumo); onClose(); }}
                                                            className="px-3 py-1 bg-white border border-green-200 text-green-600 rounded hover:bg-green-600 hover:text-white text-xs font-medium transition-colors"
                                                        >
                                                            Copiar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-200 bg-white text-xs text-slate-500 flex justify-between">
                    <span>
                        Mostrando {localInsumos.length + referenceInsumos.length} resultados totales
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Tu BD
                        <span className="w-2 h-2 rounded-full bg-green-500 ml-2"></span> Mercado
                    </span>
                </div>
            </div>
        </div>
    );
};
