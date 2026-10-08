import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

export default function Search({
  value,
  onChange,
  placeholder = 'Cari...',
  onClear,
  className = '',
  size = 'md',
}) {
  const sizes = {
    sm: 'py-1.5 pl-8 pr-7 text-xs',
    md: 'py-2 pl-9 pr-8 text-sm',
  };

  return (
    <div className={`relative w-full max-w-xs ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
        <SearchIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors ${sizes[size] || sizes.md}`}
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange(''))}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          aria-label="Bersihkan pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
