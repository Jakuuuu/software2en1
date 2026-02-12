
import { NextRequest, NextResponse } from 'next/server';
import { generarAPU } from '@/utils/gemini-client';
import { PartidaFormData } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { partida, clientType } = body;

        if (!partida) {
            return NextResponse.json({ error: 'Partida data is required' }, { status: 400 });
        }

        const type = clientType || 'PRIVADO';

        console.log(`Generating APU for ${partida.code} (${type})...`);

        const apu = await generarAPU(partida as PartidaFormData, type);

        return NextResponse.json(apu);

    } catch (error) {
        console.error('API Error generating APU:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error generating APU' },
            { status: 500 }
        );
    }
}
