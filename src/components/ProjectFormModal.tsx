"use client";

import React, { useState } from 'react';
import { useProjects, DEFAULT_LEGAL_CONFIG } from '@/hooks/useData';
import { Currency } from '@/types';
import { X } from 'lucide-react';

interface ProjectFormModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProjectFormModal({ onClose, onSuccess }: ProjectFormModalProps) {
    const { addProject } = useProjects();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        clientName: '',
        clientRIF: '',
        clientAddress: '',
        contractorName: '',
        contractorRIF: '',
        contractNumber: '',
        contractDate: new Date().toISOString().split('T')[0],
        contractAmount: '',
        currency: 'USD' as Currency,
        exchangeRate: '36.50',
        state: '',
        city: '',
        address: '',
        startDate: new Date().toISOString().split('T')[0],
        estimatedEndDate: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Nombre del proyecto requerido';
        if (!formData.code.trim()) newErrors.code = 'Código requerido';
        if (!formData.clientName.trim()) newErrors.clientName = 'Nombre del cliente requerido';
        if (!formData.clientRIF.trim()) newErrors.clientRIF = 'RIF del cliente requerido';
        if (!formData.contractorName.trim()) newErrors.contractorName = 'Nombre del contratista requerido';
        if (!formData.contractorRIF.trim()) newErrors.contractorRIF = 'RIF del contratista requerido';
        if (!formData.contractNumber.trim()) newErrors.contractNumber = 'Número de contrato requerido';
        if (!formData.contractAmount || parseFloat(formData.contractAmount) <= 0) {
            newErrors.contractAmount = 'Monto válido requerido';
        }
        if (formData.currency === 'USD' && (!formData.exchangeRate || parseFloat(formData.exchangeRate) <= 0)) {
            newErrors.exchangeRate = 'Tasa de cambio válida requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const newProject = {
            name: formData.name,
            code: formData.code,
            client: {
                name: formData.clientName,
                rif: formData.clientRIF,
                address: formData.clientAddress
            },
            contractor: {
                name: formData.contractorName,
                rif: formData.contractorRIF
            },
            contract: {
                number: formData.contractNumber,
                date: new Date(formData.contractDate),
                amount: parseFloat(formData.contractAmount),
                currency: formData.currency,
                exchangeRate: formData.currency === 'USD' ? parseFloat(formData.exchangeRate) : undefined
            },
            location: {
                state: formData.state,
                city: formData.city,
                address: formData.address
            },
            dates: {
                start: new Date(formData.startDate),
                estimatedEnd: formData.estimatedEndDate ? new Date(formData.estimatedEndDate) : new Date()
            },
            legalConfig: DEFAULT_LEGAL_CONFIG,
            status: 'planning' as const
        };

        addProject(newProject);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Nuevo Proyecto</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información General */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Información General</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nombre del Proyecto *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="Torre Residencial A"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Código del Proyecto *
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.code ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="PROJ-2024-001"
                                />
                                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Cliente */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Cliente</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nombre del Cliente *
                                </label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.clientName ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="Constructora XYZ C.A."
                                />
                                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    RIF del Cliente *
                                </label>
                                <input
                                    type="text"
                                    name="clientRIF"
                                    value={formData.clientRIF}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.clientRIF ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="J-123456789"
                                />
                                {errors.clientRIF && <p className="text-red-500 text-xs mt-1">{errors.clientRIF}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Dirección del Cliente
                                </label>
                                <input
                                    type="text"
                                    name="clientAddress"
                                    value={formData.clientAddress}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Av. Principal, Caracas"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contratista */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Contratista</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nombre del Contratista *
                                </label>
                                <input
                                    type="text"
                                    name="contractorName"
                                    value={formData.contractorName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.contractorName ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="Mi Empresa C.A."
                                />
                                {errors.contractorName && <p className="text-red-500 text-xs mt-1">{errors.contractorName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    RIF del Contratista *
                                </label>
                                <input
                                    type="text"
                                    name="contractorRIF"
                                    value={formData.contractorRIF}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.contractorRIF ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="J-987654321"
                                />
                                {errors.contractorRIF && <p className="text-red-500 text-xs mt-1">{errors.contractorRIF}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Contrato */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Contrato</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Número de Contrato *
                                </label>
                                <input
                                    type="text"
                                    name="contractNumber"
                                    value={formData.contractNumber}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.contractNumber ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="CT-2024-001"
                                />
                                {errors.contractNumber && <p className="text-red-500 text-xs mt-1">{errors.contractNumber}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Fecha del Contrato
                                </label>
                                <input
                                    type="date"
                                    name="contractDate"
                                    value={formData.contractDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Moneda *
                                </label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="USD">Dólares (USD)</option>
                                    <option value="VES">Bolívares (VES)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Monto Contratado *
                                </label>
                                <input
                                    type="number"
                                    name="contractAmount"
                                    value={formData.contractAmount}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.contractAmount ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="500000.00"
                                />
                                {errors.contractAmount && <p className="text-red-500 text-xs mt-1">{errors.contractAmount}</p>}
                            </div>
                            {formData.currency === 'USD' && (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Tasa de Cambio (Bs/USD) *
                                    </label>
                                    <input
                                        type="number"
                                        name="exchangeRate"
                                        value={formData.exchangeRate}
                                        onChange={handleChange}
                                        step="0.01"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.exchangeRate ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                        placeholder="36.50"
                                    />
                                    {errors.exchangeRate && <p className="text-red-500 text-xs mt-1">{errors.exchangeRate}</p>}
                                    <p className="text-xs text-slate-500 mt-1">
                                        Equivalente: Bs. {(parseFloat(formData.contractAmount || '0') * parseFloat(formData.exchangeRate || '0')).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Ubicación y Fechas */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Ubicación y Fechas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Miranda"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Caracas"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Dirección de la Obra
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Av. Principal, Sector X"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Fecha Estimada de Fin
                                </label>
                                <input
                                    type="date"
                                    name="estimatedEndDate"
                                    value={formData.estimatedEndDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Crear Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
