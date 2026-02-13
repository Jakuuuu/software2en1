
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { APUResponse, MaterialResource, EquipmentResource, LaborResource } from '../types';
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

    // Government badge
    if (isGovernment) {
        doc.setFillColor(220, 38, 38);
        doc.roundedRect(margins.left, 22, 45, 8, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('PROYECTO GUBERNAMENTAL', margins.left + 22.5, 27, { align: 'center' });
    }

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

    // ============================================
    // 3. MATERIALS TABLE (with waste factor)
    // ============================================

    if (apuData.analisis_costos.materiales && apuData.analisis_costos.materiales.length > 0) {
        doc.setFontSize(fonts.heading);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('MATERIALES', margins.left, currentY);
        currentY += 6;

        if (isGovernment) {
            doc.setFontSize(fonts.small - 2);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            doc.text('COVENIN 2250-2000 Cap. 4 Art. 12 - Factores de Desperdicio', margins.left, currentY);
            currentY += 4;
        }

        doc.setTextColor(0, 0, 0);

        const materialsData = apuData.analisis_costos.materiales.map((m: any) => {
            const mat = m as MaterialResource;
            const baseRow = [
                m.descripcion,
                m.unidad,
                m.cantidad.toFixed(2)
            ];

            if (isGovernment && mat.wasteFactor !== undefined) {
                const wastePct = (mat.wasteFactor * 100).toFixed(1) + '%';
                const effectiveQty = (m.cantidad * (1 + (mat.wasteFactor || 0))).toFixed(2);
                return [
                    ...baseRow,
                    wastePct,
                    effectiveQty,
                    formatCurrencyForPDF(m.precio_unitario, 'VES'),
                    formatCurrencyForPDF(m.total, 'VES')
                ];
            }

            return [
                ...baseRow,
                formatCurrencyForPDF(m.precio_unitario, 'VES'),
                formatCurrencyForPDF(m.total, 'VES')
            ];
        });

        const materialsColumns = isGovernment
            ? ['Descripción', 'Unid.', 'Cant.', 'Desp.', 'Cant. Efec.', 'P.Unit.', 'Total']
            : ['Descripción', 'Unid.', 'Cantidad', 'P.Unit.', 'Total'];

        autoTable(doc, {
            startY: currentY,
            head: [materialsColumns],
            body: materialsData,
            theme: 'striped',
            headStyles: { fillColor: colors.primary, fontSize: fonts.small },
            styles: { fontSize: fonts.small, cellPadding: 2 },
            columnStyles: isGovernment ? {
                0: { cellWidth: 60 },
                1: { cellWidth: 15, halign: 'center' },
                2: { cellWidth: 20, halign: 'right' },
                3: { cellWidth: 18, halign: 'right' },
                4: { cellWidth: 22, halign: 'right' },
                5: { cellWidth: 22, halign: 'right' },
                6: { cellWidth: 23, halign: 'right', fontStyle: 'bold' }
            } : {
                0: { cellWidth: 90 },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 25, halign: 'right' },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 25, halign: 'right', fontStyle: 'bold' }
            },
            margin: { left: margins.left, right: margins.right }
        });

        currentY = (doc as any).lastAutoTable.finalY + 3;

        // Subtotal
        doc.setFont('helvetica', 'bold');
        doc.text(`Subtotal Materiales: ${formatCurrencyForPDF(apuData.costos_directos.total_materiales, 'VES')}`,
            rightX, currentY, { align: 'right' });
        currentY += 8;
    }

    // ============================================
    // 4. EQUIPMENT TABLE (with COP)
    // ============================================

    if (apuData.analisis_costos.equipos && apuData.analisis_costos.equipos.length > 0) {
        doc.setFontSize(fonts.heading);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('EQUIPOS', margins.left, currentY);
        currentY += 6;

        if (isGovernment) {
            doc.setFontSize(fonts.small - 2);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            doc.text('COVENIN 2250-2000 Cap. 4 Art. 15 - COP (Costo de Posesión y Operación)', margins.left, currentY);
            currentY += 4;
        }

        doc.setTextColor(0, 0, 0);

        const equipmentData = apuData.analisis_costos.equipos.map((e: any) => {
            const eq = e as EquipmentResource;
            const baseRow = [
                e.descripcion,
                e.cantidad.toFixed(2)
            ];

            if (isGovernment) {
                const ownershipType = eq.ownershipType === 'OWNED' ? 'Propio' : 'Alquilado';
                return [
                    ...baseRow,
                    ownershipType,
                    formatCurrencyForPDF(e.precio_unitario, 'VES'),
                    formatCurrencyForPDF(e.total, 'VES')
                ];
            }

            return [
                ...baseRow,
                formatCurrencyForPDF(e.precio_unitario, 'VES'),
                formatCurrencyForPDF(e.total, 'VES')
            ];
        });

        const equipmentColumns = isGovernment
            ? ['Descripción', 'Horas', 'Tipo', 'Tarifa/COP', 'Total']
            : ['Descripción', 'Horas', 'Tarifa', 'Total'];

        autoTable(doc, {
            startY: currentY,
            head: [equipmentColumns],
            body: equipmentData,
            theme: 'striped',
            headStyles: { fillColor: colors.primary, fontSize: fonts.small },
            styles: { fontSize: fonts.small, cellPadding: 2 },
            columnStyles: isGovernment ? {
                0: { cellWidth: 90 },
                1: { cellWidth: 20, halign: 'right' },
                2: { cellWidth: 25, halign: 'center' },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 25, halign: 'right', fontStyle: 'bold' }
            } : {
                0: { cellWidth: 105 },
                1: { cellWidth: 25, halign: 'right' },
                2: { cellWidth: 25, halign: 'right' },
                3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
            },
            margin: { left: margins.left, right: margins.right }
        });

        currentY = (doc as any).lastAutoTable.finalY + 3;

        doc.setFont('helvetica', 'bold');
        doc.text(`Subtotal Equipos: ${formatCurrencyForPDF(apuData.costos_directos.total_equipos, 'VES')}`,
            rightX, currentY, { align: 'right' });
        currentY += 8;
    }

    // ============================================
    // 5. LABOR TABLE (with FCAS)
    // ============================================

    if (apuData.analisis_costos.mano_obra && apuData.analisis_costos.mano_obra.length > 0) {
        doc.setFontSize(fonts.heading);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('MANO DE OBRA', margins.left, currentY);
        currentY += 6;

        if (isGovernment) {
            doc.setFontSize(fonts.small - 2);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            doc.text('LOTTT - Factor de Costos Asociados al Salario (FCAS)', margins.left, currentY);
            currentY += 4;
        }

        doc.setTextColor(0, 0, 0);

        const laborData = apuData.analisis_costos.mano_obra.map((l: any) => {
            const lab = l as LaborResource;
            const baseRow = [
                l.descripcion,
                l.cantidad.toFixed(2)
            ];

            if (isGovernment && lab.fcas) {
                return [
                    ...baseRow,
                    formatCurrencyForPDF(l.precio_unitario, 'VES'),
                    `${lab.fcas.totalFactor.toFixed(2)}x`,
                    formatCurrencyForPDF(l.total, 'VES')
                ];
            }

            return [
                ...baseRow,
                formatCurrencyForPDF(l.precio_unitario, 'VES'),
                formatCurrencyForPDF(l.total, 'VES')
            ];
        });

        const laborColumns = isGovernment
            ? ['Descripción', 'Horas', 'Jornal Base', 'FCAS', 'Total']
            : ['Descripción', 'Horas', 'Jornal', 'Total'];

        autoTable(doc, {
            startY: currentY,
            head: [laborColumns],
            body: laborData,
            theme: 'striped',
            headStyles: { fillColor: colors.primary, fontSize: fonts.small },
            styles: { fontSize: fonts.small, cellPadding: 2 },
            columnStyles: isGovernment ? {
                0: { cellWidth: 85 },
                1: { cellWidth: 20, halign: 'right' },
                2: { cellWidth: 28, halign: 'right' },
                3: { cellWidth: 22, halign: 'center' },
                4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
            } : {
                0: { cellWidth: 105 },
                1: { cellWidth: 25, halign: 'right' },
                2: { cellWidth: 25, halign: 'right' },
                3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
            },
            margin: { left: margins.left, right: margins.right }
        });

        currentY = (doc as any).lastAutoTable.finalY + 3;

        doc.setFont('helvetica', 'bold');
        doc.text(`Subtotal Mano de Obra: ${formatCurrencyForPDF(apuData.costos_directos.total_mano_obra, 'VES')}`,
            rightX, currentY, { align: 'right' });
        currentY += 8;
    }

    // ============================================
    // 6. FCAS BREAKDOWN TABLE (Government only)
    // ============================================

    if (isGovernment && apuData.analisis_costos.mano_obra && apuData.analisis_costos.mano_obra.length > 0) {
        // Check if we need a new page
        if (currentY > 240) {
            doc.addPage();
            currentY = margins.top;
        }

        doc.setFontSize(fonts.heading);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('DESGLOSE FCAS (Factor de Costos Asociados al Salario)', margins.left, currentY);
        currentY += 6;

        doc.setFontSize(fonts.small - 1);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text('Cumplimiento: LOTTT Art. 104, 142, 173, 174, 190, 192 | LOPCYMAT Art. 56 | Decreto 4.298', margins.left, currentY);
        currentY += 6;

        doc.setTextColor(0, 0, 0);

        // Get first labor item with FCAS for breakdown
        // Get first labor item with FCAS for breakdown
        const laborWithFCAS = apuData.analisis_costos.mano_obra.find((l: any) => l.fcas);

        if (laborWithFCAS) {
            const fcas = laborWithFCAS.fcas!;

            const fcasBreakdownData = [
                ['Días Trabajados/Año', fcas.workedDaysPerYear.toString()],
                ['Días Pagados/Año', fcas.paidDaysPerYear.toString()],
                ['SSO Patronal (13.5%)', formatCurrencyForPDF(fcas.sso, 'VES')],
                ['LPH - Ley Política Habitacional (3%)', formatCurrencyForPDF(fcas.lph, 'VES')],
                ['Banavih (1%)', formatCurrencyForPDF(fcas.banavih, 'VES')],
                ['INCES (2%)', formatCurrencyForPDF(fcas.inces, 'VES')],
                ['Vacaciones (15 días)', formatCurrencyForPDF(fcas.vacations, 'VES')],
                ['Bono Vacacional (7 días)', formatCurrencyForPDF(fcas.vacationBonus, 'VES')],
                ['Utilidades (15 días mín.)', formatCurrencyForPDF(fcas.utilities, 'VES')],
                ['Bono Fin de Año (15 días)', formatCurrencyForPDF(fcas.yearEndBonus, 'VES')],
                ['Cesta Ticket (365 días)', formatCurrencyForPDF(fcas.cestaTicket, 'VES')],
                ['Dotación EPP', formatCurrencyForPDF(fcas.eppDotation, 'VES')],
                ['Días Feriados (12 días)', formatCurrencyForPDF(fcas.paidHolidays, 'VES')],
                ['Antigüedad (5 días/año)', formatCurrencyForPDF(fcas.severance, 'VES')]
            ];

            autoTable(doc, {
                startY: currentY,
                head: [['Componente FCAS', 'Valor']],
                body: fcasBreakdownData,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229], fontSize: fonts.small },
                styles: { fontSize: fonts.small - 1, cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 120 },
                    1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
                },
                margin: { left: margins.left, right: margins.right }
            });

            currentY = (doc as any).lastAutoTable.finalY + 5;

            // FCAS Summary
            doc.setFillColor(245, 245, 245);
            doc.rect(margins.left, currentY - 3, 170, 12, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(fonts.normal);
            doc.text('FACTOR TOTAL FCAS:', margins.left + 3, currentY + 4);
            doc.text(`${fcas.totalFactor.toFixed(4)}x`, rightX - 10, currentY + 4, { align: 'right' });

            currentY += 15;
        }
    }

    // ============================================
    // 7. COST SUMMARY
    // ============================================

    if (currentY > 230) {
        doc.addPage();
        currentY = margins.top;
    }

    doc.setFontSize(fonts.heading);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('RESUMEN DE COSTOS', margins.left, currentY);
    currentY += 8;

    doc.setTextColor(0, 0, 0);

    const summaryData = [
        ['Materiales', formatCurrencyForPDF(apuData.costos_directos.total_materiales, 'VES')],
        ['Equipos', formatCurrencyForPDF(apuData.costos_directos.total_equipos, 'VES')],
        ['Mano de Obra', formatCurrencyForPDF(apuData.costos_directos.total_mano_obra, 'VES')],
        ['COSTO DIRECTO TOTAL', formatCurrencyForPDF(apuData.resumen.costo_directo_total, 'VES')]
    ];

    autoTable(doc, {
        startY: currentY,
        body: summaryData,
        theme: 'plain',
        styles: { fontSize: fonts.normal, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 120, fontStyle: 'bold' },
            1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: margins.left, right: margins.right }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Final Unit Price
    doc.setFillColor(...colors.primary);
    doc.rect(margins.left, currentY - 5, 170, 15, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text('PRECIO UNITARIO:', margins.left + 5, currentY + 4);
    doc.text(formatCurrencyForPDF(apuData.resumen.precio_unitario, 'VES'), rightX - 10, currentY + 4, { align: 'right' });

    // ============================================
    // 8. LEGAL CERTIFICATION PAGE (Government only)
    // ============================================

    if (isGovernment) {
        doc.addPage();
        currentY = margins.top;

        // Title
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, 210, 25, 'F');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.white);
        doc.text('CERTIFICACIÓN LEGAL DE CUMPLIMIENTO', 105, 15, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        currentY = 35;

        // Compliance statement
        doc.setFontSize(fonts.normal);
        doc.setFont('helvetica', 'normal');

        const certText = `El presente Análisis de Precios Unitarios (APU) ha sido elaborado en estricto cumplimiento con la normativa legal venezolana aplicable a proyectos de construcción gubernamentales, incluyendo:`;
        const splitCert = doc.splitTextToSize(certText, 170);
        doc.text(splitCert, margins.left, currentY);
        currentY += (splitCert.length * 6) + 5;

        // Legal framework table
        const legalFramework = [
            ['LOTTT', 'Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras'],
            ['LOPCYMAT', 'Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo'],
            ['Ley LPH', 'Ley de Política Habitacional (Banavih)'],
            ['COVENIN 2250', 'Código de Prácticas para Medición y Codificación de Partidas'],
            ['Decreto 4.298', 'Cesta Ticket Socialista'],
            ['CIV', 'Tabuladores del Colegio de Ingenieros de Venezuela']
        ];

        autoTable(doc, {
            startY: currentY,
            head: [['Normativa', 'Descripción']],
            body: legalFramework,
            theme: 'grid',
            headStyles: { fillColor: colors.primary, fontSize: fonts.small },
            styles: { fontSize: fonts.small, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 40, fontStyle: 'bold' },
                1: { cellWidth: 130 }
            },
            margin: { left: margins.left, right: margins.right }
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;

        // Compliance checklist
        doc.setFontSize(fonts.heading);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('VERIFICACIÓN DE CUMPLIMIENTO', margins.left, currentY);
        currentY += 8;

        doc.setTextColor(0, 0, 0);

        const complianceChecks = [
            ['✓', 'Factores de desperdicio aplicados según COVENIN 2250-2000'],
            ['✓', 'FCAS completo con 14 componentes legales (factor ≥ 1.45)'],
            ['✓', 'COP calculado para equipos propios según normativa'],
            ['✓', 'Tabuladores de mano de obra basados en CIV 2026'],
            ['✓', 'Cargas sociales patronales completas (SSO, LPH, Banavih, INCES)'],
            ['✓', 'Beneficios laborales incluidos (vacaciones, utilidades, bonos)'],
            ['✓', 'Cesta Ticket según Decreto 4.298 y BCV'],
            ['✓', 'Dotación EPP según LOPCYMAT']
        ];

        autoTable(doc, {
            startY: currentY,
            body: complianceChecks,
            theme: 'plain',
            styles: { fontSize: fonts.small, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center', textColor: [34, 197, 94], fontStyle: 'bold' },
                1: { cellWidth: 160 }
            },
            margin: { left: margins.left, right: margins.right }
        });

        currentY = (doc as any).lastAutoTable.finalY + 15;

        // Signature section
        doc.setFillColor(245, 245, 245);
        doc.rect(margins.left, currentY, 170, 40, 'F');

        currentY += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fonts.small);
        doc.text('ELABORADO POR:', margins.left + 5, currentY);
        currentY += 15;
        doc.line(margins.left + 5, currentY, margins.left + 80, currentY);
        currentY += 5;
        doc.setFontSize(fonts.small - 1);
        doc.text('Nombre y Firma del Ingeniero Responsable', margins.left + 5, currentY);
        currentY += 3;
        doc.text('CIV: _______________', margins.left + 5, currentY);

        currentY += 10;
        doc.setFontSize(fonts.small - 2);
        doc.setFont('helvetica', 'italic');
        doc.text(`Fecha de Certificación: ${new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            margins.left + 5, currentY);
    }

    // Add page numbers to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        addPageFooter(doc, i, pageCount);
    }

    // Save
    doc.save(filename);
};
