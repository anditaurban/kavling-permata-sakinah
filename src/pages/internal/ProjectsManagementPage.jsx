import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Search as SearchIcon, Eye, CheckCircle2, Edit2 } from 'lucide-react';
import api from '../../services/api/adapter';
import {
  Button,
  Table,
  Badge,
  Input,
  Modal,
  LoadingState,
  ErrorState,
} from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function ProjectsManagementPage() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ description: '', status: 'ACTIVE' });

  // Form State & Validation
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    total_lots: '',
    available_lots: '',
    description: '',
    cover_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    facilities: 'Jalan Paving 6m, Saluran Drainase, Tiang Listrik, Masjid Komplek',
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProjects();
      if (res.success) {
        setProjects(res.data);
      } else {
        throw new Error(res.error?.message || 'Gagal memuat data proyek');
      }
    } catch (err) {
      setError(err.message || 'Terjadi gangguan saat memuat data proyek');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...projects];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }
    setFilteredProjects(result);
  }, [search, projects]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Nama proyek wajib diisi';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Nama minimal 3 karakter';
    }

    if (!formData.location.trim()) {
      errors.location = 'Lokasi proyek wajib diisi';
    }

    if (!formData.total_lots || Number(formData.total_lots) <= 0) {
      errors.total_lots = 'Jumlah total kavling harus lebih dari 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await api.createProject({
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        location_text: formData.location,
        address: formData.location,
        description: formData.description || 'Kavling perumahan syariah siap bangun dengan legalitas aman.',
        cover_image_url: formData.cover_image_url,
        status: 'ACTIVE',
      });

      if (res.success) {
        addToast(`Proyek ${res.data.name} berhasil ditambahkan ke database!`, 'success');
        setIsAddOpen(false);
        setFormData({
          name: '',
          location: '',
          total_lots: '',
          available_lots: '',
          description: '',
          cover_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
          facilities: 'Jalan Paving 6m, Saluran Drainase, Tiang Listrik, Masjid Komplek',
        });
        setFormErrors({});
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal menambahkan proyek', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan proyek', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDetail = (prj) => {
    setSelectedProject(prj);
    setIsEditing(false);
    setEditData({
      description: prj.description || '',
      status: prj.status || 'ACTIVE',
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    setSubmitting(true);
    try {
      const res = await api.updateProject(selectedProject.id, editData);
      if (res.success) {
        addToast(`Proyek ${res.data.name} berhasil diperbarui!`, 'success');
        setSelectedProject(res.data);
        setIsEditing(false);
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal memperbarui proyek', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal memperbarui proyek', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Nama Proyek',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" /> {row.location}
          </span>
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
      render: (row) => <Badge variant={row.status === 'ACTIVE' ? 'success' : 'default'}>{row.status}</Badge>,
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenDetail(row)}
        >
          Kelola
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat data proyek..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Manajemen Proyek</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar lokasi proyek pengembangan tanah kavling Permata Sakinah.
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
          Tambah Proyek
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama proyek atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch('')} className="text-xs">
            Reset
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={filteredProjects}
        emptyTitle="Tidak Ada Proyek Ditemukan"
        emptyDescription={
          search
            ? 'Tidak ada proyek yang cocok dengan kata kunci pencarian.'
            : 'Belum ada data proyek kavling terdaftar di sistem.'
        }
        emptyActionText={search ? 'Reset Pencarian' : 'Tambah Proyek Baru'}
        onEmptyAction={search ? () => setSearch('') : () => setIsAddOpen(true)}
      />

      {/* Modal Tambah Proyek Baru */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Proyek Kavling Baru"
        description="Daftarkan proyek baru ke dalam inventaris Permata Sakinah via API."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Nama Proyek"
            placeholder="Contoh: Permata Sakinah 3 - Padalarang"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
          />

          <Input
            label="Lokasi Proyek"
            placeholder="Contoh: Padalarang, Bandung Barat"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            error={formErrors.location}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Kavling"
              type="number"
              placeholder="Contoh: 10"
              value={formData.total_lots}
              onChange={(e) => setFormData({ ...formData, total_lots: e.target.value })}
              error={formErrors.total_lots}
              required
            />
            <Input
              label="Kavling Tersedia Awal"
              type="number"
              placeholder="Contoh: 10"
              value={formData.available_lots}
              onChange={(e) => setFormData({ ...formData, available_lots: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              placeholder="Jelaskan keunggulan lokasi dan peruntukan kavling..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-slate-400"
            />
          </div>

          <Input
            label="Fasilitas (Pisahkan dengan koma)"
            placeholder="Contoh: Jalan Paving, Drainase, Musholla"
            value={formData.facilities}
            onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={submitting}>
              Simpan Proyek (API)
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail / Kelola Proyek */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={`Detail Proyek — ${selectedProject.name}`}
          description={`ID: ${selectedProject.id} • ${selectedProject.location}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={selectedProject.cover_image || selectedProject.cover_image_url}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Status Operasional:</span>
                <Badge variant={selectedProject.status === 'ACTIVE' ? 'success' : 'default'}>
                  {selectedProject.status}
                </Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Total Kavling Terdaftar:</span>
                <span className="font-semibold text-slate-900">{selectedProject.total_lots} Kavling</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Kavling Tersedia:</span>
                <span className="font-semibold text-primary">{selectedProject.available_lots} Unit</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Deskripsi:</span>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 text-xs leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1.5">Fasilitas Komplek:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedProject.facilities?.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateSubmit} className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 text-xs">Edit Informasi Proyek (API PATCH)</h4>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status Proyek</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="ACTIVE">ACTIVE (Aktif)</option>
                    <option value="INACTIVE">INACTIVE (Nonaktif)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Deskripsi Proyek</label>
                  <textarea
                    rows={3}
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                  <Button size="sm" type="submit" isLoading={submitting}>
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Data
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedProject(null)}>
                  Tutup
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
