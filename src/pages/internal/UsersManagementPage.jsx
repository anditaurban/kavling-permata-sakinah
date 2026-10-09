import React, { useState } from 'react';
import { UserCheck, Shield, Plus, Search as SearchIcon, Eye } from 'lucide-react';
import {
  Button,
  Table,
  Badge,
  Input,
  Modal,
} from '../../components/common';
import { DEMO_CREDENTIALS } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function UsersManagementPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState(DEMO_CREDENTIALS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State & Validation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STAFF',
  });
  const [formErrors, setFormErrors] = useState({});

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search.trim() ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Nama minimal 3 karakter';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Format email tidak valid';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9+-\s]{9,16}$/.test(formData.phone.trim())) {
      errors.phone = 'Nomor telepon minimal 9 digit';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newUser = {
      id: `usr_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    };

    setUsers((prev) => [newUser, ...prev]);
    addToast(`Pengguna ${newUser.name} berhasil ditambahkan!`, 'success');
    setIsAddOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'STAFF',
    });
    setFormErrors({});
  };

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('');
  };

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
          icon={Eye}
          onClick={() => setSelectedUser(row)}
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
            Daftar akun pengguna internal dengan hak akses Owner, Admin, dan Staf.
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
          Tambah Pengguna
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau nomor HP pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="w-full sm:w-44">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
          >
            <option value="">Semua Role</option>
            <option value="OWNER">OWNER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="STAFF">STAFF</option>
            <option value="CUSTOMER">CUSTOMER</option>
          </select>
        </div>
        {(search || roleFilter) && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
            Reset
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={filteredUsers}
        emptyTitle="Pengguna Tidak Ditemukan"
        emptyDescription="Tidak ada pengguna yang sesuai dengan filter pencarian Anda."
        emptyActionText={search || roleFilter ? 'Reset Filter' : 'Tambah Pengguna'}
        onEmptyAction={search || roleFilter ? resetFilters : () => setIsAddOpen(true)}
      />

      {/* Modal Tambah Pengguna */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Pengguna Baru"
        description="Daftarkan akun staf atau pengelola baru ke sistem."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Rian Pratama"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Alamat Email"
              type="email"
              placeholder="Contoh: rian@permatasakinah.id"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
              required
            />
            <Input
              label="Nomor Telepon"
              placeholder="Contoh: 081234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={formErrors.phone}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hak Akses / Peran (Role)
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-900"
            >
              <option value="STAFF">STAFF (Penjualan & Follow-up)</option>
              <option value="ADMIN">ADMIN (Manajemen Operasional)</option>
              <option value="OWNER">OWNER (Pemilik / Monitoring)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button type="submit">
              Simpan Pengguna
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail User */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Profil Pengguna — ${selectedUser.name}`}
          description={`ID: ${selectedUser.id}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Nama:</span>
                <span className="font-semibold text-slate-900">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-900">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Nomor Telepon:</span>
                <span className="font-semibold text-slate-900">{selectedUser.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Peran Sistem:</span>
                <Badge variant="primary">{selectedUser.role}</Badge>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
