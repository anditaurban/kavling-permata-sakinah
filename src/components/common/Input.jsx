import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    type = 'text',
    id,
    name,
    placeholder,
    className = '',
    required = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    ...props
  },
  ref
) {
  const inputId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {LeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <LeftIcon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-lg border text-sm transition-colors
            ${LeftIcon ? 'pl-9' : 'pl-3.5'}
            ${RightIcon ? 'pr-9' : 'pr-3.5'}
            py-2 bg-white text-slate-900 placeholder:text-slate-400
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary'
            }
            ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
            <RightIcon className="h-4 w-4" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

export default Input;
