import { forwardRef, ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useFormContext, Controller, RegisterOptions, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '../../lib/utils';

interface BaseFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
}

// Text Input Field
interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'size'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
}

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

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ name, label, helperText, containerClassName, size = 'medium', icon, className, ...props }, ref) => {
    const { register, formState: { errors }, watch } = useFormContext();
    const error = errors[name]?.message as string | undefined;
    const value = watch(name);
   //console.log(`Rendering InputField: name=${name}, value=${value}, error=${error}`);
    return (
      <div className={cn("space-y-1 w-full", containerClassName)}>
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
            {...register(name, { ...props.required ? { required: `${label || 'This field'} is required` } : undefined })}
            ref={ref}
            defaultValue={value}
            className={cn(
              "w-full bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline outline-none font-bold text-on-surface",
              sizeClasses[size],
              icon ? iconPadding[size] : '',
              error ? 'ring-1 ring-error' : '',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-[10px] text-error font-bold uppercase tracking-widest">{error}</p>
        ) : helperText ? (
          <p className="text-[10px] text-on-surface-variant/60 font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

// Number Input Field
interface NumberFieldProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ name, label, helperText, containerClassName, ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
      <div className={cn("space-y-1 w-full", containerClassName)}>
        {label && (
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {label}
          </label>
        )}
        <input
          type="number"
          {...register(name, { valueAsNumber: true })}
          ref={ref}
          className={cn(
            "w-full bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline outline-none font-bold text-on-surface py-3 px-4 text-sm",
            error ? 'ring-1 ring-error' : ''
          )}
          {...props}
        />
        {error ? (
          <p className="text-[10px] text-error font-bold uppercase tracking-widest">{error}</p>
        ) : helperText ? (
          <p className="text-[10px] text-on-surface-variant/60 font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

NumberField.displayName = 'NumberField';

// Select Field
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends BaseFieldProps {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ name, label, options, placeholder, helperText, containerClassName, disabled }, ref) => {
    const { register, formState: { errors }, watch } = useFormContext();
    const error = errors[name]?.message as string | undefined;
    const value = watch(name);

    return (
      <div className={cn("space-y-1 w-full", containerClassName)}>
        {label && (
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {label}
          </label>
        )}
        <select
          {...register(name)}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none font-bold text-on-surface py-3 px-4 text-sm appearance-none cursor-pointer",
            error ? 'ring-1 ring-error' : '',
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-[10px] text-error font-bold uppercase tracking-widest">{error}</p>
        ) : helperText ? (
          <p className="text-[10px] text-on-surface-variant/60 font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

// Textarea Field
interface TextareaFieldProps extends BaseFieldProps {
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ name, label, rows = 3, helperText, containerClassName, ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
      <div className={cn("space-y-1 w-full", containerClassName)}>
        {label && (
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {label}
          </label>
        )}
        <textarea
          {...register(name)}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline outline-none font-bold text-on-surface py-3 px-4 text-sm resize-none",
            error ? 'ring-1 ring-error' : ''
          )}
          {...props}
        />
        {error ? (
          <p className="text-[10px] text-error font-bold uppercase tracking-widest">{error}</p>
        ) : helperText ? (
          <p className="text-[10px] text-on-surface-variant/60 font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

TextareaField.displayName = 'TextareaField';
