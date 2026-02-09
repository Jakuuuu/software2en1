"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
            <Link
                href="/"
                className="flex items-center hover:text-indigo-600 transition-colors"
            >
                <Home size={16} />
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={16} className="text-slate-400" />
                    {item.href && index < items.length - 1 ? (
                        <Link
                            href={item.href}
                            className="hover:text-indigo-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-900 font-medium">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
