"use client";

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Info } from 'lucide-react';
import {
    validateCovenInFormat,
    searchCovenInCodes,
    suggestCovenInCode,
    getCovenInCategories,
    CovenInCode
} from '@/data/covenin';

interface CovenInValidatorProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (code: CovenInCode) => void;
}

export const CovenInValidator: React.FC<CovenInValidatorProps> = ({ value, onChange, onSelect }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<CovenInCode[]>([]);

    const isValid = validateCovenInFormat(value);
    const hasValue = value.length > 0;

    const handleInputChange = (newValue: string) => {
        onChange(newValue.toUpperCase());

        if (newValue.length >= 3) {
            const results = searchCovenInCodes(newValue);
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (code: CovenInCode) => {
        onChange(code.codigo);
        setShowSuggestions(false);
        if (onSelect) {
            onSelect(code);
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                        if (suggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                    placeholder="E-XXX-XXX-XXX"
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${hasValue
                            ? isValid
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                            : 'border-slate-300'
                        }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {hasValue && (
                        isValid ? (
                            <CheckCircle size={18} className="text-green-600" />
                        ) : (
                            <XCircle size={18} className="text-red-600" />
                        )
                    )}
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-slate-100 last:border-0 transition-colors"
                        >
                            <div className="font-mono text-sm font-semibold text-indigo-600">
                                {suggestion.codigo}
                            </div>
                            <div className="text-sm text-slate-900 mt-1">
                                {suggestion.descripcion}
                            </div>
                            <div className="flex gap-2 mt-1">
                                <span className="text-xs text-slate-500">{suggestion.categoria}</span>
                                {suggestion.subcategoria && (
                                    <>
                                        <span className="text-xs text-slate-400">•</span>
                                        <span className="text-xs text-slate-500">{suggestion.subcategoria}</span>
                                    </>
                                )}
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500">{suggestion.unidad}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Validation Message */}
            {hasValue && !isValid && (
                <p className="text-xs text-red-600 mt-1">
                    Formato inválido. Use: LETRA-###-###-### (ej: E-001-001-001)
                </p>
            )}
        </div>
    );
};

// Component for description-based suggestions
export const CovenInSuggester: React.FC<{
    descripcion: string;
    onSelect: (code: CovenInCode) => void;
}> = ({ descripcion, onSelect }) => {
    const [suggestions, setSuggestions] = useState<CovenInCode[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    React.useEffect(() => {
        if (descripcion.length >= 5) {
            const results = suggestCovenInCode(descripcion);
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
        } else {
            setShowSuggestions(false);
        }
    }, [descripcion]);

    if (!showSuggestions) return null;

    return (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-900 mb-2">
                <Info size={16} />
                Códigos COVENIN sugeridos:
            </div>
            <div className="space-y-2">
                {suggestions.slice(0, 3).map((suggestion, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(suggestion)}
                        className="w-full text-left px-3 py-2 bg-white rounded hover:bg-blue-100 transition-colors"
                    >
                        <div className="font-mono text-xs font-semibold text-indigo-600">
                            {suggestion.codigo}
                        </div>
                        <div className="text-xs text-slate-700 mt-0.5">
                            {suggestion.descripcion}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
