
import { construirPromptDinamico } from '../src/utils/gemini-client';
import { PARTIDAS_COVENIN } from '../src/data/covenin-data';
import { PartidaFormData, APUResponse } from '../src/types';

// Mock data based on PARTIDAS_COVENIN
const partidaKey = Object.keys(PARTIDAS_COVENIN)[0];
const coveninItem = PARTIDAS_COVENIN[partidaKey as keyof typeof PARTIDAS_COVENIN];

const mockPartida: PartidaFormData = {
    code: coveninItem.codigo,
    description: coveninItem.descripcion,
    unit: coveninItem.unidad,
    quantity: 100,
    materials: [
        { description: 'Material Prueba 1', unit: 'kg', quantity: 10, unitPrice: 5 },
        { description: 'Material Prueba 2', unit: 'm', quantity: 5, unitPrice: 2 }
    ],
    equipment: [
        { description: 'Equipo Prueba 1', unit: 'hr', quantity: 8, unitPrice: 20 }
    ],
    labor: [
        { description: 'Obrero', unit: 'hr', quantity: 10, unitPrice: 10, category: 'Obrero' }
    ]
};

console.log("--- PROMPT FOR GOVERNMENT CLIENT (GEMINI) ---");
const promptGubernamental = construirPromptDinamico(mockPartida, 'GUBERNAMENTAL');
console.log(promptGubernamental);

console.log("\n\n--- TESTING FULL GENERATION (GOVERNMENT) ---");
import { generarAPU } from '../src/utils/gemini-client';

async function runTest() {
    try {
        console.log("Generando APU para cliente GUBERNAMENTAL...");
        const apu = await generarAPU(mockPartida, 'GUBERNAMENTAL', 'AIzaSyBZBWch9Lm6-YmSi4iw5uaKS3heXaYcVPo');

        console.log("✅ APU Generado Exitosamente:");
        console.log("Código:", apu.codigo_covenin);
        console.log("Descripción:", apu.descripcion);
        console.log("Costo Directo:", apu.resumen.costo_directo_total);
        console.log("Total Incidencias:", apu.incidencias.total_incidencias);
        console.log("Precio Unitario:", apu.resumen.precio_unitario);

        if (apu.certificacion_legal) {
            console.log("✅ Certificación Legal presente");
        } else {
            console.error("❌ Falta Certificación Legal");
        }

    } catch (error) {
        console.error("Error en prueba:", error);
    }
}

runTest();
