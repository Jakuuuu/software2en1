// ============================================
// TABULADORES Y BASES DE DATOS
// Datos de referencia para cumplimiento legal
// ============================================

// ============================================
// TABULADORES DE MANO DE OBRA
// ============================================

export interface LaborTabulador {
    id: string;
    category: string;
    specialty: string;
    minDailyRate: number;
    maxDailyRate: number;
    currency: 'USD' | 'VES';
    source: 'CIV' | 'CONVENCION_COLECTIVA' | 'MINISTERIO_TRABAJO';
    effectiveDate: Date;
    region?: string;
}

/**
 * Tabuladores CIV 2026 - Colegio de Ingenieros de Venezuela
 * Fuente: Tabulador CIV actualizado enero 2026
 */
export const TABULADORES_CIV_2026: LaborTabulador[] = [
    // Profesionales
    {
        id: 'civ-maestro-obra',
        category: 'Profesional',
        specialty: 'Maestro de Obra',
        minDailyRate: 18,
        maxDailyRate: 25,
        currency: 'USD',
        source: 'CIV',
        effectiveDate: new Date('2026-01-01')
    },
    {
        id: 'civ-ingeniero-residente',
        category: 'Profesional',
        specialty: 'Ingeniero Residente',
        minDailyRate: 35,
        maxDailyRate: 50,
        currency: 'USD',
        source: 'CIV',
        effectiveDate: new Date('2026-01-01')
    },

    // Técnicos
    {
        id: 'civ-operador-equipo-a',
        category: 'Técnico',
        specialty: 'Operador Equipo Pesado Cat. A',
        minDailyRate: 20,
        maxDailyRate: 28,
        currency: 'USD',
        source: 'CIV',
        effectiveDate: new Date('2026-01-01')
    },
    {
        id: 'civ-operador-equipo-b',
        category: 'Técnico',
        specialty: 'Operador Equipo Pesado Cat. B',
        minDailyRate: 16,
        maxDailyRate: 22,
        currency: 'USD',
        source: 'CIV',
        effectiveDate: new Date('2026-01-01')
    },

    // Obreros Especializados
    {
        id: 'conv-oficial-albanil',
        category: 'Obrero',
        specialty: 'Oficial Albañil',
        minDailyRate: 12,
        maxDailyRate: 16,
        currency: 'USD',
        source: 'CONVENCION_COLECTIVA',
        effectiveDate: new Date('2026-01-01')
    },
    {
        id: 'conv-oficial-electricista',
        category: 'Obrero',
        specialty: 'Oficial Electricista',
        minDailyRate: 15,
        maxDailyRate: 20,
        currency: 'USD',
        source: 'CONVENCION_COLECTIVA',
        effectiveDate: new Date('2026-01-01')
    },
    {
        id: 'conv-oficial-plomero',
        category: 'Obrero',
        specialty: 'Oficial Plomero',
        minDailyRate: 14,
        maxDailyRate: 18,
        currency: 'USD',
        source: 'CONVENCION_COLECTIVA',
        effectiveDate: new Date('2026-01-01')
    },
    {
        id: 'conv-oficial-carpintero',
        category: 'Obrero',
        specialty: 'Oficial Carpintero',
        minDailyRate: 13,
        maxDailyRate: 17,
        currency: 'USD',
        source: 'CONVENCION_COLECTIVA',
        effectiveDate: new Date('2026-01-01')
    },
    {
        id: 'conv-oficial-herrero',
        category: 'Obrero',
        specialty: 'Oficial Herrero',
        minDailyRate: 13,
        maxDailyRate: 17,
        currency: 'USD',
        source: 'CONVENCION_COLECTIVA',
        effectiveDate: new Date('2026-01-01')
    },
    {
        id: 'conv-oficial-pintor',
        category: 'Obrero',
        specialty: 'Oficial Pintor',
        minDailyRate: 11,
        maxDailyRate: 15,
        currency: 'USD',
        source: 'CONVENCION_COLECTIVA',
        effectiveDate: new Date('2026-01-01')
    },

    // Ayudantes
    {
        id: 'conv-ayudante-general',
        category: 'Ayudante',
        specialty: 'Ayudante General',
        minDailyRate: 8,
        maxDailyRate: 10,
        currency: 'USD',
        source: 'CONVENCION_COLECTIVA',
        effectiveDate: new Date('2026-01-01')
    },
    {
        id: 'conv-ayudante-albanil',
        category: 'Ayudante',
        specialty: 'Ayudante de Albañil',
        minDailyRate: 9,
        maxDailyRate: 11,
        currency: 'USD',
        source: 'CONVENCION_COLECTIVA',
        effectiveDate: new Date('2026-01-01')
    }
];

