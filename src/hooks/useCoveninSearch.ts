import { useState, useMemo } from 'react';
import { PARTIDAS_COVENIN } from '@/data/covenin-data';

export interface CoveninPartida {
    codigo: string;
    descripcion: string;
    unidad: string;
    norma_covenin?: string;
    rendimiento?: number;
    mano_obra?: {
        cuadrilla: string;
        horas_hombre: number;
    };
}

export function useCoveninSearch(query: string) {
    const [searchQuery, setSearchQuery] = useState(query);

    const results = useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) {
            return [];
        }

        const lowerQuery = searchQuery.toLowerCase();
        const partidas = Object.values(PARTIDAS_COVENIN) as CoveninPartida[];

        // Search by code or description
        const matches = partidas.filter((partida) => {
            const codeMatch = partida.codigo.toLowerCase().includes(lowerQuery);
            const descMatch = partida.descripcion.toLowerCase().includes(lowerQuery);
            return codeMatch || descMatch;
        });

        // Sort: exact code matches first, then by relevance
        return matches.sort((a, b) => {
            const aExactCode = a.codigo.toLowerCase().startsWith(lowerQuery);
            const bExactCode = b.codigo.toLowerCase().startsWith(lowerQuery);

            if (aExactCode && !bExactCode) return -1;
            if (!aExactCode && bExactCode) return 1;

            return a.codigo.localeCompare(b.codigo);
        }).slice(0, 10); // Limit to 10 results
    }, [searchQuery]);

    return {
        searchQuery,
        setSearchQuery,
        results
    };
}
