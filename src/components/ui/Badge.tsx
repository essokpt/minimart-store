import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info';
  className?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export function Badge({ 
  children, 
  variant = 'secondary', 
  className = '', 
  size = 'md',
  onClick
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-widest border rounded-sm';
  
  const variants = {
    primary: 'bg-primary/20 text-primary border-primary/30',
    secondary: 'bg-secondary-container/80 text-on-secondary-container border-outline-variant/50',
    tertiary: 'bg-tertiary/20 text-tertiary border-tertiary/30',
    error: 'bg-error/20 text-error border-error/30',
    success: 'bg-green-500/20 text-green-700 border-green-500/40 dark:bg-green-900/40 dark:text-green-300',
    warning: 'bg-amber-500/20 text-amber-700 border-amber-500/40 dark:bg-amber-900/40 dark:text-amber-300',
    info: 'bg-blue-500/20 text-blue-700 border-blue-500/40 dark:bg-blue-900/40 dark:text-blue-300',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3.5 py-1.5 text-[11px]',
  };

  return (
    <span 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
