"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, ChevronDown, ChevronRight, FileDown, Calculator, Search, Filter, AlertCircle } from 'lucide-react';
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto shadow-[0_0_15px_#0ea5e9]"></div>
                    <p className="mt-4 text-primary-400 font-mono text-sm animate-pulse">LOADING_BUDGET_DATA...</p>
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
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden selection:bg-primary-500/30 selection:text-white pb-20">
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
                            <div className="flex items-center gap-2 text-[10px] font-mono text-primary-400 mb-0.5 uppercase tracking-widest">
                                <span>PROJECT: {project.code}</span>
                                <span>/</span>
                                <span>BUDGET_MODULE</span>
                            </div>
                            <h1 className="text-lg font-bold text-white tracking-tight">{project.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right mr-4">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Total Presupuestado</p>
                            <p className="text-xl font-bold text-primary-400 font-mono text-shadow-glow">
                                {formatCurrency(totalBudget, project.contract.currency)}
                            </p>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-2 tracking-tight">
                            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                <Calculator className="text-indigo-400" size={24} />
                            </div>
                            Presupuesto y APU
                        </h2>
                        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                            Gestión centralizada de partidas, análisis de precios unitarios (APU) y costos directos.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                if (project) generateBudgetPDF(project, partidas);
                            }}
                            leftIcon={<FileDown size={18} />}
                            className="bg-slate-900/50 border-white/10 hover:bg-slate-800 text-slate-300"
                        >
                            Exportar PDF
                        </Button>
                        <Button
                            onClick={handleNewPartida}
                            leftIcon={<Plus size={18} />}
                            variant="cyber"
                            className="shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                        >
                            Nueva Partida
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar partida por código o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-200 placeholder:text-slate-600 transition-all backdrop-blur-sm shadow-inner"
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
                        iconColor="text-indigo-400"
                        iconBgColor="bg-indigo-500/10"
                    />
                ) : (
                    <Card className="overflow-hidden bg-slate-900/40 border-white/5 backdrop-blur-md" noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-950/50 text-slate-400 font-medium border-b border-white/5 uppercase tracking-wider text-[10px] font-mono">
                                    <tr>
                                        <th className="px-6 py-4 w-10"></th>
                                        <th className="px-6 py-4">Código</th>
                                        <th className="px-6 py-4">Descripción</th>
                                        <th className="px-6 py-4 text-right">Cant.</th>
                                        <th className="px-6 py-4 text-right">P. Unitario</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                        <th className="px-6 py-4 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredPartidas.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <tr className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => toggleExpand(item.id)}>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
                                                        className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded hover:bg-indigo-500/10"
                                                    >
                                                        {expandedId === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-indigo-400 font-bold text-xs">
                                                    {item.code}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-300 max-w-md">
                                                    {item.description}
                                                    {item.apu?.incidencias && item.apu.incidencias.total_incidencias > 0 && (
                                                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                            ⚠ INCIDENCIAS
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-400 bg-slate-950/30">
                                                    {item.quantity.toLocaleString()} <span className="text-[10px] text-slate-600 ml-1 uppercase">{item.unit}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-400 bg-slate-950/30">
                                                    {formatCurrency(item.unitPrice || 0, project.contract.currency)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-bold text-indigo-300 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors">
                                                    {formatCurrency((item.quantity || 0) * (item.unitPrice || 0), project.contract.currency)}
                                                </td>
                                                <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditPartida(item)} className="h-8 w-8 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10">
                                                            <Pencil size={14} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeletePartida(item.id)} className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                                                            <Trash2 size={14} />
                                                        </Button>
                                                        {item.apu && (
                                                            <Button variant="ghost" size="icon" onClick={() => project && generatePartidaPDF(item, project)} className="h-8 w-8 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10">
                                                                <FileDown size={14} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedId === item.id && item.apu && (
                                                <tr className="bg-slate-950/30 shadow-inner">
                                                    <td colSpan={7} className="px-6 py-6 border-b border-indigo-500/20">
                                                        <div className="pl-12">
                                                            <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-lg max-w-4xl relative overflow-hidden">
                                                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                                    <Calculator size={100} className="text-white" />
                                                                </div>
                                                                <h4 className="font-bold text-indigo-400 mb-6 text-xs uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                                                                    <Calculator size={14} />
                                                                    Desglose de Costos (APU)
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-12 text-sm relative z-10">
                                                                    <div className="space-y-3">
                                                                        <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1">
                                                                            <span>Materiales:</span>
                                                                            <span className="font-mono text-slate-200">{formatCurrency(item.apu.subtotals?.materials || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1">
                                                                            <span>Equipos:</span>
                                                                            <span className="font-mono text-slate-200">{formatCurrency(item.apu.subtotals?.equipment || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1">
                                                                            <span>Mano de Obra:</span>
                                                                            <span className="font-mono text-slate-200">{formatCurrency(item.apu.subtotals?.labor || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-3 pl-8 border-l border-white/5">
                                                                        <div className="flex justify-between text-slate-300 font-medium">
                                                                            <span>Costo Directo:</span>
                                                                            <span className="font-mono text-white">{formatCurrency(item.apu.directCost || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-slate-300 font-medium">
                                                                            <span>Ind. y Utilidad:</span>
                                                                            <span className="font-mono text-white">{formatCurrency(item.apu.indirectCosts?.total || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                        <div className="bg-indigo-500/10 -mx-2 px-2 py-2 rounded-lg mt-2 flex justify-between font-bold text-indigo-300 text-base border border-indigo-500/20">
                                                                            <span>PRECIO UNITARIO:</span>
                                                                            <span className="font-mono text-indigo-200 text-shadow-glow">{formatCurrency(item.apu.unitPrice || 0, project.contract.currency)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-6 pt-4 border-t border-white/5 flex justify-end gap-2">
                                                                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => project && generatePartidaPDF(item, project)}>
                                                                        <FileDown size={14} className="mr-2" /> PDF
                                                                    </Button>
                                                                    <Button size="sm" variant="cyber" onClick={() => handleEditPartida(item)}>
                                                                        <Pencil size={14} className="mr-2" /> Editar Análisis
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
                            <div className="px-6 py-4 border-t border-white/5 bg-slate-900/50 flex justify-end backdrop-blur-sm">
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mr-4">Total Presupuesto</span>
                                    <span className="text-xl font-bold text-indigo-400 font-mono text-shadow-glow">
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
