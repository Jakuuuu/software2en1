"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects, DEFAULT_LEGAL_CONFIG } from '@/hooks/useData';
import { Currency } from '@/types';
import { X } from 'lucide-react';

interface ProjectFormModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProjectFormModal({ onClose, onSuccess }: ProjectFormModalProps) {
    const router = useRouter();
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

        const createdProject = addProject(newProject);
        onSuccess();
        router.push(`/projects/${createdProject.id}`);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900/95 border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-4xl w-full max-h-[90vh] overflow-y-auto text-slate-200">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary-500 rounded-full shadow-[0_0_10px_#0ea5e9]"></span>
                        Nuevo Proyecto
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Información General */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
                            01. I N F O R M A C I Ó N _ G E N E R A L
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Nombre del Proyecto *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100 ${errors.name ? 'border-red-500/50' : 'border-slate-800'
                                        }`}
                                    placeholder="Torre Residencial A"
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-1 font-mono">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Código del Proyecto *
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100 font-mono ${errors.code ? 'border-red-500/50' : 'border-slate-800'
                                        }`}
                                    placeholder="PROJ-2024-001"
                                />
                                {errors.code && <p className="text-red-400 text-xs mt-1 font-mono">{errors.code}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Cliente */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
                            02. C L I E N T E
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Nombre del Cliente *
                                </label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100 ${errors.clientName ? 'border-red-500/50' : 'border-slate-800'
                                        }`}
                                    placeholder="Constructora XYZ C.A."
                                />
                                {errors.clientName && <p className="text-red-400 text-xs mt-1 font-mono">{errors.clientName}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    RIF del Cliente *
                                </label>
                                <input
                                    type="text"
                                    name="clientRIF"
                                    value={formData.clientRIF}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100 font-mono ${errors.clientRIF ? 'border-red-500/50' : 'border-slate-800'
                                        }`}
                                    placeholder="J-123456789"
                                />
                                {errors.clientRIF && <p className="text-red-400 text-xs mt-1 font-mono">{errors.clientRIF}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Dirección del Cliente
                                </label>
                                <input
                                    type="text"
                                    name="clientAddress"
                                    value={formData.clientAddress}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100"
                                    placeholder="Av. Principal, Caracas"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contratista */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
                            03. C O N T R A T I S T A
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Nombre del Contratista *
                                </label>
                                <input
                                    type="text"
                                    name="contractorName"
                                    value={formData.contractorName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100 ${errors.contractorName ? 'border-red-500/50' : 'border-slate-800'
                                        }`}
                                    placeholder="Mi Empresa C.A."
                                />
                                {errors.contractorName && <p className="text-red-400 text-xs mt-1 font-mono">{errors.contractorName}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    RIF del Contratista *
                                </label>
                                <input
                                    type="text"
                                    name="contractorRIF"
                                    value={formData.contractorRIF}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100 font-mono ${errors.contractorRIF ? 'border-red-500/50' : 'border-slate-800'
                                        }`}
                                    placeholder="J-987654321"
                                />
                                {errors.contractorRIF && <p className="text-red-400 text-xs mt-1 font-mono">{errors.contractorRIF}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Contrato */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
                            04. D E T A L L E S _ D E L _ C O N T R A T O
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Número de Contrato *
                                </label>
                                <input
                                    type="text"
                                    name="contractNumber"
                                    value={formData.contractNumber}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100 font-mono ${errors.contractNumber ? 'border-red-500/50' : 'border-slate-800'
                                        }`}
                                    placeholder="CT-2024-001"
                                />
                                {errors.contractNumber && <p className="text-red-400 text-xs mt-1 font-mono">{errors.contractNumber}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Fecha del Contrato
                                </label>
                                <input
                                    type="date"
                                    name="contractDate"
                                    value={formData.contractDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-100 scheme-dark"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Moneda *
                                </label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-100"
                                >
                                    <option value="USD">Dólares (USD)</option>
                                    <option value="VES">Bolívares (VES)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Monto Contratado *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-2.5 text-slate-500 font-mono">$</span>
                                    <input
                                        type="number"
                                        name="contractAmount"
                                        value={formData.contractAmount}
                                        onChange={handleChange}
                                        step="0.01"
                                        className={`w-full pl-8 pr-4 py-2.5 bg-slate-950/50 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100 font-mono ${errors.contractAmount ? 'border-red-500/50' : 'border-slate-800'
                                            }`}
                                        placeholder="500000.00"
                                    />
                                </div>
                                {errors.contractAmount && <p className="text-red-400 text-xs mt-1 font-mono">{errors.contractAmount}</p>}
                            </div>
                            {formData.currency === 'USD' && (
                                <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                                    <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                        Tasa de Cambio (Bs/USD) *
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-1">
                                            <span className="absolute left-4 top-2.5 text-slate-500 font-mono">Bs</span>
                                            <input
                                                type="number"
                                                name="exchangeRate"
                                                value={formData.exchangeRate}
                                                onChange={handleChange}
                                                step="0.01"
                                                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-100 font-mono ${errors.exchangeRate ? 'border-red-500/50' : 'border-slate-800'
                                                    }`}
                                                placeholder="36.50"
                                            />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1">Equivalente en Bolívares</p>
                                            <p className="text-lg font-mono text-emerald-400 font-bold">
                                                Bs. {(parseFloat(formData.contractAmount || '0') * parseFloat(formData.exchangeRate || '0')).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                    {errors.exchangeRate && <p className="text-red-400 text-xs mt-1 font-mono">{errors.exchangeRate}</p>}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Ubicación y Fechas */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
                            05. U B I C A C I Ó N _ Y _ F E C H A S
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100"
                                    placeholder="Miranda"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100"
                                    placeholder="Caracas"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Dirección de la Obra
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 text-slate-100"
                                    placeholder="Av. Principal, Sector X"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-100 scheme-dark"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                                    Fecha Estimada de Fin
                                </label>
                                <input
                                    type="date"
                                    name="estimatedEndDate"
                                    value={formData.estimatedEndDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-100 scheme-dark"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg font-medium hover:bg-white/5 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                        >
                            Inicializar Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
