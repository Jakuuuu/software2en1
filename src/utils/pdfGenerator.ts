import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Partida, Project, Valuation } from '../types';
import {
    addProjectHeader,
    addPageFooter,
    addSectionTitle,
    addInfoBox,
    addSignatureSection,
    addFinancialSummary,
    checkPageBreak,
    formatCurrencyForPDF,
    formatDateForPDF,
    PDF_STYLES
} from './pdfStyles';

// Declare autoTable for TypeScript
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
        lastAutoTable: {
            finalY: number;
        };
    }
}

// ============================================
// GENERATE VALUATION PDF
// ============================================

export const generateValuationPDF = (
    valuation: Valuation,
    project: Project,
    partidas: Partida[]
) => {
    const doc = new jsPDF();
    const { margins, colors, fonts } = PDF_STYLES;
    const currency = project.contract.currency;

    // Filename
    const filename = `Valuacion_${valuation.number}_${project.code}_${new Date().toISOString().split('T')[0]}.pdf`;

    // ========================================
    // PAGE 1: COVER PAGE
    // ========================================

    let currentY = addProjectHeader(
        doc,
        project,
        `VALUACIÓN N° ${valuation.number}`,
        `Período: ${formatDateForPDF(valuation.periodStart)} - ${formatDateForPDF(valuation.periodEnd)}`
    );

    currentY += 5;

    // Project Information
    currentY = addSectionTitle(doc, 'INFORMACIÓN DEL PROYECTO', currentY, true);

    const projectInfo = [
        { label: 'Proyecto', value: project.name },
        { label: 'Código', value: project.code },
        { label: 'Ubicación', value: `${project.location.city}, ${project.location.state}` },
        { label: 'Contrato', value: project.contract.number }
    ];

    currentY = addInfoBox(doc, margins.left, currentY, 90, 25, projectInfo);
    currentY += 5;

    // Client Information
    currentY = addSectionTitle(doc, 'INFORMACIÓN DEL CLIENTE', currentY, true);

    const clientInfo = [
        { label: 'Cliente', value: project.client.name },
        { label: 'RIF', value: project.client.rif },
        { label: 'Dirección', value: project.client.address }
    ];

    currentY = addInfoBox(doc, margins.left, currentY, 90, 20, clientInfo);
    currentY += 5;

    // Contractor Information
    currentY = addSectionTitle(doc, 'INFORMACIÓN DEL CONTRATISTA', currentY, true);

    const contractorInfo = [
        { label: 'Contratista', value: project.contractor.name },
        { label: 'RIF', value: project.contractor.rif }
    ];

    currentY = addInfoBox(doc, margins.left, currentY, 90, 15, contractorInfo);
    currentY += 10;

    // Financial Summary
    currentY = addSectionTitle(doc, 'RESUMEN FINANCIERO', currentY, true);

    const financialItems = [
        {
            label: 'Monto Bruto de Obra',
            value: formatCurrencyForPDF(valuation.grossAmount, currency),
            type: undefined as any
        }
    ];

    // Add deductions
    if (valuation.deductions.advancePayment > 0) {
        financialItems.push({
            label: `(-) Amortización Anticipo (${project.legalConfig.advancePayment * 100}%)`,
            value: formatCurrencyForPDF(valuation.deductions.advancePayment, currency),
            type: 'negative' as any
        });
    }

    // IVA
    const ivaAmount = valuation.grossAmount * (project.legalConfig.ivaRate);
    if (project.legalConfig.ivaRate > 0) {
        financialItems.push({
            label: `(+) IVA (${(project.legalConfig.ivaRate * 100).toFixed(0)}%)`,
            value: formatCurrencyForPDF(ivaAmount, currency),
            type: 'positive' as any
        });
    }

    if (valuation.deductions.ivaRetention > 0) {
        financialItems.push({
            label: `(-) Retención IVA (${(project.legalConfig.retentionIVA * 100).toFixed(0)}%)`,
            value: formatCurrencyForPDF(valuation.deductions.ivaRetention, currency),
            type: 'negative' as any
        });
    }

    if (valuation.deductions.islrRetention > 0) {
        financialItems.push({
            label: `(-) Retención ISLR (${(project.legalConfig.retentionISLR * 100).toFixed(0)}%)`,
            value: formatCurrencyForPDF(valuation.deductions.islrRetention, currency),
            type: 'negative' as any
        });
    }

    if (valuation.deductions.guaranteeFund > 0) {
        financialItems.push({
            label: `(-) Fondo de Garantía (${(project.legalConfig.performanceBond * 100).toFixed(0)}%)`,
            value: formatCurrencyForPDF(valuation.deductions.guaranteeFund, currency),
            type: 'negative' as any
        });
    }

    // Net amount
    financialItems.push({
        label: 'MONTO NETO A PAGAR',
        value: formatCurrencyForPDF(valuation.netAmount, currency),
        type: 'total' as any
    });

    currentY = addFinancialSummary(doc, margins.left, currentY, 90, financialItems, currency);

    // Exchange rate if USD
    if (currency === 'USD' && project.contract.exchangeRate) {
        currentY += 5;
        doc.setFontSize(fonts.small);
        doc.setFont('helvetica', 'italic');
        doc.text(
            `Tasa de Cambio: Bs. ${project.contract.exchangeRate.toFixed(2)} por USD`,
            margins.left,
            currentY
        );
        doc.setFont('helvetica', 'normal');
    }

    // Footer for page 1
    addPageFooter(doc, 1);

    // ========================================
    // PAGE 2+: PARTIDAS BREAKDOWN
    // ========================================

    doc.addPage();
    let pageNumber = 2;

    currentY = margins.top;
    currentY = addSectionTitle(doc, 'DESGLOSE DE PARTIDAS', currentY, true);

    // Prepare table data
    const tableData = valuation.items.map(item => {
        const partida = partidas.find(p => p.id === item.partidaId);
        if (!partida) return null;

        const previousAccum = partida.previousAccumulated || 0;
        const thisVal = item.quantity;
        const newAccum = previousAccum + thisVal;

        return [
            partida.code,
            partida.description,
            partida.unit,
            partida.quantity?.toFixed(2) || '0.00',
            previousAccum.toFixed(2),
            thisVal.toFixed(2),
            newAccum.toFixed(2),
            formatCurrencyForPDF(item.unitPrice, currency),
            formatCurrencyForPDF(item.amount, currency)
        ];
    }).filter(Boolean);

    // Add table
    doc.autoTable({
        startY: currentY,
        head: [[
            'Código',
            'Descripción',
            'Unidad',
            'Contratado',
            'Acum. Ant.',
            'Esta Val.',
            'Acum. Total',
            'P. Unit.',
            'Monto'
        ]],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: colors.primary,
            textColor: colors.white,
            fontSize: fonts.small,
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: fonts.small - 1,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: 20, fontSize: fonts.small - 2 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 18, halign: 'right' },
            4: { cellWidth: 18, halign: 'right' },
            5: { cellWidth: 18, halign: 'right' },
            6: { cellWidth: 18, halign: 'right' },
            7: { cellWidth: 20, halign: 'right' },
            8: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }
        },
        didDrawPage: (data: any) => {
            addPageFooter(doc, pageNumber);
            pageNumber++;
        }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // Total
    doc.setFontSize(fonts.heading);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 140, currentY);
    doc.text(formatCurrencyForPDF(valuation.grossAmount, currency), 196, currentY, { align: 'right' });

    // ========================================
    // SIGNATURES PAGE
    // ========================================

    currentY = checkPageBreak(doc, currentY, 60);

    if (currentY === margins.top) {
        addPageFooter(doc, pageNumber);
        pageNumber++;
    }

    currentY += 15;
    addSignatureSection(doc, currentY);

    // Final footer
    addPageFooter(doc, pageNumber);

    // Save
    doc.save(filename);
};

