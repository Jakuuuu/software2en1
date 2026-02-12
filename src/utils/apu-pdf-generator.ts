
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { APUResponse } from '../types';
import { PDF_STYLES, addPageFooter, formatCurrencyForPDF } from './pdfStyles';

export const generateAPUPDF = (apuData: APUResponse, clientType: 'GUBERNAMENTAL' | 'PRIVADO') => {
    const doc = new jsPDF();
    const { margins, colors, fonts } = PDF_STYLES;
    const isGovernment = clientType === 'GUBERNAMENTAL';
    const filename = `APU_${apuData.codigo_covenin || 'SIN_CODIGO'}_${clientType}.pdf`;

    let currentY = margins.top;

    // ============================================
    // 1. HEADER & TITLE
    // ============================================

    // Background header
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 210, 35, 'F');

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text('ANÁLISIS DE PRECIOS UNITARIOS (APU)', margins.left, 12);

    // Subtitle / Normative
    doc.setFontSize(fonts.small + 1);
    doc.setFont('helvetica', 'normal');
    if (isGovernment && apuData.certificacion_legal?.marco_normativo) {
        doc.text(apuData.certificacion_legal.marco_normativo.join(' | '), margins.left, 19);
    } else {
        doc.text('Estructura de Costos Estándar', margins.left, 19);
    }

    // Code & Date (Right side)
    const rightX = 196;
    doc.text(`Código: ${apuData.codigo_covenin}`, rightX, 12, { align: 'right' });
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-VE')}`, rightX, 19, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    currentY = 45;

    // ============================================
    // 2. PARTIDA DESCRIPTION
    // ============================================

    doc.setFontSize(fonts.heading);
    doc.setFont('helvetica', 'bold');
    doc.text(apuData.codigo_covenin, margins.left, currentY);

    doc.setFontSize(fonts.normal);
    doc.setFont('helvetica', 'normal');

    const splitDesc = doc.splitTextToSize(apuData.descripcion, 180);
    doc.text(splitDesc, margins.left + 25, currentY);

    currentY += (splitDesc.length * 6) + 5;

    doc.setFont('helvetica', 'bold');
    doc.text(`UNIDAD: ${apuData.unidad}`, margins.left, currentY);
    currentY += 10;

    // Helper for Tables
    const addTable = (title: string, items: any[], columns: string[], keys: string[], citation?: string) => {
        if (!items || items.length === 0) return;

        // Section Title
        doc.setFontSize(fonts.heading);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text(title, margins.left, currentY);
        currentY += 6;

        // Legal Citation
        if (citation && isGovernment) {
            doc.setFontSize(fonts.small - 2);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(...colors.medium);
            doc.text(`Base Legal: ${citation}`, margins.left, currentY);
            doc.setTextColor(0, 0, 0);
            currentY += 4;
        }

        // Table
        autoTable(doc, {
            startY: currentY,
            head: [columns],
            body: items.map(item => keys.map(k => {
                if (k === 'precio_unitario' || k === 'total' || k === 'monto') {
                    return formatCurrencyForPDF(item[k], 'USD').replace('$', ''); // Simplified for demo
                }
                return item[k];
            })),
            theme: 'striped',
            headStyles: {
                fillColor: colors.medium,
                fontSize: fonts.small,
                halign: 'center'
            },
            styles: { fontSize: fonts.small - 1 },
            columnStyles: {
                [keys.length - 1]: { halign: 'right', fontStyle: 'bold' },
                [keys.length - 2]: { halign: 'right' }
            }
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;
    };

    // ============================================
    // 3. COST TABLES
    // ============================================

    // Materials
    addTable(
        'MATERIALES',
        apuData.analisis_costos.materiales,
        ['Descripción', 'Unidad', 'Cantidad', 'P. Unit.', 'Total'],
        ['descripcion', 'unidad', 'cantidad', 'precio_unitario', 'total'],
        'COVENIN 2250-2000 Cap. 4 / Decreto 1.399/2026 Art. 5'
    );

    // Equipment
    addTable(
        'EQUIPOS',
        apuData.analisis_costos.equipos,
        ['Descripción', 'Cantidad', 'Tarifa', 'Total'],
        ['descripcion', 'cantidad', 'precio_unitario', 'total'],
        'COVENIN 2250-2000 Cap. 4 / Decreto 1.399/2026 Art. 7'
    );

    // Labor
    addTable(
        'MANO DE OBRA',
        apuData.analisis_costos.mano_obra,
        ['Descripción', 'Cantidad', 'Jornal', 'Total'],
        ['descripcion', 'cantidad', 'precio_unitario', 'total'],
        'LOTTT Art. 104 / Decreto 1.399/2026 Art. 6'
    );

    // ============================================
    // 4. INCIDENCES (Government Only)
    // ============================================

    if (isGovernment && apuData.incidencias?.laborales) {
        // Force new page if low on space
        if (currentY > 200) {
            doc.addPage();
            currentY = margins.top;
        }

        doc.setFontSize(fonts.heading);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.secondary);
        doc.text('INCIDENCIAS LABORALES Y BENEFICIOS SOCIALES', margins.left, currentY);
        currentY += 6;

        doc.setFontSize(fonts.small - 2);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(...colors.medium);
        doc.text('Desglose conforme a LOTTT y Ley de Protección de Pensiones 2026', margins.left, currentY);
        doc.setTextColor(0, 0, 0);
        currentY += 4;

        autoTable(doc, {
            startY: currentY,
            head: [['Concepto', 'Base Legal', '%', 'Monto']],
            body: apuData.incidencias.laborales.map(i => [
                i.concepto,
                i.base_legal || '-',
                `${i.porcentaje}%`,
                formatCurrencyForPDF(i.monto, 'USD').replace('$', '')
            ]),
            theme: 'grid',
            headStyles: { fillColor: colors.secondary },
            columnStyles: {
                2: { halign: 'center' },
                3: { halign: 'right' }
            }
        });
        currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // ============================================
    // 5. SUMMARY
    // ============================================

    // Check space for summary
    if (currentY > 220) {
        doc.addPage();
        currentY = margins.top;
    }

    doc.setFillColor(240, 240, 240);
    doc.rect(margins.left, currentY, 180, 50, 'F');
    doc.setDrawColor(...colors.medium);
    doc.rect(margins.left, currentY, 180, 50, 'S');

    let sumY = currentY + 10;
    const labelX = margins.left + 10;
    const valueX = margins.left + 170;

    const summaryItems = [
        { l: 'Costo Directo (Mat + Eq + MO)', v: apuData.resumen.costo_directo_total },
        { l: 'Costos Administrativos y Utilidad', v: apuData.resumen.costos_administrativos + apuData.resumen.utilidad },
        { l: 'Incidencias Laborales', v: apuData.incidencias.total_incidencias }
    ];

    doc.setFontSize(fonts.normal);
    summaryItems.forEach(item => {
        doc.text(item.l, labelX, sumY);
        doc.text(formatCurrencyForPDF(item.v, 'USD').replace('$', ''), valueX, sumY, { align: 'right' });
        sumY += 8;
    });

    doc.setLineWidth(0.5);
    doc.line(labelX, sumY, valueX, sumY);
    sumY += 8;

    doc.setFontSize(fonts.heading);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('PRECIO UNITARIO TOTAL:', labelX, sumY);
    doc.text(formatCurrencyForPDF(apuData.resumen.precio_unitario, 'USD'), valueX, sumY, { align: 'right' });


    // ============================================
    // 6. FOOTER / CERTIFICATION
    // ============================================

    addPageFooter(doc, 1, 1);

    if (isGovernment) {
        const certText = "CERTIFICACIÓN: El presente Análisis de Precios Unitarios cumple estrictamente con el Decreto 1.399/2026 y la normativa COVENIN vigente. Se garantizan los derechos laborales establecidos en la LOTTT y leyes de seguridad social.";

        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        const splitCert = doc.splitTextToSize(certText, 180);
        doc.text(splitCert, margins.left, 280);
    }

    doc.save(filename);
    console.log(`PDF Generated: ${filename}`);
};
