import { useState, useEffect, useCallback } from 'react';
import { InsumoMaestro, InsumosDatabase, TasaCambio, InsumoTipo } from '@/types';

const STORAGE_KEY = 'insumos_database';
const DEFAULT_TASA_CAMBIO = 65.00; // Bs por USD (actualizar según BCV)

// Categorías predefinidas
const DEFAULT_CATEGORIAS = {
    materiales: [
        'Concreto',
        'Acero',
        'Bloques',
        'Cerámica',
        'Pintura',
        'Madera',
        'Tubería',
        'Cables',
        'Arena y Agregados',
        'Cemento'
    ],
    equipos: [
        'Excavación',
        'Transporte',
        'Mezcla',
        'Compactación',
        'Herramientas Menores',
        'Elevación'
    ],
    manoDeObra: [
        'Albañilería',
        'Electricidad',
        'Plomería',
        'Carpintería',
        'Herrería',
        'Pintura',
        'Acabados'
    ]
};

// Base de datos inicial vacía
const getInitialDatabase = (): InsumosDatabase => ({
    insumos: [],
    categorias: DEFAULT_CATEGORIAS,
    tasaCambio: {
        valor: DEFAULT_TASA_CAMBIO,
        fecha: new Date(),
        fuente: 'MANUAL'
    }
});

