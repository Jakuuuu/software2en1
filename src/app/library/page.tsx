
"use client";

import React, { useState } from 'react';
import LegacyUpload from '@/components/LegacyUpload/LegacyUpload';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useLibrary } from '@/hooks/useData';
import { Partida } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { Search, Trash2, Database, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function LibraryPage() {
    const { library, loading, addToLibrary, clearLibrary } = useLibrary();
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    const handleUploadComplete = (newPartidas: Partida[]) => {
        addToLibrary(newPartidas);
        showToast('success', `${newPartidas.length} partidas agregadas a la biblioteca`);
    };

    const filteredLibrary = library.filter(p =>
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClearLibrary = () => {
        if (confirm('¿Estás seguro de borrar toda la biblioteca? Esta acción no se puede deshacer.')) {
            clearLibrary();
            showToast('success', 'Biblioteca vaciada');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
                <Breadcrumb items={[
                    { label: 'Proyectos', href: '/projects' },
                    { label: 'Biblioteca', href: '/library' }
                ]} />
                <div className="mt-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Database className="text-indigo-600" />
                            Biblioteca Maestra
                        </h1>
                        <p className="text-gray-500 mt-1">Gestión de partidas y base de datos de precios unitarios.</p>
                    </div>
                    <div>
                        <div className="text-right text-sm text-gray-500">
                            Total Registros: <span className="font-bold text-gray-900">{library.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Data List */}
                    <div className="lg:col-span-2 space-y-6">

                        <div className="flex justify-between gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por código o descripción..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {library.length > 0 && (
                                <button
                                    onClick={handleClearLibrary}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <Trash2 size={16} /> Limpiar Todo
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="bg-white rounded-lg p-12 text-center text-gray-400">
                                Cargando biblioteca...
                            </div>
                        ) : library.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Biblioteca Vacía</h3>
                                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                    No hay partidas en tu biblioteca local. Usa el panel de la derecha para importar datos desde Lulowin o DataLaing.
                                </p>
                            </div>
                        ) : filteredLibrary.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center text-gray-400">
                                No se encontraron resultados para "{searchTerm}"
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3">Código</th>
                                                <th className="px-6 py-3">Descripción</th>
                                                <th className="px-6 py-3">Unidad</th>
                                                <th className="px-6 py-3 text-right">Precio Unit. (Ref)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredLibrary.slice(0, 100).map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-3 font-medium text-indigo-600 font-mono whitespace-nowrap">
                                                        {item.code}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-900 line-clamp-2 max-w-md">
                                                        {item.description}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-500">
                                                        {item.unit}
                                                    </td>
                                                    <td className="px-6 py-3 text-right font-medium text-gray-900">
                                                        {formatCurrency(item.unitPrice, 'USD')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredLibrary.length > 100 && (
                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center text-xs text-gray-500">
                                        Mostrando primeros 100 resultados de {filteredLibrary.length}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Upload */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <LegacyUpload onUploadComplete={handleUploadComplete} />

                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <AlertTriangle className="text-blue-600 flex-shrink-0" size={20} />
                                    <div>
                                        <h4 className="font-medium text-blue-900 text-sm">Información Importante</h4>
                                        <p className="text-blue-800 text-xs mt-1">
                                            Los datos importados se guardan en tu navegador (LocalStorage).
                                            Si borras el caché, perderás esta biblioteca.
                                            <br /><br />
                                            Los precios unitarios son referenciales y pueden requerir recálculo de APU.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
