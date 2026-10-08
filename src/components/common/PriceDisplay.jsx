import React from 'react';

/**
 * Reusable Price Display Primitive
 * Formats numbers into Indonesian Rupiah currency format
 */
export default function PriceDisplay({
  amount = 0,
  prefix = 'Rp ',
  suffix = '',
  size = 'md',
  className = '',
}) {
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(amount || 0);

  const sizes = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-semibold',
    lg: 'text-lg font-bold',
    xl: 'text-2xl font-bold tracking-tight',
  };

  return (
    <span className={`tabular-nums text-slate-900 ${sizes[size] || sizes.md} ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
