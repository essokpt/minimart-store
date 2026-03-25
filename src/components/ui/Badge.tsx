import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ 
  children, 
  variant = 'secondary', 
  className = '', 
  size = 'md' 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-widest border rounded-sm';
  
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary-container/50 text-on-secondary-container border-outline-variant/30',
    tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
    error: 'bg-error/10 text-error border-error/20',
    success: 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[8px]',
    md: 'px-3 py-1 text-[9px]',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
