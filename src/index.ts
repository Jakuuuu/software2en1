
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import fs from "fs";

// Extend jsPDF to include autoTable
declare module "jspdf" {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

interface Item {
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Partida {
    code: string;
    description: string;
    unit: string;
    quantity: number;
    materials: Item[];
    equipment: Item[];
    labor: Item[];
    totalUnitPrice: number;
}

// Sample Data derived from common construction tasks
const samplePartida: Partida = {
    code: "E-411.110.120",
    description: "CONSTRUCCIÓN DE PARED DE BLOQUES DE CONCRETO, ACABADO OBRA LIMPIA POR UNA CARA, DE 15 CMS DE ESPESOR, INCLUYE MACHONES, VIGAS DE CORONA Y REFUERZO METÁLICO.",
    unit: "m2",
    quantity: 1.00,
    materials: [
        { description: "BLOQUE DE CONCRETO 15X20X40", unit: "UND", quantity: 12.50, unitPrice: 0.80, total: 10.00 },
        { description: "MORTERO 1:4", unit: "m3", quantity: 0.02, unitPrice: 150.00, total: 3.00 },
        { description: "ACERO DE REFUERZO", unit: "kg", quantity: 1.50, unitPrice: 1.20, total: 1.80 }
    ],
    equipment: [
        { description: "MEZCLADORA DE CONCRETO 1 SACO", unit: "hr", quantity: 0.10, unitPrice: 15.00, total: 1.50 },
        { description: "HERRAMIENTAS MENORES", unit: "%MO", quantity: 5.00, unitPrice: 1.00, total: 0.60 }
    ],
    labor: [
        { description: "ALBAÑIL DE 1RA", unit: "hr", quantity: 1.50, unitPrice: 5.00, total: 7.50 },
        { description: "AYUDANTE", unit: "hr", quantity: 1.50, unitPrice: 3.00, total: 4.50 }
    ],
    totalUnitPrice: 28.90 // Sum of above
};

export const generatePartidaPDF = (partida: Partida) => {
    const doc = new jsPDF();
    const filename = `Partida_${partida.code}.pdf`;

    // Header Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ANÁLISIS DE PRECIO UNITARIO", 105, 15, { align: "center" });

    // Partida Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Draw a box for header info
    doc.rect(14, 20, 182, 25);

    doc.setFont("helvetica", "bold");
    doc.text(`CÓDIGO:`, 16, 26);
    doc.setFont("helvetica", "normal");
    doc.text(partida.code, 40, 26);

    doc.setFont("helvetica", "bold");
    doc.text(`UNIDAD:`, 140, 26);
    doc.setFont("helvetica", "normal");
    doc.text(partida.unit, 160, 26);

    doc.setFont("helvetica", "bold");
    doc.text(`CANTIDAD:`, 140, 31);
    doc.setFont("helvetica", "normal");
    doc.text(partida.quantity.toFixed(2), 160, 31);

    doc.setFont("helvetica", "bold");
    doc.text(`DESCRIPCIÓN:`, 16, 31);
    doc.setFont("helvetica", "normal");

    // Wrap description
    const splitDescription = doc.splitTextToSize(partida.description, 160);
    doc.text(splitDescription, 16, 36);

    let currentY = 50;

    // Helper for tables
    const addTable = (title: string, items: Item[], startY: number) => {
        if (items.length === 0) return startY;

        doc.setFont("helvetica", "bold");
        doc.text(title, 14, startY - 2);

        // Prepare table body
        const body = items.map(item => [
            item.description,
            item.unit,
            item.quantity.toFixed(2),
            item.unitPrice.toFixed(2),
            item.total.toFixed(2)
        ]);

        doc.autoTable({
            startY: startY,
            head: [['Descripción', 'Unidad', 'Cantidad', 'Costo Unitario', 'Total']],
            body: body,
            theme: 'striped',
            headStyles: { fillColor: [52, 73, 94] },
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 'auto' }, // Description
                1: { cellWidth: 20 },      // Unit
                2: { cellWidth: 20, halign: 'right' }, // Qty
                3: { cellWidth: 25, halign: 'right' }, // Price
                4: { cellWidth: 25, halign: 'right' }  // Total
            }
        });

        return (doc as any).lastAutoTable.finalY + 10;
    };

    // 1. Materials
    currentY = addTable("MATERIALES", partida.materials, currentY);

    // 2. Equipment
    currentY = addTable("EQUIPOS", partida.equipment, currentY);

    // 3. Labor
    currentY = addTable("MANO DE OBRA", partida.labor, currentY);

    // Summary
    const totalMat = partida.materials.reduce((a, b) => a + b.total, 0);
    const totalEq = partida.equipment.reduce((a, b) => a + b.total, 0);
    const totalLab = partida.labor.reduce((a, b) => a + b.total, 0);

    // Draw Total Box
    const summaryY = currentY;
    const summaryX = 120;

    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN DE COSTOS", summaryX, summaryY);

    doc.setFont("helvetica", "normal");
    doc.text(`Total Materiales:`, summaryX, summaryY + 6);
    doc.text(totalMat.toFixed(2), 195, summaryY + 6, { align: "right" });

    doc.text(`Total Equipos:`, summaryX, summaryY + 12);
    doc.text(totalEq.toFixed(2), 195, summaryY + 12, { align: "right" });

    doc.text(`Total Mano de Obra:`, summaryX, summaryY + 18);
    doc.text(totalLab.toFixed(2), 195, summaryY + 18, { align: "right" });

    // Grand Total
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.rect(summaryX - 5, summaryY + 22, 85, 10, 'F'); // Fill box
    doc.setTextColor(255, 255, 255);
    doc.text(`PRECIO UNITARIO:`, summaryX, summaryY + 29);
    doc.text(partida.totalUnitPrice.toFixed(2), 195, summaryY + 29, { align: "right" });

    // Save to file
    const buffer = doc.output('arraybuffer');
    fs.writeFileSync(filename, Buffer.from(buffer));
    console.log(`PDF Generated successfully: ${filename}`);
};

// Run
generatePartidaPDF(samplePartida);
