"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Box, Truck, Users, AlertCircle, DollarSign } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900/95 border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-200">
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className={`w-2 h-6 rounded-full shadow-[0_0_10px_currentColor] ${formData.tipo === 'MATERIAL' ? 'bg-emerald-500 text-emerald-500' :
                                formData.tipo === 'EQUIPO' ? 'bg-amber-500 text-amber-500' :
                                    'bg-sky-500 text-sky-500'
                            }`}></span>
                        {editingInsumo ? 'Editar Insumo' : 'Nuevo Insumo'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Información Básica */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            Información Básica
                            <div className="h-px bg-indigo-500/20 flex-1"></div>
                        </h4>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Tipo de Insumo *
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.tipo}
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value as InsumoTipo, categoria: '' })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-slate-200 appearance-none"
                                        required
                                    >
                                        <option value="MATERIAL">Material</option>
                                        <option value="EQUIPO">Equipo</option>
                                        <option value="MANO_OBRA">Mano de Obra</option>
                                    </select>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                        {formData.tipo === 'MATERIAL' && <Box size={16} />}
                                        {formData.tipo === 'EQUIPO' && <Truck size={16} />}
                                        {formData.tipo === 'MANO_OBRA' && <Users size={16} />}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Categoría *
                                </label>
                                <select
                                    value={formData.categoria}
                                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-slate-200"
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
                            <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                Descripción *
                            </label>
                            <input
                                type="text"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700"
                                placeholder="Ej: Cemento Portland Tipo I"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Unidad *
                                </label>
                                <input
                                    type="text"
                                    value={formData.unidad}
                                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700"
                                    placeholder="Ej: saco, m³, hora"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Proveedor
                                </label>
                                <input
                                    type="text"
                                    value={formData.proveedor}
                                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700"
                                    placeholder="Opcional"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="space-y-6 bg-slate-800/30 p-6 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                Configuración de Precios
                            </h4>
                            <div className="flex bg-slate-950/50 p-1 rounded-lg border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setPrecioMode('USD')}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${precioMode === 'USD'
                                            ? 'bg-emerald-500 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    USD
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPrecioMode('BS')}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${precioMode === 'BS'
                                            ? 'bg-emerald-500 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    BS
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Precio Unitario (USD) *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                                        <DollarSign size={14} />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.precioUnitarioUSD}
                                        onChange={(e) => handlePrecioChange(parseFloat(e.target.value) || 0, 'USD')}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-slate-200 font-mono ${precioMode === 'BS' ? 'border-slate-800 opacity-50' : 'border-emerald-500/30'}`}
                                        disabled={precioMode === 'BS'}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Precio Unitario (Bs) *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs font-bold">Bs</div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.precioUnitarioBs}
                                        onChange={(e) => handlePrecioChange(parseFloat(e.target.value) || 0, 'BS')}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-slate-200 font-mono ${precioMode === 'USD' ? 'border-slate-800 opacity-50' : 'border-emerald-500/30'}`}
                                        disabled={precioMode === 'USD'}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-950/30 px-3 py-2 rounded-lg border border-white/5">
                            <AlertCircle size={12} className="text-indigo-400" />
                            Tasa de cambio actual: <span className="text-emerald-400 font-bold">{tasaCambio.toFixed(2)} Bs/USD</span>
                        </div>
                    </div>

                    {/* Campos específicos por tipo */}
                    {formData.tipo === 'MATERIAL' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                Configuración de Material
                                <div className="h-px bg-emerald-500/20 flex-1"></div>
                            </h4>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Factor de Desperdicio (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={(formData.wasteFactorDefault || 0) * 100}
                                    onChange={(e) => setFormData({ ...formData, wasteFactorDefault: parseFloat(e.target.value) / 100 })}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-slate-200"
                                />
                                <p className="text-xs text-slate-500 mt-1 font-mono">Recomendado: 5% - 10%</p>
                            </div>
                        </div>
                    )}

                    {formData.tipo === 'EQUIPO' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                Configuración de Equipo
                                <div className="h-px bg-amber-500/20 flex-1"></div>
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                        Tipo por Defecto
                                    </label>
                                    <select
                                        value={formData.ownershipTypeDefault}
                                        onChange={(e) => setFormData({ ...formData, ownershipTypeDefault: e.target.value as 'OWNED' | 'RENTED' })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-amber-500/50 outline-none transition-all text-slate-200"
                                    >
                                        <option value="RENTED">Alquilado</option>
                                        <option value="OWNED">Propio</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                        Vida Útil (horas)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.usefulLifeHours}
                                        onChange={(e) => setFormData({ ...formData, usefulLifeHours: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-amber-500/50 outline-none transition-all text-slate-200"
                                        placeholder="Ej: 10000"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.tipo === 'MANO_OBRA' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                                Configuración de Mano de Obra
                                <div className="h-px bg-sky-500/20 flex-1"></div>
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                        Categoría Laboral
                                    </label>
                                    <select
                                        value={formData.categoriaLaboral}
                                        onChange={(e) => setFormData({ ...formData, categoriaLaboral: e.target.value as any })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-sky-500/50 outline-none transition-all text-slate-200"
                                    >
                                        <option value="Profesional">Profesional</option>
                                        <option value="Técnico">Técnico</option>
                                        <option value="Obrero">Obrero</option>
                                        <option value="Ayudante">Ayudante</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                        Especialidad
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.especialidad}
                                        onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-sky-500/50 outline-none transition-all text-slate-200"
                                        placeholder="Ej: Albañil, Electricista"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Tabulador
                                </label>
                                <input
                                    type="text"
                                    value={formData.tabulador}
                                    onChange={(e) => setFormData({ ...formData, tabulador: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-sky-500/50 outline-none transition-all text-slate-200"
                                    placeholder="Ej: CIV 2026"
                                />
                            </div>
                        </div>
                    )}

                    {/* Notas */}
                    <div>
                        <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                            Notas
                        </label>
                        <textarea
                            value={formData.notas}
                            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700 resize-none"
                            rows={3}
                            placeholder="Información adicional..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-6 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition-all text-sm tracking-wide uppercase"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] text-sm tracking-wide uppercase flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {editingInsumo ? 'Guardar Cambios' : 'Crear Insumo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
