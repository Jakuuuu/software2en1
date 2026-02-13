"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Filter, Download, Upload, DollarSign, Edit2, Trash2, Check, X } from 'lucide-react';
import { useInsumos } from '@/hooks/useInsumos';
import { InsumoMaestro, InsumoTipo } from '@/types';
import { InsumosReferenceCard } from '@/components/InsumosReferenceCard';
import { InsumoFormModal } from '@/components/InsumoFormModal';

export default function InsumosPage() {
    const {
        insumos,
        categorias,
        tasaCambio,
        loading,
        createInsumo,
        updateInsumo,
        deleteInsumo,
        searchInsumos,
        convertBsToUSD,
        convertUSDToBs,
        updateTasaCambio,
        updatePreciosConNuevaTasa,
        getEstadisticas,
        exportToJSON
    } = useInsumos();

    const [searchQuery, setSearchQuery] = useState('');
    const [tipoFilter, setTipoFilter] = useState<InsumoTipo | ''>('');
    const [categoriaFilter, setCategoriaFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingInsumo, setEditingInsumo] = useState<InsumoMaestro | null>(null);
    const [showTasaModal, setShowTasaModal] = useState(false);
    const [nuevaTasa, setNuevaTasa] = useState(tasaCambio.valor.toString());

    const estadisticas = getEstadisticas();
    const filteredInsumos = searchInsumos(searchQuery, tipoFilter || undefined, categoriaFilter || undefined);

    const handleCreateEdit = () => {
        setEditingInsumo(null);
        setShowModal(true);
    };

    const handleSaveInsumo = (insumoData: Omit<InsumoMaestro, 'id' | 'codigo' | 'fechaActualizacion'>) => {
        if (editingInsumo) {
            updateInsumo(editingInsumo.id, insumoData);
        } else {
            createInsumo(insumoData);
        }
        setEditingInsumo(null);
    };

    const handleEdit = (insumo: InsumoMaestro) => {
        setEditingInsumo(insumo);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Está seguro de eliminar este insumo?')) {
            deleteInsumo(id);
        }
    };

    const handleExport = () => {
        const json = exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `insumos_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleUpdateTasa = () => {
        const tasa = parseFloat(nuevaTasa);
        if (!isNaN(tasa) && tasa > 0) {
            if (confirm(`¿Actualizar todos los precios en Bs con la nueva tasa ${tasa} Bs/USD?`)) {
                updatePreciosConNuevaTasa(tasa);
                setShowTasaModal(false);
            }
        }
    };

    const getTipoLabel = (tipo: InsumoTipo) => {
        switch (tipo) {
            case 'MATERIAL': return 'Material';
            case 'EQUIPO': return 'Equipo';
            case 'MANO_OBRA': return 'Mano de Obra';
        }
    };

    const getTipoBadgeColor = (tipo: InsumoTipo) => {
        switch (tipo) {
            case 'MATERIAL': return 'bg-blue-100 text-blue-800';
            case 'EQUIPO': return 'bg-green-100 text-green-800';
            case 'MANO_OBRA': return 'bg-purple-100 text-purple-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

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
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Base de Datos de Insumos</h1>
                            <p className="text-xs text-slate-500 mt-1">Gestión centralizada de materiales, equipos y mano de obra</p>
                        </div>
                    </div>
                    <Link href="/projects" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-600 font-medium">
                        <ArrowLeft size={16} /> Volver a Proyectos
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Base de Datos de Referencia */}
                <div className="mb-8">
                    <InsumosReferenceCard />
                </div>

                {/* Estadísticas Locales */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Mi Base de Datos</h2>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <div className="text-2xl font-bold text-slate-900">{estadisticas.total}</div>
                        <div className="text-sm text-slate-600">Total Insumos</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">{estadisticas.materiales}</div>
                        <div className="text-sm text-blue-700">Materiales</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-900">{estadisticas.equipos}</div>
                        <div className="text-sm text-green-700">Equipos</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-2xl font-bold text-purple-900">{estadisticas.manoDeObra}</div>
                        <div className="text-sm text-purple-700">Mano de Obra</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => setShowTasaModal(true)}>
                        <div className="text-lg font-bold text-indigo-900">{tasaCambio.valor.toFixed(2)} Bs/USD</div>
                        <div className="text-xs text-indigo-700">Tasa de Cambio <DollarSign size={12} className="inline" /></div>
                    </div>
                </div>

                {/* Barra de acciones */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 flex items-center gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por descripción o código..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <select
                                value={tipoFilter}
                                onChange={(e) => setTipoFilter(e.target.value as InsumoTipo | '')}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="">Todos los tipos</option>
                                <option value="MATERIAL">Materiales</option>
                                <option value="EQUIPO">Equipos</option>
                                <option value="MANO_OBRA">Mano de Obra</option>
                            </select>

                            <select
                                value={categoriaFilter}
                                onChange={(e) => setCategoriaFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="">Todas las categorías</option>
                                {tipoFilter === 'MATERIAL' && categorias.materiales.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                {tipoFilter === 'EQUIPO' && categorias.equipos.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                {tipoFilter === 'MANO_OBRA' && categorias.manoDeObra.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                            >
                                <Download size={18} />
                                Exportar
                            </button>
                            <button
                                onClick={handleCreateEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
                            >
                                <Plus size={18} />
                                Nuevo Insumo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla de insumos */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Código</th>
                                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Descripción</th>
                                    <th className="text-center p-3 text-sm font-semibold text-slate-700">Tipo</th>
                                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Categoría</th>
                                    <th className="text-center p-3 text-sm font-semibold text-slate-700">Unidad</th>
                                    <th className="text-right p-3 text-sm font-semibold text-slate-700">Precio Bs</th>
                                    <th className="text-right p-3 text-sm font-semibold text-slate-700">Precio USD</th>
                                    <th className="text-center p-3 text-sm font-semibold text-slate-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredInsumos.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-slate-500">
                                            {searchQuery || tipoFilter || categoriaFilter
                                                ? 'No se encontraron insumos con los filtros aplicados'
                                                : 'No hay insumos registrados. Haz clic en "Nuevo Insumo" para comenzar.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInsumos.map((insumo) => (
                                        <tr key={insumo.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 text-sm font-mono text-slate-900">{insumo.codigo}</td>
                                            <td className="p-3 text-sm text-slate-900">{insumo.descripcion}</td>
                                            <td className="p-3 text-center">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoBadgeColor(insumo.tipo)}`}>
                                                    {getTipoLabel(insumo.tipo)}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-slate-600">{insumo.categoria}</td>
                                            <td className="p-3 text-center text-sm text-slate-900">{insumo.unidad}</td>
                                            <td className="p-3 text-right text-sm font-medium text-slate-900">
                                                {insumo.precioUnitarioBs.toFixed(2)}
                                            </td>
                                            <td className="p-3 text-right text-sm font-medium text-green-700">
                                                ${insumo.precioUnitarioUSD.toFixed(2)}
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(insumo)}
                                                        className="p-1.5 hover:bg-indigo-50 rounded text-indigo-600 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(insumo.id)}
                                                        className="p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mostrar total de resultados */}
                {filteredInsumos.length > 0 && (
                    <div className="mt-4 text-sm text-slate-600 text-center">
                        Mostrando {filteredInsumos.length} de {insumos.length} insumos
                    </div>
                )}
            </main>

            {/* Modal de Tasa de Cambio */}
            {showTasaModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Actualizar Tasa de Cambio</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nueva Tasa (Bs/USD)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={nuevaTasa}
                                onChange={(e) => setNuevaTasa(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Tasa actual: {tasaCambio.valor.toFixed(2)} Bs/USD
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-yellow-800">
                                ⚠️ Esto actualizará todos los precios en Bolívares de todos los insumos usando la nueva tasa.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowTasaModal(false)}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdateTasa}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
