
import { Partida, Resource, MaterialResource, EquipmentResource, LaborResource } from '@/types';

// Helper to create IDs
const id = () => Math.random().toString(36).substr(2, 9);

export interface PartidaReference {
    id: string;
    code: string;
    description: string;
    unit: string;
    category: string;
    apu: {
        materials: MaterialResource[];
        equipment: EquipmentResource[];
        labor: LaborResource[];
    };
}

export const PARTIDAS_REFERENCE_DATABASE: PartidaReference[] = [
    // ============================================
    // ALBAÑILERÍA
    // ============================================
    {
        id: 'ref-par-001',
        code: 'E-411.110.120',
        description: 'Construcción de paredes de bloques de arcilla, e=15cm, acabado corriente.',
        unit: 'm2',
        category: 'Albañilería',
        apu: {
            materials: [
                {
                    id: id(),
                    description: 'Bloque de arcilla 15x20x40 cm',
                    unit: 'unidad',
                    quantity: 12.5,
                    unitPrice: 0.85, // USD
                    total: 10.625,
                    wasteFactor: 0.05,
                    effectiveQuantity: 13.125,
                    priceSource: 'MARKET'
                },
                {
                    id: id(),
                    description: 'Mortero de pega (Cemento/Arena)',
                    unit: 'm3',
                    quantity: 0.02,
                    unitPrice: 120.00,
                    total: 2.4,
                    wasteFactor: 0.10,
                    effectiveQuantity: 0.022,
                    priceSource: 'MARKET'
                }
            ],
            equipment: [
                {
                    id: id(),
                    description: 'Herramientas menores',
                    unit: '%MO',
                    quantity: 1,
                    unitPrice: 0, // Calculated as % of Labor usually, but here fixed or placeholder
                    total: 0.50, // Placeholder
                    ownershipType: 'OWNED'
                },
                {
                    id: id(),
                    description: 'Andamio metálico',
                    unit: 'pieza/día',
                    quantity: 0.1, // Fractional use per m2
                    unitPrice: 2.00,
                    total: 0.20,
                    ownershipType: 'RENTED'
                }
            ],
            labor: [
                {
                    id: id(),
                    description: 'Albañil de 1ra',
                    unit: 'hr',
                    quantity: 0.8,
                    unitPrice: 3.50, // Base hourly rate
                    total: 2.80,
                    category: 'Obrero',
                    specialty: 'Albañilería'
                },
                {
                    id: id(),
                    description: 'Ayudante',
                    unit: 'hr',
                    quantity: 0.8,
                    unitPrice: 2.50,
                    total: 2.00,
                    category: 'Ayudante',
                    specialty: 'Albañilería'
                }
            ]
        }
    },
    {
        id: 'ref-par-002',
        code: 'E-412.110.120',
        description: 'Revestimiento de paredes con friso liso base y acabado, e=1.5cm.',
        unit: 'm2',
        category: 'Albañilería',
        apu: {
            materials: [
                {
                    id: id(),
                    description: 'Mortero base (Cemento/Arena/Cal)',
                    unit: 'm3',
                    quantity: 0.018,
                    unitPrice: 110.00,
                    total: 1.98,
                    wasteFactor: 0.15,
                    effectiveQuantity: 0.0207,
                    priceSource: 'MARKET'
                },
                {
                    id: id(),
                    description: 'Pasta profesional (acabado liso)',
                    unit: 'gal',
                    quantity: 0.05,
                    unitPrice: 25.00,
                    total: 1.25,
                    wasteFactor: 0.05,
                    effectiveQuantity: 0.0525,
                    priceSource: 'MARKET'
                }
            ],
            equipment: [
                {
                    id: id(),
                    description: 'Herramientas menores',
                    unit: '%MO',
                    quantity: 1,
                    unitPrice: 0,
                    total: 0.30,
                    ownershipType: 'OWNED'
                },
                {
                    id: id(),
                    description: 'Andamio',
                    unit: 'día',
                    quantity: 0.05,
                    unitPrice: 2.00,
                    total: 0.10,
                    ownershipType: 'RENTED'
                }
            ],
            labor: [
                {
                    id: id(),
                    description: 'Albañil',
                    unit: 'hr',
                    quantity: 0.60,
                    unitPrice: 3.50,
                    total: 2.10,
                    category: 'Obrero'
                },
                {
                    id: id(),
                    description: 'Ayudante',
                    unit: 'hr',
                    quantity: 0.60,
                    unitPrice: 2.50,
                    total: 1.50,
                    category: 'Ayudante'
                }
            ]
        }
    },

    // ============================================
    // PINTURA
    // ============================================
    {
        id: 'ref-par-003',
        code: 'E-421.110.120',
        description: 'Pintura de caucho interior en paredes, incl. fondo antialcalino.',
        unit: 'm2',
        category: 'Pintura',
        apu: {
            materials: [
                {
                    id: id(),
                    description: 'Fondo antialcalino',
                    unit: 'gal',
                    quantity: 0.025, // ~40m2/gal
                    unitPrice: 28.00,
                    total: 0.70,
                    wasteFactor: 0.05,
                    effectiveQuantity: 0.02625,
                    priceSource: 'MARKET'
                },
                {
                    id: id(),
                    description: 'Pintura Caucho Clase A (Mate)',
                    unit: 'gal',
                    quantity: 0.035, // ~30m2/gal (2 manos)
                    unitPrice: 35.00,
                    total: 1.225,
                    wasteFactor: 0.05,
                    effectiveQuantity: 0.03675,
                    priceSource: 'MARKET'
                },
                {
                    id: id(),
                    description: 'Lija #120',
                    unit: 'pliego',
                    quantity: 0.1,
                    unitPrice: 0.50,
                    total: 0.05,
                    wasteFactor: 0,
                    effectiveQuantity: 0.1,
                    priceSource: 'MARKET'
                }
            ],
            equipment: [
                {
                    id: id(),
                    description: 'Kit de pintura (Rodillo, brocha, bandeja)',
                    unit: 'kit',
                    quantity: 0.05, // Vida útil estimada
                    unitPrice: 15.00,
                    total: 0.75,
                    ownershipType: 'OWNED'
                },
                {
                    id: id(),
                    description: 'Andamio (si altura > 3m)',
                    unit: 'día',
                    quantity: 0.02,
                    unitPrice: 2.00,
                    total: 0.04,
                    ownershipType: 'RENTED'
                }
            ],
            labor: [
                {
                    id: id(),
                    description: 'Pintor',
                    unit: 'hr',
                    quantity: 0.30,
                    unitPrice: 3.50,
                    total: 1.05,
                    category: 'Obrero',
                    specialty: 'Pintura'
                },
                {
                    id: id(),
                    description: 'Ayudante',
                    unit: 'hr',
                    quantity: 0.15,
                    unitPrice: 2.50,
                    total: 0.375,
                    category: 'Ayudante'
                }
            ]
        }
    },

    // ============================================
    // ELECTRICIDAD
    // ============================================
    {
        id: 'ref-par-004',
        code: 'E-511.110.000',
        description: 'Punto de iluminación (salida de techo) incl. tubería y cableado standard.',
        unit: 'pto',
        category: 'Electricidad',
        apu: {
            materials: [
                {
                    id: id(),
                    description: 'Cajetín octogonal 4x4"',
                    unit: 'pza',
                    quantity: 1,
                    unitPrice: 0.80,
                    total: 0.80,
                    wasteFactor: 0,
                    effectiveQuantity: 1,
                    priceSource: 'MARKET'
                },
                {
                    id: id(),
                    description: 'Tubería EMT 1/2"',
                    unit: 'tubo',
                    quantity: 0.5, // 1.5m approx
                    unitPrice: 4.50,
                    total: 2.25,
                    wasteFactor: 0.10,
                    effectiveQuantity: 0.55,
                    priceSource: 'MARKET'
                },
                {
                    id: id(),
                    description: 'Cable THW #12 AWG',
                    unit: 'm',
                    quantity: 8,
                    unitPrice: 0.60,
                    total: 4.80,
                    wasteFactor: 0.10,
                    effectiveQuantity: 8.8,
                    priceSource: 'MARKET'
                },
                {
                    id: id(),
                    description: 'Conectores EMT 1/2"',
                    unit: 'pza',
                    quantity: 2,
                    unitPrice: 0.30,
                    total: 0.60,
                    wasteFactor: 0,
                    effectiveQuantity: 2,
                    priceSource: 'MARKET'
                }
            ],
            equipment: [
                {
                    id: id(),
                    description: 'Herramientas de electricista',
                    unit: '%MO',
                    quantity: 1,
                    unitPrice: 0,
                    total: 0.50,
                    ownershipType: 'OWNED'
                }
            ],
            labor: [
                {
                    id: id(),
                    description: 'Electricista',
                    unit: 'hr',
                    quantity: 1.5,
                    unitPrice: 4.50,
                    total: 6.75,
                    category: 'Técnico',
                    specialty: 'Electricidad'
                },
                {
                    id: id(),
                    description: 'Ayudante',
                    unit: 'hr',
                    quantity: 1.5,
                    unitPrice: 2.50,
                    total: 3.75,
                    category: 'Ayudante'
                }
            ]
        }
    }
];

export const REFERENCE_CATEGORIES = Array.from(new Set(PARTIDAS_REFERENCE_DATABASE.map(p => p.category)));
