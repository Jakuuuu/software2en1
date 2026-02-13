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
            <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-mono text-sm">LOADING_PROJECT_DATA...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 relative">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-tech-pattern opacity-30 pointer-events-none"></div>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                            <span>DASHBOARD</span>
                            <span>/</span>
                            <span>PROJECTS</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Panel de Control de Proyectos
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            Gestión centralizada de obras y presupuestos activos.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowNewProjectModal(true)}
                        leftIcon={<Plus size={18} />}
                        className="shadow-lg shadow-primary-900/10"
                    >
                        Nuevo Proyecto
                    </Button>
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por código, nombre o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-slate-100' : ''}>
                            <LayoutGrid size={18} />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-slate-100' : ''}>
                            <List size={18} />
                        </Button>
                        <Button variant="outline" leftIcon={<Filter size={16} />}>
                            Filtros
                        </Button>
                    </div>
                </div>

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <Building2 size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">
                            {searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos registrados'}
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">
                            {searchTerm
                                ? 'Intenta ajustar los términos de búsqueda o filtros.'
                                : 'Comienza creando tu primer proyecto para gestionar presupuestos y valuaciones.'}
                        </p>
                        {!searchTerm && (
                            <Button onClick={() => setShowNewProjectModal(true)} leftIcon={<Plus size={18} />}>
                                Crear Primer Proyecto
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                        {filteredProjects.map((project) => (
                            <Card
                                key={project.id}
                                className="group hover:border-primary-300 transition-colors duration-300"
                                noPadding
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                    {project.code}
                                                </span>
                                                <StatusBadge status={project.status} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                                {project.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-400 mb-0.5 uppercase tracking-wider">Cliente</p>
                                            <p className="font-medium text-slate-700 truncate" title={project.client.name}>
                                                {project.client.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-0.5 uppercase tracking-wider">Monto</p>
                                            <p className="font-bold text-slate-700">
                                                {formatCurrency(project.contract.amount, project.contract.currency)}
                                            </p>
                                        </div>
                                    </div>

                                    {project.progress !== undefined && (
                                        <div className="mb-4">
                                            <div className="flex justify-between items-end mb-1">
                                                <p className="text-xs text-slate-400 uppercase tracking-wider">Avance Físico</p>
                                                <span className="text-xs font-bold text-primary-600">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-primary-500 h-1.5 rounded-full transition-all duration-1000 ease-out group-hover:bg-primary-600"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                                    <Link href={`/projects/${project.id}`} className="flex-1">
                                        <Button variant="secondary" size="sm" className="w-full">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href={`/projects/${project.id}/budget`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            APU
                                        </Button>
                                    </Link>
                                    <Link href={`/projects/${project.id}/valuations`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
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
