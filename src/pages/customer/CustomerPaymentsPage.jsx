import React from 'react';
import { Card, PriceDisplay, StatusBadge, Button } from '../../components/common';
import { MOCK_TRANSACTIONS, MOCK_PAYMENTS } from '../../services/api/mockData';

export default function CustomerPaymentsPage() {
  const myTrx = MOCK_TRANSACTIONS[0];
  const myPayments = MOCK_PAYMENTS.filter((p) => p.transaction_id === myTrx.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pembayaran & Tagihan</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Jadwal angsuran berkala dan riwayat bukti pembayaran terverifikasi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Nilai Kontrak">
          <PriceDisplay amount={myTrx.amount} size="lg" className="text-slate-900 block" />
          <span className="text-xs text-slate-500 mt-1 block">Skema Akad: {myTrx.type}</span>
        </Card>
        <Card title="Sudah Dibayar">
          <PriceDisplay amount={myTrx.paid_amount} size="lg" className="text-emerald-700 block" />
          <span className="text-xs text-slate-500 mt-1 block">
            {Math.round((myTrx.paid_amount / myTrx.amount) * 100)}% dari total harga
          </span>
        </Card>
        <Card title="Sisa Tagihan">
          <PriceDisplay amount={myTrx.remaining_amount} size="lg" className="text-amber-700 block" />
          <span className="text-xs text-slate-500 mt-1 block">Jatuh tempo tgl 15 setiap bulan</span>
        </Card>
      </div>

      <Card title="Riwayat Pembayaran Terverifikasi">
        <div className="divide-y divide-slate-100">
          {myPayments.map((p) => (
            <div key={p.id} className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{p.reference}</span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <p className="text-slate-500 mt-0.5">
                  {p.notes} • {new Date(p.payment_date).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="text-right">
                <PriceDisplay amount={p.amount} size="sm" className="text-emerald-700 block" />
                <span className="text-[11px] text-slate-400">Metode: {p.method}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
