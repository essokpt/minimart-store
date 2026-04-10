/**
 * Centralized formatting utilities for the Minimart Pro ecosystem.
 * Supports configurable currency symbols and consistent date patterns.
 */

interface FormatOptions {
  currencySymbol?: string;
  showSymbol?: boolean;
}

/**
 * Formats a number as a currency string.
 * Defaults to '$' if no symbol is provided, but can be configured globally.
 */
export const formatCurrency = (
  value: number | undefined | null,
  options: FormatOptions = { currencySymbol: '$', showSymbol: true }
): string => {
  const amount = value || 0;
  const formattedAmount = amount.toFixed(2);
  
  if (!options.showSymbol) {
    return formattedAmount;
  }

  return `${options.currencySymbol}${formattedAmount}`;
};

/**
 * Formats a date string or object into a consistent readable format.
 */
export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date with time.
 */
export const formatDateTime = (date: string | Date | undefined | null): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
