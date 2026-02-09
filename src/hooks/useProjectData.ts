"use client";

import { useState, useEffect } from 'react';
import { Partida } from '../types';

const SAMPLE_PARTIDAS: Partida[] = [
    {
        id: "1",
        code: "E-411.110.120",
        description: "CONSTRUCCIÓN DE PARED DE BLOQUES DE CONCRETO...",
        unit: "m2",
        quantity: 100,
        unitPrice: 28.90,
        price: 2890,
        contracted: 2890,
        previousAccumulated: 800,
        thisValuation: 0,
        apu: {
            materials: [
                { id: "m1", description: "BLOQUE DE CONCRETO", unit: "UND", quantity: 12.5, unitPrice: 0.8, total: 10 },
                { id: "m2", description: "MORTERO 1:4", unit: "m3", quantity: 0.02, unitPrice: 150, total: 3 }
            ],
            equipment: [
                { id: "e1", description: "MEZCLADORA", unit: "hr", quantity: 0.1, unitPrice: 15, total: 1.5 }
            ],
            labor: [
                { id: "l1", description: "ALBAÑIL", unit: "hr", quantity: 1.5, unitPrice: 5, total: 7.5 }
            ],
            subtotals: {
                materials: 13,
                equipment: 1.5,
                labor: 7.5
            },
            legalCharges: {
                lopcymat: 0.26,
                inces: 0.15,
                sso: 1.5
            },
            directCost: 23.91,
            indirectCosts: {
                administration: 2.39,
                utilities: 1.20,
                profit: 1.40,
                total: 4.99
            },
            unitPrice: 28.90
        }
    }
];

export const useProjectData = () => {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('project_partidas');
        if (saved) {
            setPartidas(JSON.parse(saved));
        } else {
            setPartidas(SAMPLE_PARTIDAS);
        }
        setLoaded(true);
    }, []);

    const updatePartidas = (newPartidas: Partida[]) => {
        setPartidas(newPartidas);
        localStorage.setItem('project_partidas', JSON.stringify(newPartidas));
    };

    return { partidas, updatePartidas, loaded };
};
