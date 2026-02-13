"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Trash2, Calculator, Users } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {initialData ? 'Editar Partida' : 'Nueva Partida'}
                            </h2>
                            {isConnected && (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    En Vivo
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500">Análisis de Precio Unitario (APU)</p>
                        {lastUpdatedBy && (
                            <p className="text-xs text-amber-600 mt-1 italic">
                                ✏️ {lastUpdatedBy} actualizó este formulario
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {activeUsers.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                                <Users size={16} />
                                <span>{activeUsers.length} editando</span>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información General */}
                    <section className="bg-slate-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Información General</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Unidad *
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.quantity ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                />
                                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                            </div>
                            <div className="col-span-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Descripción *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={2}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="CONSTRUCCIÓN DE PARED DE BLOQUES DE CONCRETO..."
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    </section>

                    {/* MATERIALES */}
                    <section>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-slate-800">📦 MATERIALES</h3>
                            <button
                                type="button"
                                onClick={addMaterial}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Agregar
                            </button>
                        </div>
                        {formData.materials.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border border-slate-200 rounded-lg">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Descripción</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 w-24">Unidad</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-28">Cantidad</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-32">P. Unitario</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-32">Total</th>
                                            <th className="px-3 py-2 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.materials.map((material, index) => (
                                            <tr key={index} className="border-t border-slate-200">
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={material.description}
                                                        onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                                        placeholder="BLOQUE 15X20X40"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <select
                                                        value={material.unit}
                                                        onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
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
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={material.quantity}
                                                        onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm text-right"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={material.unitPrice}
                                                        onChange={(e) => updateMaterial(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm text-right"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right font-semibold text-sm">
                                                    ${(material.quantity * material.unitPrice).toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMaterial(index)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm italic">No hay materiales agregados</p>
                        )}
                        {calculations && (
                            <div className="mt-2 text-right space-y-1">
                                <p className="text-sm text-slate-600">
                                    Subtotal Materiales: <span className="font-semibold">${calculations.breakdown.materials.toFixed(2)}</span>
                                </p>
                                {config.applyLOPCYMAT && (
                                    <p className="text-sm text-emerald-600">
                                        + LOPCYMAT (2%): <span className="font-semibold">${calculations.breakdown.lopcymat.toFixed(2)}</span>
                                    </p>
                                )}
                                <p className="text-sm font-bold text-slate-800">
                                    Total Materiales: ${(calculations.breakdown.materials + calculations.breakdown.lopcymat).toFixed(2)}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* EQUIPOS */}
                    <section>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-slate-800">🔧 EQUIPOS</h3>
                            <button
                                type="button"
                                onClick={addEquipment}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Agregar
                            </button>
                        </div>
                        {formData.equipment.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border border-slate-200 rounded-lg">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Descripción</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 w-24">Unidad</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-28">Cantidad</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-32">P. Unitario</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-32">Total</th>
                                            <th className="px-3 py-2 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.equipment.map((equip, index) => (
                                            <tr key={index} className="border-t border-slate-200">
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={equip.description}
                                                        onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                                        placeholder="MEZCLADORA"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <select
                                                        value={equip.unit}
                                                        onChange={(e) => updateEquipment(index, 'unit', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                                    >
                                                        <option value="HR">HR</option>
                                                        <option value="DIA">DIA</option>
                                                        <option value="MES">MES</option>
                                                    </select>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={equip.quantity}
                                                        onChange={(e) => updateEquipment(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm text-right"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={equip.unitPrice}
                                                        onChange={(e) => updateEquipment(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm text-right"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right font-semibold text-sm">
                                                    ${(equip.quantity * equip.unitPrice).toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEquipment(index)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm italic">No hay equipos agregados</p>
                        )}
                        {calculations && (
                            <div className="mt-2 text-right">
                                <p className="text-sm font-bold text-slate-800">
                                    Total Equipos: ${calculations.breakdown.equipment.toFixed(2)}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* MANO DE OBRA */}
                    <section>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-slate-800">👷 MANO DE OBRA</h3>
                            <button
                                type="button"
                                onClick={addLabor}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Agregar
                            </button>
                        </div>
                        {formData.labor.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border border-slate-200 rounded-lg">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Descripción</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 w-24">Unidad</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-28">Horas</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-32">Tarifa/Hr</th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 w-32">Subtotal</th>
                                            <th className="px-3 py-2 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.labor.map((labor, index) => (
                                            <tr key={index} className="border-t border-slate-200">
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={labor.description}
                                                        onChange={(e) => updateLabor(index, 'description', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                                        placeholder="ALBAÑIL 1RA"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <select
                                                        value={labor.unit}
                                                        onChange={(e) => updateLabor(index, 'unit', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                                    >
                                                        <option value="HR">HR</option>
                                                        <option value="DIA">DIA</option>
                                                    </select>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={labor.quantity}
                                                        onChange={(e) => updateLabor(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm text-right"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={labor.unitPrice}
                                                        onChange={(e) => updateLabor(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm text-right"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right font-semibold text-sm">
                                                    ${(labor.quantity * labor.unitPrice).toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLabor(index)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm italic">No hay mano de obra agregada</p>
                        )}
                        {calculations && (
                            <div className="mt-2 text-right space-y-1">
                                <p className="text-sm text-slate-600">
                                    Subtotal M.O.: <span className="font-semibold">${calculations.breakdown.labor.toFixed(2)}</span>
                                </p>
                                <p className="text-sm text-emerald-600">
                                    + Cargas Sociales ({(config.ssoRate + config.lphRate + config.incesRate + config.vacationsRate + config.utilitiesRateMO) * 100}%): <span className="font-semibold">${calculations.breakdown.socialCharges.toFixed(2)}</span>
                                </p>
                                <p className="text-sm font-bold text-slate-800">
                                    Total M.O.: ${(calculations.breakdown.labor + calculations.breakdown.socialCharges).toFixed(2)}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* RESUMEN */}
                    {calculations && (
                        <section className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Calculator className="text-indigo-600" size={24} />
                                <h3 className="text-xl font-bold text-indigo-900">RESUMEN DE COSTOS</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-700">Materiales:</span>
                                    <span className="font-semibold">${calculations.breakdown.materials.toFixed(2)}</span>
                                </div>
                                {config.applyLOPCYMAT && (
                                    <div className="flex justify-between text-sm text-emerald-700">
                                        <span>+ LOPCYMAT (2%):</span>
                                        <span className="font-semibold">${calculations.breakdown.lopcymat.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-700">Equipos:</span>
                                    <span className="font-semibold">${calculations.breakdown.equipment.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-700">Mano de Obra:</span>
                                    <span className="font-semibold">${calculations.breakdown.labor.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-emerald-700">
                                    <span>+ Cargas Sociales:</span>
                                    <span className="font-semibold">${calculations.breakdown.socialCharges.toFixed(2)}</span>
                                </div>
                                <div className="border-t-2 border-indigo-300 pt-2 mt-2">
                                    <div className="flex justify-between font-semibold">
                                        <span>COSTO DIRECTO UNITARIO:</span>
                                        <span className="text-lg">${calculations.directCost.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>+ Administración ({config.administrationRate * 100}%):</span>
                                    <span className="font-semibold">${calculations.breakdown.administration.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>+ Imprevistos ({config.utilitiesRate * 100}%):</span>
                                    <span className="font-semibold">${calculations.breakdown.utilities.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>+ Utilidad ({config.profitRate * 100}%):</span>
                                    <span className="font-semibold">${calculations.breakdown.profit.toFixed(2)}</span>
                                </div>
                                <div className="border-t-2 border-indigo-400 pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-indigo-900">PRECIO UNITARIO TOTAL:</span>
                                        <span className="text-2xl font-bold text-indigo-600">${calculations.unitPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            {initialData ? 'Actualizar Partida' : 'Guardar Partida'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
