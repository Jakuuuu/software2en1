"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, FileText, Calculator, Settings } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/projects', label: 'Proyectos', icon: Briefcase },
        { href: '/budget', label: 'Presupuesto', icon: Calculator },
        { href: '/valuations', label: 'Valuaciones', icon: FileText },
    ];

    return (
        <>
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Calculator className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold text-slate-800 hidden sm:inline">
                                2 en 1 APU
                            </span>
                            <span className="text-xl font-bold text-slate-800 sm:hidden">
                                APU
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <link.icon size={18} />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                                >
                                    <link.icon size={20} />
                                    <span className="font-medium text-base">{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/20 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