export const useInsumos = () => {
    const [database, setDatabase] = useState<InsumosDatabase>(getInitialDatabase());
    const [loading, setLoading] = useState(true);

    // Cargar desde localStorage
    useEffect(() => {
        const loadDatabase = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // Convertir fechas de strings a Date objects
                    parsed.tasaCambio.fecha = new Date(parsed.tasaCambio.fecha);
                    parsed.insumos = parsed.insumos.map((insumo: any) => ({
                        ...insumo,
                        fechaActualizacion: new Date(insumo.fechaActualizacion)
                    }));
                    setDatabase(parsed);
                } else {
                    setDatabase(getInitialDatabase());
                }
            } catch (error) {
                console.error('Error loading insumos database:', error);
                setDatabase(getInitialDatabase());
            } finally {
                setLoading(false);
            }
        };

        loadDatabase();
    }, []);

    // Guardar en localStorage
    const saveDatabase = useCallback((db: InsumosDatabase) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
            setDatabase(db);
        } catch (error) {
            console.error('Error saving insumos database:', error);
        }
    }, []);

    // Generar código automático
    const generateCodigo = useCallback((tipo: InsumoTipo): string => {
        const prefix = tipo === 'MATERIAL' ? 'M' : tipo === 'EQUIPO' ? 'E' : 'L';
        const existingCodes = database.insumos
            .filter(i => i.tipo === tipo)
            .map(i => parseInt(i.codigo.substring(1)))
            .filter(n => !isNaN(n));

        const nextNumber = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
        return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    }, [database.insumos]);

    // Convertir Bs a USD
    const convertBsToUSD = useCallback((bs: number): number => {
        return bs / database.tasaCambio.valor;
    }, [database.tasaCambio.valor]);

    // Convertir USD a Bs
    const convertUSDToBs = useCallback((usd: number): number => {
        return usd * database.tasaCambio.valor;
    }, [database.tasaCambio.valor]);

    // Crear insumo
    const createInsumo = useCallback((insumo: Omit<InsumoMaestro, 'id' | 'codigo' | 'fechaActualizacion'>) => {
        const newInsumo: InsumoMaestro = {
            ...insumo,
            id: `insumo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            codigo: generateCodigo(insumo.tipo),
            fechaActualizacion: new Date(),
            tasaCambioReferencia: database.tasaCambio.valor
        };

        const newDatabase = {
            ...database,
            insumos: [...database.insumos, newInsumo]
        };

        saveDatabase(newDatabase);
        return newInsumo;
    }, [database, generateCodigo, saveDatabase]);

    // Actualizar insumo
    const updateInsumo = useCallback((id: string, updates: Partial<InsumoMaestro>) => {
        const newDatabase = {
            ...database,
            insumos: database.insumos.map(insumo =>
                insumo.id === id
                    ? { ...insumo, ...updates, fechaActualizacion: new Date() }
                    : insumo
            )
        };

        saveDatabase(newDatabase);
    }, [database, saveDatabase]);

    // Eliminar insumo
    const deleteInsumo = useCallback((id: string) => {
        const newDatabase = {
            ...database,
            insumos: database.insumos.filter(insumo => insumo.id !== id)
        };

        saveDatabase(newDatabase);
    }, [database, saveDatabase]);

    // Obtener insumo por ID
    const getInsumo = useCallback((id: string): InsumoMaestro | undefined => {
        return database.insumos.find(insumo => insumo.id === id);
    }, [database.insumos]);

    // Buscar insumos
    const searchInsumos = useCallback((query: string, tipo?: InsumoTipo, categoria?: string): InsumoMaestro[] => {
        return database.insumos.filter(insumo => {
            const matchesQuery = query === '' ||
                insumo.descripcion.toLowerCase().includes(query.toLowerCase()) ||
                insumo.codigo.toLowerCase().includes(query.toLowerCase());

            const matchesTipo = !tipo || insumo.tipo === tipo;
            const matchesCategoria = !categoria || insumo.categoria === categoria;

            return matchesQuery && matchesTipo && matchesCategoria && insumo.activo;
        });
    }, [database.insumos]);

    // Actualizar tasa de cambio
    const updateTasaCambio = useCallback((nuevaTasa: number, fuente: 'BCV' | 'MANUAL' = 'MANUAL') => {
        const newDatabase = {
            ...database,
            tasaCambio: {
                valor: nuevaTasa,
                fecha: new Date(),
                fuente
            }
        };

        saveDatabase(newDatabase);
    }, [database, saveDatabase]);

    // Actualizar precios masivamente con nueva tasa
    const updatePreciosConNuevaTasa = useCallback((nuevaTasa: number) => {
        const newDatabase = {
            ...database,
            insumos: database.insumos.map(insumo => ({
                ...insumo,
                precioUnitarioBs: insumo.precioUnitarioUSD * nuevaTasa,
                tasaCambioReferencia: nuevaTasa,
                fechaActualizacion: new Date()
            })),
            tasaCambio: {
                valor: nuevaTasa,
                fecha: new Date(),
                fuente: 'MANUAL' as const
            }
        };

        saveDatabase(newDatabase);
    }, [database, saveDatabase]);

    // Agregar nueva categoría
    const addCategoria = useCallback((tipo: 'materiales' | 'equipos' | 'manoDeObra', categoria: string) => {
        if (!database.categorias[tipo].includes(categoria)) {
            const newDatabase = {
                ...database,
                categorias: {
                    ...database.categorias,
                    [tipo]: [...database.categorias[tipo], categoria]
                }
            };
            saveDatabase(newDatabase);
        }
    }, [database, saveDatabase]);

    // Importar desde JSON
    const importFromJSON = useCallback((data: InsumoMaestro[]) => {
        const currentTasa = database.tasaCambio.valor;
        // Recalcular precios en Bs basados en la tasa actual
        const processedData = data.map(insumo => ({
            ...insumo,
            precioUnitarioBs: insumo.precioUnitarioUSD * currentTasa,
            tasaCambioReferencia: currentTasa
        }));

        const newDatabase = {
            ...database,
            insumos: [...database.insumos, ...processedData]
        };
        saveDatabase(newDatabase);
    }, [database, saveDatabase]);

    // Exportar a JSON
    const exportToJSON = useCallback((): string => {
        return JSON.stringify(database.insumos, null, 2);
    }, [database.insumos]);

    // Estadísticas
    const getEstadisticas = useCallback(() => {
        return {
            total: database.insumos.length,
            materiales: database.insumos.filter(i => i.tipo === 'MATERIAL').length,
            equipos: database.insumos.filter(i => i.tipo === 'EQUIPO').length,
            manoDeObra: database.insumos.filter(i => i.tipo === 'MANO_OBRA').length,
            activos: database.insumos.filter(i => i.activo).length,
            inactivos: database.insumos.filter(i => !i.activo).length
        };
    }, [database.insumos]);

    return {
        // Estado
        database,
        loading,
        insumos: database.insumos,
        categorias: database.categorias,
        tasaCambio: database.tasaCambio,

        // CRUD
        createInsumo,
        updateInsumo,
        deleteInsumo,
        getInsumo,
        searchInsumos,

        // Conversión de moneda
        convertBsToUSD,
        convertUSDToBs,
        updateTasaCambio,
        updatePreciosConNuevaTasa,

        // Categorías
        addCategoria,

        // Importar/Exportar
        importFromJSON,
        exportToJSON,

        // Utilidades
        generateCodigo,
        getEstadisticas
    };
};
