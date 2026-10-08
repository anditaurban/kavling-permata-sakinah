import React, { forwardRef } from 'react';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    id,
    name,
    options = [],
    placeholder = 'Pilih salah satu...',
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const selectId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        name={name}
        required={required}
        className={`block w-full rounded-lg border text-sm py-2 px-3 bg-white text-slate-900 transition-colors
          ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary'
          }
          ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

export default Select;
