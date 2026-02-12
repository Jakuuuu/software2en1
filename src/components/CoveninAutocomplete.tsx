"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { useCoveninSearch, CoveninPartida } from '@/hooks/useCoveninSearch';

interface CoveninAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (partida: CoveninPartida) => void;
    placeholder?: string;
    error?: string;
}

export default function CoveninAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = "E-411.110.120",
    error
}: CoveninAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { setSearchQuery, results } = useCoveninSearch(value);

    useEffect(() => {
        setSearchQuery(value);
    }, [value, setSearchQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setIsOpen(true);
        setSelectedIndex(-1);
    };

    const handleSelect = (partida: CoveninPartida) => {
        onChange(partida.codigo);
        onSelect(partida);
        setIsOpen(false);
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown') {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value.length >= 2 && setIsOpen(true)}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-slate-300'
                        }`}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {results.map((partida, index) => (
                        <button
                            key={partida.codigo}
                            type="button"
                            onClick={() => handleSelect(partida)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-indigo-50 transition-colors ${index === selectedIndex ? 'bg-indigo-50' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-indigo-600">
                                            {partida.codigo}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {partida.unidad}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 mt-1 line-clamp-2">
                                        {partida.descripcion}
                                    </p>
                                    {partida.norma_covenin && (
                                        <p className="text-xs text-slate-500 mt-1">
                                            📋 {partida.norma_covenin}
                                        </p>
                                    )}
                                </div>
                                {index === selectedIndex && (
                                    <Check size={16} className="text-indigo-600 flex-shrink-0 mt-1" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {isOpen && value.length >= 2 && results.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4">
                    <p className="text-sm text-slate-500 text-center">
                        No se encontraron partidas que coincidan con "{value}"
                    </p>
                </div>
            )}
        </div>
    );
}