// ============================================
// GENERATE PARTIDA PDF (EXISTING - IMPROVED)
// ============================================

export const generatePartidaPDF = (partida: Partida, project?: Project) => {
    const doc = new jsPDF();
    const { margins, colors, fonts } = PDF_STYLES;
    const filename = `APU_${partida.code || 'UNKNOWN'}.pdf`;
    const currency = project?.contract.currency || 'USD'; // Default to USD if no project

    // ========================================
    // HEADER
    // ========================================

    let currentY = margins.top;

    if (project) {
        currentY = addProjectHeader(
            doc,
            project,
            'ANÁLISIS DE PRECIO UNITARIO',
            `Código: ${partida.code}`
        );
    } else {
        // Generic Header
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.white);
        doc.text('ANÁLISIS DE PRECIO UNITARIO', 105, 18, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        currentY = 40;
    }

    currentY += 5;

    // ========================================
    // PARTIDA INFO
    // ========================================

    doc.setFontSize(fonts.normal);
    doc.setFont('helvetica', 'bold');
    doc.text(`CÓDIGO: ${partida.code || 'N/A'}`, margins.left, currentY);

    doc.text(`UNIDAD: ${partida.unit || 'N/A'}`, 100, currentY);

    doc.text(`CANTIDAD: ${(partida.quantity || 0).toFixed(2)}`, 160, currentY);

    currentY += 8;

    doc.text('DESCRIPCIÓN:', margins.left, currentY);
    doc.setFont('helvetica', 'normal');

    const splitDescription = doc.splitTextToSize(partida.description, 180);
    doc.text(splitDescription, margins.left, currentY + 6);

    currentY += 15 + (splitDescription.length * 5);

    // ========================================
    // TABLES
    // ========================================

    if (!partida.apu) {
        doc.text('No hay datos de APU disponibles.', margins.left, currentY);
        doc.save(filename);
        return;
    }

    // Helper for tables
    const addAPUTable = (title: string, items: any[], startY: number) => {
        if (!items || items.length === 0) return startY;

        doc.setFontSize(fonts.heading);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text(title, margins.left, startY - 2);
        doc.setTextColor(0, 0, 0);

        const body = items.map(item => [
            item.description,
            item.unit,
            item.quantity.toFixed(2),
            formatCurrencyForPDF(item.unitPrice, currency),
            formatCurrencyForPDF(item.total, currency)
        ]);

        doc.autoTable({
            startY: startY,
            head: [['Descripción', 'Unidad', 'Cantidad', 'Costo Unit.', 'Total']],
            body: body,
            theme: 'striped',
            headStyles: {
                fillColor: colors.medium,
                fontSize: fonts.small,
                halign: 'center'
            },
            styles: {
                fontSize: fonts.small - 1,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 15, halign: 'center' },
                2: { cellWidth: 20, halign: 'right' },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 25, halign: 'right' }
            }
        });

        return doc.lastAutoTable.finalY + 10;
    };

    // 1. Materials
    currentY = checkPageBreak(doc, currentY, 60);
    currentY = addAPUTable("MATERIALES", partida.apu.materials, currentY);

    // 2. Equipment
    currentY = checkPageBreak(doc, currentY, 60);
    currentY = addAPUTable("EQUIPOS", partida.apu.equipment, currentY);

    // 3. Labor
    currentY = checkPageBreak(doc, currentY, 60);
    currentY = addAPUTable("MANO DE OBRA", partida.apu.labor, currentY);

    // ========================================
    // COST SUMMARY
    // ========================================

    currentY = checkPageBreak(doc, currentY, 100);

    // Draw Summary Box
    doc.setDrawColor(...colors.medium);
    doc.rect(100, currentY, 96, 80); // Info box

    let summaryY = currentY + 8;
    const summaryX = 105;
    const valueX = 190;

    doc.setFontSize(fonts.normal);

    // Direct Costs
    doc.setFont('helvetica', 'bold');
    doc.text('COSTOS DIRECTOS', summaryX, summaryY);
    summaryY += 6;

    doc.setFont('helvetica', 'normal');
    doc.text('Materiales:', summaryX, summaryY);
    doc.text(formatCurrencyForPDF(partida.apu.subtotals.materials, currency), valueX, summaryY, { align: 'right' });
    summaryY += 6;

    doc.text('Equipos:', summaryX, summaryY);
    doc.text(formatCurrencyForPDF(partida.apu.subtotals.equipment, currency), valueX, summaryY, { align: 'right' });
    summaryY += 6;

    doc.text('Mano de Obra:', summaryX, summaryY);
    doc.text(formatCurrencyForPDF(partida.apu.subtotals.labor, currency), valueX, summaryY, { align: 'right' });
    summaryY += 8;

    // Subtotal Direct Cost
    doc.setDrawColor(200, 200, 200);
    doc.line(summaryX, summaryY - 4, valueX, summaryY - 4);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Costo Directo:', summaryX, summaryY);
    doc.text(formatCurrencyForPDF(partida.apu.directCost || 0, currency), valueX, summaryY, { align: 'right' });
    summaryY += 10;

    // Indirect Costs (Simplified for now, can expand later)
    doc.setFont('helvetica', 'bold');
    doc.text('COSTOS INDIRECTOS', summaryX, summaryY);
    summaryY += 6;

    doc.setFont('helvetica', 'normal');
    if (partida.apu.indirectCosts) {
        doc.text('Administración y Gastos:', summaryX, summaryY);
        doc.text(formatCurrencyForPDF(partida.apu.indirectCosts.administration || 0, currency), valueX, summaryY, { align: 'right' });
        summaryY += 6;

        doc.text('Utilidad:', summaryX, summaryY);
        doc.text(formatCurrencyForPDF(partida.apu.indirectCosts.profit || 0, currency), valueX, summaryY, { align: 'right' });
        summaryY += 8;
    }

    // Grand Total
    const grandTotal = partida.apu.unitPrice;

    doc.setFillColor(...colors.primary);
    doc.rect(100, summaryY, 96, 12, 'F');
    doc.setTextColor(...colors.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fonts.heading);
    doc.text('PRECIO UNITARIO:', summaryX + 2, summaryY + 8);
    doc.text(formatCurrencyForPDF(grandTotal, currency), valueX - 2, summaryY + 8, { align: 'right' });

    // Footer
    addPageFooter(doc, 1, 1);

    doc.save(filename);
};
