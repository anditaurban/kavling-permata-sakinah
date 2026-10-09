import React, { useEffect, useState } from 'react';
import { ShoppingCart, Check, User, MapPin, Printer, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import api from '../../services/api/adapter';
import {
  Button,
  Card,
  Select,
  StatusBadge,
  PriceDisplay,
  Modal,
  LoadingState,
  ErrorState,
} from '../../components/common';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function PosPage() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentType, setPaymentType] = useState('BOOKING');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER_BSI');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);

  const initData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pRes, cRes] = await Promise.all([api.getProjects(), api.getCustomers()]);
      if (pRes.success) {
        setProjects(pRes.data);
        if (pRes.data.length > 0) setSelectedProjectId(pRes.data[0].id);
      }
      if (cRes.success) {
        setCustomers(cRes.data);
        if (cRes.data.length > 0) setSelectedCustomerId(cRes.data[0].id);
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat sistem POS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const loadLotsForProject = async (projId) => {
    if (!projId) return;
    try {
      const res = await api.getLots(projId);
      if (res.success) setLots(res.data);
      setSelectedLot(null);
    } catch (err) {
      addToast('Gagal memuat kavling proyek', 'error');
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadLotsForProject(selectedProjectId);
    }
  }, [selectedProjectId]);

  const calculateDefaultAmount = () => {
    if (!selectedLot) return 0;
    if (paymentType === 'BOOKING') return 5000000;
    if (paymentType === 'CASH') return selectedLot.price;
    return Math.round(selectedLot.price * 0.2); // 20% DP untuk cicilan
  };

  const currentPayAmount = customAmount ? Number(customAmount) : calculateDefaultAmount();

  const handleCreateOrder = async () => {
    if (!selectedLot) {
      addToast('Pilih unit kavling yang tersedia terlebih dahulu', 'warning');
      return;
    }
    if (!selectedCustomerId) {
      addToast('Pilih data customer pembeli', 'warning');
      return;
    }
    if (currentPayAmount <= 0) {
      addToast('Nominal pembayaran harus lebih dari 0', 'warning');
      return;
    }

    setSubmitting(true);
    const customer = customers.find((c) => String(c.id) === String(selectedCustomerId));
    const project = projects.find((p) => String(p.id) === String(selectedProjectId));
    const refNumber = `TRF-POS-${Date.now().toString().slice(-6)}`;

    try {
      let createdTrxNumber = '';
      if (paymentType === 'BOOKING') {
        // 1. Create booking
        const bookRes = await api.createBooking({
          customer_id: Number(selectedCustomerId),
          plot_id: Number(selectedLot.id),
          booking_fee: currentPayAmount,
          notes: `Booking unit ${selectedLot.code} via POS`,
        });

        if (!bookRes.success) {
          throw new Error(bookRes.error?.message || 'Gagal membuat booking');
        }

        createdTrxNumber = bookRes.data.booking_number;

        // 2. Submit payment for booking fee
        await api.submitPayment({
          booking_id: bookRes.data.id,
          amount: currentPayAmount,
          method: paymentMethod,
          reference_number: refNumber,
          notes: `Tanda jadi booking ${selectedLot.code} (${customer?.name || 'Customer'})`,
        });
      } else {
        // Sale / Cash / Cicilan
        const saleRes = await api.createSale({
          customer_id: Number(selectedCustomerId),
          plot_id: Number(selectedLot.id),
          discount_amount: 0,
          status: 'PENDING_PAYMENT',
          notes: `Transaksi ${paymentType} kavling ${selectedLot.code} via POS`,
        });

        if (!saleRes.success) {
          throw new Error(saleRes.error?.message || 'Gagal memproses transaksi penjualan');
        }

        createdTrxNumber = saleRes.data.sale_number || saleRes.data.transaction_number;

        // Submit initial payment
        await api.submitPayment({
          sale_id: saleRes.data.id,
          amount: currentPayAmount,
          method: paymentMethod,
          reference_number: refNumber,
          notes: `Pembayaran awal ${paymentType} ${selectedLot.code}`,
        });
      }

      const newReceipt = {
        transaction_number: createdTrxNumber,
        date: new Date().toISOString(),
        staff_name: user?.name || 'Staf Penjualan',
        customer_name: customer?.name || 'Customer',
        customer_phone: customer?.phone || '-',
        project_name: project?.name || 'Permata Sakinah',
        lot_code: selectedLot.code,
        lot_area: selectedLot.area_m2,
        total_price: selectedLot.price,
        payment_type: paymentType,
        payment_method: paymentMethod,
        amount_paid: currentPayAmount,
        remaining_amount: Math.max(0, selectedLot.price - currentPayAmount),
      };

      setReceiptData(newReceipt);
      addToast(`Transaksi ${createdTrxNumber} berhasil dicatat ke backend!`, 'success');

      // Refresh plots to show updated status
      loadLotsForProject(selectedProjectId);
    } catch (err) {
      addToast(err.message || 'Gagal memproses order transaksi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) return <LoadingState text="Memuat modul POS..." />;
  if (error) return <ErrorState message={error} onRetry={initData} />;

  const selectedCustomer = customers.find((c) => String(c.id) === String(selectedCustomerId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">POS Penjualan Kavling</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pilih unit kavling yang tersedia, tetapkan customer, dan konfirmasi skema pembayaran via REST API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Project & Lot Selector */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Pilih Proyek & Kavling">
            <div className="space-y-4">
              <Select
                label="Proyek Aktif"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Daftar Kavling
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {lots.map((lot) => {
                    const isSelected = selectedLot?.id === lot.id;
                    const isAvailable = lot.status === 'AVAILABLE';

                    return (
                      <button
                        key={lot.id}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedLot(lot);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20 bg-brand-50/50'
                            : isAvailable
                            ? 'border-slate-200 hover:border-slate-300 bg-white'
                            : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-slate-900">{lot.code}</span>
                          <StatusBadge status={lot.status} size="sm" />
                        </div>
                        <span className="text-xs text-slate-500 block">{lot.area_m2} m²</span>
                        <PriceDisplay amount={lot.price} size="sm" className="text-xs mt-1 block" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Data Calon Pembeli">
            <Select
              label="Pilih Customer Terdaftar"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              placeholder="-- Pilih Customer --"
              options={customers.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.phone})`,
              }))}
            />
            {selectedCustomer && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200">
                <p><span className="font-semibold text-slate-800">Alamat:</span> {selectedCustomer.address}</p>
                <p><span className="font-semibold text-slate-800">Email:</span> {selectedCustomer.email}</p>
                <p><span className="font-semibold text-slate-800">Sumber Lead:</span> {selectedCustomer.source}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Sticky Order Summary */}
        <div className="lg:sticky lg:top-20 space-y-4">
          <Card title="Ringkasan Transaksi">
            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Unit Kavling:</span>
                <span className="font-bold text-slate-900">
                  {selectedLot ? `${selectedLot.code} (${selectedLot.area_m2} m²)` : 'Belum dipilih'}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Harga Total:</span>
                <PriceDisplay amount={selectedLot?.price || 0} size="sm" className="font-semibold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Skema Transaksi
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['BOOKING', 'CASH', 'CICILAN'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setPaymentType(type);
                        setCustomAmount('');
                      }}
                      className={`py-1.5 px-2 rounded text-xs font-medium border text-center transition-colors ${
                        paymentType === type
                          ? 'border-primary bg-brand-50 text-primary font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-800"
                >
                  <option value="BANK_TRANSFER">Transfer Rekening Bank</option>
                  <option value="TRANSFER_BSI">Transfer BSI Syariah</option>
                  <option value="TRANSFER_BCA">Transfer BCA</option>
                  <option value="TRANSFER_MANDIRI">Transfer Mandiri</option>
                  <option value="CASH">Tunai di Kantor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nominal Dibayarkan Sekarang (Rp)
                </label>
                <input
                  type="number"
                  placeholder={calculateDefaultAmount().toString()}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full py-2 px-3 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Default {paymentType}: Rp {calculateDefaultAmount().toLocaleString('id-ID')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-slate-700 font-semibold">Total Tagihan Awal:</span>
                <PriceDisplay
                  amount={currentPayAmount}
                  size="md"
                  className="text-primary font-bold"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleCreateOrder}
                className="w-full justify-center mt-4"
                disabled={!selectedLot || submitting}
                isLoading={submitting}
              >
                Konfirmasi & Catat Transaksi (API)
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Cetak / Preview Struk POS */}
      {receiptData && (
        <Modal
          isOpen={!!receiptData}
          onClose={() => setReceiptData(null)}
          title="Struk Pemesanan & Pembayaran POS"
          description={`Nomor Transaksi: ${receiptData.transaction_number}`}
        >
          <div className="space-y-4">
            {/* Printable Receipt Paper */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs text-xs space-y-4 font-mono">
              <div className="text-center border-b border-dashed border-slate-300 pb-3 font-sans">
                <h3 className="font-extrabold text-base text-slate-900 tracking-wide">KAVLING PERMATA SAKINAH</h3>
                <p className="text-slate-500 text-xs">Bukti Tanda Terima Pembelian Unit Kavling</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Jl. Raya Permata Sakinah No. 1, Jawa Barat</p>
              </div>

              <div className="space-y-1 font-sans text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Order:</span>
                  <span className="font-bold text-slate-800">{receiptData.transaction_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu:</span>
                  <span className="text-slate-700">
                    {new Date(receiptData.date).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kasir / Staf:</span>
                  <span className="text-slate-800 font-medium">{receiptData.staff_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pembeli:</span>
                  <span className="text-slate-800 font-semibold">{receiptData.customer_name}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-1.5 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-600">Unit Kavling:</span>
                  <span className="font-bold text-slate-900">{receiptData.lot_code} ({receiptData.project_name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Luas Tanah:</span>
                  <span className="text-slate-800">{receiptData.lot_area} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Harga Kavling:</span>
                  <PriceDisplay amount={receiptData.total_price} size="xs" className="font-semibold text-slate-800" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Skema & Metode:</span>
                  <span className="font-medium text-slate-700">{receiptData.payment_type} • {receiptData.payment_method}</span>
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Jumlah Dibayar:</span>
                  <PriceDisplay amount={receiptData.amount_paid} size="md" className="font-extrabold text-emerald-700" />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Sisa Pelunasan:</span>
                  <PriceDisplay amount={receiptData.remaining_amount} size="xs" className="font-semibold text-slate-700" />
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-300 text-center font-sans text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Terima kasih atas kepercayaan Anda.</p>
                <p>Simpan tanda terima ini sebagai bukti sah transaksi awal kepemilikan kavling.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1 font-sans">
              <Button variant="outline" size="sm" onClick={() => setReceiptData(null)}>
                Tutup
              </Button>
              <Button size="sm" icon={Printer} onClick={handlePrintReceipt}>
                Cetak Struk
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
