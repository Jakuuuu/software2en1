"use client";

import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface OnboardingProps {
    steps: Step[];
    run?: boolean;
    onComplete?: () => void;
    continuous?: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({
    steps,
    run = false,
    onComplete,
    continuous = true
}) => {
    const [runTour, setRunTour] = useState(run);

    useEffect(() => {
        setRunTour(run);
    }, [run]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            if (onComplete) {
                onComplete();
            }
        }
    };

    return (
        <Joyride
            steps={steps}
            run={runTour}
            continuous={continuous}
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#4f46e5',
                    zIndex: 10000,
                },
                tooltip: {
                    borderRadius: 12,
                    padding: 20,
                },
                buttonNext: {
                    backgroundColor: '#4f46e5',
                    borderRadius: 8,
                    padding: '8px 16px',
                },
                buttonBack: {
                    color: '#64748b',
                    marginRight: 10,
                },
                buttonSkip: {
                    color: '#94a3b8',
                },
            }}
            locale={{
                back: 'Atrás',
                close: 'Cerrar',
                last: 'Finalizar',
                next: 'Siguiente',
                skip: 'Saltar',
            }}
        />
    );
};

interface WelcomeModalProps {
    onStart: () => void;
    onSkip: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart, onSkip }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleSkip = () => {
        if (dontShowAgain) {
            localStorage.setItem('2en1apu-onboarding-skipped', 'true');
        }
        onSkip();
    };

    const handleStart = () => {
        localStorage.setItem('2en1apu-onboarding-completed', 'true');
        onStart();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏗️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        ¡Bienvenido a 2 en 1 APU! 👋
                    </h2>
                    <p className="text-slate-600">
                        Tu sistema profesional de gestión de obras
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Crear presupuestos detallados (APU)</p>
                            <p className="text-sm text-slate-500">Analiza costos de materiales, equipos y mano de obra</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Controlar avances de obra</p>
                            <p className="text-sm text-slate-500">Registra valuaciones periódicas y acumulados</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Generar carátulas de pago</p>
                            <p className="text-sm text-slate-500">Con IVA, amortizaciones y retenciones automáticas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                    <p className="text-sm text-indigo-900 font-medium">
                        ¿Quieres un tour rápido de 1 minuto?
                    </p>
                    <p className="text-xs text-indigo-700 mt-1">
                        Te mostraremos cómo usar cada módulo paso a paso
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSkip}
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Saltar
                    </button>
                    <button
                        onClick={handleStart}
                        className="flex-1 px-4 py-2.5 bg-indigo-600 rounded-lg font-medium text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Sí, mostrarme
                    </button>
                </div>

                <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-500">No mostrar de nuevo</span>
                </label>
            </div>
        </div>
    );
};

export default Onboarding;
