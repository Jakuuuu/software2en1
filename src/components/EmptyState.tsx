import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
        disabled?: boolean;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    iconColor?: string;
    iconBgColor?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    primaryAction,
    secondaryAction,
    iconColor = 'text-slate-400',
    iconBgColor = 'bg-slate-100'
}: EmptyStateProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className={`w-16 h-16 ${iconBgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon size={32} className={iconColor} />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">{title}</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">{description}</p>

            <div className="flex items-center justify-center gap-3">
                {primaryAction && (
                    <button
                        onClick={primaryAction.onClick}
                        disabled={primaryAction.disabled}
                        className="px-5 py-2.5 bg-indigo-600 rounded-lg font-medium text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {primaryAction.label}
                    </button>
                )}
                {secondaryAction && (
                    <button
                        onClick={secondaryAction.onClick}
                        className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
                    >
                        {secondaryAction.label}
                    </button>
                )}
            </div>
        </div>
    );
}
