import React, { useEffect, useState } from 'react';
import api from '../../services/api/adapter';
import { Button, Table, StatusBadge, PriceDisplay, LoadingState } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function PaymentsManagementPage() {
  const { addToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getPayments();
        if (res.success) setPayments(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    {
      header: 'No. Pembayaran / Ref',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.reference}</span>
          <span className="text-xs text-slate-400">{row.id}</span>
        </div>
      ),
    },
    {
      header: 'Tanggal Bayar',
      key: 'payment_date',
      render: (row) => new Date(row.payment_date).toLocaleDateString('id-ID'),
    },
    {
      header: 'Keterangan',
      key: 'notes',
      render: (row) => <span className="text-xs text-slate-600">{row.notes}</span>,
    },
    {
      header: 'Metode',
      key: 'method',
      align: 'center',
      render: (row) => <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded">{row.method}</span>,
    },
    {
      header: 'Nominal',
      key: 'amount',
      align: 'right',
      render: (row) => <PriceDisplay amount={row.amount} size="sm" className="text-emerald-700" />,
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToast(`Cetak kwitansi pembayaran ${row.reference}`, 'info')}
        >
          Kwitansi
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat catatan pembayaran..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Manajemen Pembayaran</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log riwayat pembayaran booking fee, down payment, dan pelunasan kavling.
          </p>
        </div>
      </div>

      <Table columns={columns} data={payments} />
    </div>
  );
}
