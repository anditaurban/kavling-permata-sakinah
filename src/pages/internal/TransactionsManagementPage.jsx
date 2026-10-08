import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../services/api/adapter';
import { Button, Table, StatusBadge, PriceDisplay, LoadingState } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function TransactionsManagementPage() {
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getTransactions();
        if (res.success) setTransactions(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    {
      header: 'No. Transaksi',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.transaction_number}</span>
          <span className="text-xs text-slate-400">
            {new Date(row.created_at).toLocaleDateString('id-ID')}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer',
      key: 'customer_name',
      render: (row) => <span className="font-medium text-slate-800">{row.customer_name}</span>,
    },
    {
      header: 'Unit Kavling',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">Kavling {row.lot_code}</span>
          <span className="text-[11px] text-slate-500">{row.project_name}</span>
        </div>
      ),
    },
    {
      header: 'Skema',
      key: 'type',
      align: 'center',
      render: (row) => <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">{row.type}</span>,
    },
    {
      header: 'Total Nilai',
      key: 'amount',
      align: 'right',
      render: (row) => <PriceDisplay amount={row.amount} size="sm" />,
    },
    {
      header: 'Sisa Tagihan',
      key: 'remaining_amount',
      align: 'right',
      render: (row) => (
        <PriceDisplay
          amount={row.remaining_amount}
          size="sm"
          className={row.remaining_amount === 0 ? 'text-emerald-600' : 'text-amber-600'}
        />
      ),
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
          onClick={() => addToast(`Lihat rincian transaksi ${row.transaction_number}`, 'info')}
        >
          Rincian
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat daftar transaksi..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Transaksi Penjualan</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar seluruh transaksi booking, cash keras, dan akad cicilan kavling.
          </p>
        </div>
      </div>

      <Table columns={columns} data={transactions} />
    </div>
  );
}
