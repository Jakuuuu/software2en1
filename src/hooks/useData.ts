// ============================================
// CUSTOM HOOKS FOR DATA MANAGEMENT
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Project, Partida, LegalConfig, Valuation } from '../types';

// ============================================
// DEFAULT LEGAL CONFIG FOR VENEZUELA
// ============================================

export const DEFAULT_LEGAL_CONFIG: LegalConfig = {
    // Venezuelan Legal Requirements
    applyLOPCYMAT: true,
    applyINCES: true,
    applySSO: true,
    applyLPH: true,

    // Tax Rates (Venezuela 2026)
    ivaRate: 0.16, // 16%
    retentionIVA: 1.00, // 100% for special contributors
    retentionISLR: 0.03, // 3%

    // Contract Terms
    advancePayment: 0.10, // 10%
    applyAmortization: true,
    performanceBond: 0.05, // 5%

    // Indirect Costs
    administrationRate: 0.10, // 10%
    utilitiesRate: 0.05, // 5%
    profitRate: 0.15, // 15%

    // Social Charges Rates
    ssoRate: 0.135, // 13.5%
    lphRate: 0.03, // 3%
    incesRate: 0.02, // 2%
    vacationsRate: 0.15, // 15%
    utilitiesRateMO: 0.15 // 15%
};

// ============================================
// useProjects Hook
// ============================================

const PROJECTS_KEY = '2en1apu-projects';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Load projects from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(PROJECTS_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setProjects(parsed);
            } catch (error) {
                console.error('Error loading projects:', error);
            }
        }
        setLoading(false);
    }, []);

    // Save projects to localStorage
    const saveProjects = (newProjects: Project[]) => {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(newProjects));
        setProjects(newProjects);
    };

    const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newProject: Project = {
            ...project,
            id: `proj-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        saveProjects([...projects, newProject]);
        return newProject;
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        const updated = projects.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        );
        saveProjects(updated);
    };

    const deleteProject = (id: string) => {
        saveProjects(projects.filter(p => p.id !== id));
    };

    const getProject = (id: string) => {
        return projects.find(p => p.id === id);
    };

    return {
        projects,
        loading,
        addProject,
        updateProject,
        deleteProject,
        getProject
    };
};

// ============================================
// usePartidas Hook
// ============================================

const PARTIDAS_KEY_PREFIX = '2en1apu-partidas-';

export const usePartidas = (projectId: string) => {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);

    const storageKey = `${PARTIDAS_KEY_PREFIX}${projectId}`;

    // Load partidas from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setPartidas(parsed);
            } catch (error) {
                console.error('Error loading partidas:', error);
            }
        }
        setLoading(false);
    }, [storageKey]);

    // Save partidas to localStorage
    const savePartidas = (newPartidas: Partida[]) => {
        localStorage.setItem(storageKey, JSON.stringify(newPartidas));
        setPartidas(newPartidas);
    };

    const addPartida = (partida: Omit<Partida, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newPartida: Partida = {
            ...partida,
            id: `part-${Date.now()}`,
            projectId,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        savePartidas([...partidas, newPartida]);
        return newPartida;
    };

    const updatePartida = (id: string, updates: Partial<Partida>) => {
        const updated = partidas.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        );
        savePartidas(updated);
    };

    const deletePartida = (id: string) => {
        savePartidas(partidas.filter(p => p.id !== id));
    };

    const getPartida = (id: string) => {
        return partidas.find(p => p.id === id);
    };

    return {
        partidas,
        loading,
        addPartida,
        updatePartida,
        deletePartida,
        getPartida
    };
};

// ============================================
// useProjectConfig Hook
// ============================================

export const useProjectConfig = (projectId: string | undefined) => {
    const { getProject } = useProjects();

    if (!projectId) return DEFAULT_LEGAL_CONFIG;

    const project = getProject(projectId);
    return project?.legalConfig || DEFAULT_LEGAL_CONFIG;
};

// ============================================
// useValuations Hook
// ============================================

const VALUATIONS_KEY_PREFIX = '2en1apu-valuations-';

export const useValuations = (projectId: string) => {
    const [valuations, setValuations] = useState<Valuation[]>([]);
    const [loading, setLoading] = useState(true);

    const storageKey = `${VALUATIONS_KEY_PREFIX}${projectId}`;

    // Load valuations from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setValuations(parsed);
            } catch (error) {
                console.error('Error loading valuations:', error);
            }
        }
        setLoading(false);
    }, [storageKey]);

    // Save valuations to localStorage
    const saveValuations = (newValuations: Valuation[]) => {
        localStorage.setItem(storageKey, JSON.stringify(newValuations));
        setValuations(newValuations);
    };

    const addValuation = (valuation: Omit<Valuation, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newValuation: Valuation = {
            ...valuation,
            id: `val-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        saveValuations([...valuations, newValuation]);
        return newValuation;
    };

    const updateValuation = (id: string, updates: Partial<Valuation>) => {
        const updated = valuations.map(v =>
            v.id === id ? { ...v, ...updates, updatedAt: new Date() } : v
        );
        saveValuations(updated);
    };

    const deleteValuation = (id: string) => {
        saveValuations(valuations.filter(v => v.id !== id));
    };

    const getValuation = (id: string) => {
        return valuations.find(v => v.id === id);
    };

    return {
        valuations,
        loading,
        addValuation,
        updateValuation,
        deleteValuation,
        getValuation
    };
};

// ============================================
// useLibrary Hook
// ============================================

const LIBRARY_KEY = '2en1apu-library';

export const useLibrary = () => {
    const [library, setLibrary] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);

    // Load form localStorage
    useEffect(() => {
        const stored = localStorage.getItem(LIBRARY_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setLibrary(parsed);
            } catch (error) {
                console.error('Error loading library:', error);
            }
        }
        setLoading(false);
    }, []);

    const saveLibrary = (newLibrary: Partida[]) => {
        localStorage.setItem(LIBRARY_KEY, JSON.stringify(newLibrary));
        setLibrary(newLibrary);
    };

    const addToLibrary = (newPartidas: Partida[]) => {
        const updated = [...library, ...newPartidas];
        saveLibrary(updated);
    };

    const clearLibrary = () => {
        saveLibrary([]);
    };

    return {
        library,
        loading,
        addToLibrary,
        clearLibrary
    };
};
