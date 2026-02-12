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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Cargando proyecto...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Proyecto no encontrado</h2>
                    <p className="text-slate-600 mb-6">El proyecto que buscas no existe o fue eliminado.</p>
                    <Link
                        href="/projects"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Volver a Proyectos
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

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'archived': return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusLabel = (status: Project['status']) => {
        switch (status) {
            case 'active': return '⏳ En Ejecución';
            case 'planning': return '📋 Planificación';
            case 'paused': return '⏸️ Pausado';
            case 'completed': return '✅ Completado';
            case 'archived': return '📦 Archivado';
        }
    };

    const daysElapsed = Math.floor((new Date().getTime() - new Date(project.dates.start).getTime()) / (1000 * 60 * 60 * 24));
    const daysTotal = Math.floor((new Date(project.dates.estimatedEnd).getTime() - new Date(project.dates.start).getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = daysTotal - daysElapsed;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/projects" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                        <ArrowLeft size={18} />
                        <span>Volver a Proyectos</span>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">2 en 1 APU</h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Project Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 size={32} className="text-indigo-600" />
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">{project.name}</h2>
                                    <p className="text-sm text-slate-500">Código: {project.code}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                                    {getStatusLabel(project.status)}
                                </span>
                                <span className="text-sm text-slate-600">
                                    <Calendar size={14} className="inline mr-1" />
                                    Inicio: {new Date(project.dates.start).toLocaleDateString('es-VE')}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push(`/projects/${projectId}/config`)}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            <Edit size={16} />
                            Editar
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-200">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Cliente</p>
                            <p className="font-semibold text-slate-800">{project.client.name}</p>
                            <p className="text-xs text-slate-500">{project.client.rif}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Contrato</p>
                            <p className="font-semibold text-slate-800">{project.contract.number}</p>
                            <p className="text-xs text-slate-500">
                                {new Date(project.contract.date).toLocaleDateString('es-VE')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Ubicación</p>
                            <p className="font-semibold text-slate-800">{project.location.city}</p>
                            <p className="text-xs text-slate-500">{project.location.state}</p>
                        </div>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Monto Contratado */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <DollarSign className="text-indigo-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Monto Contratado</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {formatCurrency(project.contract.amount, project.contract.currency)}
                        </p>
                        {project.contract.currency === 'USD' && project.contract.exchangeRate && (
                            <p className="text-xs text-slate-500 mt-1">
                                Tasa: Bs. {project.contract.exchangeRate.toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Total Ejecutado */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <CheckCircle2 className="text-emerald-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Total Ejecutado</p>
                        <p className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(totalExecuted, project.contract.currency)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {progress.toFixed(1)}% del total
                        </p>
                    </div>

                    {/* Pendiente */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-3 bg-amber-100 rounded-lg">
                                <Clock className="text-amber-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Pendiente</p>
                        <p className="text-2xl font-bold text-amber-600">
                            {formatCurrency(pendingAmount, project.contract.currency)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {(100 - progress).toFixed(1)}% restante
                        </p>
                    </div>

                    {/* Días */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Calendar className="text-blue-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Tiempo</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {daysRemaining > 0 ? daysRemaining : 0}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            días restantes de {daysTotal}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-slate-800">Progreso del Proyecto</h3>
                        <span className="text-2xl font-bold text-indigo-600">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                            {progress > 10 && (
                                <span className="text-xs font-semibold text-white">
                                    {progress.toFixed(1)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>Inicio: {new Date(project.dates.start).toLocaleDateString('es-VE')}</span>
                        <span>Fin estimado: {new Date(project.dates.estimatedEnd).toLocaleDateString('es-VE')}</span>
                    </div>
                </div>

                {/* Flow Progress & Next Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Flow Progress */}
                    <FlowProgress steps={flowStatus} />

                    {/* Next Steps Widget */}
                    <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-200 p-6">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                            💡 Próximos Pasos Sugeridos
                        </h3>
                        {partidas.length === 0 ? (
                            <div className="space-y-3">
                                <p className="text-indigo-800 text-sm">
                                    Para comenzar con tu proyecto, necesitas crear partidas en el presupuesto.
                                </p>
                                <Link
                                    href={`/projects/${projectId}/budget`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus size={18} />
                                    Crear Primera Partida
                                </Link>
                            </div>
                        ) : valuations.length === 0 ? (
                            <div className="space-y-3">
                                <p className="text-indigo-800 text-sm">
                                    ✅ Tienes {partidas.length} partida{partidas.length !== 1 ? 's' : ''} en tu presupuesto.
                                    El siguiente paso es crear valuaciones para registrar avances de obra.
                                </p>
                                <Link
                                    href={`/projects/${projectId}/valuations`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus size={18} />
                                    Crear Primera Valuación
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-indigo-800 text-sm">
                                    ✅ Tu proyecto está completamente configurado con {partidas.length} partida{partidas.length !== 1 ? 's' : ''} y {valuations.length} valuación{valuations.length !== 1 ? 'es' : ''}.
                                </p>
                                <div className="flex gap-3">
                                    <Link
                                        href={`/projects/${projectId}/valuations`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                    >
                                        <ClipboardList size={18} />
                                        Ver Valuaciones
                                    </Link>
                                    <Link
                                        href={`/projects/${projectId}/budget`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                                    >
                                        <Calculator size={18} />
                                        Ver Presupuesto
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        href={`/projects/${projectId}/budget`}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                <Calculator className="text-indigo-600 group-hover:text-white transition-colors" size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    Presupuesto y APU
                                </h3>
                                <p className="text-sm text-slate-500">{partidas.length} partidas</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">
                            Gestiona las partidas y análisis de precios unitarios del proyecto
                        </p>
                        <div className="mt-4 text-indigo-600 font-semibold flex items-center gap-2">
                            Ir al Presupuesto
                            <span>→</span>
                        </div>
                    </Link>

                    <Link
                        href={`/projects/${projectId}/valuations`}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-600 transition-colors">
                                <ClipboardList className="text-emerald-600 group-hover:text-white transition-colors" size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                    Valuaciones
                                </h3>
                                <p className="text-sm text-slate-500">0 valuaciones</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">
                            Registra avances de obra y genera valuaciones con retenciones
                        </p>
                        <div className="mt-4 text-emerald-600 font-semibold flex items-center gap-2">
                            Ir a Valuaciones
                            <span>→</span>
                        </div>
                    </Link>

                    <Link
                        href={`/projects/${projectId}/config`}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-slate-600 transition-colors">
                                <Settings className="text-slate-600 group-hover:text-white transition-colors" size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-600 transition-colors">
                                    Configuración
                                </h3>
                                <p className="text-sm text-slate-500">Legal y parámetros</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">
                            Ajusta configuración legal, tasas e indirectos del proyecto
                        </p>
                        <div className="mt-4 text-slate-600 font-semibold flex items-center gap-2">
                            Ver Configuración
                            <span>→</span>
                        </div>
                    </Link>
                </div>

                {/* Recent Partidas */}
                {partidas.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Partidas Recientes</h3>
                            <Link
                                href={`/projects/${projectId}/budget`}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Ver todas →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {partidas.slice(0, 5).map((partida) => (
                                <div key={partida.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800">{partida.code}</p>
                                        <p className="text-sm text-slate-600 truncate">{partida.description}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="font-semibold text-slate-800">
                                            {formatCurrency((partida.quantity || 0) * (partida.unitPrice || 0), project.contract.currency)}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {partida.quantity} {partida.unit}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Quick Actions FAB */}
            <QuickActions projectId={projectId} currentPage="dashboard" />
        </div>
    );
}
