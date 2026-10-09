import React, { useEffect, useState } from 'react';
import { Card, PriceDisplay, StatusBadge, Button, EmptyState, LoadingState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/adapter';

export default function CustomerPaymentsPage() {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const customerId = currentUser?.customer_id;
        const sRes = await api.getSales(customerId ? { customer_id: customerId } : {});
        if (sRes.success && sRes.data?.length > 0) {
          setSales(sRes.data);
          const firstSale = sRes.data[0];
          const pRes = await api.getPaymentsByTransaction(firstSale.id);
          if (pRes.success) setPayments(pRes.data || []);
        } else {
          setSales([]);
          setPayments([]);
        }
      } catch {
        setSales([]);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  if (loading) return <LoadingState text="Memuat riwayat pembayaran Anda..." />;

  const myTrx = sales[0];

  if (!myTrx) {
    return (
      <EmptyState
        title="Belum Ada Transaksi"
        description="Anda belum memiliki transaksi pembelian kavling aktif di sistem."
        actionText="Lihat Proyek Tersedia"
        onAction={() => (window.location.href = '/projects')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pembayaran & Tagihan</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Jadwal angsuran berkala dan riwayat bukti pembayaran terverifikasi via REST API.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Nilai Kontrak">
          <PriceDisplay amount={myTrx.amount} size="lg" className="text-slate-900 block" />
          <span className="text-xs text-slate-500 mt-1 block">No: {myTrx.transaction_number}</span>
        </Card>
        <Card title="Sudah Dibayar">
          <PriceDisplay amount={myTrx.paid_amount} size="lg" className="text-emerald-700 block" />
          <span className="text-xs text-slate-500 mt-1 block">
            {myTrx.amount > 0 ? Math.round((myTrx.paid_amount / myTrx.amount) * 100) : 0}% dari total harga
          </span>
        </Card>
        <Card title="Sisa Tagihan">
          <PriceDisplay amount={myTrx.remaining_amount} size="lg" className="text-amber-700 block" />
          <span className="text-xs text-slate-500 mt-1 block">Status Transaksi: {myTrx.status}</span>
        </Card>
      </div>

      <Card title="Riwayat Pembayaran Terverifikasi (GET /payments)">
        {payments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Belum ada riwayat pembayaran yang tercatat untuk transaksi ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{p.reference}</span>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {p.notes} • {p.payment_date ? new Date(p.payment_date).toLocaleDateString('id-ID') : '-'}
                  </p>
                </div>
                <div className="text-right">
                  <PriceDisplay amount={p.amount} size="sm" className="text-emerald-700 block font-semibold" />
                  <span className="text-[11px] text-slate-400">Metode: {p.method}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
