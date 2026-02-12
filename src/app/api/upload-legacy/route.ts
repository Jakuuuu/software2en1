
import { NextRequest, NextResponse } from 'next/server';
import { LegacyParser } from '@/utils/parsers/legacy-parser'; // Adjusted import path
// import { LibraryService } from '@/services/library-service'; // Import when service created

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let parsedData = [];

        // Detect file type by extension or signature
        if (file.name.toLowerCase().endsWith('.dbf')) {
            parsedData = await LegacyParser.parseDBF(buffer);
        } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
            parsedData = LegacyParser.parseExcel(buffer);
        } else {
            return NextResponse.json({ success: false, message: 'Unsupported file format' }, { status: 400 });
        }

        // Save to library (mocked for now)
        // const result = await LibraryService.addPartidas(parsedData);
        console.log(`Processed ${parsedData.length} records from ${file.name}`);

        return NextResponse.json({
            success: true,
            count: parsedData.length,
            data: parsedData // limiting return size might be good for large files
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
