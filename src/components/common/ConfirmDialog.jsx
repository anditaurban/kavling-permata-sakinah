import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'danger',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex gap-4 items-start">
        <div
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-primary'
          }`}
        >
          {variant === 'danger' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
