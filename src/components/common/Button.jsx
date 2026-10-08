import React from 'react';

/**
 * Reusable Button Primitive
 * Variants: primary, secondary, outline, danger, ghost
 * Sizes: sm, md, lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-primary hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm focus-visible:ring-primary',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus-visible:ring-slate-400',
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus-visible:ring-red-500',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus-visible:ring-slate-400',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
