"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { WelcomeModal, Onboarding } from '@/components/Onboarding';
import { onboardingSteps } from '@/data/onboarding-steps';

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
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      {showWelcome && (
        <WelcomeModal onStart={handleStartTour} onSkip={handleSkipTour} />
      )}

      <Onboarding
        steps={onboardingSteps}
        run={runTour}
        onComplete={handleTourComplete}
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          2 en 1 <span className="text-indigo-600">APU</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-6">
          Sistema de gestión de obras simplificado. Pareto 80/20: Presupuestos, APU y Valuaciones.
        </p>

        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
          <span>¿Cómo funciona?</span>
          <span className="font-bold">① Proyectos</span>
          <span>→</span>
          <span className="font-bold">② Presupuesto</span>
          <span>→</span>
          <span className="font-bold">③ Valuaciones</span>
        </div>

        {/* Quick Access to Projects */}
        <Link
          href="/projects"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          <span>🏗️</span>
          <span>Ver Mis Proyectos</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/projects" className="group" data-tour="budget-card">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 h-full relative overflow-hidden">
            <div className="absolute top-4 right-4 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
              1
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">Presupuesto y APU</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Gestiona partidas y análisis de precios unitarios dentro de tus proyectos.
            </p>
            <div className="text-sm text-indigo-600 font-medium">
              Ir a Proyectos →
            </div>
          </div>
        </Link>

        <Link href="/projects" className="group" data-tour="valuation-card">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 h-full relative overflow-hidden">
            <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
              2
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💰</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">Valuaciones</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Carga avances y genera reportes de pago para cada contrato.
            </p>
            <div className="text-sm text-emerald-600 font-medium">
              Ir a Proyectos →
            </div>
          </div>
        </Link>
      </div>

      <button
        onClick={() => setShowWelcome(true)}
        className="mt-8 text-sm text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
      >
        <span>💡</span>
        <span>¿Nuevo aquí? Ver tutorial</span>
      </button>
    </main>
  );
}
