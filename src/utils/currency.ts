// ============================================
// CURRENCY UTILITIES
// ============================================

import { Currency } from '../types';

/**
 * Format currency based on type (VES or USD)
 */
export const formatCurrency = (
    amount: number | undefined | null,
    currency: Currency,
    includeSymbol: boolean = true
): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return currency === 'USD' ? '$0.00' : 'Bs. 0.00';
    }

    const formatted = amount.toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    if (!includeSymbol) return formatted;

    return currency === 'USD' ? `$${formatted}` : `Bs. ${formatted}`;
};

/**
 * Convert VES to USD
 */
export const convertVEStoUSD = (amountVES: number, exchangeRate: number): number => {
    return amountVES / exchangeRate;
};

/**
 * Convert USD to VES
 */
export const convertUSDtoVES = (amountUSD: number, exchangeRate: number): number => {
    return amountUSD * exchangeRate;
};

/**
 * Get/Set exchange rate from localStorage
 */
const EXCHANGE_RATE_KEY = '2en1apu-exchange-rate';
const EXCHANGE_RATE_DATE_KEY = '2en1apu-exchange-rate-date';

export const getStoredExchangeRate = (): { rate: number; date: string } | null => {
    const rate = localStorage.getItem(EXCHANGE_RATE_KEY);
    const date = localStorage.getItem(EXCHANGE_RATE_DATE_KEY);

    if (!rate || !date) return null;

    return {
        rate: parseFloat(rate),
        date
    };
};

export const setStoredExchangeRate = (rate: number): void => {
    localStorage.setItem(EXCHANGE_RATE_KEY, rate.toString());
    localStorage.setItem(EXCHANGE_RATE_DATE_KEY, new Date().toISOString());
};

/**
 * Check if exchange rate needs update (older than 24 hours)
 */
export const shouldUpdateExchangeRate = (): boolean => {
    const stored = getStoredExchangeRate();
    if (!stored) return true;

    const lastUpdate = new Date(stored.date);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    return hoursDiff > 24;
};
