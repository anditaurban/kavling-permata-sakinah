import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  LayoutGrid,
  List,
  Compass,
  MessageCircle,
  ExternalLink,
  Info,
} from 'lucide-react';
import api from '../../services/api/adapter';
import {
  Button,
  Card,
  StatusBadge,
  PriceDisplay,
  Modal,
  LoadingState,
  ErrorState,
} from '../../components/common';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View state & selection
  const [activeTab, setActiveTab] = useState('siteplan'); // 'siteplan' | 'list'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLot, setSelectedLot] = useState(null);
  const [inquiryModalLot, setInquiryModalLot] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        const pRes = await api.getProjectById(id);
        if (!pRes.success) throw new Error(pRes.error?.message || 'Proyek tidak ditemukan');
        setProject(pRes.data);

        const lRes = await api.getLots(pRes.data.id);
        if (lRes.success) {
          setLots(lRes.data);
          if (lRes.data.length > 0) {
            setSelectedLot(lRes.data[0]);
          }
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat detail proyek');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) return <LoadingState text="Memuat detail proyek & kavling..." />;
  if (error || !project) return <ErrorState message={error || 'Proyek tidak ditemukan'} />;

  const filteredLots = lots.filter((l) => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  const availableCount = lots.filter((l) => l.status === 'AVAILABLE').length;
  const bookedCount = lots.filter((l) => l.status === 'BOOKED').length;
  const soldCount = lots.filter((l) => l.status === 'SOLD').length;

  const handleWhatsAppInquiry = (lot) => {
    const text = encodeURIComponent(
      `Halo Tim Permata Sakinah, saya tertarik dan ingin menanyakan unit Kavling ${lot.code} di proyek ${project.name} (Luas: ${lot.area_m2}m²). Apakah masih bisa disurvei?`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Proyek
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {project.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/pos">
              <Button variant="outline" size="sm">
                Buka di POS
              </Button>
            </Link>
            <Button
              size="sm"
              icon={MessageCircle}
              onClick={() => handleWhatsAppInquiry(selectedLot || lots[0])}
            >
              Konsultasi Proyek
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Banner & Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={project.cover_image} alt={project.name} className="w-full h-full object-cover" />
          </div>

          <Card title="Deskripsi & Keunggulan Proyek">
            <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2.5">
                Fasilitas Lingkungan Islami
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.facilities?.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Selected Lot Quick Inspector Card */}
        <div>
          <Card
            title={selectedLot ? `Kavling ${selectedLot.code}` : 'Pilih Kavling'}
            subtitle={selectedLot ? `Blok ${selectedLot.block} • Luas ${selectedLot.area_m2} m²` : 'Klik kavling di bawah'}
          >
            {selectedLot ? (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Status Ketersediaan:</span>
                  <StatusBadge status={selectedLot.status} size="sm" />
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Luas Tanah:</span>
                  <span className="font-bold text-slate-900">{selectedLot.area_m2} m²</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Harga Tunai:</span>
                  <PriceDisplay amount={selectedLot.price} size="sm" className="font-bold text-primary" />
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Estimasi Booking Fee:</span>
                  <span className="font-semibold text-slate-800">Rp 5.000.000</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 block mb-1">Catatan Lokasi:</span>
                  <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700">
                    {selectedLot.notes || 'Posisi standar.'}
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full justify-center"
                    icon={MessageCircle}
                    onClick={() => handleWhatsAppInquiry(selectedLot)}
                  >
                    Inquiry via WhatsApp
                  </Button>
                  <Link to="/pos" className="block">
                    <Button variant="outline" className="w-full justify-center">
                      Proses Transaksi di POS
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                Pilih salah satu kavling pada site-plan visual untuk melihat spesifikasi detail.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Site-plan Visual Explorer Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" /> Site-Plan Interaktif & Ketersediaan Kavling
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik kotak kavling untuk melihat spesifikasi unit dan simulasi pembelian.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({lots.length})
            </button>
            <button
              onClick={() => setStatusFilter('AVAILABLE')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                statusFilter === 'AVAILABLE'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Tersedia ({availableCount})
            </button>
            <button
              onClick={() => setStatusFilter('BOOKED')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                statusFilter === 'BOOKED'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Dibooking ({bookedCount})
            </button>
            <button
              onClick={() => setStatusFilter('SOLD')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                statusFilter === 'SOLD'
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Terjual ({soldCount})
            </button>
          </div>
        </div>

        {/* Visual Map Layout */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 border-b border-slate-200 pb-3">
            <span className="font-semibold text-slate-800">Petunjuk Warna:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-white border-2 border-emerald-500 block" />
              <span>Tersedia (Bisa Dipilih)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-50 border-2 border-amber-400 block" />
              <span>Dibooking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-200 border-2 border-slate-300 block" />
              <span>Terjual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-primary/10 border-2 border-primary block" />
              <span>Kavling Terpilih</span>
            </div>
          </div>

          {/* Road Visual Marker (Akses Jalan Utama) */}
          <div className="p-2 bg-slate-200 rounded text-center text-[11px] font-bold tracking-widest text-slate-600 uppercase">
            === JALAN UTAMA KOMPLEK (ROW 6 METER PAVING BLOCK) ===
          </div>

          {/* Lots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredLots.map((lot) => {
              const isSelected = selectedLot?.id === lot.id;
              const isAvailable = lot.status === 'AVAILABLE';
              const isBooked = lot.status === 'BOOKED';
              const isSold = lot.status === 'SOLD';

              return (
                <button
                  key={lot.id}
                  type="button"
                  onClick={() => setSelectedLot(lot)}
                  className={`relative p-3.5 rounded-lg border-2 text-left transition-all flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-xs'
                      : isAvailable
                      ? 'border-emerald-400/80 bg-white hover:border-emerald-600 hover:shadow-xs'
                      : isBooked
                      ? 'border-amber-300 bg-amber-50/70 hover:border-amber-400'
                      : 'border-slate-200 bg-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{lot.code}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : isBooked
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {lot.status}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 block">{lot.area_m2} m²</span>
                    <PriceDisplay amount={lot.price} size="xs" className="font-bold text-slate-800 block" />
                  </div>
                </button>
              );
            })}
          </div>

          {filteredLots.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              Tidak ada kavling yang sesuai dengan filter status yang dipilih.
            </div>
          )}

          {/* Road Visual Marker (Jalan Lingkungan Belakang) */}
          <div className="p-1.5 bg-slate-200/80 rounded text-center text-[10px] tracking-wider text-slate-500 uppercase">
            --- JALAN LINGKUNGAN BLOK BELAKANG & FASILITAS TAMAN ---
          </div>
        </div>
      </div>
    </div>
  );
}
