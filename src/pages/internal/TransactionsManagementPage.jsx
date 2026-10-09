import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
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

export default function TransactionsManagementPage() {
  const { addToast } = useToast();
  const { role } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Modal Detail
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [trxPayments, setTrxPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTransactions();
      if (res.success) {
        setTransactions(res.data);
      } else {
        throw new Error(res.error?.message || 'Gagal memuat transaksi');
      }
    } catch (err) {
      setError(err.message || 'Terjadi gangguan saat memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...transactions];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          (t.transaction_number && t.transaction_number.toLowerCase().includes(q)) ||
          (t.customer_name && t.customer_name.toLowerCase().includes(q)) ||
          (t.lot_code && t.lot_code.toLowerCase().includes(q)) ||
          (t.project_name && t.project_name.toLowerCase().includes(q))
      );
    }
    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }
    setFilteredTransactions(result);
  }, [search, statusFilter, transactions]);

  const handleOpenDetail = async (trx) => {
    setSelectedTrx(trx);
    setLoadingPayments(true);
    try {
      const res = await api.getPaymentsByTransaction(trx.id);
      if (res.success) {
        setTrxPayments(res.data);
      }
    } catch {
      setTrxPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleConfirmSale = async (trxId) => {
    if (!window.confirm('Konfirmasi transaksi ini? Kavling akan otomatis terkunci ke status SOLD (Terjual).')) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.confirmSale(trxId);
      if (res.success) {
        addToast(`Transaksi ${res.data.transaction_number} berhasil dikonfirmasi (CONFIRMED)!`, 'success');
        setSelectedTrx(res.data);
        loadData();
      } else {
        addToast(res.error?.message || 'Gagal mengonfirmasi transaksi', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal mengonfirmasi transaksi', 'error');
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
      header: 'No. Transaksi',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.transaction_number}</span>
          <span className="text-xs text-slate-400">
            {row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-'}
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
      header: 'Total Nilai',
      key: 'amount',
      align: 'right',
      render: (row) => <PriceDisplay amount={row.amount} size="sm" />,
    },
    {
      header: 'Sudah Dibayar',
      key: 'paid_amount',
      align: 'right',
      render: (row) => <PriceDisplay amount={row.paid_amount} size="sm" className="text-emerald-700" />,
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
          icon={Eye}
          onClick={() => handleOpenDetail(row)}
        >
          Rincian
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState text="Memuat daftar transaksi..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const canConfirm = role === 'OWNER' || role === 'ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Transaksi Penjualan</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar seluruh transaksi booking, cash keras, dan akad cicilan kavling via REST API.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor transaksi, customer, kavling, atau proyek..."
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
            <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CONFIRMED">CONFIRMED (Terkonfirmasi)</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
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
        data={filteredTransactions}
        emptyTitle="Tidak Ada Transaksi Ditemukan"
        emptyDescription={
          search || statusFilter
            ? 'Tidak ada data transaksi yang cocok dengan filter pencarian Anda.'
            : 'Belum ada transaksi penjualan yang tercatat dalam sistem.'
        }
        emptyActionText={search || statusFilter ? 'Reset Filter' : undefined}
        onEmptyAction={search || statusFilter ? resetFilters : undefined}
      />

      {/* Modal Detail Transaksi */}
      {selectedTrx && (
        <Modal
          isOpen={!!selectedTrx}
          onClose={() => setSelectedTrx(null)}
          title={`Rincian Transaksi ${selectedTrx.transaction_number}`}
          description={`ID: ${selectedTrx.id} • Dibuat pada ${
            selectedTrx.created_at ? new Date(selectedTrx.created_at).toLocaleDateString('id-ID') : '-'
          }`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Info Box */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Status Akad Transaksi:</span>
                <StatusBadge status={selectedTrx.status} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Nama Pembeli / Customer:</span>
                <span className="font-semibold text-slate-900">{selectedTrx.customer_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Unit Tanah Kavling:</span>
                <span className="font-semibold text-slate-900">
                  {selectedTrx.lot_code} ({selectedTrx.project_name})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Total Nilai Transaksi:</span>
                <PriceDisplay amount={selectedTrx.amount} size="sm" className="font-bold text-slate-900" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Telah Terbayar:</span>
                <PriceDisplay amount={selectedTrx.paid_amount} size="sm" className="text-emerald-700 font-bold" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Sisa Tagihan Belum Terbayar:</span>
                <PriceDisplay
                  amount={selectedTrx.remaining_amount}
                  size="sm"
                  className={selectedTrx.remaining_amount === 0 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}
                />
              </div>
            </div>

            {/* Confirmation Banner for Admin/Owner if not yet CONFIRMED */}
            {canConfirm && selectedTrx.status !== 'CONFIRMED' && (
              <div className="p-3 bg-brand-50/70 border border-primary/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs text-slate-800">
                    Konfirmasi transaksi ini untuk mengunci status kavling menjadi <strong>SOLD</strong>.
                  </span>
                </div>
                <Button
                  size="sm"
                  icon={CheckCircle2}
                  isLoading={submitting}
                  onClick={() => handleConfirmSale(selectedTrx.id)}
                >
                  Konfirmasi Penjualan
                </Button>
              </div>
            )}

            {/* Riwayat Pembayaran Terkait */}
            <div>
              <h5 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Riwayat Pembayaran Terkait (API GET /payments)
              </h5>
              {loadingPayments ? (
                <div className="text-center py-4 text-xs text-slate-500">Memuat pembayaran...</div>
              ) : trxPayments.length === 0 ? (
                <div className="text-center py-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500">
                  Belum ada log pembayaran tercatat untuk transaksi ini.
                </div>
              ) : (
                <div className="space-y-2">
                  {trxPayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-white rounded border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 block text-xs">{p.reference}</span>
                        <span className="text-[11px] text-slate-500">
                          {p.notes} • {p.payment_date ? new Date(p.payment_date).toLocaleDateString('id-ID') : '-'}
                        </span>
                      </div>
                      <div className="text-right">
                        <PriceDisplay amount={p.amount} size="xs" className="font-bold text-emerald-700 block" />
                        <span className="text-[10px] uppercase font-bold text-slate-600">{p.method}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedTrx(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
