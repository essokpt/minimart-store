import { ReactNode } from 'react';
import { FormProvider as RHFFormProvider, UseFormReturn, FieldValues } from 'react-hook-form';
import { cn } from '../../lib/utils';

interface FormProviderProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  children: ReactNode;
  onSubmit: (data: T) => void;
  className?: string;
  id?: string;
}

export function FormProvider<T extends FieldValues>({
  form,
  children,
  onSubmit,
  className,
  id
}: FormProviderProps<T>) {
  return (
    <RHFFormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        {children}
      </form>
    </RHFFormProvider>
  );
}
