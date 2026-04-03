import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  variant?: 'elevated' | 'flat' | 'outline';
  hover?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  variant = 'elevated', 
  hover = false,
  ...props 
}: CardProps) {
  const baseStyles = 'rounded-sm transition-all duration-300 border border-outline-variant/10';
  
  const variants = {
    elevated: 'bg-surface-container shadow-xl',
    flat: 'bg-surface-container-low',
    outline: 'bg-transparent border-outline-variant/30',
  };

  const hoverStyles = hover ? 'hover-scale cursor-pointer' : '';

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
