"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { InsumoMaestro, InsumoTipo } from '@/types';

interface InsumoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (insumo: Omit<InsumoMaestro, 'id' | 'codigo' | 'fechaActualizacion'>) => void;
    editingInsumo?: InsumoMaestro | null;
    tasaCambio: number;
    categorias: {
        materiales: string[];
        equipos: string[];
        manoDeObra: string[];
    };
}

export const InsumoFormModal: React.FC<InsumoFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingInsumo,
    tasaCambio,
    categorias
}) => {
    const [formData, setFormData] = useState({
        descripcion: '',
        unidad: '',
        tipo: 'MATERIAL' as InsumoTipo,
        categoria: '',
        precioUnitarioUSD: 0,
        precioUnitarioBs: 0,
        proveedor: '',
        fuentePrecio: 'MANUAL' as 'BCV' | 'PROVEEDOR' | 'TABULADOR_CIV' | 'MERCADO' | 'MANUAL',
        wasteFactorDefault: 0.05,
        ownershipTypeDefault: 'RENTED' as 'OWNED' | 'RENTED',
        usefulLifeHours: 0,
        categoriaLaboral: 'Obrero' as 'Profesional' | 'Técnico' | 'Obrero' | 'Ayudante',
        especialidad: '',
        tabulador: '',
        activo: true,
        notas: ''
    });

    const [precioMode, setPrecioMode] = useState<'USD' | 'BS'>('USD');

    useEffect(() => {
        if (editingInsumo) {
            setFormData({
                descripcion: editingInsumo.descripcion,
                unidad: editingInsumo.unidad,
                tipo: editingInsumo.tipo,
                categoria: editingInsumo.categoria,
                precioUnitarioUSD: editingInsumo.precioUnitarioUSD,
                precioUnitarioBs: editingInsumo.precioUnitarioBs,
                proveedor: editingInsumo.proveedor || '',
                fuentePrecio: editingInsumo.fuentePrecio || 'MANUAL',
                wasteFactorDefault: editingInsumo.wasteFactorDefault || 0.05,
                ownershipTypeDefault: editingInsumo.ownershipTypeDefault || 'RENTED',
                usefulLifeHours: editingInsumo.usefulLifeHours || 0,
                categoriaLaboral: editingInsumo.categoriaLaboral || 'Obrero',
                especialidad: editingInsumo.especialidad || '',
                tabulador: editingInsumo.tabulador || '',
                activo: editingInsumo.activo,
                notas: editingInsumo.notas || ''
            });
        } else {
            // Reset form
            setFormData({
                descripcion: '',
                unidad: '',
                tipo: 'MATERIAL',
                categoria: '',
                precioUnitarioUSD: 0,
                precioUnitarioBs: 0,
                proveedor: '',
                fuentePrecio: 'MANUAL',
                wasteFactorDefault: 0.05,
                ownershipTypeDefault: 'RENTED',
                usefulLifeHours: 0,
                categoriaLaboral: 'Obrero',
                especialidad: '',
                tabulador: '',
                activo: true,
                notas: ''
            });
        }
    }, [editingInsumo, isOpen]);

    const handlePrecioChange = (value: number, mode: 'USD' | 'BS') => {
        if (mode === 'USD') {
            setFormData({
                ...formData,
                precioUnitarioUSD: value,
                precioUnitarioBs: value * tasaCambio
            });
        } else {
            setFormData({
                ...formData,
                precioUnitarioBs: value,
                precioUnitarioUSD: value / tasaCambio
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            tasaCambioReferencia: tasaCambio
        });
        onClose();
    };

    const getCategoriasList = () => {
        switch (formData.tipo) {
            case 'MATERIAL': return categorias.materiales;
            case 'EQUIPO': return categorias.equipos;
            case 'MANO_OBRA': return categorias.manoDeObra;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                        {editingInsumo ? 'Editar Insumo' : 'Nuevo Insumo'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información Básica */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900 border-b pb-2">Información Básica</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Tipo de Insumo *
                                </label>
                                <select
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as InsumoTipo, categoria: '' })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                >
                                    <option value="MATERIAL">Material</option>
                                    <option value="EQUIPO">Equipo</option>
                                    <option value="MANO_OBRA">Mano de Obra</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Categoría *
                                </label>
                                <select
                                    value={formData.categoria}
                                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    {getCategoriasList().map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Descripción *
                            </label>
                            <input
                                type="text"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Ej: Cemento Portland Tipo I"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Unidad *
                                </label>
                                <input
                                    type="text"
                                    value={formData.unidad}
                                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ej: saco, m³, hora"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Proveedor
                                </label>
                                <input
                                    type="text"
                                    value={formData.proveedor}
                                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Opcional"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900 border-b pb-2">Precios</h4>

                        <div className="flex gap-2 mb-2">
                            <button
                                type="button"
                                onClick={() => setPrecioMode('USD')}
                                className={`px-3 py-1 rounded ${precioMode === 'USD' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                            >
                                Ingresar en USD
                            </button>
                            <button
                                type="button"
                                onClick={() => setPrecioMode('BS')}
                                className={`px-3 py-1 rounded ${precioMode === 'BS' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                            >
                                Ingresar en Bs
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Precio Unitario (USD) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precioUnitarioUSD}
                                    onChange={(e) => handlePrecioChange(parseFloat(e.target.value) || 0, 'USD')}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    disabled={precioMode === 'BS'}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Precio Unitario (Bs) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precioUnitarioBs}
                                    onChange={(e) => handlePrecioChange(parseFloat(e.target.value) || 0, 'BS')}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    disabled={precioMode === 'USD'}
                                    required
                                />
                            </div>
                        </div>

                        <p className="text-xs text-slate-500">
                            Tasa de cambio: {tasaCambio.toFixed(2)} Bs/USD
                        </p>
                    </div>

                    {/* Campos específicos por tipo */}
                    {formData.tipo === 'MATERIAL' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900 border-b pb-2">Configuración de Material</h4>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Factor de Desperdicio (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={(formData.wasteFactorDefault || 0) * 100}
                                    onChange={(e) => setFormData({ ...formData, wasteFactorDefault: parseFloat(e.target.value) / 100 })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">Por defecto: 5%</p>
                            </div>
                        </div>
                    )}

                    {formData.tipo === 'EQUIPO' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900 border-b pb-2">Configuración de Equipo</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Tipo por Defecto
                                    </label>
                                    <select
                                        value={formData.ownershipTypeDefault}
                                        onChange={(e) => setFormData({ ...formData, ownershipTypeDefault: e.target.value as 'OWNED' | 'RENTED' })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="RENTED">Alquilado</option>
                                        <option value="OWNED">Propio</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Vida Útil (horas)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.usefulLifeHours}
                                        onChange={(e) => setFormData({ ...formData, usefulLifeHours: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ej: 10000"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.tipo === 'MANO_OBRA' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900 border-b pb-2">Configuración de Mano de Obra</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Categoría Laboral
                                    </label>
                                    <select
                                        value={formData.categoriaLaboral}
                                        onChange={(e) => setFormData({ ...formData, categoriaLaboral: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="Profesional">Profesional</option>
                                        <option value="Técnico">Técnico</option>
                                        <option value="Obrero">Obrero</option>
                                        <option value="Ayudante">Ayudante</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Especialidad
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.especialidad}
                                        onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ej: Albañil, Electricista"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Tabulador
                                </label>
                                <input
                                    type="text"
                                    value={formData.tabulador}
                                    onChange={(e) => setFormData({ ...formData, tabulador: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ej: CIV 2026"
                                />
                            </div>
                        </div>
                    )}

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Notas
                        </label>
                        <textarea
                            value={formData.notas}
                            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows={3}
                            placeholder="Información adicional..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                        >
                            {editingInsumo ? 'Guardar Cambios' : 'Crear Insumo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
