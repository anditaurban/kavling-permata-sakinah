import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit2 } from 'lucide-react';
import api from '../../services/api/adapter';
import {
  Button,
  Table,
  StatusBadge,
  PriceDisplay,
  Search,
  Input,
  Modal,
  LoadingState,
  ErrorState,
} from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function LotsManagementPage() {
  const { addToast } = useToast();
  const [lots, setLots] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    price: '',
    status: 'AVAILABLE',
    notes: '',
  });

  // Form State & Validation
  const [formData, setFormData] = useState({
    code: '',
    project_id: '',
    block: 'A',
    area_m2: '',
    price: '',
    status: 'AVAILABLE',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [lotsRes, prjRes] = await Promise.all([api.getLots(), api.getProjects()]);
      if (lotsRes.success) setLots(lotsRes.data);
      if (prjRes.success) {
        setProjects(prjRes.data);
        if (prjRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, project_id: prjRes.data[0].id }));
        }
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat inventaris kavling');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...lots];
    if (search.trim()) {
      result = result.filter((l) => l.code.toLowerCase().includes(search.toLowerCase().trim()));
    }
    if (statusFilter) {
      result = result.filter((l) => l.status === statusFilter);
    }
    if (projectFilter) {
      result = result.filter((l) => String(l.project_id) === String(projectFilter));
    }
    setFilteredLots(result);
  }, [search, statusFilter, projectFilter, lots]);

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) {
      errors.code = 'Kode kavling wajib diisi (e.g. A-12)';
    }

    if (!formData.project_id) {
      errors.project_id = 'Pilih proyek lokasi kavling';
    }

    if (!formData.block.trim()) {
      errors.block = 'Blok kavling wajib diisi';
    }

    if (!formData.area_m2 || Number(formData.area_m2) <= 0) {
      errors.area_m2 = 'Luas tanah harus lebih dari 0 m²';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = 'Harga kavling harus lebih dari 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await api.createPlot({
        project_id: formData.project_id,
        plot_code: formData.code.toUpperCase(),
        block_name: `Blok ${formData.block.toUpperCase()}`,
        area_sqm: Number(formData.area_m2),
        price: Number(formData.price),
        status: formData.status,
        description: formData.notes || 'Posisi standar dekat fasilitas umum.',
      });

      if (res.success) {
        addToast(`Kavling ${res.data.code} berhasil ditambahkan ke database!`, 'success');
        setIsAddOpen(false);
        setFormData({
          code: '',
          project_id: projects[0]?.id || '',
          block: 'A',
          area_m2: '',
          price: '',
          status: 'AVAILABLE',
          notes: '',
        });
        setFormErrors({});
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal menambahkan kavling', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan unit kavling', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDetail = (lot) => {
    setSelectedLot(lot);
    setIsEditing(false);
    setEditData({
      price: lot.price,
      status: lot.status,
      notes: lot.notes || '',
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLot) return;

    setSubmitting(true);
    try {
      const res = await api.updatePlot(selectedLot.id, {
        price: Number(editData.price),
        status: editData.status,
        description: editData.notes,
      });

      if (res.success) {
        addToast(`Kavling ${res.data.code} berhasil diperbarui!`, 'success');
        setSelectedLot(res.data);
        setIsEditing(false);
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal memperbarui kavling', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal memperbarui kavling', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setProjectFilter('');
  };

  const columns = [
    {
      header: 'Kode Kavling',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.code}</span>
          <span className="text-xs text-slate-500">{row.block_name || `Blok ${row.block}`}</span>
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
      render: (row) => <span className="text-xs text-slate-500 block max-w-xs truncate">{row.notes || '-'}</span>,
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
          Detail
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat inventaris kavling..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inventaris Kavling</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manajemen status ketersediaan kavling, ukuran luas tanah, dan penetapan harga.
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
          Tambah Unit Kavling
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
        <Search
          value={search}
          onChange={setSearch}
          placeholder="Cari kode kavling (e.g. A-01)..."
          className="w-full sm:flex-1"
        />
        <div className="w-full sm:w-48">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
          >
            <option value="">Semua Proyek</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
          >
            <option value="">Semua Status</option>
            <option value="AVAILABLE">AVAILABLE (Tersedia)</option>
            <option value="BOOKED">BOOKED (Dibooking)</option>
            <option value="SOLD">SOLD (Terjual)</option>
            <option value="INACTIVE">INACTIVE (Nonaktif)</option>
          </select>
        </div>
        {(search || statusFilter || projectFilter) && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
            Reset
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={filteredLots}
        emptyTitle="Unit Kavling Tidak Ditemukan"
        emptyDescription={
          search || statusFilter || projectFilter
            ? 'Tidak ada unit kavling yang cocok dengan filter pencarian Anda.'
            : 'Belum ada data kavling terdaftar di sistem.'
        }
        emptyActionText={search || statusFilter || projectFilter ? 'Reset Filter' : 'Tambah Unit Baru'}
        onEmptyAction={search || statusFilter || projectFilter ? resetFilters : () => setIsAddOpen(true)}
      />

      {/* Modal Tambah Kavling Baru */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Unit Kavling Baru"
        description="Daftarkan kavling baru ke dalam sistem inventaris Permata Sakinah."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Proyek
            </label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white"
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {formErrors.project_id && (
              <p className="mt-1 text-xs text-rose-500">{formErrors.project_id}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode Unit"
              placeholder="Contoh: A-05"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              error={formErrors.code}
              required
            />
            <Input
              label="Blok"
              placeholder="Contoh: A"
              value={formData.block}
              onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              error={formErrors.block}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Luas Tanah (m²)"
              type="number"
              placeholder="Contoh: 84"
              value={formData.area_m2}
              onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
              error={formErrors.area_m2}
              required
            />
            <Input
              label="Harga Tunai (Rp)"
              type="number"
              placeholder="Contoh: 252000000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={formErrors.price}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Awal
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white"
            >
              <option value="AVAILABLE">AVAILABLE (Tersedia)</option>
              <option value="BOOKED">BOOKED (Dibooking)</option>
              <option value="SOLD">SOLD (Terjual)</option>
              <option value="INACTIVE">INACTIVE (Nonaktif)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Catatan / Posisi Khusus
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Posisi hook, hadap timur, dekat taman."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-slate-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={submitting}>
              Simpan Kavling (API)
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail / Edit Kavling */}
      {selectedLot && (
        <Modal
          isOpen={!!selectedLot}
          onClose={() => setSelectedLot(null)}
          title={`Detail Kavling — ${selectedLot.code}`}
          description={`ID: ${selectedLot.id} • ${selectedLot.block_name || `Blok ${selectedLot.block}`}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Status Ketersediaan:</span>
                <StatusBadge status={selectedLot.status} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Luas Tanah:</span>
                <span className="font-semibold text-slate-900">{selectedLot.area_m2} m²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Harga Standar:</span>
                <PriceDisplay amount={selectedLot.price} size="sm" className="text-primary font-bold" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Harga per m²:</span>
                <PriceDisplay amount={Math.round(selectedLot.price / (selectedLot.area_m2 || 1))} size="xs" />
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Catatan Spesifikasi:</span>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 text-xs">
                  {selectedLot.notes || 'Posisi standar.'}
                </p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateSubmit} className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 text-xs">Perbarui Data Kavling (API PATCH)</h4>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status Kavling</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="AVAILABLE">AVAILABLE (Tersedia)</option>
                    <option value="BOOKED">BOOKED (Dibooking)</option>
                    <option value="SOLD">SOLD (Terjual)</option>
                    <option value="INACTIVE">INACTIVE (Nonaktif)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Harga Tunai (Rp)</label>
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Catatan</label>
                  <textarea
                    rows={2}
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
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
                <Button variant="outline" size="sm" onClick={() => setSelectedLot(null)}>
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
