import React, { useEffect, useState } from 'react';
import { ShoppingCart, Check, User, MapPin } from 'lucide-react';
import api from '../../services/api/adapter';
import { Button, Card, Select, StatusBadge, PriceDisplay, LoadingState } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function PosPage() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentType, setPaymentType] = useState('BOOKING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [pRes, cRes] = await Promise.all([api.getProjects(), api.getCustomers()]);
        if (pRes.success) {
          setProjects(pRes.data);
          if (pRes.data.length > 0) setSelectedProjectId(pRes.data[0].id);
        }
        if (cRes.success) setCustomers(cRes.data);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function loadLots() {
      if (!selectedProjectId) return;
      const res = await api.getLots(selectedProjectId);
      if (res.success) setLots(res.data);
      setSelectedLot(null);
    }
    loadLots();
  }, [selectedProjectId]);

  const handleCreateOrder = () => {
    if (!selectedLot) {
      addToast('Pilih kavling terlebih dahulu', 'warning');
      return;
    }
    addToast(`Simulasi transaksi untuk Kavling ${selectedLot.code} berhasil diproses`, 'success');
  };

  if (loading) return <LoadingState text="Memuat modul POS..." />;

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">POS Penjualan Kavling</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pilih unit kavling yang tersedia, tetapkan customer, dan konfirmasi skema pembayaran.
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
                        onClick={() => setSelectedLot(lot)}
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
                <PriceDisplay amount={selectedLot?.price || 0} size="sm" />
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
                      onClick={() => setPaymentType(type)}
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

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-slate-700 font-semibold">Estimasi DP/Booking:</span>
                <PriceDisplay
                  amount={
                    paymentType === 'BOOKING'
                      ? 5000000
                      : paymentType === 'CASH'
                      ? selectedLot?.price || 0
                      : Math.round((selectedLot?.price || 0) * 0.2)
                  }
                  size="md"
                  className="text-primary"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleCreateOrder}
                className="w-full justify-center mt-4"
                disabled={!selectedLot}
              >
                Konfirmasi & Buat Tagihan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
