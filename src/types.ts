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

// ============================================
// MATERIAL RESOURCE (with waste factor)
// ============================================

export interface MaterialResource extends Resource {
    wasteFactor?: number; // % de desperdicio (ej: 0.05 = 5%)
    effectiveQuantity?: number; // quantity * (1 + wasteFactor)
    priceSource?: 'QUOTATION' | 'DATALAING' | 'MAPREX' | 'CIV' | 'MARKET' | 'MANUAL';
    quotationNumber?: string;
    quotationDate?: Date;
    supplierRIF?: string;
}

// ============================================
// EQUIPMENT RESOURCE (with COP)
// ============================================

export interface EquipmentResource extends Resource {
    ownershipType?: 'RENTED' | 'OWNED';
    // Para equipos propios - COP (Costo de Posesión y Operación)
    acquisitionValue?: number;
    residualValue?: number;
    usefulLifeHours?: number;
    interestRate?: number;
    insuranceRate?: number;
    maintenanceCostPerHour?: number;
    operationCostPerHour?: number;
    cop?: number; // COP calculado
}

// ============================================
// LABOR RESOURCE (with complete FCAS)
// ============================================

export interface LaborResource extends Resource {
    category: 'Profesional' | 'Técnico' | 'Obrero' | 'Ayudante';
    specialty?: string; // ej: "Albañil", "Electricista", "Plomero"
    dailyRate?: number;
    hoursPerUnit?: number;

    // Tabulador
    tabulatorSource?: 'CIV' | 'CONVENCION_COLECTIVA' | 'CUSTOM';
    tabulatorDate?: Date;

    // FCAS completo (Factor de Costos Asociados al Salario)
    fcas?: {
        workedDaysPerYear: number; // 260 días
        paidDaysPerYear: number; // 365 días
        sso: number; // 13.5% - Seguro Social Obligatorio
        lph: number; // 3% - Ley Política Habitacional
        banavih: number; // 1% - Banavih
        inces: number; // 2% - INCES
        vacations: number; // 5.77% - Vacaciones
        vacationBonus: number; // Variable - Bono vacacional
        utilities: number; // 5.77% - Utilidades
        yearEndBonus: number; // Variable - Bono de fin de año
        cestaTicket: number; // Bs/día - Cesta Ticket
        eppDotation: number; // Dotación EPP
        paidHolidays: number; // 4.62% - Días feriados
        severance: number; // Antigüedad
        totalFactor: number; // Factor total (1.485 - 1.65)
        totalCost: number; // Costo total con FCAS
    };

    // Legacy compatibility
    socialCharges?: {
        sso: number;
        lph: number;
        inces: number;
        vacations: number;
        utilities: number;
        total: number;
    };
}

// ============================================
// INSUMO MAESTRO (Master Database)
// ============================================

export type InsumoTipo = 'MATERIAL' | 'EQUIPO' | 'MANO_OBRA';

export interface InsumoMaestro {
    id: string;
    codigo: string; // Código interno (ej: "M001", "E015", "L003")
    descripcion: string;
    unidad: string;
    tipo: InsumoTipo;
    categoria: string; // "Concreto", "Herramientas", "Albañilería", etc.

    // Precios duales
    precioUnitarioBs: number; // Precio en Bolívares
    precioUnitarioUSD: number; // Precio en USD
    tasaCambioReferencia: number; // Tasa usada para conversión
    fechaActualizacion: Date;

    // Proveedor/Fuente
    proveedor?: string;
    fuentePrecio?: 'BCV' | 'PROVEEDOR' | 'TABULADOR_CIV' | 'MERCADO' | 'MANUAL';

    // Específicos por tipo de insumo
    // Para materiales
    wasteFactorDefault?: number; // Factor de desperdicio por defecto

    // Para equipos
    ownershipTypeDefault?: 'OWNED' | 'RENTED';
    usefulLifeHours?: number; // Vida útil en horas

    // Para mano de obra
    categoriaLaboral?: 'Profesional' | 'Técnico' | 'Obrero' | 'Ayudante';
    especialidad?: string;
    tabulador?: string; // "CIV 2026", "Convención Colectiva"

    // Metadata
    activo: boolean; // Si está activo para uso
    notas?: string;
}

// Configuración de tasa de cambio
export interface TasaCambio {
    valor: number; // Bs por USD
    fecha: Date;
    fuente: 'BCV' | 'MANUAL';
}

// Base de datos de insumos
export interface InsumosDatabase {
    insumos: InsumoMaestro[];
    categorias: {
        materiales: string[];
        equipos: string[];
        manoDeObra: string[];
    };
    tasaCambio: TasaCambio;
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

    // ============================================
    // NUEVOS CAMPOS PARA FCAS COMPLETO
    // ============================================

    // Días trabajados vs pagados
    workedDaysPerYear: number; // Default: 260 días
    paidDaysPerYear: number; // Default: 365 días

    // Cargas adicionales
    banavihRate: number; // 1% - Banavih
    cestaTicketDaily: number; // Bs/día - Cesta Ticket según BCV
    eppDotationYearly: number; // Costo anual dotación EPP
    paidHolidaysPerYear: number; // 12 días feriados
    vacationBonusDays: number; // 7 días + 1/12
    yearEndBonusDays: number; // 15 días mínimo
    severanceDaysPerYear: number; // 5 días/año antigüedad

    // ============================================
    // MODO GUBERNAMENTAL Y VALIDACIONES
    // ============================================

    isGovernmentProject: boolean; // Proyecto gubernamental
    requirePriceValidation: boolean; // Validar fuentes de precios
    requireWasteFactors: boolean; // Exigir factores de desperdicio
    requireCOPCalculation: boolean; // Exigir COP para equipos propios
    requireTabulators: boolean; // Usar tabuladores oficiales
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
        mano_obra: {
            descripcion: string;
            cantidad: number;
            precio_unitario: number;
            total: number;
            fcas_factor?: number; // Factor asociado al salario
        }[];
    };
    costos_directos: {
        total_materiales: number;
        total_equipos: number;
        total_mano_obra: number;
        total_fcas?: number; // Total calculado de FCAS
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
