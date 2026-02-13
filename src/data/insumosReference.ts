/**
 * Base de Datos de Referencia de Insumos
 * 
 * Esta base de datos contiene precios de referencia para insumos de construcción
 * en el mercado venezolano. Los usuarios pueden consultar estos precios como
 * referencia o importarlos a su base de datos personal.
 * 
 * IMPORTANTE: Estos precios son referenciales y deben ser actualizados según
 * el mercado local y las condiciones específicas de cada proyecto.
 * 
 * Última actualización: 2026-02-12
 * Versión: 1.0
 * Fuente: Precios de mercado promedio Venezuela
 * Tasa de cambio referencial: 65.00 Bs/USD
 */

import { InsumoMaestro } from '@/types';

export interface InsumosReferenceMetadata {
    version: string;
    lastUpdate: string;
    exchangeRate: number;
    source: string;
    totalInsumos: number;
    disclaimer: string;
}

export const INSUMOS_REFERENCE_METADATA: InsumosReferenceMetadata = {
    version: '1.0',
    lastUpdate: '2026-02-12',
    exchangeRate: 65.00,
    source: 'Precios de mercado promedio Venezuela - Febrero 2026',
    totalInsumos: 40,
    disclaimer: 'Estos precios son referenciales. Actualice según su mercado local y condiciones del proyecto.'
};

/**
 * Base de datos de referencia de insumos
 * Contiene 40 insumos básicos de construcción:
 * - 21 Materiales (M001-M022)
 * - 8 Equipos (E001-E008)
 * - 11 Mano de Obra (L001-L010)
 */
