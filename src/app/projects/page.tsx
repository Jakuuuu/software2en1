"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/useData';
import { Project } from '@/types';
import { Building2, Plus, Search, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import ProjectFormModal from '@/components/ProjectFormModal';

export default function ProjectsPage() {
    const { projects, loading } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Cargando proyectos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                        <span>← Volver al inicio</span>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">2 en 1 APU</h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Page Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <Building2 size={32} className="text-indigo-600" />
                            Proyectos
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'} registrados
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewProjectModal(true)}
                        className="px-5 py-2.5 bg-indigo-600 rounded-lg font-medium text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Nuevo Proyecto
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cliente o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                        <Building2 size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">
                            {searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos aún'}
                        </h3>
                        <p className="text-slate-500 mb-6">
                            {searchTerm
                                ? 'Intenta con otros términos de búsqueda'
                                : 'Comienza creando tu primer proyecto'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowNewProjectModal(true)}
                                className="px-5 py-2.5 bg-indigo-600 rounded-lg font-medium text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Crear Primer Proyecto
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-slate-800">{project.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                                {getStatusLabel(project.status)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500">Código: {project.code}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Cliente</p>
                                        <p className="font-medium text-slate-700">{project.client.name}</p>
                                        <p className="text-xs text-slate-500">{project.client.rif}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Contrato</p>
                                        <p className="font-medium text-slate-700">{project.contract.number}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(project.contract.date).toLocaleDateString('es-VE')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-4 p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={18} className="text-indigo-600" />
                                        <div>
                                            <p className="text-xs text-slate-500">Monto Contratado</p>
                                            <p className="font-bold text-slate-800">
                                                {formatCurrency(project.contract.amount, project.contract.currency)}
                                            </p>
                                        </div>
                                    </div>
                                    {project.contract.currency === 'USD' && project.contract.exchangeRate && (
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={18} className="text-emerald-600" />
                                            <div>
                                                <p className="text-xs text-slate-500">Tasa de Cambio</p>
                                                <p className="font-bold text-slate-800">
                                                    Bs. {project.contract.exchangeRate.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {project.progress !== undefined && (
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 mb-1">Avance</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-indigo-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {project.progress}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        href={`/projects/${project.id}`}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center"
                                    >
                                        Ver Dashboard
                                    </Link>
                                    <Link
                                        href={`/projects/${project.id}/budget`}
                                        className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center"
                                    >
                                        Presupuesto
                                    </Link>
                                    <Link
                                        href={`/projects/${project.id}/valuations`}
                                        className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center"
                                    >
                                        Valuaciones
                                    </Link>
                                </div>
                            </div>
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
