import React, { useEffect, useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import api from '../../services/api/adapter';
import { Card, PriceDisplay, Button, LoadingState } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function ReportsPage() {
  const { addToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getDashboardSummary();
        if (res.success) setSummary(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingState text="Menyiapkan data laporan..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Laporan & Rekapitulasi</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ikhtisar performa penjualan kavling dan penerimaan dana tunai / cicilan.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => addToast('Fitur ekspor CSV akan aktif pada fase backend', 'info')}
        >
          Ekspor Ringkasan (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Rekap Keuangan">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Penerimaan:</span>
              <PriceDisplay amount={summary?.total_revenue} size="sm" className="text-emerald-700" />
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Target Semester:</span>
              <PriceDisplay amount={summary?.target_revenue} size="sm" />
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Pencapaian:</span>
              <span className="font-bold text-slate-900">
                {Math.round(((summary?.total_revenue || 0) / (summary?.target_revenue || 1)) * 100)}%
              </span>
            </div>
          </div>
        </Card>

        <Card title="Rekap Inventaris Unit">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Keseluruhan:</span>
              <span className="font-bold text-slate-900">{summary?.total_lots} Kavling</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Unit Tersedia:</span>
              <span className="font-bold text-emerald-600">{summary?.available_lots} Kavling</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Unit Terjual / Akad:</span>
              <span className="font-bold text-slate-900">{summary?.sold_lots} Kavling</span>
            </div>
          </div>
        </Card>

        <Card title="Rekap Prospek & Pelanggan">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Pelanggan Aktif:</span>
              <span className="font-bold text-slate-900">{summary?.active_customers} Orang</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Tren Pertumbuhan:</span>
              <span className="font-bold text-emerald-600">{summary?.monthly_growth}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Status Database:</span>
              <span className="font-medium text-slate-700">Tersinkronisasi Mock</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
