"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, FileText, Download, Eye, TrendingUp, AlertCircle, Calendar, CheckCircle2, Wallet, DollarSign } from 'lucide-react';
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto shadow-[0_0_15px_#10b981]"></div>
                    <p className="mt-4 text-emerald-400 font-mono text-sm animate-pulse">LOADING_VALUATIONS...</p>
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
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-white pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"></div>
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none animate-pulse-slow"></div>

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
                            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 mb-0.5 uppercase tracking-widest">
                                <span>PROJECT: {project.code}</span>
                                <span>/</span>
                                <span>VALUATIONS_MODULE</span>
                            </div>
                            <h1 className="text-lg font-bold text-white tracking-tight">{project.name}</h1>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
                {/* Header with Progress */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-2 tracking-tight">
                            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <TrendingUp className="text-emerald-400" size={24} />
                            </div>
                            Valuaciones
                        </h2>
                        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                            Control de avance de obra financiero y físico, generación de valuaciones y reportes de pago.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowValuationModal(true)}
                        disabled={partidas.length === 0}
                        leftIcon={<Plus size={18} />}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-none"
                    >
                        Nueva Valuación
                    </Button>
                </div>

                {/* Progress Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md hover:bg-slate-900/60 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest group-hover:text-slate-400">Total Contratado</p>
                            <div className="p-1.5 rounded bg-slate-800 text-slate-400">
                                <DollarSign size={14} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-slate-200 font-mono tracking-tight group-hover:text-white transition-colors">
                            {formatCurrency(totalBudget, project.contract.currency)}
                        </p>
                    </Card>

                    <Card className="bg-emerald-950/20 border-emerald-500/20 backdrop-blur-md hover:bg-emerald-950/30 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <p className="text-[10px] text-emerald-500/70 uppercase tracking-widest group-hover:text-emerald-400">Ejecutado</p>
                            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 size={14} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-emerald-400 font-mono tracking-tight text-shadow-glow relative z-10">
                            {formatCurrency(totalExecuted, project.contract.currency)}
                        </p>
                    </Card>

                    <Card className="bg-amber-950/20 border-amber-500/20 backdrop-blur-md hover:bg-amber-950/30 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <p className="text-[10px] text-amber-500/70 uppercase tracking-widest group-hover:text-amber-400">Por Ejecutar</p>
                            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                <Wallet size={14} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-amber-400 font-mono tracking-tight relative z-10">
                            {formatCurrency(totalBudget - totalExecuted, project.contract.currency)}
                        </p>
                    </Card>

                    <Card className="bg-slate-900/60 border-white/5 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <TrendingUp size={80} className="text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Avance Físico</p>
                                <span className="text-lg font-bold text-white font-mono">{progress.toFixed(2)}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-1.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#10b981]"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

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
                        iconColor="text-emerald-400"
                        iconBgColor="bg-emerald-500/10"
                    />
                ) : (
                    <div className="space-y-4">
                        {valuations.map((valuation) => (
                            <Card key={valuation.id} className="bg-slate-900/40 border-white/5 hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all group backdrop-blur-md" noPadding>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] font-mono">
                                                    #{valuation.number}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                        Valuación de Obra
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                                                        <Calendar size={12} className="text-emerald-500/50" />
                                                        <span>
                                                            {new Date(valuation.periodStart).toLocaleDateString('es-VE')} - {new Date(valuation.periodEnd).toLocaleDateString('es-VE')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-2">
                                                    <StatusBadge status={valuation.status} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 px-8 border-l border-white/5">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Monto Bruto</p>
                                                <p className="text-lg font-bold text-slate-400 font-mono">
                                                    {formatCurrency(valuation.grossAmount, project.contract.currency)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Monto Neto</p>
                                                <p className="text-lg font-bold text-emerald-400 font-mono text-shadow-glow">
                                                    {formatCurrency(valuation.netAmount, project.contract.currency)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pl-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => router.push(`/projects/${projectId}/valuations/${valuation.id}`)}
                                                className="text-slate-400 hover:text-white hover:bg-white/10"
                                            >
                                                <Eye size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDownloadExcel(valuation)}
                                                className="text-slate-400 hover:text-green-400 hover:bg-green-500/10"
                                            >
                                                <FileText size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDownloadPDF(valuation)}
                                                className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                                            >
                                                <Download size={18} />
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
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4">
                        <AlertCircle className="text-amber-500 mt-0.5 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" size={20} />
                        <div>
                            <p className="text-sm font-bold text-amber-400">Atención requerida</p>
                            <p className="text-sm text-amber-200/80 mt-1">
                                Necesitas crear partidas en el presupuesto antes de poder generar valuaciones.
                            </p>
                            <Link href={`/projects/${projectId}/budget`} className="text-sm font-medium text-amber-400 underline mt-2 inline-block hover:text-white transition-colors">
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
