import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: ReactNode;
  className?: string;
  loading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  loading = false,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-headline font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-sm relative';
  
  const variants = {
    primary: 'bg-primary text-on-primary shadow-lg shadow-primary/20 border-t border-white/20 hover:bg-primary/90',
    secondary: 'bg-secondary-container text-on-secondary-container hover:bg-surface-container-highest',
    outline: 'border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
    ghost: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
    error: 'bg-error text-on-error hover:bg-error/90 shadow-lg shadow-error/20 border-t border-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-2.5',
  };

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={cn(loading && 'opacity-0')}>{children}</span>
    </motion.button>
  );
}
