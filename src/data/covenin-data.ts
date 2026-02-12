// database/partidas-covenin.js
export const PARTIDAS_COVENIN = {
    '05.02.01.001': {
        codigo: '05.02.01.001',
        descripcion: 'Excavación a mano en material tipo II',
        unidad: 'm³',
        norma_covenin: 'COVENIN 2826-2003',
        rendimiento: 4.0, // m³/jornada

        mano_obra: {
            cuadrilla: '1 Cabo + 4 Obreros',
            horas_hombre: 10.0
        }
    }
    // ... más partidas
};

// database/incidencias-laborales.js
export const INCIDENCIAS_2026 = [
    {
        concepto: 'Prestaciones sociales',
        porcentaje: 16.67,
        base_legal: 'LOTTT Art. 142',
        obligatorio_publico: true
    },
    {
        concepto: 'Utilidades',
        porcentaje: 8.33,
        base_legal: 'LOTTT Art. 131',
        obligatorio_publico: true
    },
    {
        concepto: 'Vacaciones',
        porcentaje: 10.42,
        base_legal: 'LOTTT Art. 190, 192',
        obligatorio_publico: true
    },
    {
        concepto: 'IVSS',
        porcentaje: 10.00,
        base_legal: 'Ley SS 2026',
        obligatorio_publico: true
    },
    {
        concepto: 'INCES',
        porcentaje: 2.00,
        base_legal: 'INCES',
        obligatorio_publico: true
    },
    {
        concepto: 'LPH',
        porcentaje: 2.00,
        base_legal: 'LPH',
        obligatorio_publico: true
    },
    {
        concepto: 'Protección Pensiones',
        porcentaje: 1.50,
        base_legal: 'Ley Protección Pensiones',
        obligatorio_publico: true
    },
    {
        concepto: 'Bono alimentación',
        porcentaje: 5.00,
        base_legal: 'Bono Alimentación',
        obligatorio_publico: true
    }
];

// database/plantillas.js
export const PLANTILLA_PIE_PAGINA_GUBERNAMENTAL = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CERTIFICACIÓN LEGAL

Marco normativo aplicado:
- Decreto N° 1.399 (Feb 2026) - Ley de Contrataciones Públicas
- COVENIN 2250-2000, 2826-2003
- LOTTT + Ley Seguro Social 2026

Incidencias laborales (55.92%):
Todas obligatorias según normativa venezolana vigente

Este presupuesto cumple con la normativa para
presentación ante organismos gubernamentales.

Fecha: {fecha}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
