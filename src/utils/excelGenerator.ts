import ExcelJS from 'exceljs';
import { Project, Valuation, Partida } from '../types';

/**
 * Generates an Excel file with LIVE FORMULAS for PDVSA/MinObras audit compliance
 * Instead of static values, cells contain formulas like =D5*E5 for Amount = Quantity * UnitPrice
 */
export const generateValuationExcel = async (
    valuation: Valuation,
    project: Project,
    partidas: Partida[]
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Valuación');

    const currency = project.contract.currency;

    // ============================================
    // HEADER SECTION
    // ============================================
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `VALUACIÓN No. ${valuation.number}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
    };
    titleCell.font = { ...titleCell.font, color: { argb: 'FFFFFFFF' } };

    // Project Info
    worksheet.getCell('A3').value = 'PROYECTO:';
    worksheet.getCell('B3').value = project.name;
    worksheet.getCell('A4').value = 'CÓDIGO:';
    worksheet.getCell('B4').value = project.code;
    worksheet.getCell('A5').value = 'PERÍODO:';
    worksheet.getCell('B5').value = `${new Date(valuation.periodStart).toLocaleDateString()} - ${new Date(valuation.periodEnd).toLocaleDateString()}`;

    // Make info section bold
    worksheet.getCell('A3').font = { bold: true };
    worksheet.getCell('A4').font = { bold: true };
    worksheet.getCell('A5').font = { bold: true };

    // ============================================
    // TABLE HEADERS (Row 7)
    // ============================================
    const headerRow = worksheet.getRow(7);
    const headers = [
        'Código',
        'Descripción',
        'Unidad',
        'Cant. Contratada',
        'Acum. Anterior',
        'Esta Valuación',
        'Acum. Total',
        `P.U. (${currency})`,
        `Monto (${currency})`
    ];

    headers.forEach((header, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = header;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1E40AF' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // ============================================
    // DATA ROWS (Starting at Row 8)
    // ============================================
    let currentRow = 8;
    const dataStartRow = currentRow;

    valuation.items.forEach((item) => {
        const partida = partidas.find(p => p.id === item.partidaId);
        if (!partida) return;

        const previousAccum = partida.previousAccumulated || 0;
        const thisVal = item.quantity;

        const row = worksheet.getRow(currentRow);

        // A: Código
        row.getCell(1).value = partida.code;

        // B: Descripción
        row.getCell(2).value = partida.description;

        // C: Unidad
        row.getCell(3).value = partida.unit;

        // D: Cantidad Contratada
        row.getCell(4).value = partida.quantity;
        row.getCell(4).numFmt = '#,##0.00';

        // E: Acumulado Anterior
        row.getCell(5).value = previousAccum;
        row.getCell(5).numFmt = '#,##0.00';

        // F: Esta Valuación
        row.getCell(6).value = thisVal;
        row.getCell(6).numFmt = '#,##0.00';

        // G: Acumulado Total = FORMULA: E + F (Anterior + Esta)
        row.getCell(7).value = { formula: `E${currentRow}+F${currentRow}` };
        row.getCell(7).numFmt = '#,##0.00';

        // H: Precio Unitario
        row.getCell(8).value = item.unitPrice;
        row.getCell(8).numFmt = `"${currency}" #,##0.00`;

        // I: Monto = FORMULA: F * H (Esta Valuación * Precio Unitario)
        // ⚠️ THIS IS THE KEY AUDIT FORMULA ⚠️
        row.getCell(9).value = { formula: `F${currentRow}*H${currentRow}` };
        row.getCell(9).numFmt = `"${currency}" #,##0.00`;

        // Apply borders
        for (let col = 1; col <= 9; col++) {
            row.getCell(col).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }

        currentRow++;
    });

    const dataEndRow = currentRow - 1;

    // ============================================
    // FINANCIAL SUMMARY (Starting 2 rows after data)
    // ============================================
    const summaryStartRow = currentRow + 2;
    let summaryRow = summaryStartRow;

    // Monto Bruto = SUM of all amounts (column I)
    worksheet.getCell(`H${summaryRow}`).value = 'MONTO BRUTO:';
    worksheet.getCell(`H${summaryRow}`).font = { bold: true };
    worksheet.getCell(`I${summaryRow}`).value = { formula: `SUM(I${dataStartRow}:I${dataEndRow})` };
    worksheet.getCell(`I${summaryRow}`).numFmt = `"${currency}" #,##0.00`;
    worksheet.getCell(`I${summaryRow}`).font = { bold: true };
    summaryRow++;

    // Amortización Anticipo
    worksheet.getCell(`H${summaryRow}`).value = 'AMORTIZACIÓN ANTICIPO:';
    worksheet.getCell(`I${summaryRow}`).value = -valuation.deductions.advancePayment;
    worksheet.getCell(`I${summaryRow}`).numFmt = `"${currency}" #,##0.00`;
    summaryRow++;

    // IVA = Monto Bruto * IVA Rate
    const grossRow = summaryStartRow;
    worksheet.getCell(`H${summaryRow}`).value = `IVA (${(project.legalConfig.ivaRate * 100).toFixed(0)}%):`;
    worksheet.getCell(`I${summaryRow}`).value = { formula: `I${grossRow}*${project.legalConfig.ivaRate}` };
    worksheet.getCell(`I${summaryRow}`).numFmt = `"${currency}" #,##0.00`;
    summaryRow++;

    // Retención IVA
    worksheet.getCell(`H${summaryRow}`).value = 'RETENCIÓN IVA:';
    worksheet.getCell(`I${summaryRow}`).value = -valuation.deductions.ivaRetention;
    worksheet.getCell(`I${summaryRow}`).numFmt = `"${currency}" #,##0.00`;
    summaryRow++;

    // Retención ISLR
    worksheet.getCell(`H${summaryRow}`).value = 'RETENCIÓN ISLR:';
    worksheet.getCell(`I${summaryRow}`).value = -valuation.deductions.islrRetention;
    worksheet.getCell(`I${summaryRow}`).numFmt = `"${currency}" #,##0.00`;
    summaryRow++;

    // Fondo de Garantía
    worksheet.getCell(`H${summaryRow}`).value = 'FONDO DE GARANTÍA:';
    worksheet.getCell(`I${summaryRow}`).value = -valuation.deductions.guaranteeFund;
    worksheet.getCell(`I${summaryRow}`).numFmt = `"${currency}" #,##0.00`;
    summaryRow++;

    // Monto Neto = SUM of all summary items
    worksheet.getCell(`H${summaryRow}`).value = 'MONTO NETO:';
    worksheet.getCell(`H${summaryRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`H${summaryRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDBEAFE' }
    };
    worksheet.getCell(`I${summaryRow}`).value = { formula: `SUM(I${summaryStartRow}:I${summaryRow - 1})` };
    worksheet.getCell(`I${summaryRow}`).numFmt = `"${currency}" #,##0.00`;
    worksheet.getCell(`I${summaryRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`I${summaryRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDBEAFE' }
    };

    // ============================================
    // COLUMN WIDTHS
    // ============================================
    worksheet.columns = [
        { width: 15 },  // Código
        { width: 40 },  // Descripción
        { width: 10 },  // Unidad
        { width: 15 },  // Cant. Contratada
        { width: 15 },  // Acum. Anterior
        { width: 15 },  // Esta Valuación
        { width: 15 },  // Acum. Total
        { width: 18 },  // P.U.
        { width: 18 }   // Monto
    ];

    // ============================================
    // GENERATE FILE AND DOWNLOAD
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `Valuacion_${valuation.number}_${project.code}_AUDITORIA.xlsx`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
