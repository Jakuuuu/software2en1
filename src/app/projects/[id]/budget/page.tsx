"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, ChevronDown, ChevronRight, FileDown, Calculator } from 'lucide-react';
import { Partida, Resource, PartidaFormData, Project } from '@/types';
import { generatePartidaPDF, generateBudgetPDF } from '@/utils/pdfGenerator';
import { Breadcrumb } from '@/components/Breadcrumb';
import PartidaFormModal from '@/components/PartidaFormModal';
import { useProjects, usePartidas } from '@/hooks/useData';
import { formatCurrency } from '@/utils/currency';

export default function ProjectBudgetPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const { getProject, loading: projectsLoading } = useProjects();
    const { partidas, addPartida, updatePartida, deletePartida } = usePartidas(projectId);

    const [project, setProject] = useState<Project | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showPartidaModal, setShowPartidaModal] = useState(false);
    const [editingPartida, setEditingPartida] = useState<Partida | null>(null);

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

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const calculateTotal = (resources: Resource[]) => resources.reduce((acc, curr) => acc + curr.total, 0);

    const handleNewPartida = () => {
        setEditingPartida(null);
        setShowPartidaModal(true);
    };

    const handleEditPartida = (partida: Partida) => {
        setEditingPartida(partida);
        setShowPartidaModal(true);
    };

    const handleDeletePartida = (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta partida?')) {
            deletePartida(id);
        }
    };

    const handleSavePartida = (data: PartidaFormData) => {
        // Optimistic UI: Close modal immediately
        setShowPartidaModal(false);
        setEditingPartida(null);

        // Process data in next tick to prevent UI blocking during animation
        setTimeout(() => {
            const newPartida: Partial<Partida> = {
                code: data.code,
                description: data.description,
                unit: data.unit,
                quantity: data.quantity,
                unitPrice: 0, // Would be calculated from APU
                contracted: 0,
                previousAccumulated: 0,
                thisValuation: 0
            };

            if (editingPartida) {
                updatePartida(editingPartida.id, newPartida);
            } else {
                addPartida(newPartida as Omit<Partida, 'id' | 'createdAt' | 'updatedAt'>);
            }
        }, 0);
    };

    const totalBudget = partidas.reduce((sum, p) => sum + (p.contracted || 0), 0);

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

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                <Breadcrumb items={[
                    { label: 'Proyectos', href: '/projects' },
                    { label: project.name, href: `/projects/${projectId}` },
                    { label: 'Presupuesto y APU' }
                ]} />

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Calculator className="text-indigo-600" size={32} />
                            Presupuesto y APU
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {partidas.length} partidas | Moneda: {project.contract.currency}
                            {project.contract.currency === 'USD' && project.contract.exchangeRate && (
                                <span className="ml-2">| Tasa: Bs. {project.contract.exchangeRate.toFixed(2)}</span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => project && generateBudgetPDF(project, partidas)}
                            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <FileDown size={18} />
                            Descargar Presupuesto
                        </button>
                        <button
                            onClick={handleNewPartida}
                            className="px-5 py-2.5 bg-indigo-600 rounded-lg font-medium text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Nueva Partida
                        </button>
                    </div>
                </div>

                {/* Partidas List */}
                {partidas.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <Calculator size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay partidas aún</h3>
                        <p className="text-slate-500 mb-6">Comienza agregando la primera partida con su APU</p>
                        <button
                            onClick={handleNewPartida}
                            className="px-5 py-2.5 bg-indigo-600 rounded-lg font-medium text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Crear Primera Partida
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {partidas.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
                                                    {item.code}
                                                </span>
                                                <h3 className="text-lg font-bold text-slate-800">{item.description}</h3>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm text-slate-600">
                                                <span>Unidad: <strong>{item.unit}</strong></span>
                                                <span>Cantidad: <strong>{item.quantity.toLocaleString()}</strong></span>
                                                <span>P. Unitario: <strong>{formatCurrency(item.unitPrice || 0, project.contract.currency)}</strong></span>
                                                <span className="text-indigo-600 font-bold">
                                                    Total: {formatCurrency((item.quantity || 0) * (item.unitPrice || 0), project.contract.currency)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditPartida(item)}
                                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePartida(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            {item.apu && (
                                                <>
                                                    <button
                                                        onClick={() => project && generatePartidaPDF(item, project)}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Descargar PDF"
                                                    >
                                                        <FileDown size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleExpand(item.id)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title={expandedId === item.id ? "Ocultar APU" : "Ver APU"}
                                                    >
                                                        {expandedId === item.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* APU Details */}
                                    {expandedId === item.id && item.apu && (
                                        <div className="mt-6 space-y-6 border-t border-slate-200 pt-6">
                                            {/* Materials, Equipment, Labor tables - Same as before */}
                                            <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
                                                <h4 className="font-bold text-indigo-900 mb-3">RESUMEN DE COSTOS</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>Costo Directo:</span>
                                                        <span className="font-semibold">{formatCurrency(item.apu.directCost || 0, project.contract.currency)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Costos Indirectos:</span>
                                                        <span className="font-semibold">{formatCurrency(item.apu.indirectCosts?.total || 0, project.contract.currency)}</span>
                                                    </div>
                                                    <div className="border-t-2 border-indigo-300 pt-2 mt-2 flex justify-between font-bold text-lg">
                                                        <span>PRECIO UNITARIO:</span>
                                                        <span className="text-indigo-600">{formatCurrency(item.apu.unitPrice || 0, project.contract.currency)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Resumen del Presupuesto</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Total Partidas</p>
                            <p className="text-2xl font-bold text-slate-900">{partidas.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Monto Total Presupuestado</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {formatCurrency(totalBudget, project.contract.currency)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Próximo Paso</p>
                            <Link
                                href={`/projects/${projectId}/valuations`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                            >
                                Ir a Valuaciones →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Partida Form Modal */}
            {showPartidaModal && (
                <PartidaFormModal
                    projectId={projectId}
                    onClose={() => {
                        setShowPartidaModal(false);
                        setEditingPartida(null);
                    }}
                    onSave={handleSavePartida}
                    initialData={editingPartida ? {
                        code: editingPartida.code,
                        description: editingPartida.description,
                        unit: editingPartida.unit,
                        quantity: editingPartida.quantity,
                        materials: editingPartida.apu?.materials.map(m => ({
                            description: m.description,
                            unit: m.unit,
                            quantity: m.quantity,
                            unitPrice: m.unitPrice
                        })) || [],
                        equipment: editingPartida.apu?.equipment.map(e => ({
                            description: e.description,
                            unit: e.unit,
                            quantity: e.quantity,
                            unitPrice: e.unitPrice
                        })) || [],
                        labor: editingPartida.apu?.labor.map(l => ({
                            description: l.description,
                            unit: l.unit,
                            quantity: l.quantity,
                            unitPrice: l.unitPrice
                        })) || []
                    } : undefined}
                />
            )}
        </div>
    );
}
