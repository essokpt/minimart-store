import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string | boolean;
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, size = 'medium', className = '', children, ...props }, ref) => {
    const sizeClasses = {
      small: 'py-2 px-3 text-xs',
      medium: 'py-3.5 px-4 text-sm',
      large: 'py-5 px-6 text-base',
    };

    return (
      <div className="space-y-2 w-full text-left">
        {label && (
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={cn(
              "w-full bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none outline-none font-bold",
              sizeClasses[size],
              error ? 'ring-1 ring-error' : '',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
            <ChevronDown size={size === 'small' ? 14 : 18} />
          </div>
        </div>
        {error && typeof error === 'string' && <p className="text-[10px] text-error font-bold uppercase tracking-widest">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
