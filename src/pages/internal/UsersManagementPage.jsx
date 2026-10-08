import React from 'react';
import { UserCheck, Shield, Plus } from 'lucide-react';
import { Button, Table, Badge } from '../../components/common';
import { MOCK_USERS } from '../../services/api/mockData';
import { useToast } from '../../context/ToastContext';

export default function UsersManagementPage() {
  const { addToast } = useToast();

  const columns = [
    {
      header: 'Nama Pengguna',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-xs text-slate-500">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Nomor Telepon',
      key: 'phone',
      render: (row) => <span className="text-xs text-slate-600">{row.phone}</span>,
    },
    {
      header: 'Hak Akses / Role',
      key: 'role',
      align: 'center',
      render: (row) => {
        const variants = {
          OWNER: 'primary',
          ADMIN: 'warning',
          STAFF: 'info',
          CUSTOMER: 'success',
        };
        return <Badge variant={variants[row.role] || 'default'}>{row.role}</Badge>;
      },
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToast(`Ubah hak akses pengguna ${row.name}`, 'info')}
        >
          Kelola
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Manajemen Pengguna & Staf</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar pengguna internal dengan hak akses Owner, Admin, dan Staf.
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => addToast('Tambah pengguna internal baru', 'info')}>
          Tambah Pengguna
        </Button>
      </div>

      <Table columns={columns} data={MOCK_USERS} />
    </div>
  );
}
