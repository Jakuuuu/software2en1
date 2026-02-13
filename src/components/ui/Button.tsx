import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

        const variants = {
            primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md",
            secondary: "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500 shadow-sm",
            outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
            ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            danger: "bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-sm",
        };

        const sizes = {
            sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
            md: "text-sm px-4 py-2 rounded-lg gap-2",
            lg: "text-base px-6 py-3 rounded-lg gap-2.5",
            icon: "p-2 rounded-lg",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />}
                {!isLoading && leftIcon}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = "Button";
