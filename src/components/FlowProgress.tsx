import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface FlowStep {
    label: string;
    status: 'completed' | 'current' | 'pending';
    count?: number;
}

interface FlowProgressProps {
    steps: FlowStep[];
    className?: string;
}

export function FlowProgress({ steps, className = '' }: FlowProgressProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
            <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                Progreso del Flujo
            </h3>
            <div className="space-y-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                        {/* Icon */}
                        {step.status === 'completed' ? (
                            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                        ) : step.status === 'current' ? (
                            <Clock size={20} className="text-indigo-600 flex-shrink-0 animate-pulse" />
                        ) : (
                            <Circle size={20} className="text-slate-300 flex-shrink-0" />
                        )}

                        {/* Label */}
                        <div className="flex-1">
                            <span
                                className={`text-sm font-medium ${step.status === 'completed'
                                        ? 'text-emerald-700'
                                        : step.status === 'current'
                                            ? 'text-indigo-700'
                                            : 'text-slate-400'
                                    }`}
                            >
                                {step.label}
                            </span>
                            {step.count !== undefined && step.status !== 'pending' && (
                                <span className="ml-2 text-xs text-slate-500">
                                    ({step.count})
                                </span>
                            )}
                        </div>

                        {/* Connector line (except for last item) */}
                        {index < steps.length - 1 && (
                            <div className="absolute left-[30px] w-0.5 h-8 bg-slate-200 mt-8" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper hook to calculate flow status
export function useFlowStatus(partidasCount: number, valuationsCount: number): FlowStep[] {
    return [
        {
            label: 'Proyecto Creado',
            status: 'completed',
        },
        {
            label: 'Presupuesto y APU',
            status: partidasCount > 0 ? 'completed' : 'current',
            count: partidasCount,
        },
        {
            label: 'Valuaciones',
            status: valuationsCount > 0 ? 'completed' : partidasCount > 0 ? 'current' : 'pending',
            count: valuationsCount,
        },
    ];
}
