"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration: number = 5000) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const getToastStyles = () => {
        switch (toast.type) {
            case 'success':
                return {
                    bg: 'bg-emerald-50 border-emerald-200',
                    text: 'text-emerald-800',
                    icon: <CheckCircle2 size={20} className="text-emerald-600" />,
                };
            case 'error':
                return {
                    bg: 'bg-red-50 border-red-200',
                    text: 'text-red-800',
                    icon: <AlertCircle size={20} className="text-red-600" />,
                };
            case 'warning':
                return {
                    bg: 'bg-amber-50 border-amber-200',
                    text: 'text-amber-800',
                    icon: <AlertTriangle size={20} className="text-amber-600" />,
                };
            case 'info':
                return {
                    bg: 'bg-blue-50 border-blue-200',
                    text: 'text-blue-800',
                    icon: <Info size={20} className="text-blue-600" />,
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className={`${styles.bg} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md flex items-start gap-3 animate-in slide-in-from-right duration-300`}
        >
            {styles.icon}
            <p className={`flex-1 text-sm font-medium ${styles.text}`}>{toast.message}</p>
            <button
                onClick={onClose}
                className={`${styles.text} hover:opacity-70 transition-opacity`}
            >
                <X size={18} />
            </button>
        </div>
    );
}
