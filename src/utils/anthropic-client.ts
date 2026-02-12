import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT_APU } from '../data/system-prompt';
import { INCIDENCIAS_2026 } from '../data/covenin-data';
import { PartidaFormData } from '../types';

// Lazy initialization for default client
let defaultClient: Anthropic | null = null;

const DEFAULT_MODEL = 'claude-3-5-sonnet-20240620';

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

Genera el APU ahora.
`;
}

function getClient(apiKey?: string) {
    if (apiKey) {
        return new Anthropic({ apiKey });
    }
    if (!defaultClient) {
        defaultClient = new Anthropic({
            apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
        });
    }
    return defaultClient;
}

export async function generarAPU(partidaData: PartidaFormData, tipoCliente: 'GUBERNAMENTAL' | 'PRIVADO', apiKey?: string) {
    const client = getClient(apiKey);

    if (!client.apiKey) {
        throw new Error('Anthropic API Key not configured');
    }

    const response = await client.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 4096,
        system: [
            {
                type: 'text',
                text: SYSTEM_PROMPT_APU,
                cache_control: { type: 'ephemeral' }
            }
        ],
        messages: [
            {
                role: 'user',
                content: construirPromptDinamico(partidaData, tipoCliente)
            }
        ]
    });

    return (response.content[0] as Anthropic.TextBlock).text;
}