export const INSUMOS_REFERENCE_DATABASE: InsumoMaestro[] = [
    // ==================== MATERIALES ====================

    // CEMENTO Y AGREGADOS
    {
        id: 'ref-m001',
        codigo: 'M001',
        tipo: 'MATERIAL',
        descripcion: 'Cemento Portland Tipo I (50 kg)',
        unidad: 'saco',
        categoria: 'Cemento',
        precioUnitarioUSD: 8.50,
        precioUnitarioBs: 552.50,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        proveedor: 'Cemex Venezuela',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m002',
        codigo: 'M002',
        tipo: 'MATERIAL',
        descripcion: 'Arena lavada',
        unidad: 'm³',
        categoria: 'Arena y Agregados',
        precioUnitarioUSD: 25.00,
        precioUnitarioBs: 1625.00,
        wasteFactorDefault: 0.10,
        fuentePrecio: 'MERCADO',
        proveedor: 'Agregados del Centro',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m003',
        codigo: 'M003',
        tipo: 'MATERIAL',
        descripcion: 'Piedra picada 3/4"',
        unidad: 'm³',
        categoria: 'Arena y Agregados',
        precioUnitarioUSD: 30.00,
        precioUnitarioBs: 1950.00,
        wasteFactorDefault: 0.08,
        fuentePrecio: 'MERCADO',
        proveedor: 'Agregados del Centro',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m022',
        codigo: 'M022',
        tipo: 'MATERIAL',
        descripcion: 'Mortero de pega',
        unidad: 'saco',
        categoria: 'Cemento',
        precioUnitarioUSD: 6.50,
        precioUnitarioBs: 422.50,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // ACERO
    {
        id: 'ref-m004',
        codigo: 'M004',
        tipo: 'MATERIAL',
        descripcion: 'Cabilla 3/8" (12 m)',
        unidad: 'unidad',
        categoria: 'Acero',
        precioUnitarioUSD: 6.50,
        precioUnitarioBs: 422.50,
        wasteFactorDefault: 0.15,
        fuentePrecio: 'MERCADO',
        proveedor: 'Siderúrgica del Orinoco',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m005',
        codigo: 'M005',
        tipo: 'MATERIAL',
        descripcion: 'Cabilla 1/2" (12 m)',
        unidad: 'unidad',
        categoria: 'Acero',
        precioUnitarioUSD: 11.50,
        precioUnitarioBs: 747.50,
        wasteFactorDefault: 0.15,
        fuentePrecio: 'MERCADO',
        proveedor: 'Siderúrgica del Orinoco',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m006',
        codigo: 'M006',
        tipo: 'MATERIAL',
        descripcion: 'Cabilla 5/8" (12 m)',
        unidad: 'unidad',
        categoria: 'Acero',
        precioUnitarioUSD: 17.50,
        precioUnitarioBs: 1137.50,
        wasteFactorDefault: 0.15,
        fuentePrecio: 'MERCADO',
        proveedor: 'Siderúrgica del Orinoco',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m007',
        codigo: 'M007',
        tipo: 'MATERIAL',
        descripcion: 'Alambre de amarre #18',
        unidad: 'kg',
        categoria: 'Acero',
        precioUnitarioUSD: 2.50,
        precioUnitarioBs: 162.50,
        wasteFactorDefault: 0.10,
        fuentePrecio: 'MERCADO',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // BLOQUES
    {
        id: 'ref-m008',
        codigo: 'M008',
        tipo: 'MATERIAL',
        descripcion: 'Bloque de arcilla 15x20x40 cm',
        unidad: 'unidad',
        categoria: 'Bloques',
        precioUnitarioUSD: 0.85,
        precioUnitarioBs: 55.25,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        proveedor: 'Bloques La Victoria',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m009',
        codigo: 'M009',
        tipo: 'MATERIAL',
        descripcion: 'Bloque de concreto 15x20x40 cm',
        unidad: 'unidad',
        categoria: 'Bloques',
        precioUnitarioUSD: 1.20,
        precioUnitarioBs: 78.00,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        proveedor: 'Bloques del Centro',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // CERÁMICA
    {
        id: 'ref-m010',
        codigo: 'M010',
        tipo: 'MATERIAL',
        descripcion: 'Cerámica para piso 40x40 cm',
        unidad: 'm²',
        categoria: 'Cerámica',
        precioUnitarioUSD: 12.50,
        precioUnitarioBs: 812.50,
        wasteFactorDefault: 0.10,
        fuentePrecio: 'MERCADO',
        proveedor: 'Cerámicas Carabobo',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m011',
        codigo: 'M011',
        tipo: 'MATERIAL',
        descripcion: 'Porcelanato 60x60 cm',
        unidad: 'm²',
        categoria: 'Cerámica',
        precioUnitarioUSD: 28.00,
        precioUnitarioBs: 1820.00,
        wasteFactorDefault: 0.10,
        fuentePrecio: 'MERCADO',
        proveedor: 'Porcelanosa',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // PINTURA
    {
        id: 'ref-m012',
        codigo: 'M012',
        tipo: 'MATERIAL',
        descripcion: 'Pintura látex interior (galón)',
        unidad: 'galón',
        categoria: 'Pintura',
        precioUnitarioUSD: 18.00,
        precioUnitarioBs: 1170.00,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        proveedor: 'Pinturas Montana',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m013',
        codigo: 'M013',
        tipo: 'MATERIAL',
        descripcion: 'Pintura látex exterior (galón)',
        unidad: 'galón',
        categoria: 'Pintura',
        precioUnitarioUSD: 22.00,
        precioUnitarioBs: 1430.00,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        proveedor: 'Pinturas Montana',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // MADERA
    {
        id: 'ref-m014',
        codigo: 'M014',
        tipo: 'MATERIAL',
        descripcion: 'Madera pino 2x4" (3.60 m)',
        unidad: 'unidad',
        categoria: 'Madera',
        precioUnitarioUSD: 8.50,
        precioUnitarioBs: 552.50,
        wasteFactorDefault: 0.15,
        fuentePrecio: 'MERCADO',
        proveedor: 'Maderas del Caribe',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // TUBERÍA
    {
        id: 'ref-m015',
        codigo: 'M015',
        tipo: 'MATERIAL',
        descripcion: 'Tubería PVC 1/2" (6 m)',
        unidad: 'unidad',
        categoria: 'Tubería',
        precioUnitarioUSD: 4.50,
        precioUnitarioBs: 292.50,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        proveedor: 'Tubrica',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m016',
        codigo: 'M016',
        tipo: 'MATERIAL',
        descripcion: 'Tubería PVC 3/4" (6 m)',
        unidad: 'unidad',
        categoria: 'Tubería',
        precioUnitarioUSD: 6.50,
        precioUnitarioBs: 422.50,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        proveedor: 'Tubrica',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m017',
        codigo: 'M017',
        tipo: 'MATERIAL',
        descripcion: 'Tubería PVC 2" aguas servidas (6 m)',
        unidad: 'unidad',
        categoria: 'Tubería',
        precioUnitarioUSD: 12.00,
        precioUnitarioBs: 780.00,
        wasteFactorDefault: 0.05,
        fuentePrecio: 'MERCADO',
        proveedor: 'Tubrica',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // CABLES
    {
        id: 'ref-m018',
        codigo: 'M018',
        tipo: 'MATERIAL',
        descripcion: 'Cable eléctrico #12 AWG',
        unidad: 'ml',
        categoria: 'Cables',
        precioUnitarioUSD: 1.20,
        precioUnitarioBs: 78.00,
        wasteFactorDefault: 0.10,
        fuentePrecio: 'MERCADO',
        proveedor: 'Cableado Nacional',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m019',
        codigo: 'M019',
        tipo: 'MATERIAL',
        descripcion: 'Cable eléctrico #10 AWG',
        unidad: 'ml',
        categoria: 'Cables',
        precioUnitarioUSD: 1.80,
        precioUnitarioBs: 117.00,
        wasteFactorDefault: 0.10,
        fuentePrecio: 'MERCADO',
        proveedor: 'Cableado Nacional',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // CONCRETO
    {
        id: 'ref-m020',
        codigo: 'M020',
        tipo: 'MATERIAL',
        descripcion: 'Concreto premezclado f\'c=210 kg/cm²',
        unidad: 'm³',
        categoria: 'Concreto',
        precioUnitarioUSD: 85.00,
        precioUnitarioBs: 5525.00,
        wasteFactorDefault: 0.03,
        fuentePrecio: 'PROVEEDOR',
        proveedor: 'Premezclados Caracas',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-m021',
        codigo: 'M021',
        tipo: 'MATERIAL',
        descripcion: 'Concreto premezclado f\'c=250 kg/cm²',
        unidad: 'm³',
        categoria: 'Concreto',
        precioUnitarioUSD: 95.00,
        precioUnitarioBs: 6175.00,
        wasteFactorDefault: 0.03,
        fuentePrecio: 'PROVEEDOR',
        proveedor: 'Premezclados Caracas',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // ==================== EQUIPOS ====================

    {
        id: 'ref-e001',
        codigo: 'E001',
        tipo: 'EQUIPO',
        descripcion: 'Retroexcavadora CAT 416',
        unidad: 'hr',
        categoria: 'Excavación',
        precioUnitarioUSD: 45.00,
        precioUnitarioBs: 2925.00,
        ownershipTypeDefault: 'RENTED',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-e002',
        codigo: 'E002',
        tipo: 'EQUIPO',
        descripcion: 'Excavadora hidráulica 320',
        unidad: 'hr',
        categoria: 'Excavación',
        precioUnitarioUSD: 65.00,
        precioUnitarioBs: 4225.00,
        ownershipTypeDefault: 'RENTED',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-e003',
        codigo: 'E003',
        tipo: 'EQUIPO',
        descripcion: 'Camión volteo 6 m³',
        unidad: 'hr',
        categoria: 'Transporte',
        precioUnitarioUSD: 35.00,
        precioUnitarioBs: 2275.00,
        ownershipTypeDefault: 'RENTED',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-e004',
        codigo: 'E004',
        tipo: 'EQUIPO',
        descripcion: 'Mezcladora de concreto 1 saco',
        unidad: 'hr',
        categoria: 'Mezcla',
        precioUnitarioUSD: 8.00,
        precioUnitarioBs: 520.00,
        ownershipTypeDefault: 'OWNED',
        usefulLifeHours: 5000,
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-e005',
        codigo: 'E005',
        tipo: 'EQUIPO',
        descripcion: 'Compactador vibratorio',
        unidad: 'hr',
        categoria: 'Compactación',
        precioUnitarioUSD: 12.00,
        precioUnitarioBs: 780.00,
        ownershipTypeDefault: 'RENTED',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-e006',
        codigo: 'E006',
        tipo: 'EQUIPO',
        descripcion: 'Vibrador de concreto',
        unidad: 'hr',
        categoria: 'Mezcla',
        precioUnitarioUSD: 5.00,
        precioUnitarioBs: 325.00,
        ownershipTypeDefault: 'OWNED',
        usefulLifeHours: 3000,
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-e007',
        codigo: 'E007',
        tipo: 'EQUIPO',
        descripcion: 'Andamio metálico',
        unidad: 'm²/día',
        categoria: 'Elevación',
        precioUnitarioUSD: 0.80,
        precioUnitarioBs: 52.00,
        ownershipTypeDefault: 'RENTED',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-e008',
        codigo: 'E008',
        tipo: 'EQUIPO',
        descripcion: 'Herramientas menores',
        unidad: '%MO',
        categoria: 'Herramientas Menores',
        precioUnitarioUSD: 0.05,
        precioUnitarioBs: 3.25,
        ownershipTypeDefault: 'OWNED',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },

    // ==================== MANO DE OBRA ====================

    {
        id: 'ref-l001',
        codigo: 'L001',
        tipo: 'MANO_OBRA',
        descripcion: 'Maestro de obra',
        unidad: 'hr',
        categoria: 'Albañilería',
        precioUnitarioUSD: 4.50,
        precioUnitarioBs: 292.50,
        categoriaLaboral: 'Técnico',
        especialidad: 'Construcción general',
        tabulador: 'Nivel III',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l002',
        codigo: 'L002',
        tipo: 'MANO_OBRA',
        descripcion: 'Oficial albañil',
        unidad: 'hr',
        categoria: 'Albañilería',
        precioUnitarioUSD: 3.50,
        precioUnitarioBs: 227.50,
        categoriaLaboral: 'Obrero',
        especialidad: 'Albañilería',
        tabulador: 'Nivel II',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l003',
        codigo: 'L003',
        tipo: 'MANO_OBRA',
        descripcion: 'Ayudante de albañil',
        unidad: 'hr',
        categoria: 'Albañilería',
        precioUnitarioUSD: 2.50,
        precioUnitarioBs: 162.50,
        categoriaLaboral: 'Ayudante',
        especialidad: 'Construcción',
        tabulador: 'Nivel I',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l004',
        codigo: 'L004',
        tipo: 'MANO_OBRA',
        descripcion: 'Electricista especializado',
        unidad: 'hr',
        categoria: 'Electricidad',
        precioUnitarioUSD: 5.00,
        precioUnitarioBs: 325.00,
        categoriaLaboral: 'Técnico',
        especialidad: 'Instalaciones eléctricas',
        tabulador: 'Nivel IV',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l005',
        codigo: 'L005',
        tipo: 'MANO_OBRA',
        descripcion: 'Ayudante de electricista',
        unidad: 'hr',
        categoria: 'Electricidad',
        precioUnitarioUSD: 2.80,
        precioUnitarioBs: 182.00,
        categoriaLaboral: 'Ayudante',
        especialidad: 'Electricidad',
        tabulador: 'Nivel I',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l006',
        codigo: 'L006',
        tipo: 'MANO_OBRA',
        descripcion: 'Plomero especializado',
        unidad: 'hr',
        categoria: 'Plomería',
        precioUnitarioUSD: 4.80,
        precioUnitarioBs: 312.00,
        categoriaLaboral: 'Técnico',
        especialidad: 'Instalaciones sanitarias',
        tabulador: 'Nivel IV',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l007',
        codigo: 'L007',
        tipo: 'MANO_OBRA',
        descripcion: 'Carpintero',
        unidad: 'hr',
        categoria: 'Carpintería',
        precioUnitarioUSD: 4.20,
        precioUnitarioBs: 273.00,
        categoriaLaboral: 'Obrero',
        especialidad: 'Carpintería',
        tabulador: 'Nivel III',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l008',
        codigo: 'L008',
        tipo: 'MANO_OBRA',
        descripcion: 'Herrero',
        unidad: 'hr',
        categoria: 'Herrería',
        precioUnitarioUSD: 4.50,
        precioUnitarioBs: 292.50,
        categoriaLaboral: 'Obrero',
        especialidad: 'Herrería',
        tabulador: 'Nivel III',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l009',
        codigo: 'L009',
        tipo: 'MANO_OBRA',
        descripcion: 'Pintor',
        unidad: 'hr',
        categoria: 'Pintura',
        precioUnitarioUSD: 3.80,
        precioUnitarioBs: 247.00,
        categoriaLaboral: 'Obrero',
        especialidad: 'Pintura',
        tabulador: 'Nivel II',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    },
    {
        id: 'ref-l010',
        codigo: 'L010',
        tipo: 'MANO_OBRA',
        descripcion: 'Ceramista',
        unidad: 'hr',
        categoria: 'Acabados',
        precioUnitarioUSD: 4.00,
        precioUnitarioBs: 260.00,
        categoriaLaboral: 'Obrero',
        especialidad: 'Cerámica y porcelanato',
        tabulador: 'Nivel III',
        activo: true,
        tasaCambioReferencia: 65.00,
        fechaActualizacion: new Date('2026-02-12')
    }
];

/**
 * Función helper para obtener estadísticas de la base de datos de referencia
 */
export function getInsumosReferenceStats() {
    return {
        total: INSUMOS_REFERENCE_DATABASE.length,
        materiales: INSUMOS_REFERENCE_DATABASE.filter(i => i.tipo === 'MATERIAL').length,
        equipos: INSUMOS_REFERENCE_DATABASE.filter(i => i.tipo === 'EQUIPO').length,
        manoDeObra: INSUMOS_REFERENCE_DATABASE.filter(i => i.tipo === 'MANO_OBRA').length,
        metadata: INSUMOS_REFERENCE_METADATA
    };
}

/**
 * Función helper para buscar en la base de datos de referencia
 */
export function searchInsumosReference(query: string, tipo?: string, categoria?: string): InsumoMaestro[] {
    return INSUMOS_REFERENCE_DATABASE.filter(insumo => {
        const matchesQuery = query === '' ||
            insumo.descripcion.toLowerCase().includes(query.toLowerCase()) ||
            insumo.codigo.toLowerCase().includes(query.toLowerCase());

        const matchesTipo = !tipo || insumo.tipo === tipo;
        const matchesCategoria = !categoria || insumo.categoria === categoria;

        return matchesQuery && matchesTipo && matchesCategoria;
    });
}
