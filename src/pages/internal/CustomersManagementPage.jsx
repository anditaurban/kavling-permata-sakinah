import React, { useEffect, useState } from 'react';
import { Plus, Phone, Mail, Search as SearchIcon, Eye, Edit2, MessageSquare, Calendar } from 'lucide-react';
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

export default function CustomersManagementPage() {
  const { addToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activityForm, setActivityForm] = useState({
    activity_type: 'WHATSAPP',
    description: '',
    follow_up_at: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    lead_status: 'NEW',
    notes: '',
  });

  // Form State & Validation
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    lead_status: 'NEW',
    source: 'LANDING_PAGE',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCustomers();
      if (res.success) {
        setCustomers(res.data);
      } else {
        throw new Error(res.error?.message || 'Gagal memuat data pelanggan');
      }
    } catch (err) {
      setError(err.message || 'Terjadi gangguan saat memuat pelanggan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...customers];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.address && c.address.toLowerCase().includes(q))
      );
    }
    if (statusFilter) {
      result = result.filter((c) => c.lead_status === statusFilter);
    }
    setFilteredCustomers(result);
  }, [search, statusFilter, customers]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Nama minimal 3 karakter';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Nomor telepon/WhatsApp wajib diisi';
    } else if (!/^[0-9+-\s]{9,16}$/.test(formData.phone.trim())) {
      errors.phone = 'Nomor telepon tidak valid (minimal 9 digit)';
    }

    if (!formData.email.trim()) {
      errors.email = 'Alamat email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Format email tidak valid';
    }

    if (!formData.address.trim()) {
      errors.address = 'Alamat domisili wajib diisi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await api.createCustomer(formData);
      if (res.success) {
        addToast(`Customer ${res.data.name} berhasil ditambahkan!`, 'success');
        setIsAddOpen(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          lead_status: 'NEW',
          source: 'LANDING_PAGE',
          notes: '',
        });
        setFormErrors({});
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal menambahkan customer baru', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menambahkan customer baru', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDetail = async (customer) => {
    setSelectedCustomer(customer);
    setIsEditing(false);
    setIsAddingActivity(false);
    setEditData({
      lead_status: customer.lead_status || 'NEW',
      notes: customer.notes || '',
    });

    // Load customer activities
    setLoadingActivities(true);
    try {
      const actRes = await api.getCustomerActivities(customer.id);
      if (actRes.success) {
        setActivities(actRes.data || []);
      }
    } catch {
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    setSubmitting(true);
    try {
      const res = await api.updateCustomer(selectedCustomer.id, editData);
      if (res.success) {
        addToast(`Data customer ${res.data.name} berhasil diperbarui!`, 'success');
        setSelectedCustomer(res.data);
        setIsEditing(false);
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal memperbarui customer', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal memperbarui customer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddActivitySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !activityForm.description.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.addCustomerActivity(selectedCustomer.id, activityForm);
      if (res.success) {
        addToast('Aktivitas follow-up berhasil dicatat!', 'success');
        setActivityForm({ activity_type: 'WHATSAPP', description: '', follow_up_at: '' });
        setIsAddingActivity(false);
        // Reload activities
        const actRes = await api.getCustomerActivities(selectedCustomer.id);
        if (actRes.success) setActivities(actRes.data || []);
      } else {
        addToast(res.error?.message || 'Gagal mencatat aktivitas', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal mencatat aktivitas', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

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
      header: 'Status Lead',
      key: 'lead_status',
      align: 'center',
      render: (row) => {
        const variants = {
          NEW: 'primary',
          INTERESTED: 'info',
          SURVEY_SCHEDULED: 'warning',
          CONVERTED: 'success',
          CLOSED: 'default',
        };
        return <Badge variant={variants[row.lead_status] || 'default'}>{row.lead_status || 'NEW'}</Badge>;
      },
    },
    {
      header: 'Sumber',
      key: 'source',
      render: (row) => <Badge variant="default">{row.source}</Badge>,
    },
    {
      header: 'Catatan',
      key: 'notes',
      render: (row) => <span className="text-xs text-slate-500 max-w-xs block truncate">{row.notes || '-'}</span>,
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

  if (loading) return <LoadingState text="Memuat data customer..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Customer & Leads</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Database prospek calon pembeli dan customer kavling aktif.
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
          Tambah Customer
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, nomor HP, email, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
          >
            <option value="">Semua Status Lead</option>
            <option value="NEW">NEW (Baru)</option>
            <option value="INTERESTED">INTERESTED (Tertarik)</option>
            <option value="SURVEY_SCHEDULED">SURVEY_SCHEDULED (Jadwal Survei)</option>
            <option value="CONVERTED">CONVERTED (Closing)</option>
            <option value="CLOSED">CLOSED (Batal)</option>
          </select>
        </div>
        {(search || statusFilter) && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
            Reset
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={filteredCustomers}
        emptyTitle="Tidak Ada Customer Ditemukan"
        emptyDescription={
          search || statusFilter
            ? 'Tidak ada data customer yang sesuai dengan filter pencarian Anda.'
            : 'Belum ada data customer terdaftar di sistem.'
        }
        emptyActionText={search || statusFilter ? 'Reset Filter' : 'Tambah Customer Baru'}
        onEmptyAction={search || statusFilter ? resetFilters : () => setIsAddOpen(true)}
      />

      {/* Modal Tambah Customer Baru */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Customer Baru"
        description="Lengkapi informasi kontak prospek atau pembeli kavling."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Irvan Pratama"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor WhatsApp / HP"
              placeholder="Contoh: 081299887766"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={formErrors.phone}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="Contoh: irvan@example.test"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
              required
            />
          </div>

          <Input
            label="Alamat Domisili"
            placeholder="Contoh: Jl. Riau No. 10, Bandung"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={formErrors.address}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Sumber Prospek (Lead Source)
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-900"
            >
              <option value="LANDING_PAGE">Landing Page Website</option>
              <option value="WHATSAPP">WhatsApp Direct</option>
              <option value="INSTAGRAM">Instagram Ads</option>
              <option value="WALK_IN">Walk In Kantor</option>
              <option value="REFERRAL">Referral / Rekomendasi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Catatan / Minat Proyek
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Tertarik survei lokasi akhir pekan di Cihanjuang"
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
              Simpan Customer (API)
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail & Aktivitas Customer */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Profil Customer — ${selectedCustomer.name}`}
          description={`ID: ${selectedCustomer.id}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Nama Lengkap:</span>
                <span className="font-semibold text-slate-900">{selectedCustomer.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Status Lead:</span>
                <Badge variant="primary">{selectedCustomer.lead_status || 'NEW'}</Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">No. WhatsApp / HP:</span>
                <span className="font-semibold text-slate-900">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-900">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Alamat:</span>
                <span className="font-medium text-slate-800">{selectedCustomer.address}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Catatan Staf:</span>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 text-xs">
                  {selectedCustomer.notes || 'Tidak ada catatan tambahan.'}
                </p>
              </div>
            </div>

            {/* Edit Status Customer Section */}
            {isEditing ? (
              <form onSubmit={handleUpdateCustomer} className="p-3 bg-slate-100 rounded-lg space-y-3">
                <h4 className="font-semibold text-slate-900 text-xs">Perbarui Status Prospek (API PATCH)</h4>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status Prospek</label>
                  <select
                    value={editData.lead_status}
                    onChange={(e) => setEditData({ ...editData, lead_status: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="NEW">NEW</option>
                    <option value="INTERESTED">INTERESTED</option>
                    <option value="SURVEY_SCHEDULED">SURVEY_SCHEDULED</option>
                    <option value="CONVERTED">CONVERTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Catatan Tambahan</label>
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
              <div className="flex justify-end">
                <Button variant="outline" size="sm" icon={Edit2} onClick={() => setIsEditing(true)}>
                  Edit Status Lead
                </Button>
              </div>
            )}

            {/* Riwayat Aktivitas & Follow-up */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" /> Riwayat Follow-up (Activities)
                </h4>
                {!isAddingActivity && (
                  <Button size="sm" variant="outline" onClick={() => setIsAddingActivity(true)}>
                    + Catat Aktivitas
                  </Button>
                )}
              </div>

              {isAddingActivity && (
                <form onSubmit={handleAddActivitySubmit} className="p-3 bg-brand-50/50 rounded-lg border border-primary/20 space-y-2.5">
                  <span className="font-bold text-xs text-slate-900 block">Form Aktivitas Baru (API POST)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Tipe Aktivitas</label>
                      <select
                        value={activityForm.activity_type}
                        onChange={(e) => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                        className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white"
                      >
                        <option value="WHATSAPP">WhatsApp</option>
                        <option value="PHONE_CALL">Panggilan Telepon</option>
                        <option value="SURVEY">Survei Lokasi</option>
                        <option value="MEETING">Pertemuan Tatap Muka</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Jadwal Follow-up</label>
                      <input
                        type="datetime-local"
                        value={activityForm.follow_up_at}
                        onChange={(e) => setActivityForm({ ...activityForm, follow_up_at: e.target.value })}
                        className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Deskripsi / Hasil Interaksi</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Konfirmasi rencana survei hari Sabtu jam 10 pagi..."
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      className="w-full p-1.5 text-xs border border-slate-200 rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddingActivity(false)}>
                      Batal
                    </Button>
                    <Button size="sm" type="submit" isLoading={submitting}>
                      Simpan Aktivitas
                    </Button>
                  </div>
                </form>
              )}

              {loadingActivities ? (
                <div className="text-center py-3 text-xs text-slate-400">Memuat riwayat aktivitas...</div>
              ) : activities.length === 0 ? (
                <div className="text-center py-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-400">
                  Belum ada log aktivitas tindak lanjut untuk prospek ini.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activities.map((act) => (
                    <div key={act.id} className="p-2.5 bg-white rounded border border-slate-200 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-primary">{act.activity_type}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(act.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-slate-700">{act.description}</p>
                      {act.follow_up_at && (
                        <span className="text-[10px] text-amber-600 block mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Jadwal lanjut: {new Date(act.follow_up_at).toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
