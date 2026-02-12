// ============================================
// RESOURCE TYPES
// ============================================

export interface Resource {
    id?: string;
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number; // In project currency
    unitPriceUSD?: number; // For dual currency support
    total: number;
    supplier?: string;
    lastUpdated?: Date;
}

export interface LaborResource extends Resource {
    category: 'Profesional' | 'Técnico' | 'Obrero' | 'Ayudante';
    dailyRate?: number;
    hoursPerUnit?: number;
    socialCharges?: {
        sso: number; // Seguro Social Obligatorio
        lph: number; // Ley de Política Habitacional
        inces: number; // INCES
        vacations: number;
        utilities: number;
        total: number;
    };
}

// ============================================
// APU (Análisis de Precio Unitario)
// ============================================

export interface APU {
    materials: Resource[];
    equipment: Resource[];
    labor: Resource[]; // Simplified to Resource[] for compatibility
    subtotals: {
        materials: number;
        equipment: number;
        labor: number;
    };
    legalCharges: {
        lopcymat: number; // 2% sobre materiales
        inces: number; // 2% sobre mano de obra
        sso: number; // Cargas sociales sobre M.O.
    };
    directCost: number;
    indirectCosts: {
        administration: number;
        utilities: number;
        profit: number;
        total: number;
    };
    unitPrice: number;
}

// ============================================
// PARTIDA
// ============================================

export interface Partida {
    id: string;
    projectId?: string;
    code: string; // Código COVENIN (ej: E-411.110.120)
    description: string;
    unit: string; // m2, m3, kg, etc.
    quantity: number;
    unitPrice: number;
    price?: number; // quantity * unitPrice

    // For valuations
    contracted: number;
    previousAccumulated: number;
    thisValuation: number;

    // APU Details
    apu?: APU;

    // Metadata
    createdAt?: Date;
    updatedAt?: Date;
}

// ============================================
// PROJECT TYPES
// ============================================

export type Currency = 'VES' | 'USD';
export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'archived';

export interface Client {
    name: string;
    rif: string; // RIF venezolano (J-123456789)
    address: string;
    phone?: string;
    email?: string;
}

export interface Contractor {
    name: string;
    rif: string;
    address?: string;
}

export interface Contract {
    number: string;
    date: Date;
    amount: number;
    currency: Currency;
    exchangeRate?: number; // Tasa de cambio si es USD
    startDate?: Date;
    endDate?: Date;
}

export interface ProjectLocation {
    state: string;
    city: string;
    address: string;
}

export interface ProjectDates {
    start: Date;
    estimatedEnd: Date;
    actualEnd?: Date;
}

export interface LegalConfig {
    // Venezuelan Legal Requirements
    applyLOPCYMAT: boolean; // 2% sobre materiales
    applyINCES: boolean; // 2% sobre nómina
    applySSO: boolean; // Seguro Social Obligatorio
    applyLPH: boolean; // Ley de Política Habitacional

    // Tax Rates
    ivaRate: number; // 16% actualmente
    retentionIVA: number; // 75% o 100%
    retentionISLR: number; // Según tabla (1-5%)

    // Contract Terms
    advancePayment: number; // Anticipo (%)
    applyAmortization: boolean; // Amortizar anticipo
    performanceBond: number; // Fondo de garantía (%)

    // Indirect Costs
    administrationRate: number; // % sobre costo directo
    utilitiesRate: number; // % sobre costo directo
    profitRate: number; // % sobre costo directo

    // Social Charges Rates (Venezuela)
    ssoRate: number; // 13.5% patronal
    lphRate: number; // 3%
    incesRate: number; // 2%
    vacationsRate: number; // 15%
    utilitiesRateMO: number; // 15%
}

export interface Project {
    id: string;
    name: string;
    code: string; // Código interno del proyecto

    client: Client;
    contractor: Contractor;
    contract: Contract;
    location: ProjectLocation;
    dates: ProjectDates;

    legalConfig: LegalConfig;
    status: ProjectStatus;

    // Calculated fields
    totalBudget?: number;
    totalExecuted?: number;
    progress?: number; // 0-100%

    // Metadata
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// VALUATION TYPES
// ============================================

export interface Valuation {
    id: string;
    projectId: string;
    number: number; // Valuación #1, #2, etc.
    periodStart: Date;
    periodEnd: Date;

    items: {
        partidaId: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }[];

    // Financial Summary
    grossAmount: number;
    deductions: {
        advancePayment: number;
        ivaRetention: number;
        islrRetention: number;
        guaranteeFund: number;
    };
    netAmount: number;
    currency: Currency;

    // Status
    status: 'draft' | 'submitted' | 'approved' | 'paid' | 'rejected';

    // Metadata
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// FORM INPUT TYPES
// ============================================

export interface ResourceInput {
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    supplier?: string;
}

export interface LaborInput extends ResourceInput {
    category?: 'Profesional' | 'Técnico' | 'Obrero' | 'Ayudante';
    dailyRate?: number;
    hoursPerUnit?: number;
}

export interface PartidaFormData {
    code: string;
    description: string;
    unit: string;
    quantity: number;
    materials: ResourceInput[];
    equipment: ResourceInput[];
    labor: LaborInput[]; // Simplified to ResourceInput[] for compatibility
}

export interface APUResponse {
    codigo_covenin: string;
    descripcion: string;
    unidad: string;
    analisis_costos: {
        materiales: { descripcion: string; unidad: string; cantidad: number; precio_unitario: number; total: number }[];
        equipos: { descripcion: string; unidad: string; cantidad: number; precio_unitario: number; total: number }[];
        mano_obra: { descripcion: string; cantidad: number; precio_unitario: number; total: number }[];
    };
    costos_directos: {
        total_materiales: number;
        total_equipos: number;
        total_mano_obra: number;
        subtotal_directo: number;
    };
    incidencias: {
        laborales: { concepto: string; porcentaje: number; monto: number; base_legal?: string }[];
        total_incidencias: number;
    };
    resumen: {
        costo_directo_total: number;
        costos_administrativos: number;
        utilidad: number;
        precio_unitario: number;
    };
    certificacion_legal?: {
        marco_normativo: string[];
        fecha: string;
    };
}
