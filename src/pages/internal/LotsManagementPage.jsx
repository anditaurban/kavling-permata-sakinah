import React, { useEffect, useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import api from '../../services/api/adapter';
import { Button, Table, StatusBadge, PriceDisplay, Search, Select, LoadingState } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function LotsManagementPage() {
  const { addToast } = useToast();
  const [lots, setLots] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getLots();
        if (res.success) {
          setLots(res.data);
          setFilteredLots(res.data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = [...lots];
    if (search) {
      result = result.filter((l) => l.code.toLowerCase().includes(search.toLowerCase()));
    }
    if (statusFilter) {
      result = result.filter((l) => l.status === statusFilter);
    }
    setFilteredLots(result);
  }, [search, statusFilter, lots]);

  const columns = [
    {
      header: 'Kode Kavling',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.code}</span>
          <span className="text-xs text-slate-500">Blok {row.block}</span>
        </div>
      ),
    },
    {
      header: 'Luas Tanah',
      key: 'area_m2',
      align: 'center',
      render: (row) => `${row.area_m2} m²`,
    },
    {
      header: 'Harga Tunai',
      key: 'price',
      align: 'right',
      render: (row) => <PriceDisplay amount={row.price} size="sm" />,
    },
    {
      header: 'Status Unit',
      key: 'status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Catatan',
      key: 'notes',
      render: (row) => <span className="text-xs text-slate-500">{row.notes || '-'}</span>,
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToast(`Detail & ubah status Kavling ${row.code}`, 'info')}
        >
          Edit
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat inventaris kavling..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inventaris Kavling</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manajemen status ketersediaan kavling, ukuran luas tanah, dan penetapan harga.
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => addToast('Tambah kavling baru', 'info')}>
          Tambah Unit Kavling
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Search
          value={search}
          onChange={setSearch}
          placeholder="Cari kode kavling (e.g. A-01)..."
          className="w-full sm:max-w-xs"
        />
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Semua Status"
            options={[
              { value: 'AVAILABLE', label: 'Tersedia' },
              { value: 'BOOKED', label: 'Dibooking' },
              { value: 'SOLD', label: 'Terjual' },
            ]}
          />
        </div>
      </div>

      <Table columns={columns} data={filteredLots} />
    </div>
  );
}