// ============================================
// FACTORES DE DESPERDICIO POR MATERIAL
// ============================================

/**
 * Factores de desperdicio según COVENIN 2250-2000
 * Basados en prácticas de construcción venezolanas
 */
export const WASTE_FACTORS_BY_MATERIAL: Record<string, number> = {
    // Mampostería
    'bloques': 0.05,
    'bloque': 0.05,
    'ladrillo': 0.05,
    'ladrillos': 0.05,

    // Revestimientos
    'ceramica': 0.10,
    'cerámica': 0.10,
    'porcelanato': 0.10,
    'baldosa': 0.10,
    'baldosas': 0.10,
    'azulejo': 0.10,
    'azulejos': 0.10,

    // Pintura
    'pintura': 0.07,
    'esmalte': 0.07,
    'latex': 0.07,
    'látex': 0.07,

    // Agregados
    'arena': 0.15,
    'piedra': 0.15,
    'grava': 0.15,
    'gravilla': 0.15,
    'ripio': 0.15,

    // Cemento y morteros
    'cemento': 0.05,
    'mortero': 0.05,
    'concreto': 0.05,

    // Acero
    'acero': 0.08,
    'cabilla': 0.08,
    'varilla': 0.08,
    'alambre': 0.10,

    // Madera
    'madera': 0.10,
    'tablón': 0.10,
    'tablon': 0.10,
    'tabla': 0.10,

    // Instalaciones
    'tuberia': 0.03,
    'tubería': 0.03,
    'tubo': 0.03,
    'cable': 0.05,
    'conductor': 0.05,

    // Default
    'default': 0.05
};

/**
 * Obtener factor de desperdicio sugerido basado en descripción
 */
export const getWasteFactorByDescription = (description: string): number => {
    const desc = description.toLowerCase();

    for (const [material, factor] of Object.entries(WASTE_FACTORS_BY_MATERIAL)) {
        if (desc.includes(material)) {
            return factor;
        }
    }

    return WASTE_FACTORS_BY_MATERIAL.default;
};

// ============================================
// VIDA ÚTIL DE EQUIPOS (en horas)
// ============================================

/**
 * Vida útil de equipos según CIV y fabricantes
 * Usado para cálculo de COP
 */
export const EQUIPMENT_USEFUL_LIFE: Record<string, number> = {
    // Equipos pesados
    'retroexcavadora': 10000,
    'excavadora': 12000,
    'bulldozer': 15000,
    'cargador': 12000,
    'motoniveladora': 15000,
    'rodillo': 10000,
    'compactador': 8000,

    // Transporte
    'camion': 12000,
    'camión': 12000,
    'volteo': 12000,
    'cisterna': 10000,

    // Equipos medianos
    'mezcladora': 8000,
    'concretera': 8000,
    'vibrador': 5000,
    'cortadora': 5000,
    'dobladora': 8000,

    // Herramientas eléctricas
    'taladro': 3000,
    'esmeril': 3000,
    'sierra': 4000,
    'compresor': 6000,

    // Default
    'default': 8000
};

/**
 * Obtener vida útil sugerida basada en descripción
 */
export const getUsefulLifeByDescription = (description: string): number => {
    const desc = description.toLowerCase();

    for (const [equipment, hours] of Object.entries(EQUIPMENT_USEFUL_LIFE)) {
        if (desc.includes(equipment)) {
            return hours;
        }
    }

    return EQUIPMENT_USEFUL_LIFE.default;
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Buscar tabulador para mano de obra
 */
export const getTabuladorForLabor = (
    category: string,
    specialty?: string
): LaborTabulador | null => {
    if (!specialty) {
        // Retornar el primero de la categoría
        return TABULADORES_CIV_2026.find(t => t.category === category) || null;
    }

    // Buscar por especialidad (case insensitive)
    const specialtyLower = specialty.toLowerCase();
    return TABULADORES_CIV_2026.find(t =>
        t.category === category &&
        t.specialty.toLowerCase().includes(specialtyLower)
    ) || null;
};

/**
 * Obtener tasa de cambio BCV (mock - en producción conectar a API)
 */
export const getBCVExchangeRate = (): number => {
    // TODO: Integrar con API del BCV
    // Por ahora retornar valor de referencia
    return 36.50; // Bs/USD
};

/**
 * Obtener valor de Cesta Ticket según BCV (mock)
 */
export const getCestaTicketValue = (): number => {
    // TODO: Integrar con resolución oficial
    // Valor de referencia 2026
    return 130; // Bs/día
};
