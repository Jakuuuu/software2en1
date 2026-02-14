"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Trash2, Calculator, Users, Save, AlertCircle } from 'lucide-react';
import { ResourceInput, LaborInput, PartidaFormData, Resource, LaborResource } from '@/types';
import { calculateUnitPrice } from '@/utils/calculations';
import { useProjectConfig } from '@/hooks/useData';
import { useSocket } from '@/context/SocketContext';
import CoveninAutocomplete from './CoveninAutocomplete';
import { CoveninPartida } from '@/hooks/useCoveninSearch';

interface PartidaFormModalProps {
    projectId: string;
    onClose: () => void;
    onSave: (data: PartidaFormData) => void;
    initialData?: Partial<PartidaFormData>;
}

export default function PartidaFormModal({ projectId, onClose, onSave, initialData }: PartidaFormModalProps) {
    const config = useProjectConfig(projectId);
    const { isConnected, joinPartida, leavePartida, updatePartida, onPartidaUpdate, onUserJoined, onUserLeft } = useSocket();

    const [formData, setFormData] = useState<PartidaFormData>({
        code: initialData?.code || '',
        description: initialData?.description || '',
        unit: initialData?.unit || 'm2',
        quantity: initialData?.quantity || 1,
        materials: initialData?.materials || [],
        equipment: initialData?.equipment || [],
        labor: initialData?.labor || []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [calculations, setCalculations] = useState<any>(null);
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [lastUpdatedBy, setLastUpdatedBy] = useState<string>('');
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isRemoteUpdate = useRef(false);

    // Get a unique user identifier (in production, use actual user from auth)
    const currentUser = useRef(`User-${Math.random().toString(36).substr(2, 4)}`).current;
    const partidaId = initialData?.code || 'new';

    // WebSocket: Join room on mount, leave on unmount
    useEffect(() => {
        if (isConnected && partidaId) {
            joinPartida(partidaId, currentUser);
        }

        return () => {
            if (partidaId) {
                leavePartida(partidaId, currentUser);
            }
        };
    }, [isConnected, partidaId]);

    // WebSocket: Listen for remote updates
    useEffect(() => {
        onPartidaUpdate(({ data, updatedBy }) => {
            if (updatedBy !== currentUser) {
                isRemoteUpdate.current = true;
                setFormData(data);
                setLastUpdatedBy(updatedBy);
                setTimeout(() => setLastUpdatedBy(''), 3000);
            }
        });

        onUserJoined(({ userName }) => {
            setActiveUsers(prev => [...prev, userName]);
        });

        onUserLeft(({ userName }) => {
            setActiveUsers(prev => prev.filter(u => u !== userName));
        });
    }, []);

    // Debounced broadcast of local changes
    const broadcastUpdate = useCallback(() => {
        if (!isRemoteUpdate.current && isConnected) {
            updatePartida(partidaId, formData, currentUser);
        }
        isRemoteUpdate.current = false;
    }, [formData, isConnected, partidaId]);

    useEffect(() => {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        updateTimeoutRef.current = setTimeout(broadcastUpdate, 500);

        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [formData, broadcastUpdate]);

    // Recalculate when resources change
    useEffect(() => {
        const materials: Resource[] = formData.materials.map(m => ({
            ...m,
            total: m.quantity * m.unitPrice
        }));

        const equipment: Resource[] = formData.equipment.map(e => ({
            ...e,
            total: e.quantity * e.unitPrice
        }));

        const labor: Resource[] = formData.labor.map(l => ({
            ...l,
            total: l.quantity * l.unitPrice
        }));

        const calc = calculateUnitPrice(materials, equipment, labor, config);
        setCalculations(calc);
    }, [formData.materials, formData.equipment, formData.labor, config]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addMaterial = () => {
        setFormData(prev => ({
            ...prev,
            materials: [...prev.materials, { description: '', unit: 'UND', quantity: 0, unitPrice: 0 }]
        }));
    };

    const updateMaterial = (index: number, field: keyof ResourceInput, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.map((m, i) =>
                i === index ? { ...m, [field]: value } : m
            )
        }));
    };

    const removeMaterial = (index: number) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.filter((_, i) => i !== index)
        }));
    };

    const addEquipment = () => {
        setFormData(prev => ({
            ...prev,
            equipment: [...prev.equipment, { description: '', unit: 'HR', quantity: 0, unitPrice: 0 }]
        }));
    };

    const updateEquipment = (index: number, field: keyof ResourceInput, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            equipment: prev.equipment.map((e, i) =>
                i === index ? { ...e, [field]: value } : e
            )
        }));
    };

    const removeEquipment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            equipment: prev.equipment.filter((_, i) => i !== index)
        }));
    };

    const addLabor = () => {
        setFormData(prev => ({
            ...prev,
            labor: [...prev.labor, {
                description: '',
                unit: 'HR',
                quantity: 0,
                unitPrice: 0
            }]
        }));
    };

    const updateLabor = (index: number, field: keyof ResourceInput, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            labor: prev.labor.map((l, i) =>
                i === index ? { ...l, [field]: value } : l
            )
        }));
    };

    const removeLabor = (index: number) => {
        setFormData(prev => ({
            ...prev,
            labor: prev.labor.filter((_, i) => i !== index)
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.code.trim()) newErrors.code = 'Código requerido';
        if (!formData.description.trim()) newErrors.description = 'Descripción requerida';
        if (formData.quantity <= 0) newErrors.quantity = 'Cantidad debe ser mayor a 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900/95 border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-6xl max-h-[95vh] overflow-y-auto text-slate-200">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></span>
                                {initialData ? 'Editar Partida' : 'Nueva Partida'}
                            </h2>
                            {isConnected && (
                                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                                    En Vivo
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-400 font-mono mt-1 ml-4">Análisis de Precio Unitario (APU)</p>
                        {lastUpdatedBy && (
                            <p className="text-xs text-amber-500 mt-1 italic flex items-center gap-1 ml-4 animate-in slide-in-from-left-2">
                                <span>✏️</span> {lastUpdatedBy} actualizó este formulario...
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {activeUsers.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 border border-white/5 px-3 py-1.5 rounded-lg font-mono">
                                <Users size={14} className="text-indigo-400" />
                                <span>{activeUsers.length} editando</span>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Información General */}
                    <section className="bg-slate-800/30 rounded-xl p-6 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-indigo-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                            01. Información General
                            <div className="h-px bg-indigo-500/20 flex-1"></div>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Código COVENIN *
                                </label>
                                <CoveninAutocomplete
                                    value={formData.code}
                                    onChange={(value) => setFormData(prev => ({ ...prev, code: value }))}
                                    onSelect={(partida: CoveninPartida) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            code: partida.codigo,
                                            description: partida.descripcion,
                                            unit: partida.unidad as any
                                        }));
                                    }}
                                    error={errors.code}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Unidad *
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-slate-200"
                                >
                                    <option value="m2">m²</option>
                                    <option value="m3">m³</option>
                                    <option value="ml">ml</option>
                                    <option value="kg">kg</option>
                                    <option value="ton">ton</option>
                                    <option value="UND">UND</option>
                                    <option value="GL">GL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-slate-200 ${errors.quantity ? 'border-red-500/50' : 'border-slate-700/50'}`}
                                />
                                {errors.quantity && <p className="text-red-400 text-xs mt-1 font-mono">{errors.quantity}</p>}
                            </div>
                            <div className="col-span-1 md:col-span-4">
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                                    Descripción *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={2}
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700 resize-none ${errors.description ? 'border-red-500/50' : 'border-slate-700/50'}`}
                                    placeholder="CONSTRUCCIÓN DE PARED DE BLOQUES DE CONCRETO..."
                                />
                                {errors.description && <p className="text-red-400 text-xs mt-1 font-mono">{errors.description}</p>}
                            </div>
                        </div>
                    </section>

                    {/* MATERIALES */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                02. Materiales
                                <div className="h-px bg-emerald-500/20 w-12"></div>
                            </h3>
                            <button
                                type="button"
                                onClick={addMaterial}
                                className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1 uppercase tracking-wider"
                            >
                                <Plus size={14} />
                                Agregar Item
                            </button>
                        </div>
                        {formData.materials.length > 0 ? (
                            <div className="overflow-x-auto border border-white/5 rounded-xl bg-slate-900/30">
                                <table className="w-full">
                                    <thead className="bg-slate-800/50 text-xs text-slate-400 font-mono uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Descripción</th>
                                            <th className="px-4 py-3 text-left w-24">Unidad</th>
                                            <th className="px-4 py-3 text-right w-28">Cantidad</th>
                                            <th className="px-4 py-3 text-right w-32">P. Unitario</th>
                                            <th className="px-4 py-3 text-right w-32">Total</th>
                                            <th className="px-4 py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {formData.materials.map((material, index) => (
                                            <tr key={index} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={material.description}
                                                        onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                                                        className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-300 placeholder:text-slate-700"
                                                        placeholder="Descripción del material"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <select
                                                        value={material.unit}
                                                        onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-xs text-slate-400 focus:outline-none focus:border-emerald-500/50"
                                                    >
                                                        <option value="UND">UND</option>
                                                        <option value="kg">kg</option>
                                                        <option value="m3">m³</option>
                                                        <option value="m2">m²</option>
                                                        <option value="ml">ml</option>
                                                        <option value="lt">lt</option>
                                                        <option value="saco">saco</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={material.quantity}
                                                        onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-right text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 font-mono"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={material.unitPrice}
                                                        onChange={(e) => updateMaterial(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-right text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 font-mono"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right font-mono text-sm text-emerald-400">
                                                    ${(material.quantity * material.unitPrice).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMaterial(index)}
                                                        className="text-slate-600 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="border border-white/5 rounded-xl bg-slate-900/30 p-8 text-center border-dashed">
                                <p className="text-slate-600 text-sm italic">No hay materiales agregados</p>
                            </div>
                        )}
                        {calculations && (
                            <div className="mt-3 flex justify-end gap-6 text-sm font-mono border-t border-white/5 pt-3">
                                <p className="text-slate-500">
                                    Subtotal: <span className="text-slate-300">${calculations.breakdown.materials.toFixed(2)}</span>
                                </p>
                                {config.applyLOPCYMAT && (
                                    <p className="text-emerald-600">
                                        + LOPCYMAT (2%): <span className="text-emerald-400">${calculations.breakdown.lopcymat.toFixed(2)}</span>
                                    </p>
                                )}
                                <p className="text-white font-bold bg-slate-800/50 px-3 py-0.5 rounded border border-white/10">
                                    Total: ${(calculations.breakdown.materials + calculations.breakdown.lopcymat).toFixed(2)}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* EQUIPOS */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                03. Equipos
                                <div className="h-px bg-amber-500/20 w-12"></div>
                            </h3>
                            <button
                                type="button"
                                onClick={addEquipment}
                                className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1 uppercase tracking-wider"
                            >
                                <Plus size={14} />
                                Agregar Item
                            </button>
                        </div>
                        {formData.equipment.length > 0 ? (
                            <div className="overflow-x-auto border border-white/5 rounded-xl bg-slate-900/30">
                                <table className="w-full">
                                    <thead className="bg-slate-800/50 text-xs text-slate-400 font-mono uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Descripción</th>
                                            <th className="px-4 py-3 text-left w-24">Unidad</th>
                                            <th className="px-4 py-3 text-right w-28">Cantidad</th>
                                            <th className="px-4 py-3 text-right w-32">P. Unitario</th>
                                            <th className="px-4 py-3 text-right w-32">Total</th>
                                            <th className="px-4 py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {formData.equipment.map((equip, index) => (
                                            <tr key={index} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={equip.description}
                                                        onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                                                        className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-300 placeholder:text-slate-700"
                                                        placeholder="Descripción del equipo"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <select
                                                        value={equip.unit}
                                                        onChange={(e) => updateEquipment(index, 'unit', e.target.value)}
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-xs text-slate-400 focus:outline-none focus:border-amber-500/50"
                                                    >
                                                        <option value="HR">HR</option>
                                                        <option value="DIA">DIA</option>
                                                        <option value="MES">MES</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={equip.quantity}
                                                        onChange={(e) => updateEquipment(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-right text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 font-mono"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={equip.unitPrice}
                                                        onChange={(e) => updateEquipment(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-right text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 font-mono"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right font-mono text-sm text-amber-400">
                                                    ${(equip.quantity * equip.unitPrice).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEquipment(index)}
                                                        className="text-slate-600 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="border border-white/5 rounded-xl bg-slate-900/30 p-8 text-center border-dashed">
                                <p className="text-slate-600 text-sm italic">No hay equipos agregados</p>
                            </div>
                        )}
                        {calculations && (
                            <div className="mt-3 flex justify-end text-sm font-mono border-t border-white/5 pt-3">
                                <p className="text-white font-bold bg-slate-800/50 px-3 py-0.5 rounded border border-white/10">
                                    Total Equipos: <span className="text-amber-400">${calculations.breakdown.equipment.toFixed(2)}</span>
                                </p>
                            </div>
                        )}
                    </section>

                    {/* MANO DE OBRA */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                                04. Mano de Obra
                                <div className="h-px bg-sky-500/20 w-12"></div>
                            </h3>
                            <button
                                type="button"
                                onClick={addLabor}
                                className="px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-bold hover:bg-sky-500/20 transition-all flex items-center gap-1 uppercase tracking-wider"
                            >
                                <Plus size={14} />
                                Agregar Item
                            </button>
                        </div>
                        {formData.labor.length > 0 ? (
                            <div className="overflow-x-auto border border-white/5 rounded-xl bg-slate-900/30">
                                <table className="w-full">
                                    <thead className="bg-slate-800/50 text-xs text-slate-400 font-mono uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Descripción</th>
                                            <th className="px-4 py-3 text-left w-24">Unidad</th>
                                            <th className="px-4 py-3 text-right w-28">Horas</th>
                                            <th className="px-4 py-3 text-right w-32">Tarifa/Hr</th>
                                            <th className="px-4 py-3 text-right w-32">Subtotal</th>
                                            <th className="px-4 py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {formData.labor.map((labor, index) => (
                                            <tr key={index} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={labor.description}
                                                        onChange={(e) => updateLabor(index, 'description', e.target.value)}
                                                        className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-300 placeholder:text-slate-700"
                                                        placeholder="Descripción de la mano de obra"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <select
                                                        value={labor.unit}
                                                        onChange={(e) => updateLabor(index, 'unit', e.target.value)}
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-xs text-slate-400 focus:outline-none focus:border-sky-500/50"
                                                    >
                                                        <option value="HR">HR</option>
                                                        <option value="DIA">DIA</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={labor.quantity}
                                                        onChange={(e) => updateLabor(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-right text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 font-mono"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={labor.unitPrice}
                                                        onChange={(e) => updateLabor(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full bg-slate-950/30 border border-white/5 rounded px-2 py-1 text-right text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 font-mono"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right font-mono text-sm text-sky-400">
                                                    ${(labor.quantity * labor.unitPrice).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLabor(index)}
                                                        className="text-slate-600 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="border border-white/5 rounded-xl bg-slate-900/30 p-8 text-center border-dashed">
                                <p className="text-slate-600 text-sm italic">No hay mano de obra agregada</p>
                            </div>
                        )}
                        {calculations && (
                            <div className="mt-3 flex justify-end gap-6 text-sm font-mono border-t border-white/5 pt-3">
                                <p className="text-slate-500">
                                    Subtotal: <span className="text-slate-300">${calculations.breakdown.labor.toFixed(2)}</span>
                                </p>
                                <p className="text-sky-600">
                                    + Cargas: <span className="text-sky-400">${calculations.breakdown.socialCharges.toFixed(2)}</span>
                                </p>
                                <p className="text-white font-bold bg-slate-800/50 px-3 py-0.5 rounded border border-white/10">
                                    Total: ${(calculations.breakdown.labor + calculations.breakdown.socialCharges).toFixed(2)}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* RESUMEN */}
                    {calculations && (
                        <section className="bg-slate-800/50 rounded-xl p-8 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calculator className="text-indigo-400" size={20} />
                                        <h3 className="text-lg font-bold text-white tracking-wide">RESUMEN DE COSTOS</h3>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <span className="text-slate-400">Materiales + LOPCYMAT</span>
                                            <span className="font-mono text-emerald-400 font-bold">${(calculations.breakdown.materials + calculations.breakdown.lopcymat).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <span className="text-slate-400">Equipos</span>
                                            <span className="font-mono text-amber-400 font-bold">${calculations.breakdown.equipment.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <span className="text-slate-400">Mano de Obra + Cargas</span>
                                            <span className="font-mono text-sky-400 font-bold">${(calculations.breakdown.labor + calculations.breakdown.socialCharges).toFixed(2)}</span>
                                        </div>

                                        <div className="h-px bg-white/10 my-2"></div>

                                        <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg border border-white/5">
                                            <span className="text-slate-200 font-semibold">COSTO DIRECTO UNITARIO</span>
                                            <span className="font-mono text-white font-bold text-lg">${calculations.directCost.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                                    <div className="space-y-2 text-sm mt-10">
                                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400">
                                            <span>+ Administración ({config.administrationRate * 100}%)</span>
                                            <span className="font-mono text-slate-300">${calculations.breakdown.administration.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400">
                                            <span>+ Imprevistos ({config.utilitiesRate * 100}%)</span>
                                            <span className="font-mono text-slate-300">${calculations.breakdown.utilities.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400">
                                            <span>+ Utilidad ({config.profitRate * 100}%)</span>
                                            <span className="font-mono text-slate-300">${calculations.breakdown.profit.toFixed(2)}</span>
                                        </div>

                                        <div className="h-px bg-white/10 my-4"></div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-white tracking-widest">PRECIO UNITARIO</span>
                                            <div className="text-right">
                                                <span className="block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-mono">
                                                    ${calculations.unitPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-white/10 sticky bottom-0 z-20 bg-slate-900/50 backdrop-blur-md -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-transparent border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-sm font-medium tracking-wide uppercase"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] text-sm font-bold tracking-wide uppercase flex items-center gap-2"
                        >
                            <Save size={18} />
                            {initialData ? 'Actualizar Partida' : 'Guardar Partida'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
