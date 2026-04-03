import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string | boolean;
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, size = 'medium', className = '', ...props }, ref) => {
    const sizeClasses = {
      small: 'py-2 px-3 text-xs',
      medium: 'py-3 px-4 text-sm',
      large: 'py-5 px-6 text-base',
    };

    const iconPadding = {
      small: 'pl-9',
      medium: 'pl-12',
      large: 'pl-14',
    };
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline outline-none font-bold",
              sizeClasses[size],
              icon ? iconPadding[size] : '',
              error ? 'ring-1 ring-error' : '',
              className
            )}
            {...props}
          />
        </div>
        {error && typeof error === 'string' && <p className="text-[10px] text-error font-bold uppercase tracking-widest">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
