'use client';

import React, { useState } from 'react';
import {
    INSUMOS_REFERENCE_DATABASE,
    INSUMOS_REFERENCE_METADATA,
    getInsumosReferenceStats,
    searchInsumosReference
} from '@/data/insumosReference';
import { useInsumos } from '@/hooks/useInsumos';
import { InsumoMaestro } from '@/types';

export const InsumosReferenceCard: React.FC = () => {
    const { importFromJSON } = useInsumos();
    const stats = getInsumosReferenceStats();
    const [showModal, setShowModal] = useState(false);
    const [selectedType, setSelectedType] = useState<'ALL' | 'MATERIAL' | 'EQUIPO' | 'MANO_OBRA'>('ALL');
    const [importing, setImporting] = useState(false);

    const handleImport = async () => {
        setImporting(true);

        let insumosToImport: InsumoMaestro[] = [];

        if (selectedType === 'ALL') {
            insumosToImport = INSUMOS_REFERENCE_DATABASE;
        } else {
            insumosToImport = INSUMOS_REFERENCE_DATABASE.filter(i => i.tipo === selectedType);
        }

        // Generar nuevos IDs para evitar conflictos
        const insumosWithNewIds = insumosToImport.map(insumo => ({
            ...insumo,
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));

        importFromJSON(insumosWithNewIds);

        setTimeout(() => {
            setImporting(false);
            setShowModal(false);
            alert(`✅ ${insumosWithNewIds.length} insumos importados exitosamente`);
        }, 500);
    };

    const getCountByType = () => {
        switch (selectedType) {
            case 'MATERIAL': return stats.materiales;
            case 'EQUIPO': return stats.equipos;
            case 'MANO_OBRA': return stats.manoDeObra;
            default: return stats.total;
        }
    };

    return (
        <>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg shadow-md border border-indigo-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        <h3 className="text-lg font-semibold text-slate-800">
                            Base de Datos de Referencia
                        </h3>
                    </div>
                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                        v{stats.metadata.version}
                    </span>
                </div>

                {/* Metadata */}
                <div className="mb-4 p-3 bg-white rounded-lg border border-indigo-100">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-600">📅 Actualizado:</span>
                            <span className="ml-2 font-semibold text-indigo-700">
                                {stats.metadata.lastUpdate}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">💱 Tasa:</span>
                            <span className="ml-2 font-semibold text-indigo-700">
                                {stats.metadata.exchangeRate.toFixed(2)} Bs/USD
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Fuente:</span> {stats.metadata.source}
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-lg text-center border border-slate-200 hover:border-indigo-300 transition-colors">
                        <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                        <div className="text-xs text-gray-600 mt-1">Total</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center border border-slate-200 hover:border-green-300 transition-colors">
                        <div className="text-2xl font-bold text-green-600">{stats.materiales}</div>
                        <div className="text-xs text-gray-600 mt-1">Materiales</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center border border-slate-200 hover:border-orange-300 transition-colors">
                        <div className="text-2xl font-bold text-orange-600">{stats.equipos}</div>
                        <div className="text-xs text-gray-600 mt-1">Equipos</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center border border-slate-200 hover:border-purple-300 transition-colors">
                        <div className="text-2xl font-bold text-purple-600">{stats.manoDeObra}</div>
                        <div className="text-xs text-gray-600 mt-1">Mano Obra</div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    <span className="font-semibold">⚠️ Nota:</span> {stats.metadata.disclaimer}
                </div>

                {/* Botón de importación */}
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                    <span>📥</span>
                    <span>Importar a Mi Base de Datos</span>
                </button>
            </div>

            {/* Modal de importación */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">
                            Importar Insumos de Referencia
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Selecciona qué insumos deseas importar a tu base de datos personal:
                        </p>

                        {/* Opciones de importación */}
                        <div className="space-y-2 mb-6">
                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="radio"
                                    name="importType"
                                    value="ALL"
                                    checked={selectedType === 'ALL'}
                                    onChange={(e) => setSelectedType(e.target.value as any)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-slate-700">Todos los insumos</div>
                                    <div className="text-xs text-gray-500">{stats.total} insumos (materiales, equipos y mano de obra)</div>
                                </div>
                            </label>

                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="radio"
                                    name="importType"
                                    value="MATERIAL"
                                    checked={selectedType === 'MATERIAL'}
                                    onChange={(e) => setSelectedType(e.target.value as any)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-slate-700">Solo Materiales</div>
                                    <div className="text-xs text-gray-500">{stats.materiales} materiales (cemento, acero, bloques, etc.)</div>
                                </div>
                            </label>

                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="radio"
                                    name="importType"
                                    value="EQUIPO"
                                    checked={selectedType === 'EQUIPO'}
                                    onChange={(e) => setSelectedType(e.target.value as any)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-slate-700">Solo Equipos</div>
                                    <div className="text-xs text-gray-500">{stats.equipos} equipos (excavadoras, mezcladoras, etc.)</div>
                                </div>
                            </label>

                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="radio"
                                    name="importType"
                                    value="MANO_OBRA"
                                    checked={selectedType === 'MANO_OBRA'}
                                    onChange={(e) => setSelectedType(e.target.value as any)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-slate-700">Solo Mano de Obra</div>
                                    <div className="text-xs text-gray-500">{stats.manoDeObra} trabajadores (maestros, oficiales, ayudantes)</div>
                                </div>
                            </label>
                        </div>

                        {/* Resumen */}
                        <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                            <div className="text-sm text-indigo-900">
                                <span className="font-semibold">Se importarán:</span> {getCountByType()} insumos
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={importing}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={importing}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
                            >
                                {importing ? 'Importando...' : 'Importar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
