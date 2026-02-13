"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Briefcase, Calculator, ChevronRight } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/projects', label: 'Proyectos', icon: Briefcase },
    ];

    const isActive = (path: string) => {
        if (path === '/' && pathname !== '/') return false;
        return pathname.startsWith(path);
    };

    return (
        <>
            <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
                <nav className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-7xl pointer-events-auto transition-all duration-300 hover:border-primary-500/30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo & Brand */}
                            <div className="flex items-center gap-4">
                                <Link href="/" className="flex items-center gap-2 group">
                                    <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-105">
                                        <Calculator className="text-white drop-shadow-md" size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-slate-100 leading-none tracking-tight group-hover:text-primary-400 transition-colors neon-text">
                                            2 en 1 APU
                                        </span>
                                        <span className="text-[9px] uppercase tracking-widest text-primary-500 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                            Engineering System
                                        </span>
                                    </div>
                                </Link>

                                {/* Context Breadcrumb (Desktop) */}
                                <div className="hidden md:flex items-center text-slate-500 text-sm ml-6 pl-6 border-l border-white/10">
                                    <span className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${pathname === '/' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-primary-500 shadow-[0_0_10px_#0ea5e9]'} animate-pulse`}></div>
                                        <span className="font-mono ml-1 text-xs tracking-wider opacity-70">SYSTEM_ONLINE</span>
                                    </span>
                                </div>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-2">
                                {navLinks.map((link) => {
                                    const active = isActive(link.href);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group
                                                ${active
                                                    ? 'text-white bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                                                }
                                            `}
                                        >
                                            <link.icon size={16} className={`${active ? 'text-primary-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]' : 'text-slate-500 group-hover:text-primary-400'} transition-colors`} />
                                            <span>{link.label}</span>
                                            {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-80"></div>}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl rounded-b-2xl overflow-hidden">
                            <div className="px-4 py-3 space-y-1">
                                {navLinks.map((link) => {
                                    const active = isActive(link.href);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors
                                                ${active
                                                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            <link.icon size={20} />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Spacer to prevent content hiding behind fixed navbar */}
            <div className="h-24"></div>
        </>
    );
}
