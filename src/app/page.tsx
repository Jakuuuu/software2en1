"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { WelcomeModal, Onboarding } from '@/components/Onboarding';
import { onboardingSteps } from '@/data/onboarding-steps';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Check if user has completed or skipped onboarding
    const hasCompletedOnboarding = localStorage.getItem('2en1apu-onboarding-completed');
    const hasSkippedOnboarding = localStorage.getItem('2en1apu-onboarding-skipped');

    if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
      // Show welcome modal after a short delay
      setTimeout(() => setShowWelcome(true), 500);
    }
  }, []);

  const handleStartTour = () => {
    setShowWelcome(false);
    setRunTour(true);
  };

  const handleSkipTour = () => {
    setShowWelcome(false);
  };

  const handleTourComplete = () => {
    setRunTour(false);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-tech-pattern opacity-40 pointer-events-none"></div>

      {showWelcome && (
        <WelcomeModal onStart={handleStartTour} onSkip={handleSkipTour} />
      )}

      <Onboarding
        steps={onboardingSteps}
        run={runTour}
        onComplete={handleTourComplete}
      />

      <div className="text-center mb-12 relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-mono text-slate-500 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          SYSTEM_VERSION_2.0_STABLE
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Control de Obras <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
            Ingeniería de Precisión
          </span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 font-light">
          Sistema integral para la gestión de construcción. Optimizado para presupuestos APU y valuaciones de obra con metodología Pareto 80/20.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
          <Link href="/projects">
            <Button size="lg" className="shadow-xl shadow-primary-500/20 group">
              <span>Acceder al Sistema</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => setShowWelcome(true)}>
            Ver Tutorial Interactivo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
        <Link href="/projects" className="group" data-tour="budget-card">
          <Card className="h-full border-t-4 border-t-primary-500 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                <span className="text-2xl">📋</span>
              </div>
              <span className="font-mono text-xs text-slate-400">MOD_01</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">Presupuestos y APU</h3>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Análisis de Precios Unitarios detallado. Gestión de insumos y cálculo de costos directos con precisión.
            </p>
            <div className="flex items-center text-primary-600 text-sm font-semibold">
              <span>Iniciar Módulo</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </Card>
        </Link>

        <Link href="/projects" className="group" data-tour="valuation-card">
          <Card className="h-full border-t-4 border-t-emerald-500 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <span className="text-2xl">💰</span>
              </div>
              <span className="font-mono text-xs text-slate-400">MOD_02</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">Valuaciones de Obra</h3>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Control de avances y generación de reportes de pago. Seguimiento financiero del contrato en tiempo real.
            </p>
            <div className="flex items-center text-emerald-600 text-sm font-semibold">
              <span>Iniciar Módulo</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-200 w-full max-w-5xl text-center">
        <div className="inline-flex gap-8 text-sm text-slate-400 font-mono">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            BASE_DE_DATOS: CONECTADO
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            LATENCIA: 14ms
          </span>
        </div>
      </div>
    </main>
  );
}
