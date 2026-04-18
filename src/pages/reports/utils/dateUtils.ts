export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function endOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  d.setHours(23, 59, 59, 999);
  return d;
}

export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function subtractDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

export function subtractWeeks(date: Date, weeks: number): Date {
  return subtractDays(date, weeks * 7);
}

export function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

export function getDateRangeForPeriod(
  period: 'today' | 'weekly' | 'monthly' | 'custom',
  customStart?: string,
  customEnd?: string
): { startDate: Date; endDate: Date } {
  const now = new Date();

  switch (period) {
    case 'today':
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };
    case 'weekly':
      return {
        startDate: startOfWeek(now),
        endDate: endOfWeek(now),
      };
    case 'monthly':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
    case 'custom':
      return {
        startDate: customStart ? new Date(customStart) : startOfDay(now),
        endDate: customEnd ? endOfDay(new Date(customEnd)) : endOfDay(now),
      };
    default:
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };
  }
}

export function formatDateForDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function groupByDate<T extends { created_at?: string; date?: string }>(
  items: T[],
  groupBy: 'daily' | 'weekly' | 'monthly'
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};

  items.forEach((item) => {
    const dateStr = item.created_at || item.date || '';
    if (!dateStr) return;

    const date = new Date(dateStr);
    let key: string;

    switch (groupBy) {
      case 'daily':
        key = formatDateKey(date);
        break;
      case 'weekly':
        key = formatDateKey(startOfWeek(date));
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = formatDateKey(date);
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  return groups;
}
