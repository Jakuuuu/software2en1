import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    action?: React.ReactNode;
    noPadding?: boolean;
}

export const Card = ({
    children,
    className = '',
    title,
    description,
    footer,
    action,
    noPadding = false,
    ...props
}: CardProps) => {
    return (
        <div
            className={`tech-card transition-all duration-300 hover:shadow-glow-md hover:border-primary-500/30 group ${className}`}
            {...props}
        >
            {(title || description || action) && (
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <div>
                        {title && <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary-400 transition-colors">{title}</h3>}
                        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5 rounded-b-xl backdrop-blur-sm">
                    {footer}
                </div>
            )}
        </div>
    );
};
