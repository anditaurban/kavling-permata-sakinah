import React, { useEffect, useState } from 'react';
import { Download, FileText, Calendar, CheckCircle2, DollarSign, Layers } from 'lucide-react';
import api from '../../services/api/adapter';
import { Card, PriceDisplay, Button, LoadingState, Badge, Table } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function ReportsPage() {
  const { addToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [salesReport, setSalesReport] = useState([]);
  const [paymentsReport, setPaymentsReport] = useState([]);
  const [plotsReport, setPlotsReport] = useState([]);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'sales' | 'payments' | 'plots'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const [sumRes, salesRes, payRes, plotsRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getSalesReport(),
          api.getPaymentsReport(),
          api.getPlotsReport(),
        ]);
        if (sumRes.success) setSummary(sumRes.data);
        if (salesRes.success) setSalesReport(salesRes.data || []);
        if (payRes.success) setPaymentsReport(payRes.data || []);
        if (plotsRes.success) setPlotsReport(plotsRes.data || []);
      } catch (err) {
        addToast('Gagal memuat beberapa data laporan', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'sales') {
      csvContent += 'No Transaksi,Customer,Kavling,Proyek,Total Nilai,Status,Tanggal\n';
      salesReport.forEach((s) => {
        csvContent += `"${s.sale_number}","${s.customer_name}","${s.plot_code}","${s.project_name}",${s.total_amount},"${s.status}","${s.created_at}"\n`;
      });
    } else if (activeTab === 'payments') {
      csvContent += 'No Pembayaran,Jumlah,Metode,Status,Tanggal,Catatan\n';
      paymentsReport.forEach((p) => {
        csvContent += `"${p.reference}",${p.amount},"${p.method}","${p.status}","${p.payment_date}","${p.notes}"\n`;
      });
    } else {
      csvContent += 'Kode Kavling,Proyek,Blok,Luas m2,Harga,Status\n';
      plotsReport.forEach((pl) => {
        csvContent += `"${pl.code}","${pl.project_name}","${pl.block}",${pl.area_m2},${pl.price},"${pl.status}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_permata_sakinah_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Laporan berhasil diekspor ke CSV!', 'success');
  };

  if (loading) return <LoadingState text="Menyiapkan data laporan eksekutif..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Laporan & Rekapitulasi Eksekutif</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ikhtisar performa penjualan kavling, audit mutasi kas masuk, dan valuasi inventaris via REST API.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={handleExportCSV}
        >
          Ekspor CSV ({activeTab.toUpperCase()})
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('summary')}
          className={`pb-2.5 transition-colors ${
            activeTab === 'summary'
              ? 'border-b-2 border-primary text-primary'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Ringkasan KPI
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-2.5 transition-colors ${
            activeTab === 'sales'
              ? 'border-b-2 border-primary text-primary'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Rekap Penjualan ({salesReport.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-2.5 transition-colors ${
            activeTab === 'payments'
              ? 'border-b-2 border-primary text-primary'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Rekap Penerimaan Kas ({paymentsReport.length})
        </button>
        <button
          onClick={() => setActiveTab('plots')}
          className={`pb-2.5 transition-colors ${
            activeTab === 'plots'
              ? 'border-b-2 border-primary text-primary'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Valuasi Inventaris ({plotsReport.length})
        </button>
      </div>

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Rekap Keuangan">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Kas Masuk Terverifikasi:</span>
                <PriceDisplay amount={summary?.total_revenue} size="sm" className="text-emerald-700 font-bold" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Penjualan Terkonfirmasi:</span>
                <PriceDisplay amount={summary?.revenue?.total_sales_revenue || summary?.total_revenue} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Penerimaan Booking Fee:</span>
                <PriceDisplay amount={summary?.revenue?.total_booking_fees || 0} size="sm" />
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Pending Verifikasi:</span>
                <PriceDisplay amount={summary?.revenue?.pending_verification_amount || 0} size="sm" className="text-amber-600" />
              </div>
            </div>
          </Card>

          <Card title="Rekap Inventaris Kavling">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Keseluruhan:</span>
                <span className="font-bold text-slate-900">{summary?.total_lots} Kavling</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Unit Tersedia (Ready):</span>
                <span className="font-bold text-emerald-600">{summary?.available_lots} Kavling</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Unit Dalam Booking:</span>
                <span className="font-bold text-amber-600">{summary?.booked_lots || 0} Kavling</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Unit Terjual (Akad):</span>
                <span className="font-bold text-slate-900">{summary?.sold_lots} Kavling</span>
              </div>
            </div>
          </Card>

          <Card title="Rekap Pelanggan & Transaksi">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaksi Terkonfirmasi:</span>
                <span className="font-bold text-slate-900">{summary?.counts?.confirmed_sales || salesReport.length} Unit</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Booking Aktif:</span>
                <span className="font-bold text-slate-900">{summary?.counts?.active_bookings || 0} Unit</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Customer / Leads:</span>
                <span className="font-bold text-slate-900">{summary?.counts?.total_customers || 0} Orang</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status Database:</span>
                <span className="font-semibold text-emerald-700">Online MySQL REST API</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'sales' && (
        <Card title="Rekapitulasi Penjualan (GET /reports/sales)">
          <div className="divide-y divide-slate-100">
            {salesReport.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{s.sale_number}</span>
                  <span className="text-slate-500">
                    {s.customer_name} • Kavling {s.plot_code} ({s.project_name})
                  </span>
                </div>
                <div className="text-right">
                  <PriceDisplay amount={s.total_amount} size="sm" className="font-bold text-slate-900 block" />
                  <Badge variant="success" size="sm">{s.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card title="Rekapitulasi Pembayaran Masuk (GET /reports/payments)">
          <div className="divide-y divide-slate-100">
            {paymentsReport.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{p.reference}</span>
                  <span className="text-slate-500">
                    {p.notes} • {p.payment_date ? new Date(p.payment_date).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
                <div className="text-right">
                  <PriceDisplay amount={p.amount} size="sm" className="font-bold text-emerald-700 block" />
                  <span className="text-[10px] uppercase font-bold text-slate-500">{p.method} • {p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'plots' && (
        <Card title="Valuasi Tanah Kavling per Proyek (GET /reports/plots)">
          <div className="divide-y divide-slate-100">
            {plotsReport.map((pl) => (
              <div key={pl.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{pl.code} — {pl.project_name}</span>
                  <span className="text-slate-500">Blok {pl.block} • Luas {pl.area_m2} m²</span>
                </div>
                <div className="text-right">
                  <PriceDisplay amount={pl.price} size="sm" className="font-semibold block" />
                  <Badge variant={pl.status === 'AVAILABLE' ? 'primary' : pl.status === 'SOLD' ? 'default' : 'warning'} size="sm">
                    {pl.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
