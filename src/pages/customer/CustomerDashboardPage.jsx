import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { Card, PriceDisplay, StatusBadge, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { MOCK_TRANSACTIONS, MOCK_LOTS } from '../../services/api/mockData';

export default function CustomerDashboardPage() {
  const { currentUser } = useAuth();

  // Find customer's transaction & lot
  const myTrx = MOCK_TRANSACTIONS[0]; // Dimas Prasetyo
  const myLot = MOCK_LOTS[0]; // A-01

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Hai, {currentUser?.name || 'Pelanggan Permata Sakinah'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Selamat datang di portal kepemilikan kavling Anda. Pantau unit, jadwal pembayaran, dan progres legalitas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kavling Card */}
        <Card title="Kavling Anda" subtitle={myTrx.project_name}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-slate-900">Kavling {myLot.code}</span>
                <span className="text-xs text-slate-500 block">Luas {myLot.area_m2} m² • Blok {myLot.block}</span>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Nilai Kavling</span>
              <PriceDisplay amount={myTrx.amount} size="md" />
            </div>

            <Link to="/customer/lots" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full justify-center">
                Lihat Detail Kavling & Dokumen
              </Button>
            </Link>
          </div>
        </Card>

        {/* Payment Summary Card */}
        <Card title="Status Pembayaran" subtitle="Skema Akad Cicilan Syariah">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Telah Dibayar:</span>
              <PriceDisplay amount={myTrx.paid_amount} size="sm" className="text-emerald-700 font-bold" />
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Sisa Tagihan:</span>
              <PriceDisplay amount={myTrx.remaining_amount} size="sm" className="text-amber-700 font-bold" />
            </div>

            <div className="pt-2">
              <Link to="/customer/payments">
                <Button size="sm" className="w-full justify-center">
                  Riwayat & Jadwal Angsuran
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
