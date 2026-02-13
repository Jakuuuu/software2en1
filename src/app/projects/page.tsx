"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/useData';
import { Project } from '@/types';
import { Building2, Plus, Search, Calendar, DollarSign, TrendingUp, Filter, LayoutGrid, List } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import ProjectFormModal from '@/components/ProjectFormModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ProjectsPage() {
    const { projects, loading } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto shadow-[0_0_15px_#0ea5e9]"></div>
                    <p className="mt-4 text-primary-400 font-mono text-sm animate-pulse">LOADING_PROJECT_DATA...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden selection:bg-primary-500/30 selection:text-white pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"></div>
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 mt-20">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-primary-400 text-xs font-mono mb-1 bg-primary-500/10 inline-block px-2 py-1 rounded border border-primary-500/20">
                            <span>DASHBOARD</span>
                            <span>/</span>
                            <span>PROJECTS</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight text-shadow-glow">
                            Panel de Control de Proyectos
                        </h2>
                        <p className="text-slate-400 mt-1 text-sm">
                            Gestión centralizada de obras y presupuestos activos.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowNewProjectModal(true)}
                        leftIcon={<Plus size={18} />}
                        className="shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-shadow"
                        variant="cyber"
                    >
                        Nuevo Proyecto
                    </Button>
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por código, nombre o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm shadow-inner text-slate-200 placeholder:text-slate-600 transition-all backdrop-blur-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' : 'text-slate-500 border-white/10'}>
                            <LayoutGrid size={18} />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' : 'text-slate-500 border-white/10'}>
                            <List size={18} />
                        </Button>
                        <Button variant="outline" leftIcon={<Filter size={16} />} className="border-white/10 text-slate-400 hover:text-white">
                            Filtros
                        </Button>
                    </div>
                </div>

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-white/10 bg-slate-900/40 backdrop-blur-sm">
                        <Building2 size={48} className="text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">
                            {searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos registrados'}
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">
                            {searchTerm
                                ? 'Intenta ajustar los términos de búsqueda o filtros.'
                                : 'Comienza creando tu primer proyecto para gestionar presupuestos y valuaciones.'}
                        </p>
                        {!searchTerm && (
                            <Button onClick={() => setShowNewProjectModal(true)} leftIcon={<Plus size={18} />} variant="cyber">
                                Crear Primer Proyecto
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                        {filteredProjects.map((project) => (
                            <Card
                                key={project.id}
                                className="group hover:border-primary-500/40 transition-all duration-300 bg-slate-900/40 backdrop-blur-md border-white/5 hover:shadow-[0_0_20px_rgba(14,165,233,0.1)] hover:-translate-y-1"
                                noPadding
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-5">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-mono text-[10px] text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded border border-primary-500/20">
                                                    {project.code}
                                                </span>
                                                <StatusBadge status={project.status} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-200 line-clamp-1 group-hover:text-primary-400 transition-colors tracking-tight">
                                                {project.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                        <div>
                                            <p className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-widest">Cliente</p>
                                            <p className="font-medium text-slate-300 truncate group-hover:text-slate-100 transition-colors" title={project.client.name}>
                                                {project.client.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-widest">Monto</p>
                                            <p className="font-bold text-slate-200 group-hover:text-white transition-colors">
                                                {formatCurrency(project.contract.amount, project.contract.currency)}
                                            </p>
                                        </div>
                                    </div>

                                    {project.progress !== undefined && (
                                        <div className="mb-4">
                                            <div className="flex justify-between items-end mb-1">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Avance Físico</p>
                                                <span className="text-xs font-bold text-primary-400 text-shadow-glow">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-primary-600 to-cyan-400 h-1.5 rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_#0ea5e9]"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="px-5 py-3 bg-slate-900/50 border-t border-white/5 flex gap-2 rounded-b-xl">
                                    <Link href={`/projects/${project.id}`} className="flex-1">
                                        <Button variant="secondary" size="sm" className="w-full bg-white/5 hover:bg-white/10 text-xs border border-white/5">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href={`/projects/${project.id}/budget`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full border-white/5 hover:border-primary-500/30 hover:bg-primary-500/10 text-xs text-slate-400 hover:text-primary-400">
                                            APU
                                        </Button>
                                    </Link>
                                    <Link href={`/projects/${project.id}/valuations`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-xs text-slate-400 hover:text-emerald-400">
                                            Val
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Project Form Modal */}
            {showNewProjectModal && (
                <ProjectFormModal
                    onClose={() => setShowNewProjectModal(false)}
                    onSuccess={() => {
                        setShowNewProjectModal(false);
                    }}
                />
            )}
        </div>
    );
}
