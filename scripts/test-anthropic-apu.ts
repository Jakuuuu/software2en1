
import { construirPromptDinamico } from '../src/utils/anthropic-client';
import { PARTIDAS_COVENIN } from '../src/data/covenin-data';
import { PartidaFormData } from '../src/types';

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

console.log("--- PROMPT FOR GOVERNMENT CLIENT ---");
const promptGubernamental = construirPromptDinamico(mockPartida, 'GUBERNAMENTAL');
console.log(promptGubernamental);

console.log("\n\n--- PROMPT FOR PRIVATE CLIENT ---");
const promptPrivado = construirPromptDinamico(mockPartida, 'PRIVADO');
console.log(promptPrivado);
