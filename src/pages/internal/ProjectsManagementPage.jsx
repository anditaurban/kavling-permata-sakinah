import React, { useEffect, useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import api from '../../services/api/adapter';
import { Button, Table, Badge, Card, LoadingState } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function ProjectsManagementPage() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getProjects();
        if (res.success) setProjects(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    {
      header: 'Nama Proyek',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-xs text-slate-500">{row.location}</span>
        </div>
      ),
    },
    {
      header: 'Total Unit',
      key: 'total_lots',
      align: 'center',
      render: (row) => `${row.total_lots} Kavling`,
    },
    {
      header: 'Tersedia',
      key: 'available_lots',
      align: 'center',
      render: (row) => <Badge variant="primary">{row.available_lots} Unit</Badge>,
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (row) => <Badge variant="success">{row.status}</Badge>,
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToast(`Aksi edit untuk ${row.name}`, 'info')}
        >
          Kelola
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat data proyek..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Manajemen Proyek</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar lokasi proyek pengembangan tanah kavling Permata Sakinah.
          </p>
        </div>
        <Button
          size="sm"
          icon={Plus}
          onClick={() => addToast('Modal tambah proyek baru', 'info')}
        >
          Tambah Proyek
        </Button>
      </div>

      <Table columns={columns} data={projects} />
    </div>
  );
}
