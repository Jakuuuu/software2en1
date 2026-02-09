import { Step } from 'react-joyride';

export const onboardingSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div className="text-left">
                <h2 className="text-xl font-bold mb-3">¡Bienvenido a 2 en 1 APU! 👋</h2>
                <p className="mb-2">
                    Este sistema te ayuda a gestionar tus proyectos de construcción de forma profesional.
                </p>
                <p className="text-sm text-slate-600">
                    Combina dos herramientas esenciales: <strong>Presupuestos</strong> y <strong>Valuaciones</strong>.
                </p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '[data-tour="budget-card"]',
        content: (
            <div className="text-left">
                <h3 className="font-bold mb-2">📋 Paso 1: Presupuestos y APU</h3>
                <p className="mb-2">
                    Aquí creas el <strong>presupuesto inicial</strong> de tu proyecto:
                </p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>Define partidas de obra</li>
                    <li>Analiza precios unitarios (APU)</li>
                    <li>Genera reportes en PDF</li>
                </ul>
                <p className="text-xs text-slate-600 mt-2">
                    💡 Esto se hace <strong>antes</strong> de iniciar la obra.
                </p>
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: '[data-tour="valuation-card"]',
        content: (
            <div className="text-left">
                <h3 className="font-bold mb-2">💰 Paso 2: Valuaciones</h3>
                <p className="mb-2">
                    Aquí controlas los <strong>avances de obra</strong> y generas pagos:
                </p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>Registra avances periódicos</li>
                    <li>Controla acumulados vs contratado</li>
                    <li>Calcula retenciones y amortizaciones</li>
                    <li>Genera carátulas de pago</li>
                </ul>
                <p className="text-xs text-slate-600 mt-2">
                    💡 Esto se hace <strong>durante</strong> la ejecución de la obra.
                </p>
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: 'body',
        content: (
            <div className="text-left">
                <h3 className="font-bold mb-2">🎯 Secuencia Lógica</h3>
                <div className="bg-indigo-50 p-3 rounded-lg mb-3">
                    <p className="text-sm font-medium text-indigo-900">
                        1️⃣ Primero → Crea tu <strong>Presupuesto</strong>
                    </p>
                    <p className="text-sm font-medium text-indigo-900 mt-1">
                        2️⃣ Después → Registra <strong>Valuaciones</strong>
                    </p>
                </div>
                <p className="text-sm text-slate-600">
                    Durante el recorrido verás iconos <strong>(?)</strong> con ayuda contextual. ¡Úsalos cuando tengas dudas!
                </p>
            </div>
        ),
        placement: 'center',
    },
];

export const budgetPageSteps: Step[] = [
    {
        target: '[data-tour="new-partida-btn"]',
        content: 'Haz clic aquí para agregar una nueva partida a tu presupuesto.',
        placement: 'left',
    },
    {
        target: '[data-tour="partida-item"]',
        content: 'Cada partida muestra su código, descripción, cantidad y precio unitario. Haz clic para expandir y ver el análisis APU.',
        placement: 'bottom',
    },
];

export const valuationPageSteps: Step[] = [
    {
        target: '[data-tour="valuation-table"]',
        content: 'En esta tabla registras el avance de cada partida. La columna "Esta Valuación" es editable.',
        placement: 'top',
    },
    {
        target: '[data-tour="valuation-cover"]',
        content: 'Aquí se calcula el monto final a pagar, considerando IVA, amortizaciones y retenciones.',
        placement: 'left',
    },
];
