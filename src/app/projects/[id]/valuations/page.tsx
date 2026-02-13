"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, FileText, Download, Eye, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { Project, Valuation } from '@/types';
import { useProjects, usePartidas, useValuations } from '@/hooks/useData';
import { formatCurrency } from '@/utils/currency';
import { Breadcrumb } from '@/components/Breadcrumb';
import ValuationFormModal from '@/components/ValuationFormModal';
import { generateValuationPDF } from '@/utils/pdfGenerator';
import { generateValuationExcel } from '@/utils/excelGenerator';
import { EmptyState } from '@/components/EmptyState';
import { QuickActions } from '@/components/QuickActions';
import { useToast } from '@/components/Toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ProjectValuationsPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const { getProject, loading: projectsLoading } = useProjects();
    const { partidas, updatePartida } = usePartidas(projectId);
    const { valuations, addValuation } = useValuations(projectId);

    const [project, setProject] = useState<Project | null>(null);
    const [showValuationModal, setShowValuationModal] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        if (!projectsLoading) {
            const proj = getProject(projectId);
            if (proj) {
                setProject(proj);
            } else {
                router.push('/projects');
            }
        }
    }, [projectId, getProject, router, projectsLoading]);

    if (!project) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-mono text-sm">LOADING_VALUATIONS...</p>
                </div>
            </div>
        );
    }

    const totalExecuted = partidas.reduce((sum, p) => sum + (p.previousAccumulated || 0) + (p.thisValuation || 0), 0);
    const totalBudget = partidas.reduce((sum, p) => sum + (p.contracted || 0), 0);
    const progress = totalBudget > 0 ? (totalExecuted / totalBudget) * 100 : 0;

    const handleSaveValuation = (valuation: Omit<Valuation, 'id' | 'createdAt' | 'updatedAt'>) => {
        // Save valuation
        addValuation(valuation);

        // Update partidas with new accumulated values
        valuation.items.forEach(item => {
            const partida = partidas.find(p => p.id === item.partidaId);
            if (partida) {
                updatePartida(item.partidaId, {
                    previousAccumulated: (partida.previousAccumulated || 0) + (partida.thisValuation || 0),
                    thisValuation: 0 // Reset for next valuation
                });
            }
        });

        setShowValuationModal(false);
        showToast('success', 'Valuación creada correctamente');
    };

    const handleDownloadPDF = (valuation: Valuation) => {
        if (!project) return;

        // Get partidas for this valuation
        const valuationPartidas = valuation.items
            .map(item => partidas.find(p => p.id === item.partidaId))
            .filter(Boolean) as typeof partidas;

        generateValuationPDF(valuation, project, valuationPartidas);
    };

    const handleDownloadExcel = async (valuation: Valuation) => {
        if (!project) return;

        const valuationPartidas = valuation.items
            .map(item => partidas.find(p => p.id === item.partidaId))
            .filter(Boolean) as typeof partidas;

        await generateValuationExcel(valuation, project, valuationPartidas);
        showToast('success', 'Excel con fórmulas generado (Auditoría PDVSA)');
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 relative">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-tech-pattern opacity-30 pointer-events-none"></div>

            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/projects/${projectId}`}>
                            <Button variant="ghost" size="icon" className="text-slate-500">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-0.5">
                                <span>PROJECT: {project.code}</span>
                                <span>/</span>
                                <span>VALUATIONS</span>
                            </div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{project.name}</h1>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 relative z-10">
                {/* Header with Progress */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                            <TrendingUp className="text-emerald-600" size={24} />
                            Valuaciones
                        </h2>
                        <p className="text-slate-500 text-sm max-w-2xl">
                            Control de avance de obra y generación de valuaciones para pago.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowValuationModal(true)}
                        disabled={partidas.length === 0}
                        leftIcon={<Plus size={18} />}
                        className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                    >
                        Nueva Valuación
                    </Button>
                </div>

                {/* Progress Summary Card */}
                <Card className="bg-white/80 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Monto Contratado</p>
                            <p className="text-xl font-bold text-slate-800 font-mono">
                                {formatCurrency(totalBudget, project.contract.currency)}
                            </p>
                        </div>
                        <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <p className="text-xs text-emerald-700 uppercase tracking-wider mb-1">Total Ejecutado</p>
                            <p className="text-xl font-bold text-emerald-600 font-mono">
                                {formatCurrency(totalExecuted, project.contract.currency)}
                            </p>
                        </div>
                        <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100">
                            <p className="text-xs text-amber-700 uppercase tracking-wider mb-1">Pendiente</p>
                            <p className="text-xl font-bold text-amber-600 font-mono">
                                {formatCurrency(totalBudget - totalExecuted, project.contract.currency)}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Progreso Físico</p>
                                <p className="text-2xl font-bold text-slate-900 font-mono">
                                    {progress.toFixed(2)}%
                                </p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Valuations List */}
                {valuations.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No hay valuaciones aún"
                        description={partidas.length === 0
                            ? "Primero necesitas crear partidas en el presupuesto antes de generar valuaciones."
                            : "Crea tu primera valuación para registrar el avance de obra y calcular pagos."}
                        primaryAction={partidas.length > 0 ? {
                            label: "Crear Primera Valuación",
                            onClick: () => setShowValuationModal(true)
                        } : {
                            label: "Ir al Presupuesto",
                            onClick: () => router.push(`/projects/${projectId}/budget`)
                        }}
                        iconColor="text-emerald-600"
                        iconBgColor="bg-emerald-100"
                    />
                ) : (
                    <div className="space-y-4">
                        {valuations.map((valuation) => (
                            <Card key={valuation.id} className="hover:border-emerald-200 hover:shadow-md transition-all group" noPadding>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg shadow-sm">
                                                    #{valuation.number}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800">
                                                        Valuación de Obra
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar size={12} />
                                                        <span>
                                                            {new Date(valuation.periodStart).toLocaleDateString('es-VE')} - {new Date(valuation.periodEnd).toLocaleDateString('es-VE')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <StatusBadge status={valuation.status} />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 px-6 border-l border-slate-100">
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Monto Bruto</p>
                                                <p className="text-lg font-bold text-slate-700 font-mono">
                                                    {formatCurrency(valuation.grossAmount, project.contract.currency)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Monto Neto</p>
                                                <p className="text-lg font-bold text-emerald-600 font-mono">
                                                    {formatCurrency(valuation.netAmount, project.contract.currency)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => router.push(`/projects/${projectId}/valuations/${valuation.id}`)}
                                            >
                                                <Eye size={18} className="text-slate-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDownloadExcel(valuation)}
                                            >
                                                <FileText size={18} className="text-green-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDownloadPDF(valuation)}
                                            >
                                                <Download size={18} className="text-emerald-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Info Alert */}
                {partidas.length === 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="text-amber-600 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-bold text-amber-800">Atención requerida</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Necesitas crear partidas en el presupuesto antes de poder generar valuaciones.
                            </p>
                            <Link href={`/projects/${projectId}/budget`} className="text-sm font-medium text-amber-900 underline mt-2 inline-block hover:text-amber-950">
                                Ir al Presupuesto →
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            {/* Valuation Form Modal */}
            {showValuationModal && project && (
                <ValuationFormModal
                    projectId={projectId}
                    project={project}
                    partidas={partidas}
                    onClose={() => setShowValuationModal(false)}
                    onSave={handleSaveValuation}
                    existingValuations={valuations}
                />
            )}

            {/* Quick Actions FAB */}
            <QuickActions projectId={projectId} currentPage="valuations" />
        </div>
    );
}
