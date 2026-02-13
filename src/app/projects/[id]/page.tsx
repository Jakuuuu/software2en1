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
            <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-mono text-sm">LOADING_PROJECT...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Proyecto no encontrado</h2>
                    <p className="text-slate-600 mb-6">El proyecto que buscas no existe o fue eliminado.</p>
                    <Link href="/projects">
                        <Button leftIcon={<ArrowLeft size={18} />}>
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
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 relative">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-tech-pattern opacity-30 pointer-events-none"></div>

            {/* Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/projects">
                            <Button variant="ghost" size="icon" className="text-slate-500">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-0.5">
                                <span>PROJECTS</span>
                                <span>/</span>
                                <span>{project.code}</span>
                            </div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{project.name}</h1>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 space-y-6">
                {/* Project Header */}
                <Card className="bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <Building2 size={24} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
                                    <p className="text-sm font-mono text-slate-500">{project.code}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                <StatusBadge status={project.status} />
                                <span className="text-xs font-mono text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                    <Calendar size={12} />
                                    START: {new Date(project.dates.start).toLocaleDateString('es-VE')}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/projects/${projectId}/config`)}
                            leftIcon={<Edit size={16} />}
                        >
                            Editar Proyecto
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-sm">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Cliente</p>
                            <p className="font-semibold text-slate-800">{project.client.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{project.client.rif}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Contrato</p>
                            <p className="font-semibold text-slate-800">{project.contract.number}</p>
                            <p className="text-xs text-slate-500 font-mono">
                                {new Date(project.contract.date).toLocaleDateString('es-VE')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Ubicación</p>
                            <p className="font-semibold text-slate-800">{project.location.city}</p>
                            <p className="text-xs text-slate-500">{project.location.state}</p>
                        </div>
                    </div>
                </Card>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Monto Contratado */}
                    <Card className="hover:border-indigo-200 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Contratado</p>
                            <DollarSign className="text-indigo-600" size={16} />
                        </div>
                        <p className="text-xl font-bold text-slate-800 font-mono">
                            {formatCurrency(project.contract.amount, project.contract.currency)}
                        </p>
                        {project.contract.currency === 'USD' && project.contract.exchangeRate && (
                            <p className="text-xs text-slate-400 mt-1 font-mono">
                                TASA: {project.contract.exchangeRate.toFixed(2)}
                            </p>
                        )}
                    </Card>

                    {/* Total Ejecutado */}
                    <Card className="hover:border-emerald-200 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-emerald-600 uppercase tracking-wider">Ejecutado</p>
                            <CheckCircle2 className="text-emerald-600" size={16} />
                        </div>
                        <p className="text-xl font-bold text-emerald-600 font-mono">
                            {formatCurrency(totalExecuted, project.contract.currency)}
                        </p>
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                            <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                    </Card>

                    {/* Pendiente */}
                    <Card className="hover:border-amber-200 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-amber-600 uppercase tracking-wider">Pendiente</p>
                            <Clock className="text-amber-600" size={16} />
                        </div>
                        <p className="text-xl font-bold text-amber-600 font-mono">
                            {formatCurrency(pendingAmount, project.contract.currency)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            {(100 - progress).toFixed(1)}% restante
                        </p>
                    </Card>

                    {/* Días */}
                    <Card className="hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-blue-600 uppercase tracking-wider">Tiempo</p>
                            <Calendar className="text-blue-600" size={16} />
                        </div>
                        <p className="text-xl font-bold text-blue-600 font-mono">
                            {daysRemaining > 0 ? daysRemaining : 0} <span className="text-sm font-normal text-slate-500">días</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            de {daysTotal} totales
                        </p>
                    </Card>
                </div>

                {/* Progress Bar Detail */}
                <Card>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Avance Físico General</h3>
                        <span className="text-2xl font-bold text-indigo-600 font-mono">{progress.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-2">
                        <div
                            className="bg-primary-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>START: {new Date(project.dates.start).toLocaleDateString('es-VE')}</span>
                        <span>EST. END: {new Date(project.dates.estimatedEnd).toLocaleDateString('es-VE')}</span>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions / Modules */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Módulos del Proyecto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push(`/projects/${projectId}/budget`)}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                        <Calculator className="text-indigo-600 group-hover:text-white transition-colors" size={24} />
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-indigo-600">Abrir →</Button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-700">Presupuesto y APU</h3>
                                <p className="text-sm text-slate-500 mb-4">Gestiona partidas, análisis de precios y costos directos.</p>
                                <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block">
                                    {partidas.length} PARTIDAS
                                </div>
                            </Card>

                            <Card className="hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push(`/projects/${projectId}/valuations`)}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-600 transition-colors">
                                        <ClipboardList className="text-emerald-600 group-hover:text-white transition-colors" size={24} />
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-emerald-600">Abrir →</Button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-700">Valuaciones</h3>
                                <p className="text-sm text-slate-500 mb-4">Control de avances, generación de valuaciones y pagos.</p>
                                <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block">
                                    {valuations.length} VALUACIONES
                                </div>
                            </Card>
                        </div>

                        {/* Recent Partidas */}
                        {partidas.length > 0 && (
                            <Card className="mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Actividad Reciente</h3>
                                    <Link href={`/projects/${projectId}/budget`}>
                                        <Button variant="ghost" size="sm" className="text-indigo-600">Ver todas</Button>
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {partidas.slice(0, 3).map((partida) => (
                                        <div key={partida.id} className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100 rounded-lg hover:border-indigo-100 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">{partida.code}</span>
                                                    <p className="font-medium text-slate-700 text-sm truncate max-w-[200px]">{partida.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-bold text-slate-700 font-mono text-sm">
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

                        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
                            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Configuración</h3>
                            <p className="text-xs text-indigo-700 mb-4">Ajusta parámetros legales, IVA, y datos del contrato.</p>
                            <Button
                                variant="outline"
                                className="w-full bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50"
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
