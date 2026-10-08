import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Layers, CheckCircle2, Users, ShoppingCart, ArrowRight } from 'lucide-react';
import api from '../../services/api/adapter';
import { Card, PriceDisplay, StatusBadge, Button, LoadingState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { role, currentUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [sumRes, trxRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getRecentTransactions(),
        ]);
        if (sumRes.success) setSummary(sumRes.data);
        if (trxRes.success) setRecentTransactions(trxRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <LoadingState text="Menyiapkan data operasional..." />;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Selamat Datang, {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Panel kendali operasional Permata Sakinah • Role aktif: <span className="font-semibold text-primary">{role}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/pos">
            <Button size="sm" icon={ShoppingCart}>
              Buka POS Penjualan
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="tight">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pendapatan Masuk</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <PriceDisplay amount={summary?.total_revenue} size="lg" className="text-slate-900 block" />
            <span className="text-[11px] text-emerald-600 font-medium">{summary?.monthly_growth} dari bulan lalu</span>
          </div>
        </Card>

        <Card padding="tight">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Kavling Tersedia</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{summary?.available_lots}</span>
            <span className="text-xs text-slate-500 ml-1.5">/ {summary?.total_lots} Total Kavling</span>
          </div>
        </Card>

        <Card padding="tight">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Kavling Terjual</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{summary?.sold_lots}</span>
            <span className="text-xs text-slate-500 ml-1.5">Kavling Akad</span>
          </div>
        </Card>

        <Card padding="tight">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Customer Terdaftar</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{summary?.active_customers}</span>
            <span className="text-xs text-slate-500 ml-1.5">Leads Aktif</span>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Table Preview */}
      <Card
        title="Transaksi Terbaru"
        subtitle="Daftar 5 transaksi penjualan dan booking kavling terkini"
        action={
          <Link to="/admin/transactions" className="text-xs font-semibold text-primary hover:text-brand-700 flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        <div className="divide-y divide-slate-100">
          {recentTransactions.map((trx) => (
            <div key={trx.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{trx.transaction_number}</span>
                  <StatusBadge status={trx.status} size="sm" />
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {trx.customer_name} • <span className="text-slate-700 font-medium">Kavling {trx.lot_code}</span> ({trx.type})
                </p>
              </div>
              <div className="text-right">
                <PriceDisplay amount={trx.amount} size="sm" className="block text-slate-900" />
                <span className="text-[11px] text-slate-400">
                  {new Date(trx.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
