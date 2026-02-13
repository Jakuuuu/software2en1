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
            <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:bg-primary-500 transition-colors">
                                    <Calculator className="text-white" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-slate-100 leading-none tracking-tight group-hover:text-white transition-colors">
                                        2 en 1 APU
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold text-opacity-80">
                                        Engineering System
                                    </span>
                                </div>
                            </Link>

                            {/* Context Breadcrumb (Desktop) */}
                            <div className="hidden md:flex items-center text-slate-500 text-sm ml-4 pl-4 border-l border-slate-700">
                                <span className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${pathname === '/' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]'}`}></div>
                                    <span className="font-mono ml-2">SYSTEM_ONLINE</span>
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                                            ${active
                                                ? 'bg-slate-800 text-primary-400 border border-slate-700 shadow-sm'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                            }
                                        `}
                                    >
                                        <link.icon size={16} className={active ? 'text-primary-400' : 'text-slate-500'} />
                                        <span>{link.label}</span>
                                        {active && <div className="ml-1 w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden border-t border-slate-800 bg-slate-900">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors
                                            ${active
                                                ? 'bg-slate-800 text-primary-400'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
