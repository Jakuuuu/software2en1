"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Building2, Briefcase, FileText, Scale, Settings } from 'lucide-react';
import { Project, LegalConfig } from '@/types';
import { useProjects } from '@/hooks/useData';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function ProjectConfigPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const { getProject, updateProject } = useProjects();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'general' | 'client' | 'contract' | 'legal'>('general');
    const [formData, setFormData] = useState<Partial<Project>>({});

    useEffect(() => {
        const proj = getProject(projectId);
        if (proj) {
            setProject(proj);
            setFormData(JSON.parse(JSON.stringify(proj))); // Deep copy
        } else {
            router.push('/projects');
        }
        setLoading(false);
    }, [projectId, getProject, router]);

    const handleInputChange = (section: keyof Project, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section] as any,
                [field]: value
            }
        }));
    };

    const handleLegalChange = (field: keyof LegalConfig, value: any) => {
        setFormData(prev => ({
            ...prev,
            legalConfig: {
                ...prev.legalConfig!,
                [field]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (project && formData) {
            updateProject(project.id, formData);
            alert('Configuración guardada exitosamente');
        }
    };

    if (loading || !project || !formData.legalConfig) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'General', icon: Building2 },
        { id: 'client', label: 'Cliente', icon: Briefcase },
        { id: 'contract', label: 'Contrato', icon: FileText },
        { id: 'legal', label: 'Legal e Impuestos', icon: Scale },
    ];

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
                            <h1 className="text-xl font-bold text-slate-900 leading-none">2 en 1 APU</h1>
                            <p className="text-xs text-slate-500 mt-1">{project.name}</p>
                        </div>
                    </div>
                    <Link href={`/projects/${projectId}`} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-600 font-medium">
                        <ArrowLeft size={16} /> Volver al Dashboard
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                <Breadcrumb items={[
                    { label: 'Proyectos', href: '/projects' },
                    { label: project.name, href: `/projects/${projectId}` },
                    { label: 'Configuración' }
                ]} />

                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Settings className="text-slate-600" size={32} />
                            Configuración del Proyecto
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Gestiona los detalles, cliente y parámetros legales del proyecto.
                        </p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-indigo-600 rounded-lg font-medium text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                        <Save size={18} />
                        Guardar Cambios
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex border-b border-slate-200">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors
                                    ${activeTab === tab.id
                                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Información General</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Nombre del Proyecto</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Código</label>
                                        <input
                                            type="text"
                                            value={formData.code || ''}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Ciudad</label>
                                        <input
                                            type="text"
                                            value={formData.location?.city || ''}
                                            onChange={(e) => handleInputChange('location', 'city', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Estado</label>
                                        <input
                                            type="text"
                                            value={formData.location?.state || ''}
                                            onChange={(e) => handleInputChange('location', 'state', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Dirección Completa</label>
                                        <textarea
                                            value={formData.location?.address || ''}
                                            onChange={(e) => handleInputChange('location', 'address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CLIENT TAB */}
                        {activeTab === 'client' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Información del Cliente</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Nombre / Razón Social</label>
                                        <input
                                            type="text"
                                            value={formData.client?.name || ''}
                                            onChange={(e) => handleInputChange('client', 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">RIF / Identificación</label>
                                        <input
                                            type="text"
                                            value={formData.client?.rif || ''}
                                            onChange={(e) => handleInputChange('client', 'rif', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Dirección Fiscal</label>
                                        <textarea
                                            value={formData.client?.address || ''}
                                            onChange={(e) => handleInputChange('client', 'address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 pt-4">Información del Contratista</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Nombre / Razón Social</label>
                                        <input
                                            type="text"
                                            value={formData.contractor?.name || ''}
                                            onChange={(e) => handleInputChange('contractor', 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">RIF / Identificación</label>
                                        <input
                                            type="text"
                                            value={formData.contractor?.rif || ''}
                                            onChange={(e) => handleInputChange('contractor', 'rif', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTRACT TAB */}
                        {activeTab === 'contract' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Detalles del Contrato</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Número de Contrato</label>
                                        <input
                                            type="text"
                                            value={formData.contract?.number || ''}
                                            onChange={(e) => handleInputChange('contract', 'number', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Moneda</label>
                                        <select
                                            value={formData.contract?.currency || 'USD'}
                                            onChange={(e) => handleInputChange('contract', 'currency', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="VES">Bolívares (Bs.)</option>
                                        </select>
                                    </div>
                                    {formData.contract?.currency === 'USD' && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Tasa de Cambio (Ref.)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.contract?.exchangeRate || 0}
                                                onChange={(e) => handleInputChange('contract', 'exchangeRate', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            value={formData.contract?.startDate ? new Date(formData.contract.startDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => handleInputChange('contract', 'startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Fecha de Fin</label>
                                        <input
                                            type="date"
                                            value={formData.contract?.endDate ? new Date(formData.contract.endDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => handleInputChange('contract', 'endDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LEGAL TAB */}
                        {activeTab === 'legal' && formData.legalConfig && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Configuración Legal e Impuestos</h3>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">IVA (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.ivaRate * 100}
                                                onChange={(e) => handleLegalChange('ivaRate', Number(e.target.value) / 100)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Retención IVA (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.retentionIVA * 100}
                                                onChange={(e) => handleLegalChange('retentionIVA', Number(e.target.value) / 100)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                        <p className="text-xs text-slate-500">Porcentaje del IVA a retener (generalmente 75% o 100%)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Retención ISLR (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.retentionISLR * 100}
                                                onChange={(e) => handleLegalChange('retentionISLR', Number(e.target.value) / 100)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Anticipo (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.advancePayment * 100}
                                                onChange={(e) => handleLegalChange('advancePayment', Number(e.target.value) / 100)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                        <p className="text-xs text-slate-500">Porcentaje del contrato dado como anticipo</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Fondo de Garantía / Finel Cump. (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.performanceBond * 100}
                                                onChange={(e) => handleLegalChange('performanceBond', Number(e.target.value) / 100)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* GOVERNMENT MODE */}
                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalConfig.isGovernmentProject || false}
                                            onChange={(e) => handleLegalChange('isGovernmentProject', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                        />
                                        <span className="font-bold text-indigo-900">Proyecto Gubernamental</span>
                                    </div>
                                    <p className="text-xs text-indigo-700 ml-8">
                                        Activa validaciones de cumplimiento para PDVSA, MinObras, GMVV, etc.
                                    </p>
                                </div>

                                {/* FCAS COMPLETE PARAMETERS */}
                                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 pt-4">Parámetros FCAS (Factor de Costos Asociados al Salario)</h3>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Días Trabajados/Año</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.workedDaysPerYear || 260}
                                            onChange={(e) => handleLegalChange('workedDaysPerYear', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">Generalmente 260 días (52 semanas × 5 días)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Días Pagados/Año</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.paidDaysPerYear || 365}
                                            onChange={(e) => handleLegalChange('paidDaysPerYear', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">365 días (incluye feriados, vacaciones, etc.)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Banavih (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={(formData.legalConfig.banavihRate || 0.01) * 100}
                                                onChange={(e) => handleLegalChange('banavihRate', Number(e.target.value) / 100)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                        <p className="text-xs text-slate-500">Ley de Política Habitacional (1%)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Cesta Ticket (Bs/día)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.legalConfig.cestaTicketDaily || 130}
                                            onChange={(e) => handleLegalChange('cestaTicketDaily', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">Según Decreto 4.298 y BCV</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Dotación EPP (USD/año)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.legalConfig.eppDotationYearly || 100}
                                            onChange={(e) => handleLegalChange('eppDotationYearly', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">Equipos de Protección Personal (LOPCYMAT)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Días Feriados/Año</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.paidHolidaysPerYear || 12}
                                            onChange={(e) => handleLegalChange('paidHolidaysPerYear', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">Días feriados nacionales pagados</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Bono Vacacional (días)</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.vacationBonusDays || 7}
                                            onChange={(e) => handleLegalChange('vacationBonusDays', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">LOTTT Art. 192 (7 días + 1 día/año)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Bono Fin de Año (días)</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.yearEndBonusDays || 15}
                                            onChange={(e) => handleLegalChange('yearEndBonusDays', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">Mínimo 15 días según LOTTT</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Antigüedad (días/año)</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.severanceDaysPerYear || 5}
                                            onChange={(e) => handleLegalChange('severanceDaysPerYear', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-xs text-slate-500">LOTTT Art. 142 (5 días/año)</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 pt-4">Leyes Laborales</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalConfig.applyLOPCYMAT}
                                            onChange={(e) => handleLegalChange('applyLOPCYMAT', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                        />
                                        <span className="text-slate-700">Aplicar LOPCYMAT</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalConfig.applyINCES}
                                            onChange={(e) => handleLegalChange('applyINCES', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                        />
                                        <span className="text-slate-700">Aplicar INCES</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalConfig.applySSO}
                                            onChange={(e) => handleLegalChange('applySSO', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                        />
                                        <span className="text-slate-700">Aplicar Seguro Social Obligatorio (SSO)</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

