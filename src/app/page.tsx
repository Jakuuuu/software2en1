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
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden text-slate-200">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {showWelcome && (
        <WelcomeModal onStart={handleStartTour} onSkip={handleSkipTour} />
      )}

      <Onboarding
        steps={onboardingSteps}
        run={runTour}
        onComplete={handleTourComplete}
      />

      <div className="text-center mb-16 relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-primary-400 mb-8 shadow-glow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
          SYSTEM_VERSION_2.0_STABLE
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
          Control de Obras <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-400 to-indigo-400 animate-text-shimmer bg-[size:200%_auto]">
            Ingeniería de Precisión
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Sistema integral para la gestión de construcción. Optimizado para presupuestos APU y valuaciones de obra con metodología Pareto 80/20.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-2">
          <Link href="/projects">
            <Button size="lg" variant="cyber" className="shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.5)] group h-14 px-8 text-lg">
              <span>Acceder al Sistema</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
          <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setShowWelcome(true)}>
            Ver Tutorial Interactivo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
        <Link href="/projects" className="group" data-tour="budget-card">
          <Card className="h-full bg-slate-900/40 border-primary-500/20 glass-panel hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-primary-500/10 rounded-2xl border border-primary-500/20 flex items-center justify-center text-primary-400 shadow-[0_0_15px_rgba(14,165,233,0.2)] group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📋</span>
              </div>
              <span className="font-mono text-xs text-primary-500/50 bg-primary-500/5 px-2 py-1 rounded border border-primary-500/10">MOD_01</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-primary-400 transition-colors relative z-10">Presupuestos y APU</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">
              Análisis de Precios Unitarios detallado. Gestión de insumos y cálculo de costos directos con precisión milimétrica.
            </p>
            <div className="flex items-center text-primary-400 text-sm font-bold tracking-wide relative z-10">
              <span>INICIAR MÓDULO</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">→</span>
            </div>
          </Card>
        </Link>

        <Link href="/projects" className="group" data-tour="valuation-card">
          <Card className="h-full bg-slate-900/40 border-emerald-500/20 glass-panel hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💰</span>
              </div>
              <span className="font-mono text-xs text-emerald-500/50 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">MOD_02</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors relative z-10">Valuaciones de Obra</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">
              Control de avances y generación de reportes de pago. Seguimiento financiero del contrato en tiempo real.
            </p>
            <div className="flex items-center text-emerald-400 text-sm font-bold tracking-wide relative z-10">
              <span>INICIAR MÓDULO</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">→</span>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-20 pt-8 border-t border-white/5 w-full max-w-5xl text-center relative z-10">
        <div className="inline-flex gap-8 text-xs text-slate-500 font-mono uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></span>
            BASE_DE_DATOS: CONECTADO
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_5px_#0ea5e9]"></span>
            LATENCIA: 14ms
          </span>
        </div>
      </div>
    </main>
  );
}
