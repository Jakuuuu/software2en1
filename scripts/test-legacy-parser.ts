
import { LegacyParser } from '../src/utils/parsers/legacy-parser';
import * as XLSX from 'xlsx';
import { DBFFile } from 'dbffile';

async function testExcelParser() {
    console.log('Testing Excel Parser...');
    // Create a dummy Excel file
    const wb = XLSX.utils.book_new();
    const ws_data = [
        ['Codigo', 'Descripcion', 'Unidad', 'Cantidad', 'Precio'],
        ['E-1', 'Excavation', 'm3', 10, 50],
        ['E-2', 'Concrete', 'm3', 5, 100]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    try {
        const partidas = LegacyParser.parseExcel(buffer);
        console.log('Excel Parsed:', partidas.length, 'records');
        if (partidas.length === 2 && partidas[0].code === 'E-1') {
            console.log('PASS: Excel Parser');
        } else {
            console.log('FAIL: Excel Parser content mismatch');
        }
    } catch (e) {
        console.error('FAIL: Excel Parser threw error', e);
    }
}

async function runTests() {
    await testExcelParser();
}

runTests().catch(console.error);
