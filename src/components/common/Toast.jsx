import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-slate-800',
    warning: 'border-amber-200 bg-white text-slate-800',
    danger: 'border-red-200 bg-white text-slate-800',
    info: 'border-blue-200 bg-white text-slate-800',
  };

  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-lg border shadow-lg ${borders[type] || borders.info} animate-in fade-in slide-in-from-bottom-2 duration-150`}
      role="status"
    >
      {icons[type] || icons.info}
      <div className="flex-1 text-xs font-medium leading-relaxed">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
