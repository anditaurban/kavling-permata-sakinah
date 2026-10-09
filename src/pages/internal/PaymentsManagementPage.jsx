import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, Printer, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import api from '../../services/api/adapter';
import {
  Button,
  Table,
  StatusBadge,
  PriceDisplay,
  Modal,
  LoadingState,
  ErrorState,
} from '../../components/common';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function PaymentsManagementPage() {
  const { addToast } = useToast();
  const { role } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Modal Kwitansi / Verifikasi
  const [selectedPayment, setSelectedPayment] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPayments();
      if (res.success) {
        setPayments(res.data);
      } else {
        throw new Error(res.error?.message || 'Gagal memuat catatan pembayaran');
      }
    } catch (err) {
      setError(err.message || 'Terjadi gangguan saat memuat pembayaran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...payments];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.reference && p.reference.toLowerCase().includes(q)) ||
          (p.notes && p.notes.toLowerCase().includes(q)) ||
          (p.method && p.method.toLowerCase().includes(q)) ||
          String(p.id).toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    setFilteredPayments(result);
  }, [search, statusFilter, payments]);

  const handleVerify = async (paymentId) => {
    if (!window.confirm('Verifikasi pembayaran ini sebagai sah? Status booking/penjualan akan diperbarui secara otomatis.')) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.verifyPayment(paymentId);
      if (res.success) {
        addToast(`Pembayaran ${res.data.reference} berhasil diverifikasi!`, 'success');
        setSelectedPayment(res.data);
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal memverifikasi pembayaran', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal memverifikasi pembayaran', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (paymentId) => {
    const reason = window.prompt('Masukkan alasan penolakan pembayaran:');
    if (!reason || !reason.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.rejectPayment(paymentId, reason.trim());
      if (res.success) {
        addToast(`Pembayaran ${res.data.reference} ditolak.`, 'info');
        setSelectedPayment(res.data);
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal menolak pembayaran', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menolak pembayaran', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

  const handlePrint = () => {
    window.print();
  };

  const canManage = role === 'OWNER' || role === 'ADMIN';

  const columns = [
    {
      header: 'No. Pembayaran / Ref',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.reference}</span>
          <span className="text-xs text-slate-400">ID: {row.id}</span>
        </div>
      ),
    },
    {
      header: 'Tanggal Bayar',
      key: 'payment_date',
      render: (row) => (row.payment_date ? new Date(row.payment_date).toLocaleDateString('id-ID') : '-'),
    },
    {
      header: 'Keterangan',
      key: 'notes',
      render: (row) => <span className="text-xs text-slate-600 block max-w-xs truncate">{row.notes}</span>,
    },
    {
      header: 'Metode',
      key: 'method',
      align: 'center',
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
          {row.method}
        </span>
      ),
    },
    {
      header: 'Nominal',
      key: 'amount',
      align: 'right',
      render: (row) => (
        <PriceDisplay amount={row.amount} size="sm" className="text-emerald-700 font-semibold" />
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
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => setSelectedPayment(row)}
          >
            Kwitansi
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat catatan pembayaran..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Verifikasi & Catatan Pembayaran</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log mutasi penerimaan booking fee dan pelunasan penjualan kavling via REST API.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari referensi pembayaran, nomor kwitansi, atau catatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
          >
            <option value="">Semua Status</option>
            <option value="VERIFIED">VERIFIED (Terverifikasi)</option>
            <option value="PENDING">PENDING (Menunggu)</option>
            <option value="REJECTED">REJECTED (Ditolak)</option>
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
        data={filteredPayments}
        emptyTitle="Tidak Ada Pembayaran Ditemukan"
        emptyDescription={
          search || statusFilter
            ? 'Tidak ada catatan pembayaran yang cocok dengan filter pencarian Anda.'
            : 'Belum ada bukti pembayaran yang masuk ke sistem.'
        }
        emptyActionText={search || statusFilter ? 'Reset Filter' : undefined}
        onEmptyAction={search || statusFilter ? resetFilters : undefined}
      />

      {/* Modal Kwitansi & Verifikasi */}
      {selectedPayment && (
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          title="Kwitansi & Verifikasi Pembayaran"
          description={`ID Pembayaran: ${selectedPayment.id}`}
        >
          <div className="space-y-4">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs text-xs space-y-4 font-mono">
              <div className="text-center border-b border-dashed border-slate-300 pb-3 font-sans">
                <h3 className="font-extrabold text-base text-slate-900 tracking-wide">KWITANSI RESMI PERMATA SAKINAH</h3>
                <p className="text-slate-500 text-xs">Tanda Terima Pembayaran Sah</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <StatusBadge status={selectedPayment.status} size="sm" />
                </div>
              </div>

              <div className="space-y-1 font-sans text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Kwitansi:</span>
                  <span className="font-bold text-slate-800">{selectedPayment.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Bayar:</span>
                  <span className="text-slate-700">
                    {selectedPayment.payment_date
                      ? new Date(selectedPayment.payment_date).toLocaleDateString('id-ID')
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="text-slate-700 font-semibold">{selectedPayment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Keterangan:</span>
                  <span className="text-slate-800">{selectedPayment.notes}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-1 font-sans">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Total Nominal:</span>
                  <PriceDisplay
                    amount={selectedPayment.amount}
                    size="md"
                    className="font-extrabold text-emerald-700"
                  />
                </div>
              </div>

              {selectedPayment.proof_url && (
                <div className="pt-2 font-sans">
                  <span className="text-slate-500 block mb-1">Bukti Transfer:</span>
                  <a
                    href={selectedPayment.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline text-xs inline-flex items-center gap-1"
                  >
                    Buka Gambar Bukti Pembayaran ↗
                  </a>
                </div>
              )}
            </div>

            {/* Action Buttons for Admin/Owner */}
            {canManage && selectedPayment.status !== 'VERIFIED' && selectedPayment.status !== 'REJECTED' && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Tindakan Admin:</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={XCircle}
                    isLoading={submitting}
                    onClick={() => handleReject(selectedPayment.id)}
                  >
                    Tolak Pembayaran
                  </Button>
                  <Button
                    size="sm"
                    icon={CheckCircle}
                    isLoading={submitting}
                    onClick={() => handleVerify(selectedPayment.id)}
                  >
                    Verifikasi Sah (API)
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1 font-sans">
              <Button variant="outline" size="sm" onClick={() => setSelectedPayment(null)}>
                Tutup
              </Button>
              <Button size="sm" icon={Printer} onClick={handlePrint}>
                Cetak Kwitansi
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
