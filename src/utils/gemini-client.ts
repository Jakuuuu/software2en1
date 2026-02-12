
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT_APU } from '../data/system-prompt';
import { INCIDENCIAS_2026 } from '../data/covenin-data';
import { PartidaFormData, APUResponse } from '../types';

// Lazy initialization
let defaultGenAI: GoogleGenerativeAI | null = null;
const DEFAULT_MODEL_NAME = 'gemini-2.5-flash';

export function construirPromptDinamico(partidaData: PartidaFormData, tipoCliente: string): string {
    const esGubernamental = tipoCliente === 'GUBERNAMENTAL';

    // Map PartidaFormData to the structure expected by the template
    const partidaDataMapped = {
        codigo_covenin: partidaData.code,
        descripcion: partidaData.description,
        unidad: partidaData.unit,
        materiales: partidaData.materials,
        mano_obra: partidaData.labor,
        incidencias_laborales: INCIDENCIAS_2026.filter(i => esGubernamental ? i.obligatorio_publico : true)
    };

    return `
TIPO CLIENTE: ${tipoCliente}
${esGubernamental ? '⚠️ APLICAR NORMATIVA ESTRICTA + CITAS LEGALES' : ''}

PARTIDA:
Código: ${partidaDataMapped.codigo_covenin}
Descripción: ${partidaDataMapped.descripcion}
Unidad: ${partidaDataMapped.unidad}

DATOS DE ENTRADA:
${JSON.stringify(partidaDataMapped.materiales, null, 2)}
${JSON.stringify(partidaDataMapped.mano_obra, null, 2)}

INCIDENCIAS A APLICAR:
${JSON.stringify(partidaDataMapped.incidencias_laborales, null, 2)}

INSTRUCCIONES:
1. Generar APU completo
2. ${esGubernamental ? 'INCLUIR encabezado legal + citas en cada sección' : 'Formato estándar'}
3. Formato: ${esGubernamental ? 'Con pie de página certificación' : 'Simple'}

IMPORTANTE: La salida DEBE ser un JSON válido con la siguiente estructura exacta:
{
  "codigo_covenin": "string",
  "descripcion": "string (descripción de la partida)",
  "unidad": "string",
  "analisis_costos": {
    "materiales": [{ "descripcion": "string", "unidad": "string", "cantidad": number, "precio_unitario": number, "total": number }],
    "equipos": [{ "descripcion": "string", "unidad": "string", "cantidad": number, "precio_unitario": number, "total": number }],
    "mano_obra": [{ "descripcion": "string", "cantidad": number, "precio_unitario": number, "total": number }]
  },
  "costos_directos": {
    "total_materiales": number,
    "total_equipos": number,
    "total_mano_obra": number,
    "subtotal_directo": number
  },
  "incidencias": {
    "laborales": [{ "concepto": "string", "porcentaje": number, "monto": number }],
    "total_incidencias": number
  },
  "resumen": {
    "costo_directo_total": number,
    "costos_administrativos": number,
    "utilidad": number,
    "precio_unitario": number
  },
  "certificacion_legal": {
    "marco_normativo": ["string"],
    "fecha": "string"
  }
}

Genera el APU ahora.
`;
}

function getModel(apiKey?: string) {
    let key = apiKey;
    if (!key) {
        key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    }

    if (!key) {
        throw new Error('Gemini API Key not configured');
    }

    // Always create a new instance if apiKey is provided to avoid side effects
    if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        return genAI.getGenerativeModel({
            model: DEFAULT_MODEL_NAME,
            systemInstruction: SYSTEM_PROMPT_APU
        });
    }

    // Use singleton for default key
    if (!defaultGenAI) {
        defaultGenAI = new GoogleGenerativeAI(key);
    }

    return defaultGenAI.getGenerativeModel({
        model: DEFAULT_MODEL_NAME,
        systemInstruction: SYSTEM_PROMPT_APU
    });
}

// Helper to clean JSON response from markdown blocks
function cleanJSONResponse(text: string): string {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
        return jsonMatch[1];
    }
    return text.trim();
}

export async function generarAPU(partidaData: PartidaFormData, tipoCliente: 'GUBERNAMENTAL' | 'PRIVADO', apiKey?: string): Promise<APUResponse> {
    const model = getModel(apiKey);

    // Configurar respuesta en JSON
    const generationConfig = {
        responseMimeType: "application/json",
    };

    const prompt = construirPromptDinamico(partidaData, tipoCliente);

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig
        });

        const response = await result.response;
        const text = response.text();

        const cleanedJson = cleanJSONResponse(text);
        const parsedData = JSON.parse(cleanedJson) as APUResponse;

        // Basic Structure Validation
        if (!parsedData.analisis_costos || !parsedData.resumen) {
            throw new Error('Estructura de APU inválida: Faltan secciones principales');
        }

        return parsedData;

    } catch (error) {
        console.error('Error generando APU:', error);
        throw new Error('Falló la generación del APU. Por favor intente nuevamente.');
    }
}
