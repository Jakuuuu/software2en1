import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cyber';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

        const variants = {

            primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 focus:ring-primary-500 shadow-lg shadow-primary-500/20 hover:shadow-cyan-500/40 border border-transparent",
            secondary: "glass-button text-slate-200 hover:text-white hover:bg-white/10 focus:ring-slate-500",
            outline: "border border-slate-600 text-slate-300 hover:border-primary-500 hover:text-primary-400 hover:bg-primary-900/10 focus:ring-primary-500 backdrop-blur-sm",
            ghost: "text-slate-400 hover:text-primary-400 hover:bg-primary-500/10",
            danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-500/20 hover:shadow-red-500/40",
            cyber: "bg-slate-900 border border-primary-500 text-primary-400 hover:bg-primary-900/30 hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-all duration-300"
        };

        const sizes = {
            sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
            md: "text-sm px-5 py-2.5 rounded-lg gap-2",
            lg: "text-base px-6 py-3 rounded-xl gap-2.5",
            icon: "p-2 rounded-lg aspect-square flex items-center justify-center",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || isLoading
                }
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />}
                {!isLoading && leftIcon}
                {children}
                {!isLoading && rightIcon}
            </button >
        );
    }
);

Button.displayName = "Button";
