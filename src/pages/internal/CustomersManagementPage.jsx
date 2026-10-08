import React, { useEffect, useState } from 'react';
import { Plus, Phone, Mail } from 'lucide-react';
import api from '../../services/api/adapter';
import { Button, Table, Badge, LoadingState } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function CustomersManagementPage() {
  const { addToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCustomers();
        if (res.success) setCustomers(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    {
      header: 'Nama Customer',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-xs text-slate-500">{row.address}</span>
        </div>
      ),
    },
    {
      header: 'Kontak',
      render: (row) => (
        <div className="text-xs text-slate-600 space-y-0.5">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" /> {row.phone}
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" /> {row.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Sumber Lead',
      key: 'source',
      render: (row) => <Badge variant="default">{row.source}</Badge>,
    },
    {
      header: 'Catatan',
      key: 'notes',
      render: (row) => <span className="text-xs text-slate-500 max-w-xs block truncate">{row.notes}</span>,
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToast(`Lihat profil customer ${row.name}`, 'info')}
        >
          Detail
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat data customer..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Customer & Leads</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Database prospek calon pembeli dan customer kavling aktif.
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => addToast('Form tambah customer baru', 'info')}>
          Tambah Customer
        </Button>
      </div>

      <Table columns={columns} data={customers} />
    </div>
  );
}
