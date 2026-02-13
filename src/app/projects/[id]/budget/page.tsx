"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, ChevronDown, ChevronRight, FileDown, Calculator, Search, Filter } from 'lucide-react';
import { Partida, Resource, PartidaFormData, Project } from '@/types';
import { generatePartidaPDF, generateBudgetPDF } from '@/utils/pdfGenerator';
import { Breadcrumb } from '@/components/Breadcrumb';
import { APUEditor } from '@/components/APUEditor';
import { useProjects, usePartidas, DEFAULT_LEGAL_CONFIG } from '@/hooks/useData';
import { formatCurrency } from '@/utils/currency';
import { calculateUnitPrice } from '@/utils/calculations';
import { EmptyState } from '@/components/EmptyState';
import { QuickActions } from '@/components/QuickActions';
import { useToast } from '@/components/Toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ProjectBudgetPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const { getProject, loading: projectsLoading } = useProjects();
    const { partidas, addPartida, updatePartida, deletePartida } = usePartidas(projectId);

    const [project, setProject] = useState<Project | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingPartida, setEditingPartida] = useState<Partida | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

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
                    <p className="mt-4 text-slate-600 font-mono text-sm">LOADING_BUDGET_DATA...</p>
                </div>
            </div>
        );
    }

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const calculateTotal = (resources: Resource[]) => resources.reduce((acc, curr) => acc + curr.total, 0);

    const handleNewPartida = () => {
        // Create a temporary partida for APUEditor
        const tempPartida: Partida = {
            id: 'temp-' + Math.random().toString(36).substr(2, 9),
            code: '',
            description: '',
            unit: 'm2',
            quantity: 1,
            unitPrice: 0,
            contracted: 0,
            previousAccumulated: 0,
            thisValuation: 0,
            apu: {
                materials: [],
                equipment: [],
                labor: [],
                subtotals: { materials: 0, equipment: 0, labor: 0 },
                legalCharges: { lopcymat: 0, inces: 0, sso: 0 },
                directCost: 0,
                indirectCosts: { administration: 0, utilities: 0, profit: 0, total: 0 },
                unitPrice: 0
            }
        };
        setEditingPartida(tempPartida);
    };

    const handleEditPartida = (partida: Partida) => {
        setEditingPartida(partida);
    };

    const handleSaveAPU = (updatedPartida: Partida) => {
        if (updatedPartida.id.startsWith('temp-')) {
            // New partida
            const newPartida: Partial<Partida> = {
                ...updatedPartida,
                id: undefined, // Remove temp ID so addPartida creates a real one
            };
            addPartida(newPartida as Omit<Partida, 'id' | 'createdAt' | 'updatedAt'>);
            showToast('success', 'Partida creada correctamente');
        } else {
            // Existing partida
            updatePartida(updatedPartida.id, updatedPartida);
            showToast('success', 'APU actualizado correctamente');
        }
        setEditingPartida(null);
    };

    const handleDeletePartida = (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta partida?')) {
            deletePartida(id);
            showToast('success', 'Partida eliminada correctamente');
        }
    };

    const filteredPartidas = partidas.filter(p =>
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalBudget = partidas.reduce((sum, p) => sum + (p.contracted || 0), 0);

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
                                <span>BUDGET</span>
                            </div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{project.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right mr-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Presupuestado</p>
                            <p className="text-xl font-bold text-primary-600 font-mono">
                                {formatCurrency(totalBudget, project.contract.currency)}
                            </p>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 relative z-10">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                            <Calculator className="text-primary-600" size={24} />
                            Presupuesto y APU
                        </h2>
                        <p className="text-slate-500 text-sm max-w-2xl">
                            Gestiona las partidas del presupuesto y sus Análisis de Precios Unitarios (APU).
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                if (project) generateBudgetPDF(project, partidas);
                            }}
                            leftIcon={<FileDown size={18} />}
                        >
                            Exportar PDF
                        </Button>
                        <Button
                            onClick={handleNewPartida}
                            leftIcon={<Plus size={18} />}
                        >
                            Nueva Partida
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar partida..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Partidas List */}
                {filteredPartidas.length === 0 ? (
                    <EmptyState
                        icon={Calculator}
                        title={searchTerm ? "No se encontraron partidas" : "No hay partidas aún"}
                        description={searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando la primera partida con su análisis de precios unitarios."}
                        primaryAction={!searchTerm ? {
                            label: "Crear Primera Partida",
                            onClick: handleNewPartida
                        } : undefined}
                        iconColor="text-primary-600"
                        iconBgColor="bg-primary-50"
                    />
                ) : (
                    <Card className="overflow-hidden" noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-3 w-10"></th>
                                        <th className="px-6 py-3">Código</th>
                                        <th className="px-6 py-3">Descripción</th>
                                        <th className="px-6 py-3 text-right">Cant.</th>
                                        <th className="px-6 py-3 text-right">P. Unitario</th>
                                        <th className="px-6 py-3 text-right">Total</th>
                                        <th className="px-6 py-3 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPartidas.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <tr className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleExpand(item.id)}
                                                        className="text-slate-400 hover:text-primary-600 transition-colors"
                                                    >
                                                        {expandedId === item.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                                                    {item.code}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-800 max-w-md">
                                                    {item.description}
                                                    {item.apu?.incidencias && item.apu.incidencias.total_incidencias > 0 && (
                                                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                                                            ⚠ INCIDENCIAS
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-600">
                                                    {item.quantity.toLocaleString()} <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-600">
                                                    {formatCurrency(item.unitPrice || 0, project.contract.currency)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                                                    {formatCurrency((item.quantity || 0) * (item.unitPrice || 0), project.contract.currency)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditPartida(item)} className="h-8 w-8">
                                                            <Pencil size={16} className="text-slate-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeletePartida(item.id)} className="h-8 w-8">
                                                            <Trash2 size={16} className="text-red-500" />
                                                        </Button>
                                                        {item.apu && (
                                                            <Button variant="ghost" size="icon" onClick={() => project && generatePartidaPDF(item, project)} className="h-8 w-8">
                                                                <FileDown size={16} className="text-emerald-500" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedId === item.id && item.apu && (
                                                <tr className="bg-slate-50/50 shadow-inner">
                                                    <td colSpan={7} className="px-6 py-4">
                                                        <div className="pl-12">
                                                            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm max-w-3xl">
                                                                <h4 className="font-bold text-primary-900 mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                                                                    <Calculator size={14} />
                                                                    Resumen de Costos (APU)
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-8 text-sm">
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between text-slate-600">
                                                                            <span>Materiales:</span>
                                                                            <span className="font-mono">{formatCurrency(item.apu.subtotals?.materials || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-slate-600">
                                                                            <span>Equipos:</span>
                                                                            <span className="font-mono">{formatCurrency(item.apu.subtotals?.equipment || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-slate-600">
                                                                            <span>Mano de Obra:</span>
                                                                            <span className="font-mono">{formatCurrency(item.apu.subtotals?.labor || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2 border-l border-slate-100 pl-8">
                                                                        <div className="flex justify-between text-slate-700 font-medium">
                                                                            <span>Costo Directo:</span>
                                                                            <span className="font-mono">{formatCurrency(item.apu.directCost || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-slate-700 font-medium">
                                                                            <span>Ind. y Utilidad:</span>
                                                                            <span className="font-mono">{formatCurrency(item.apu.indirectCosts?.total || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                        <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-primary-600 text-base">
                                                                            <span>PRECIO UNITARIO:</span>
                                                                            <span className="font-mono">{formatCurrency(item.apu.unitPrice || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                                                                    <Button size="sm" variant="outline" onClick={() => handleEditPartida(item)}>
                                                                        Ver Análisis Completo
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider mr-4">Total Presupuesto</span>
                                    <span className="text-lg font-bold text-slate-900 font-mono">
                                        {formatCurrency(totalBudget, project.contract.currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </main>

            {/* APU Editor Modal */}
            {editingPartida && (
                <APUEditor
                    partida={editingPartida}
                    onSave={handleSaveAPU}
                    onClose={() => setEditingPartida(null)}
                />
            )}

            {/* Quick Actions FAB */}
            <QuickActions projectId={projectId} currentPage="budget" />
        </div>
    );
}
