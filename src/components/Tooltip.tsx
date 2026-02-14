import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps {
    children: React.ReactNode;
    content: string | React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    delayDuration?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    side = 'top',
    delayDuration = 300
}) => {
    return (
        <TooltipPrimitive.Provider delayDuration={delayDuration}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        className="z-50 overflow-hidden rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-xs"
                        sideOffset={5}
                    >
                        {content}
                        <TooltipPrimitive.Arrow className="fill-slate-900" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
};

interface InfoTooltipProps {
    content: string | React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    triggerClassName?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, side = 'top', triggerClassName }) => {
    return (
        <Tooltip content={content} side={side}>
            <button className={`inline-flex items-center justify-center w-4 h-4 ml-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors ${triggerClassName || ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
            </button>
        </Tooltip>
    );
};

export default Tooltip;
