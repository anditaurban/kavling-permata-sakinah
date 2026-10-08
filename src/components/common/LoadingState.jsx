import React from 'react';

export default function LoadingState({
  text = 'Memuat data...',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200/60 ${className}`}>
      <div className="relative w-9 h-9">
        <div className="w-9 h-9 border-3 border-brand-100 rounded-full" />
        <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
      </div>
      <p className="text-xs text-slate-500 mt-3 font-medium">{text}</p>
    </div>
  );
}
