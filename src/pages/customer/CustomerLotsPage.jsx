import React from 'react';
import { MapPin, FileCheck2, ShieldCheck } from 'lucide-react';
import { Card, PriceDisplay, StatusBadge, Button } from '../../components/common';
import { MOCK_TRANSACTIONS, MOCK_LOTS, MOCK_PROJECTS } from '../../services/api/mockData';

export default function CustomerLotsPage() {
  const myTrx = MOCK_TRANSACTIONS[0];
  const myLot = MOCK_LOTS[0];
  const project = MOCK_PROJECTS[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Kavling Saya</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Informasi spesifikasi teknis dan legalitas unit kavling yang sedang Anda miliki.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title={`Spesifikasi Unit — ${myLot.code}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Kode Kavling</span>
                <span className="text-base font-bold text-slate-900">{myLot.code}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Luas Tanah</span>
                <span className="text-base font-bold text-slate-900">{myLot.area_m2} m²</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Blok / Posisi</span>
                <span className="text-base font-bold text-slate-900">Blok {myLot.block}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Status Kepemilikan</span>
                <span className="text-base font-bold text-emerald-700">Akad Aktif</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Legalitas</span>
                <span className="text-base font-bold text-slate-900">SHM (On Process)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Catatan Posisi</span>
                <span className="text-xs font-semibold text-slate-800">{myLot.notes}</span>
              </div>
            </div>
          </Card>

          <Card title="Dokumen Legalitas & Perjanjian">
            <div className="space-y-3">
              {[
                { title: 'Surat Pemesanan Kavling (SPK)', date: '15 Feb 2026', status: 'Selesai' },
                { title: 'Akad Perjanjian Pengikatan Jual Beli (PPJB)', date: '18 Feb 2026', status: 'Selesai' },
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
              <span className="font-bold text-slate-900 block">{project.name}</span>
              <p className="text-slate-600 leading-relaxed">{project.description}</p>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-800 block mb-1">Fasilitas Proyek:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {project.facilities.slice(0, 4).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
