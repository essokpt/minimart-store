import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
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
            className={`w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline outline-none ${
              icon ? 'pl-12' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[10px] text-error font-bold uppercase tracking-widest">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
