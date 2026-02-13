
import React from 'react';
import { usePartidasReference } from '@/hooks/usePartidasReference';
import { PartidaReference } from '@/data/partidasReference';
import { Search, Plus, Filter, X } from 'lucide-react';
import { Button } from './ui/Button';

interface PartidaSelectorProps {
    onSelect: (partida: PartidaReference) => void;
    onClose: () => void;
}

export const PartidaSelector: React.FC<PartidaSelectorProps> = ({ onSelect, onClose }) => {
    const { partidas, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories } = usePartidasReference();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-indigo-600" />
                        Base de Datos de Partidas
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-100 grid md:grid-cols-[1fr_200px] gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por código o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            autoFocus
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                    {partidas.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <p>No se encontraron partidas con los filtros actuales.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {partidas.map(partida => (
                                <div key={partida.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-slate-100 text-slate-700 font-mono text-xs px-2 py-0.5 rounded font-bold border border-slate-200">
                                                    {partida.code}
                                                </span>
                                                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                                                    {partida.category}
                                                </span>
                                            </div>
                                            <p className="font-medium text-slate-800 text-sm leading-snug">
                                                {partida.description}
                                            </p>

                                            <div className="flex gap-4 mt-3 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-slate-700">{partida.apu.materials.length}</span> Materiales
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-slate-700">{partida.apu.equipment.length}</span> Equipos
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-slate-700">{partida.apu.labor.length}</span> Mano Obra
                                                </div>
                                                <div className="ml-auto font-mono text-slate-400">
                                                    Unidad: {partida.unit}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <Button
                                                size="sm"
                                                onClick={() => onSelect(partida)}
                                                leftIcon={<Plus size={16} />}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm shadow-indigo-200"
                                            >
                                                Importar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400">
                    Mostrando {partidas.length} partidas de referencia
                </div>
            </div>
        </div>
    );
};
