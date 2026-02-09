export const glossary = {
    APU: {
        term: "Análisis de Precio Unitario",
        definition: "Desglose detallado de los costos que componen el precio de una partida de obra.",
        example: "Para construir 1m² de pared se necesitan: materiales (bloques, cemento), equipos (mezcladora) y mano de obra (albañil)."
    },
    PARTIDA: {
        term: "Partida",
        definition: "Unidad de trabajo específica dentro de un proyecto de construcción.",
        example: "Ejemplo: 'Construcción de pared de bloques de 15cm' es una partida."
    },
    VALUACION: {
        term: "Valuación",
        definition: "Documento que certifica el avance de obra ejecutado en un periodo determinado para gestionar el pago correspondiente.",
        example: "Si en 15 días se construyeron 50m² de pared de los 100m² contratados, la valuación será por esos 50m²."
    },
    AMORTIZACION: {
        term: "Amortización de Anticipo",
        definition: "Descuento proporcional del anticipo recibido al inicio del contrato, aplicado en cada valuación.",
        example: "Si recibiste 10% de anticipo ($10,000 de $100,000), se descuenta ese porcentaje de cada valuación hasta completar los $10,000."
    },
    RETENCION: {
        term: "Retención de Fiel Cumplimiento",
        definition: "Porcentaje del pago que se retiene como garantía de que la obra se completará correctamente.",
        example: "Con 5% de retención, si la valuación es $5,000, se retienen $250 y se pagan $4,750."
    },
    ACUMULADO: {
        term: "Acumulado",
        definition: "Total ejecutado hasta la fecha, sumando todas las valuaciones anteriores más la actual.",
        example: "Si en valuación #1 ejecutaste $10,000 y en #2 ejecutas $8,000, el acumulado es $18,000."
    },
    CONTRATADO: {
        term: "Monto Contratado",
        definition: "Valor total acordado en el contrato para una partida o proyecto completo.",
        example: "Si se contrató construir 100m² de pared a $50/m², el monto contratado es $5,000."
    },
    IVA: {
        term: "IVA (Impuesto al Valor Agregado)",
        definition: "Impuesto que se aplica sobre el subtotal de la valuación.",
        example: "Con IVA del 16% sobre una valuación de $10,000, se agregan $1,600, totalizando $11,600."
    },
    MATERIALES: {
        term: "Materiales",
        definition: "Insumos físicos necesarios para ejecutar una partida (cemento, bloques, acero, etc.).",
        example: "Para 1m² de pared: 12.5 bloques, 0.02m³ de mortero, 1.5kg de acero."
    },
    EQUIPOS: {
        term: "Equipos",
        definition: "Maquinaria y herramientas necesarias para ejecutar la partida.",
        example: "Mezcladora de concreto, vibrador, herramientas menores."
    },
    MANO_DE_OBRA: {
        term: "Mano de Obra",
        definition: "Recurso humano necesario para ejecutar la partida.",
        example: "1 albañil de 1ra + 1 ayudante por 1.5 horas."
    },
    COSTO_DIRECTO: {
        term: "Costo Directo Unitario",
        definition: "Suma de materiales + equipos + mano de obra para ejecutar una unidad de la partida.",
        example: "Si materiales=$15, equipos=$2, mano de obra=$12, el costo directo es $29/m²."
    }
};

export type GlossaryKey = keyof typeof glossary;
