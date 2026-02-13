import React from 'react';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'active' | 'planning' | 'paused' | 'completed' | 'archived';

interface StatusBadgeProps {
    status: string;
    type?: StatusType;
    className?: string;
}

export const StatusBadge = ({ status, type, className = '' }: StatusBadgeProps) => {

    // Auto-detect type if not provided, based on common status strings
    const detectType = (s: string): StatusType => {
        const lower = s.toLowerCase();
        if (['active', 'en ejecución', 'running'].includes(lower)) return 'active';
        if (['planning', 'planificación', 'draft'].includes(lower)) return 'planning';
        if (['paused', 'pausado', 'hold'].includes(lower)) return 'paused';
        if (['completed', 'completado', 'done', 'success'].includes(lower)) return 'completed';
        if (['error', 'failed', 'danger'].includes(lower)) return 'error';
        if (['warning', 'pending'].includes(lower)) return 'warning';
        return 'neutral';
    };

    const finalType = type || detectType(status);

    const styles = {
        active: "bg-emerald-100 text-emerald-800 border-emerald-200",
        success: "bg-emerald-100 text-emerald-800 border-emerald-200",
        completed: "bg-blue-100 text-blue-800 border-blue-200",
        planning: "bg-indigo-100 text-indigo-800 border-indigo-200",
        paused: "bg-amber-100 text-amber-800 border-amber-200",
        warning: "bg-amber-100 text-amber-800 border-amber-200",
        error: "bg-red-100 text-red-800 border-red-200",
        info: "bg-sky-100 text-sky-800 border-sky-200",
        neutral: "bg-slate-100 text-slate-600 border-slate-200",
        archived: "bg-slate-100 text-slate-600 border-slate-200",
    };

    const icons = {
        active: "⚡",
        success: "✅",
        completed: "🏁",
        planning: "📋",
        paused: "⏸️",
        warning: "⚠️",
        error: "🚨",
        info: "ℹ️",
        neutral: "⚪",
        archived: "📦",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[finalType]} ${className}`}>
            {/* Optional: Add icon if needed, or keep it text only for cleaner look */}
            {/* <span>{icons[finalType]}</span> */}
            {status}
        </span>
    );
};
