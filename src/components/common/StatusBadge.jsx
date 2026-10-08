import React from 'react';

const STATUS_CONFIG = {
  // Kavling Statuses
  AVAILABLE: { label: 'Tersedia', variant: 'success', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  BOOKED: { label: 'Dibooking', variant: 'warning', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  SOLD: { label: 'Terjual', variant: 'danger', bg: 'bg-slate-100 text-slate-500 border-slate-200 line-through decoration-slate-400' },
  INACTIVE: { label: 'Non-aktif', variant: 'default', bg: 'bg-slate-100 text-slate-600 border-slate-200' },

  // Transaction Statuses
  DRAFT: { label: 'Draft', variant: 'default', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
  ACTIVE: { label: 'Aktif / Berjalan', variant: 'info', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  COMPLETED: { label: 'Selesai / Lunas', variant: 'success', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Dibatalkan', variant: 'danger', bg: 'bg-red-50 text-red-700 border-red-200' },

  // Payment Statuses
  PAID: { label: 'Lunas', variant: 'success', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PARTIAL: { label: 'Sebagian', variant: 'warning', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  UNPAID: { label: 'Belum Bayar', variant: 'danger', bg: 'bg-red-50 text-red-700 border-red-200' },
  OVERDUE: { label: 'Jatuh Tempo', variant: 'danger', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export default function StatusBadge({ status, size = 'md', className = '' }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {config.label}
    </span>
  );
}
