
import { DBFFile } from 'dbffile';
import * as XLSX from 'xlsx';
import { Partida, APU, Resource } from '@/types';

// ==========================================
// INTERFACES FOR LEGACY FORMATS
// ==========================================

// Approximate structure for Lulowin DBF
interface LuloPartidaRecord {
    CODIGO: string;
    DESCRIPCIO: string;
    UNIDAD: string;
    CANTIDAD: number;
    PRECIO: number;
    // Add other fields as discovered/needed
}

// Approximate structure of DataLaing Excel Partidas
interface DataLaingRow {
    Codigo: string;
    Descripcion: string;
    Unidad: string;
    Cantidad: number;
    Precio: number;
    // ...
}

// ==========================================
// PARSER IMPLEMENTATION
// ==========================================

export class LegacyParser {

    /**
     * Parses a Lulowin .DBF file buffer
     */
    static async parseDBF(buffer: Buffer): Promise<Partida[]> {
        try {
            // dbffile expects a file path usually, but we can try to work around it or write to temp
            // Actually dbffile only supports file paths in current versions, 
            // so we might need to write the buffer to a temp file first.

            const tempPath = `temp_${Date.now()}.dbf`;
            const fs = require('fs/promises');
            await fs.writeFile(tempPath, buffer);

            const dbf = await DBFFile.open(tempPath);
            const records = await dbf.readRecords();

            // Clean up
            await fs.unlink(tempPath);

            return records.map(record => this.mapLuloToPartida(record));
        } catch (error) {
            console.error('Error parsing DBF:', error);
            throw new Error('Failed to parse DBF file');
        }
    }

    /**
     * Parses a DataLaing Excel file buffer
     */
    static parseExcel(buffer: Buffer): Partida[] {
        try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json<DataLaingRow>(sheet);

            return data.map(row => this.mapDataLaingToPartida(row));
        } catch (error) {
            console.error('Error parsing Excel:', error);
            throw new Error('Failed to parse Excel file');
        }
    }

    // ==========================================
    // MAPPERS
    // ==========================================

    private static mapLuloToPartida(record: any): Partida {
        // Basic mapping, needs refinement based on actual file structure
        // Lulowin field names are often truncated to 10 chars

        return {
            id: crypto.randomUUID(), // Generate a temporary ID
            code: record.CODIGO || record.CODPAR || 'UNKNOWN',
            description: record.DESCRIPCIO || record.DESCRI || '',
            unit: record.UNIDAD || record.UNID || 'und',
            quantity: Number(record.CANTIDAD || 0),
            unitPrice: Number(record.PRECIO || record.PU || 0),
            contracted: 0,
            previousAccumulated: 0,
            thisValuation: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    private static mapDataLaingToPartida(row: any): Partida {
        // Logic to detect columns if names vary
        const code = row['Codigo'] || row['Código'] || row['COVENIN'] || row['Partida'];
        const desc = row['Descripcion'] || row['Descripción'] || row['Actividad'];
        const unit = row['Unidad'] || row['Und'];
        const qty = row['Cantidad'] || row['Cant'];
        const price = row['Precio'] || row['P.U.'] || row['Precio Unitario'];

        return {
            id: crypto.randomUUID(),
            code: String(code || 'UNKNOWN'),
            description: String(desc || ''),
            unit: String(unit || 'und'),
            quantity: Number(qty || 0),
            unitPrice: Number(price || 0),
            contracted: 0,
            previousAccumulated: 0,
            thisValuation: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
}
