"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Building2, Briefcase, FileText, Scale, Settings, CheckCircle2 } from 'lucide-react';
import { Project, LegalConfig } from '@/types';
import { useProjects } from '@/hooks/useData';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/Button';

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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto shadow-[0_0_15px_#6366f1]"></div>
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
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-white pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"></div>
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-pulse-slow"></div>

            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/projects/${projectId}`}>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400 mb-0.5 uppercase tracking-widest">
                                <span>PROJECT: {project.code}</span>
                                <span>/</span>
                                <span>SETTINGS_MODULE</span>
                            </div>
                            <h1 className="text-lg font-bold text-white tracking-tight">{project.name}</h1>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 relative z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                <Settings className="text-indigo-400" size={24} />
                            </div>
                            Configuración
                        </h2>
                        <p className="text-slate-400 mt-2 text-sm">
                            Parámetros globales del proyecto, cliente, contrato y normativas legales.
                        </p>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        leftIcon={<Save size={18} />}
                        variant="cyber"
                        className="shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                    >
                        Guardar Cambios
                    </Button>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
                    <div className="flex border-b border-white/5">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all relative
                                    ${activeTab === tab.id
                                        ? 'text-indigo-400 bg-indigo-500/10'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2">Información General</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Nombre del Proyecto</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner placeholder:text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Código</label>
                                        <input
                                            type="text"
                                            value={formData.code || ''}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Ciudad</label>
                                        <input
                                            type="text"
                                            value={formData.location?.city || ''}
                                            onChange={(e) => handleInputChange('location', 'city', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Estado</label>
                                        <input
                                            type="text"
                                            value={formData.location?.state || ''}
                                            onChange={(e) => handleInputChange('location', 'state', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Dirección Completa</label>
                                        <textarea
                                            value={formData.location?.address || ''}
                                            onChange={(e) => handleInputChange('location', 'address', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CLIENT TAB */}
                        {activeTab === 'client' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2">Información del Cliente</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Nombre / Razón Social</label>
                                        <input
                                            type="text"
                                            value={formData.client?.name || ''}
                                            onChange={(e) => handleInputChange('client', 'name', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">RIF / Identificación</label>
                                        <input
                                            type="text"
                                            value={formData.client?.rif || ''}
                                            onChange={(e) => handleInputChange('client', 'rif', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Dirección Fiscal</label>
                                        <textarea
                                            value={formData.client?.address || ''}
                                            onChange={(e) => handleInputChange('client', 'address', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2 pt-4">Información del Contratista</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Nombre / Razón Social</label>
                                        <input
                                            type="text"
                                            value={formData.contractor?.name || ''}
                                            onChange={(e) => handleInputChange('contractor', 'name', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">RIF / Identificación</label>
                                        <input
                                            type="text"
                                            value={formData.contractor?.rif || ''}
                                            onChange={(e) => handleInputChange('contractor', 'rif', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTRACT TAB */}
                        {activeTab === 'contract' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2">Detalles del Contrato</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Número de Contrato</label>
                                        <input
                                            type="text"
                                            value={formData.contract?.number || ''}
                                            onChange={(e) => handleInputChange('contract', 'number', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Moneda</label>
                                        <select
                                            value={formData.contract?.currency || 'USD'}
                                            onChange={(e) => handleInputChange('contract', 'currency', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="VES">Bolívares (Bs.)</option>
                                        </select>
                                    </div>
                                    {formData.contract?.currency === 'USD' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono text-slate-500 uppercase">Tasa de Cambio (Ref.)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.contract?.exchangeRate || 0}
                                                onChange={(e) => handleInputChange('contract', 'exchangeRate', Number(e.target.value))}
                                                className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            value={formData.contract?.startDate ? new Date(formData.contract.startDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => handleInputChange('contract', 'startDate', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Fecha de Fin</label>
                                        <input
                                            type="date"
                                            value={formData.contract?.endDate ? new Date(formData.contract.endDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => handleInputChange('contract', 'endDate', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LEGAL TAB */}
                        {activeTab === 'legal' && formData.legalConfig && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2">Configuración Legal e Impuestos</h3>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">IVA (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.ivaRate * 100}
                                                onChange={(e) => handleLegalChange('ivaRate', Number(e.target.value) / 100)}
                                                className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Retención IVA (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.retentionIVA * 100}
                                                onChange={(e) => handleLegalChange('retentionIVA', Number(e.target.value) / 100)}
                                                className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-600">Porcentaje del IVA a retener (generalmente 75% o 100%)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Retención ISLR (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.retentionISLR * 100}
                                                onChange={(e) => handleLegalChange('retentionISLR', Number(e.target.value) / 100)}
                                                className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Anticipo (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.advancePayment * 100}
                                                onChange={(e) => handleLegalChange('advancePayment', Number(e.target.value) / 100)}
                                                className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-600">Porcentaje del contrato dado como anticipo</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Fondo de Garantía / Finel Cump. (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.legalConfig.performanceBond * 100}
                                                onChange={(e) => handleLegalChange('performanceBond', Number(e.target.value) / 100)}
                                                className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* GOVERNMENT MODE */}
                                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalConfig.isGovernmentProject || false}
                                            onChange={(e) => handleLegalChange('isGovernmentProject', e.target.checked)}
                                            className="w-5 h-5 text-indigo-400 rounded focus:ring-indigo-500 bg-slate-900 border-white/10"
                                        />
                                        <span className="font-bold text-indigo-400">Proyecto Gubernamental</span>
                                    </div>
                                    <p className="text-xs text-indigo-300/70 ml-8">
                                        Activa validaciones de cumplimiento para PDVSA, MinObras, GMVV, etc.
                                    </p>
                                </div>

                                {/* FCAS COMPLETE PARAMETERS */}
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2 pt-4">Parámetros FCAS (Factor de Costos Asociados al Salario)</h3>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Días Trabajados/Año</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.workedDaysPerYear || 260}
                                            onChange={(e) => handleLegalChange('workedDaysPerYear', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                        <p className="text-[10px] text-slate-600">Generalmente 260 días (52 semanas × 5 días)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Días Pagados/Año</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.paidDaysPerYear || 365}
                                            onChange={(e) => handleLegalChange('paidDaysPerYear', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                        <p className="text-[10px] text-slate-600">365 días (incluye feriados, vacaciones, etc.)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Banavih (%)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={(formData.legalConfig.banavihRate || 0.01) * 100}
                                                onChange={(e) => handleLegalChange('banavihRate', Number(e.target.value) / 100)}
                                                className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-600">Ley de Política Habitacional (1%)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Cesta Ticket (Bs/día)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.legalConfig.cestaTicketDaily || 130}
                                            onChange={(e) => handleLegalChange('cestaTicketDaily', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                        <p className="text-[10px] text-slate-600">Según Decreto 4.298 y BCV</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Dotación EPP (USD/año)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.legalConfig.eppDotationYearly || 100}
                                            onChange={(e) => handleLegalChange('eppDotationYearly', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                        <p className="text-[10px] text-slate-600">Equipos de Protección Personal (LOPCYMAT)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Días Feriados/Año</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.paidHolidaysPerYear || 12}
                                            onChange={(e) => handleLegalChange('paidHolidaysPerYear', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                        <p className="text-[10px] text-slate-600">Días feriados nacionales pagados</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Bono Vacacional (días)</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.vacationBonusDays || 7}
                                            onChange={(e) => handleLegalChange('vacationBonusDays', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                        <p className="text-[10px] text-slate-600">LOTTT Art. 192 (7 días + 1 día/año)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Bono Fin de Año (días)</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.yearEndBonusDays || 15}
                                            onChange={(e) => handleLegalChange('yearEndBonusDays', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                        <p className="text-[10px] text-slate-600">Mínimo 15 días según LOTTT</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-slate-500 uppercase">Antigüedad (días/año)</label>
                                        <input
                                            type="number"
                                            value={formData.legalConfig.severanceDaysPerYear || 5}
                                            onChange={(e) => handleLegalChange('severanceDaysPerYear', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-200 text-sm transition-all shadow-inner font-mono"
                                        />
                                        <p className="text-[10px] text-slate-600">LOTTT Art. 142 (5 días/año)</p>
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2 pt-4">Leyes Laborales</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalConfig.applyLOPCYMAT}
                                            onChange={(e) => handleLegalChange('applyLOPCYMAT', e.target.checked)}
                                            className="w-5 h-5 text-indigo-400 rounded focus:ring-indigo-500 bg-slate-900 border-white/10"
                                        />
                                        <span className="text-slate-300 text-sm">Aplicar LOPCYMAT</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalConfig.applyINCES}
                                            onChange={(e) => handleLegalChange('applyINCES', e.target.checked)}
                                            className="w-5 h-5 text-indigo-400 rounded focus:ring-indigo-500 bg-slate-900 border-white/10"
                                        />
                                        <span className="text-slate-300 text-sm">Aplicar INCES</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalConfig.applySSO}
                                            onChange={(e) => handleLegalChange('applySSO', e.target.checked)}
                                            className="w-5 h-5 text-indigo-400 rounded focus:ring-indigo-500 bg-slate-900 border-white/10"
                                        />
                                        <span className="text-slate-300 text-sm">Aplicar Seguro Social Obligatorio (SSO)</span>
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
