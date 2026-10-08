import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-primary border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}
