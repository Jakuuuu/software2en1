
import { useState, useMemo } from 'react';
import { PartidaReference, PARTIDAS_REFERENCE_DATABASE, REFERENCE_CATEGORIES } from '../data/partidasReference';

export const usePartidasReference = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

    const filteredPartidas = useMemo(() => {
        return PARTIDAS_REFERENCE_DATABASE.filter(partida => {
            const matchesSearch =
                partida.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                partida.code.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === 'Todas' || partida.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const categories = ['Todas', ...REFERENCE_CATEGORIES];

    return {
        partidas: filteredPartidas,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        categories,
        totalRef: PARTIDAS_REFERENCE_DATABASE.length
    };
};
