import React from 'react';
import { cn } from '@/utils/cn';

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

interface InputProps extends BaseInputProps, React.InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
}

interface SelectProps extends BaseInputProps, React.SelectHTMLAttributes<HTMLSelectElement> {
  as: 'select';
  children: React.ReactNode;
}

interface TextareaProps extends BaseInputProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
}

type ComponentProps = InputProps | SelectProps | TextareaProps;

const Input = React.forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, ComponentProps>(
  ({ label, error, helperText, className, as = 'input', ...props }, ref) => {
    const baseClasses = 'block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors';
    const errorClasses = error
      ? 'border-red-300 focus:ring-red-500'
      : 'border-gray-300 focus:ring-primary-500';

    const renderField = () => {
      if (as === 'select') {
        const { children, ...selectProps } = props as SelectProps;
        return (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={cn(baseClasses, errorClasses, 'bg-white', className)}
            {...selectProps}
          >
            {children}
          </select>
        );
      }

      if (as === 'textarea') {
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={cn(baseClasses, errorClasses, 'resize-none', className)}
            {...props as TextareaProps}
          />
        );
      }

      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={cn(baseClasses, errorClasses, className)}
          {...props as InputProps}
        />
      );
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        {renderField()}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 