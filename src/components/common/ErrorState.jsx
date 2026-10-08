import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Tidak dapat memuat data. Silakan coba kembali sesaat lagi.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-xl border border-red-200/80 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry}>
            Muat Ulang
          </Button>
        </div>
      )}
    </div>
  );
}
