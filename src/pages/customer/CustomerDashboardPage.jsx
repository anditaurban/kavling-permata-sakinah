import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { Card, PriceDisplay, StatusBadge, Button, LoadingState, EmptyState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/adapter';

export default function CustomerDashboardPage() {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const customerId = currentUser?.customer_id;
        const res = await api.getSales(customerId ? { customer_id: customerId } : {});
        if (res.success) {
          setSales(res.data || []);
        }
      } catch {
        setSales([]);
      } finally {
        setLoading(false);
      }
    }
    loadCustomerData();
  }, [currentUser]);

  if (loading) return <LoadingState text="Memuat data kepemilikan kavling Anda..." />;

  const primarySale = sales[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Hai, {currentUser?.name || 'Pelanggan Permata Sakinah'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Selamat datang di portal kepemilikan kavling Anda. Pantau unit, jadwal pembayaran, dan progres legalitas via REST API.
        </p>
      </div>

      {!primarySale ? (
        <EmptyState
          title="Belum Ada Unit Kavling Aktif"
          description="Anda belum memiliki unit kavling yang terikat dengan akun portal ini. Hubungi konsultan untuk memproses booking atau pembelian."
          actionText="Jelajahi Proyek Kavling"
          onAction={() => (window.location.href = '/projects')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kavling Card */}
          <Card title="Kavling Anda" subtitle={primarySale.project_name}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-slate-900">Kavling {primarySale.lot_code}</span>
                  <span className="text-xs text-slate-500 block">Unit Akad • {primarySale.project_name}</span>
                </div>
                <StatusBadge status={primarySale.status} />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Nilai Kontrak</span>
                <PriceDisplay amount={primarySale.amount} size="md" />
              </div>

              <Link to="/customer/lots" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Lihat Detail Kavling & Dokumen
                </Button>
              </Link>
            </div>
          </Card>

          {/* Payment Summary Card */}
          <Card title="Status Pembayaran" subtitle="Skema Transaksi Kavling">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Telah Dibayar:</span>
                <PriceDisplay amount={primarySale.paid_amount} size="sm" className="text-emerald-700 font-bold" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sisa Tagihan:</span>
                <PriceDisplay
                  amount={primarySale.remaining_amount}
                  size="sm"
                  className={primarySale.remaining_amount === 0 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}
                />
              </div>

              <div className="pt-2">
                <Link to="/customer/payments">
                  <Button size="sm" className="w-full justify-center">
                    Riwayat Pembayaran & Kwitansi
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
