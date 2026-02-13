"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Building2,
    DollarSign,
    TrendingUp,
    Calendar,
    FileText,
    Calculator,
    ClipboardList,
    Settings,
    Edit,
    CheckCircle2,
    Clock,
    AlertCircle,
    Plus
} from 'lucide-react';
import { useProjects, usePartidas, useValuations } from '@/hooks/useData';
import { formatCurrency } from '@/utils/currency';
import { Project } from '@/types';
import { FlowProgress, useFlowStatus } from '@/components/FlowProgress';
import { QuickActions } from '@/components/QuickActions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ProjectDashboard() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const { getProject } = useProjects();
    const { partidas } = usePartidas(projectId);
    const { valuations } = useValuations(projectId);

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const flowStatus = useFlowStatus(partidas.length, valuations.length);

    useEffect(() => {
        const proj = getProject(projectId);
        if (proj) {
            setProject(proj);
        }
        setLoading(false);
    }, [projectId, getProject]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto shadow-[0_0_15px_#0ea5e9]"></div>
                    <p className="mt-4 text-primary-400 font-mono text-sm animate-pulse">SYSTEM_LOADING...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6 glass-panel rounded-2xl">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Proyecto no encontrado</h2>
                    <p className="text-slate-400 mb-6">El proyecto que buscas no existe o fue eliminado.</p>
                    <Link href="/projects">
                        <Button leftIcon={<ArrowLeft size={18} />} variant="cyber">
                            Volver a Proyectos
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate project metrics
    const totalBudget = partidas.reduce((sum, p) => sum + (p.contracted || 0), 0);
    const totalExecuted = partidas.reduce((sum, p) => sum + (p.previousAccumulated || 0) + (p.thisValuation || 0), 0);
    const pendingAmount = totalBudget - totalExecuted;
    const progress = totalBudget > 0 ? (totalExecuted / totalBudget) * 100 : 0;

    const daysElapsed = Math.floor((new Date().getTime() - new Date(project.dates.start).getTime()) / (1000 * 60 * 60 * 24));
    const daysTotal = Math.floor((new Date(project.dates.estimatedEnd).getTime() - new Date(project.dates.start).getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = daysTotal - daysElapsed;

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden selection:bg-primary-500/30 selection:text-white pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"></div>
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[100px] pointer-events-none animate-pulse-slow"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 space-y-8 mt-20">
                {/* Project Header */}
                <Card className="glass-panel border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                    <Building2 size={32} className="text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                        {project.name}
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                                    </h2>
                                    <p className="text-sm font-mono text-primary-400 tracking-wider mt-1 flex items-center gap-2">
                                        <span className="opacity-50">ID:</span> {project.code}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-4 ml-1">
                                <StatusBadge status={project.status} />
                                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <Calendar size={12} className="text-primary-400" />
                                    START: {new Date(project.dates.start).toLocaleDateString('es-VE')}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="cyber"
                            onClick={() => router.push(`/projects/${projectId}/config`)}
                            leftIcon={<Edit size={16} />}
                            className="group"
                        >
                            Configurar
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5 text-sm">
                        <div className="group hover:bg-white/5 p-3 rounded-xl transition-colors">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5">Cliente</p>
                            <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">{project.client.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{project.client.rif}</p>
                        </div>
                        <div className="group hover:bg-white/5 p-3 rounded-xl transition-colors">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5">Contrato</p>
                            <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">{project.contract.number}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                {new Date(project.contract.date).toLocaleDateString('es-VE')}
                            </p>
                        </div>
                        <div className="group hover:bg-white/5 p-3 rounded-xl transition-colors">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5">Ubicación</p>
                            <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">{project.location.city}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{project.location.state}</p>
                        </div>
                    </div>
                </Card>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Monto Contratado */}
                    <Card className="bg-slate-900/40 border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-900/60 group">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Contratado</p>
                            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all">
                                <DollarSign size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-slate-100 font-mono tracking-tight group-hover:text-white">
                            {formatCurrency(project.contract.amount, project.contract.currency)}
                        </p>
                        {project.contract.currency === 'USD' && project.contract.exchangeRate && (
                            <p className="text-xs text-slate-500 mt-1 font-mono">
                                TASA: {project.contract.exchangeRate.toFixed(2)}
                            </p>
                        )}
                    </Card>

                    {/* Total Ejecutado */}
                    <Card className="bg-slate-900/40 border-white/5 hover:border-emerald-500/30 transition-all hover:bg-slate-900/60 group">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Ejecutado</p>
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-emerald-400 font-mono tracking-tight drop-shadow-sm">
                            {formatCurrency(totalExecuted, project.contract.currency)}
                        </p>
                        <div className="w-full bg-slate-800 rounded-full h-1 mt-3">
                            <div className="bg-emerald-500 h-1 rounded-full shadow-[0_0_5px_#10b981]" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                    </Card>

                    {/* Pendiente */}
                    <Card className="bg-slate-900/40 border-white/5 hover:border-amber-500/30 transition-all hover:bg-slate-900/60 group">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-slate-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">Pendiente</p>
                            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all">
                                <Clock size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-amber-400 font-mono tracking-tight">
                            {formatCurrency(pendingAmount, project.contract.currency)}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 font-mono">
                            {(100 - progress).toFixed(1)}% restante
                        </p>
                    </Card>

                    {/* Días */}
                    <Card className="bg-slate-900/40 border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-900/60 group">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Tiempo</p>
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all">
                                <Calendar size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-blue-400 font-mono tracking-tight">
                            {daysRemaining > 0 ? daysRemaining : 0} <span className="text-sm font-normal text-slate-500">días</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            de {daysTotal} totales
                        </p>
                    </Card>
                </div>

                {/* Progress Bar Detail */}
                <Card className="bg-slate-900/60 border-white/5 backdrop-blur-xl relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <TrendingUp size={120} className="text-white" />
                    </div>

                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Avance Físico General</h3>
                        <span className="text-3xl font-bold text-primary-400 font-mono text-shadow-glow">{progress.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-800/50 rounded-full h-6 overflow-hidden mb-3 border border-white/5 relative z-10">
                        <div
                            className="bg-gradient-to-r from-primary-600 to-cyan-500 h-6 rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-slate-500 relative z-10">
                        <span>START: {new Date(project.dates.start).toLocaleDateString('es-VE')}</span>
                        <span>EST. END: {new Date(project.dates.estimatedEnd).toLocaleDateString('es-VE')}</span>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions / Modules */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Módulos del Sistema</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-slate-900/40 border-white/5 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group relative overflow-hidden" onClick={() => router.push(`/projects/${projectId}/budget`)}>
                                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <Calculator className="text-indigo-400 group-hover:text-indigo-300 transition-colors" size={28} />
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">ACCEDER <ArrowLeft className="rotate-180 ml-1" size={14} /></Button>
                                </div>
                                <h3 className="text-xl font-bold text-slate-200 mb-2 group-hover:text-indigo-300 relative z-10">Presupuesto y APU</h3>
                                <p className="text-sm text-slate-400 mb-4 relative z-10">Gestiona partidas, análisis de precios y costos directos.</p>
                                <div className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded inline-block border border-indigo-500/20 relative z-10">
                                    {partidas.length} PARTIDAS
                                </div>
                            </Card>

                            <Card className="bg-slate-900/40 border-white/5 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group relative overflow-hidden" onClick={() => router.push(`/projects/${projectId}/valuations`)}>
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <ClipboardList className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={28} />
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">ACCEDER <ArrowLeft className="rotate-180 ml-1" size={14} /></Button>
                                </div>
                                <h3 className="text-xl font-bold text-slate-200 mb-2 group-hover:text-emerald-300 relative z-10">Valuaciones</h3>
                                <p className="text-sm text-slate-400 mb-4 relative z-10">Control de avances, generación de valuaciones y pagos.</p>
                                <div className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded inline-block border border-emerald-500/20 relative z-10">
                                    {valuations.length} VALUACIONES
                                </div>
                            </Card>
                        </div>

                        {/* Recent Partidas */}
                        {partidas.length > 0 && (
                            <Card className="bg-slate-900/40 border-white/5 mt-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Actividad Reciente</h3>
                                    <Link href={`/projects/${projectId}/budget`}>
                                        <Button variant="ghost" size="sm" className="text-primary-400 hover:text-primary-300">Ver todas</Button>
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {partidas.slice(0, 3).map((partida) => (
                                        <div key={partida.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:border-primary-500/30 hover:bg-white/10 transition-all cursor-default group">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold font-mono text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2 py-1 rounded group-hover:text-primary-300">{partida.code}</span>
                                                    <p className="font-medium text-slate-300 text-sm truncate max-w-[250px] group-hover:text-white transition-colors">{partida.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-bold text-slate-300 font-mono text-sm group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all">
                                                    {formatCurrency((partida.quantity || 0) * (partida.unitPrice || 0), project.contract.currency)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar / Flow Status */}
                    <div className="space-y-6">
                        <FlowProgress steps={flowStatus} />

                        <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-indigo-500/20 shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-indigo-500/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2 relative z-10">Configuración</h3>
                            <p className="text-xs text-indigo-200/70 mb-5 relative z-10">Ajusta parámetros legales, IVA, y datos del contrato.</p>
                            <Button
                                variant="outline"
                                className="w-full bg-slate-900/50 border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 relative z-10"
                                onClick={() => router.push(`/projects/${projectId}/config`)}
                                leftIcon={<Settings size={16} />}
                            >
                                Ir a Configuración
                            </Button>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Quick Actions FAB */}
            <QuickActions projectId={projectId} currentPage="dashboard" />
        </div>
    );
}
