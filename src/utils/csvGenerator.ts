import { Project, Valuation, Partida, Currency } from '../types';

export const generateValuationCSV = (
    valuation: Valuation,
    project: Project,
    partidas: Partida[]
) => {
    const currency = project.contract.currency;
    const separator = ';'; // Excel often prefers semicolon in some regions, or comma. Let's use semicolon for now or make it configurable. 
    // Actually, UTF-8 BOM + comma is standard. Let's stick to comma and quote fields.

    // Headers
    const headers = [
        'Código',
        'Descripción',
        'Unidad',
        'Cantidad Contratada',
        'Acumulado Anterior',
        'Esta Valuación',
        'Acumulado Total',
        `Precio Unitario (${currency})`,
        `Monto (${currency})`
    ];

    // Data rows
    const rows = valuation.items.map(item => {
        const partida = partidas.find(p => p.id === item.partidaId);
        if (!partida) return null;

        const previousAccum = partida.previousAccumulated || 0;
        const thisVal = item.quantity;
        const newAccum = previousAccum + thisVal;

        return [
            partida.code,
            `"${partida.description.replace(/"/g, '""')}"`, // Escape quotes
            partida.unit,
            partida.quantity,
            previousAccum,
            thisVal,
            newAccum,
            item.unitPrice,
            item.amount
        ];
    }).filter(Boolean);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row!.join(','))
    ].join('\n');

    // Add financial summary at the bottom
    const summaryStart = rows.length + 3;
    const summary = [
        ['', '', '', '', '', '', '', 'MONTO BRUTO', valuation.grossAmount],
        ['', '', '', '', '', '', '', `AMORTIZACIÓN ANTICIPO`, -valuation.deductions.advancePayment],
        ['', '', '', '', '', '', '', `IVA`, valuation.grossAmount * project.legalConfig.ivaRate],
        ['', '', '', '', '', '', '', `RETENCIÓN IVA`, -valuation.deductions.ivaRetention],
        ['', '', '', '', '', '', '', `RETENCIÓN ISLR`, -valuation.deductions.islrRetention],
        ['', '', '', '', '', '', '', `FONDO DE GARANTÍA`, -valuation.deductions.guaranteeFund],
        ['', '', '', '', '', '', '', 'MONTO NETO', valuation.netAmount]
    ];

    const summaryContent = summary.map(row => row.join(',')).join('\n');

    const finalContent = `\uFEFF${csvContent}\n\n${summaryContent}`; // Add BOM for Excel UTF-8 support

    // Create download link
    const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `Valuacion_${valuation.number}_${project.code}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
