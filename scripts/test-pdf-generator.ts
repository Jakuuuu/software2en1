
import { generateAPUPDF } from '../src/utils/apu-pdf-generator';
import { APUResponse } from '../src/types';

// Mock Data
const mockAPU: APUResponse = {
    codigo_covenin: "05.02.01.001",
    descripcion: "Excavación a mano en material tipo II, incluyendo transporte hasta 50m.",
    unidad: "m³",
    analisis_costos: {
        materiales: [
            { descripcion: "Cemento Gris", unidad: "sacos", cantidad: 10, precio_unitario: 8.5, total: 85 },
            { descripcion: "Arena Lavada", unidad: "m3", cantidad: 2, precio_unitario: 30, total: 60 }
        ],
        equipos: [
            { descripcion: "Mezcladora 2HP", unidad: "dia", cantidad: 1, precio_unitario: 25, total: 25 }
        ],
        mano_obra: [
            { descripcion: "Albañil de 1ra", cantidad: 8, precio_unitario: 15, total: 120 },
            { descripcion: "Ayudante", cantidad: 8, precio_unitario: 10, total: 80 }
        ]
    },
    costos_directos: {
        total_materiales: 145,
        total_equipos: 25,
        total_mano_obra: 200,
        subtotal_directo: 370
    },
    incidencias: {
        laborales: [
            { concepto: "Prestaciones Sociales", porcentaje: 16.67, monto: 33.34 },
            { concepto: "Vacaciones", porcentaje: 10.42, monto: 20.84 },
            { concepto: "Bono Alimentación", porcentaje: 5, monto: 10 }
        ],
        total_incidencias: 64.18
    },
    resumen: {
        costo_directo_total: 434.18,
        costos_administrativos: 43.42,
        utilidad: 43.42,
        precio_unitario: 521.02
    },
    certificacion_legal: {
        marco_normativo: ["Decreto 1.399/2026", "COVENIN 2250-2000", "LOTTT"],
        fecha: "2024-05-15"
    }
};

// Polyfill for Node environment if needed, or just try running it.
// jsPDF save() in Node might throw or do nothing.
// We will try running it.

try {
    console.log("Generating Government APU PDF...");
    generateAPUPDF(mockAPU, 'GUBERNAMENTAL');
    console.log("✅ Government APU Generated.");
} catch (error) {
    console.error("Error generating PDF:", error);
}
