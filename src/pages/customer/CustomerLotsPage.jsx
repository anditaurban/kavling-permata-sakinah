import React, { useEffect, useState } from 'react';
import { MapPin, FileCheck2, ShieldCheck } from 'lucide-react';
import { Card, PriceDisplay, StatusBadge, Button, LoadingState, EmptyState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/adapter';

export default function CustomerLotsPage() {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const customerId = currentUser?.customer_id;
        const res = await api.getSales(customerId ? { customer_id: customerId } : {});
        if (res.success) {
          setSales(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  if (loading) return <LoadingState text="Memuat unit kavling Anda..." />;

  const mySale = sales[0];

  if (!mySale) {
    return (
      <EmptyState
        title="Belum Memiliki Kavling"
        description="Anda belum memiliki unit kavling aktif yang tercatat di portal."
        actionText="Lihat Katalog Proyek"
        onAction={() => (window.location.href = '/projects')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Kavling Saya</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Informasi spesifikasi teknis dan legalitas unit kavling yang sedang Anda miliki via REST API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title={`Spesifikasi Unit — ${mySale.lot_code}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Kode Kavling</span>
                <span className="text-base font-bold text-slate-900">{mySale.lot_code}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Proyek Lokasi</span>
                <span className="text-base font-bold text-slate-900">{mySale.project_name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Status Akad</span>
                <span className="text-base font-bold text-emerald-700">{mySale.status}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Nilai Akad</span>
                <PriceDisplay amount={mySale.amount} size="sm" className="font-bold text-slate-900" />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Legalitas</span>
                <span className="text-base font-bold text-slate-900">SHM (On Process)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">No. Transaksi</span>
                <span className="text-xs font-semibold text-slate-800">{mySale.transaction_number}</span>
              </div>
            </div>
          </Card>

          <Card title="Dokumen Legalitas & Perjanjian">
            <div className="space-y-3">
              {[
                { title: 'Surat Pemesanan Kavling (SPK)', date: 'Terverifikasi Sistem', status: 'Selesai' },
                { title: 'Akad Perjanjian Pengikatan Jual Beli (PPJB)', date: 'Terverifikasi Notaris', status: 'Selesai' },
                { title: 'Sertifikat Hak Milik (SHM)', date: 'Estimasi Akhir Pelunasan', status: 'Proses Notaris' },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="w-5 h-5 text-primary" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-500">{doc.date}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Lokasi Proyek">
            <div className="space-y-3 text-xs">
              <span className="font-bold text-slate-900 block">{mySale.project_name}</span>
              <p className="text-slate-600 leading-relaxed">
                Kawasan kavling hunian syariah asri dengan legalitas aman (Clean & Clear) langsung dari pengembang.
              </p>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-800 block mb-1">Keunggulan:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>Jalan cor beton 6m</li>
                  <li>Drainase tertutup</li>
                  <li>Jaringan listrik PLN</li>
                  <li>Masjid komplek</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
