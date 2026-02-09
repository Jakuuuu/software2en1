"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, FileText, Download, Eye } from 'lucide-react';
import { Project, Valuation } from '@/types';
import { useProjects, usePartidas, useValuations } from '@/hooks/useData';
import { formatCurrency } from '@/utils/currency';
import { Breadcrumb } from '@/components/Breadcrumb';
import ValuationFormModal from '@/components/ValuationFormModal';
import { generateValuationPDF } from '@/utils/pdfGenerator';
import { generateValuationCSV } from '@/utils/csvGenerator';

export default function ProjectValuationsPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const { getProject, loading: projectsLoading } = useProjects();
    const { partidas, updatePartida } = usePartidas(projectId);
    const { valuations, addValuation } = useValuations(projectId);

    const [project, setProject] = useState<Project | null>(null);
    const [showValuationModal, setShowValuationModal] = useState(false);

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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Cargando proyecto...</p>
                </div>
            </div>
        );
    }

    const totalExecuted = partidas.reduce((sum, p) => sum + (p.previousAccumulated || 0) + (p.thisValuation || 0), 0);
    const totalBudget = partidas.reduce((sum, p) => sum + (p.contracted || 0), 0);
    const progress = totalBudget > 0 ? (totalExecuted / totalBudget) * 100 : 0;

    const getStatusBadge = (status: Valuation['status']) => {
        switch (status) {
            case 'draft':
                return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">📝 Borrador</span>;
            case 'submitted':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">📤 Enviada</span>;
            case 'approved':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✅ Aprobada</span>;
            case 'paid':
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">💰 Pagada</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">❌ Rechazada</span>;
        }
    };

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
    };

    const handleDownloadPDF = (valuation: Valuation) => {
        if (!project) return;

        // Get partidas for this valuation
        const valuationPartidas = valuation.items
            .map(item => partidas.find(p => p.id === item.partidaId))
            .filter(Boolean) as typeof partidas;

        generateValuationPDF(valuation, project, valuationPartidas);
    };

    const handleDownloadCSV = (valuation: Valuation) => {
        if (!project) return;

        const valuationPartidas = valuation.items
            .map(item => partidas.find(p => p.id === item.partidaId))
            .filter(Boolean) as typeof partidas;

        generateValuationCSV(valuation, project, valuationPartidas);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-emerald-200 shadow-lg hover:bg-emerald-700 transition-colors">
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

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                <Breadcrumb items={[
                    { label: 'Proyectos', href: '/projects' },
                    { label: project.name, href: `/projects/${projectId}` },
                    { label: 'Valuaciones' }
                ]} />

                {/* Header with Progress */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <FileText className="text-emerald-600" size={32} />
                                Valuaciones
                            </h2>
                            <p className="text-slate-500 mt-2">
                                {valuations.length} valuaciones | Moneda: {project.contract.currency}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowValuationModal(true)}
                            disabled={partidas.length === 0}
                            className="px-5 py-2.5 bg-emerald-600 rounded-lg font-medium text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={18} />
                            Nueva Valuación
                        </button>
                    </div>

                    {/* Progress Summary */}
                    <div className="grid grid-cols-4 gap-6 mb-6">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-1">Monto Contratado</p>
                            <p className="text-xl font-bold text-slate-800">
                                {formatCurrency(totalBudget, project.contract.currency)}
                            </p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-4">
                            <p className="text-xs text-emerald-700 mb-1">Total Ejecutado</p>
                            <p className="text-xl font-bold text-emerald-600">
                                {formatCurrency(totalExecuted, project.contract.currency)}
                            </p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-4">
                            <p className="text-xs text-amber-700 mb-1">Pendiente</p>
                            <p className="text-xl font-bold text-amber-600">
                                {formatCurrency(totalBudget - totalExecuted, project.contract.currency)}
                            </p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <p className="text-xs text-indigo-700 mb-1">Progreso</p>
                            <p className="text-xl font-bold text-indigo-600">
                                {progress.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Valuations List */}
                {valuations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <FileText size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay valuaciones aún</h3>
                        <p className="text-slate-500 mb-6">
                            Crea tu primera valuación para registrar el avance de obra
                        </p>
                        <button
                            onClick={() => setShowValuationModal(true)}
                            disabled={partidas.length === 0}
                            className="px-5 py-2.5 bg-emerald-600 rounded-lg font-medium text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={18} />
                            Crear Primera Valuación
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {valuations.map((valuation) => (
                            <div key={valuation.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-slate-800">
                                                Valuación #{valuation.number}
                                            </h3>
                                            {getStatusBadge(valuation.status)}
                                        </div>
                                        <div className="grid grid-cols-3 gap-6 mt-4">
                                            <div>
                                                <p className="text-xs text-slate-500">Período</p>
                                                <p className="text-sm font-medium text-slate-700">
                                                    {new Date(valuation.periodStart).toLocaleDateString('es-VE')} - {new Date(valuation.periodEnd).toLocaleDateString('es-VE')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Monto Bruto</p>
                                                <p className="text-sm font-bold text-emerald-600">
                                                    {formatCurrency(valuation.grossAmount, project.contract.currency)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Monto Neto</p>
                                                <p className="text-sm font-bold text-indigo-600">
                                                    {formatCurrency(valuation.netAmount, project.contract.currency)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => router.push(`/projects/${projectId}/valuations/${valuation.id}`)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Ver detalles"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadCSV(valuation)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Descargar Excel (CSV)"
                                        >
                                            <FileText size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(valuation)}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            title="Descargar PDF"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Banner */}
                {partidas.length === 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            ⚠️ <strong>Atención:</strong> Necesitas crear partidas en el presupuesto antes de poder generar valuaciones.
                            <Link href={`/projects/${projectId}/budget`} className="ml-2 underline font-medium">
                                Ir al Presupuesto →
                            </Link>
                        </p>
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
        </div>
    );
}
