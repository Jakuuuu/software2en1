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
            className={`bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-200 ${className}`}
            {...props}
        >
            {(title || description || action) && (
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
                        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    {footer}
                </div>
            )}
        </div>
    );
};
