"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Calculator, ClipboardList, Settings, Download, X, Menu } from 'lucide-react';

interface QuickActionsProps {
    projectId: string;
    currentPage?: 'dashboard' | 'budget' | 'valuations' | 'config';
}

export function QuickActions({ projectId, currentPage }: QuickActionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            href: `/projects/${projectId}`,
            color: 'text-slate-600 hover:bg-slate-100',
        },
        {
            id: 'budget',
            label: 'Presupuesto',
            icon: Calculator,
            href: `/projects/${projectId}/budget`,
            color: 'text-indigo-600 hover:bg-indigo-100',
        },
        {
            id: 'valuations',
            label: 'Valuaciones',
            icon: ClipboardList,
            href: `/projects/${projectId}/valuations`,
            color: 'text-emerald-600 hover:bg-emerald-100',
        },
        {
            id: 'config',
            label: 'Configuración',
            icon: Settings,
            href: `/projects/${projectId}/config`,
            color: 'text-slate-600 hover:bg-slate-100',
        },
    ];

    // Filter out current page
    const availableActions = actions.filter(action => action.id !== currentPage);

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Action buttons */}
            {isOpen && (
                <div className="mb-3 space-y-2 animate-in slide-in-from-bottom duration-200">
                    {availableActions.map((action, index) => (
                        <Link
                            key={action.id}
                            href={action.href}
                            className={`flex items-center gap-3 bg-white shadow-lg rounded-full px-4 py-3 ${action.color} transition-all hover:scale-105 border border-slate-200`}
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                        >
                            <action.icon size={20} />
                            <span className="font-medium text-sm whitespace-nowrap">{action.label}</span>
                        </Link>
                    ))}
                </div>
            )}

            {/* Main FAB button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${isOpen
                        ? 'bg-slate-600 text-white rotate-90'
                        : 'bg-indigo-600 text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
    );
}
