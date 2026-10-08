import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  Calendar,
  Sparkles,
  Award,
  Layers,
  Banknote,
  Compass,
  FileCheck2,
  Users,
  ChevronDown,
  Clock,
  Send,
  MessageSquare,
} from 'lucide-react';
import api from '../../services/api/adapter';
import { Button, Card, Badge, PriceDisplay } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const { addToast } = useToast();

  // Booking simulation / Lead consultation form
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    preferredProject: 'prj_001',
    surveyDate: '',
    notes: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getProjects();
        if (res.success) setProjects(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    addToast('Permintaan survei Anda berhasil dikirim! Tim konsultan kami akan segera menghubungi WhatsApp Anda.', 'success');
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Bagaimana status legalitas tanah kavling Permata Sakinah?',
      a: 'Seluruh proyek Permata Sakinah berstatus tanah darat dengan legalitas terjamin (Clean & Clear). Konsumen mendapatkan kepastian peningkatan hak hingga Sertifikat Hak Milik (SHM) yang diproses langsung melalui notaris rekanan resmi.',
    },
    {
      q: 'Apakah bisa dicicil langsung ke developer tanpa bank & tanpa bunga (riba)?',
      a: 'Bisa! Kami menyediakan skema pembayaran cash bertahap dan cicilan syariah langsung ke pengembang tanpa BI Checking, tanpa denda keterlambatan, tanpa sita, dan tanpa sistem bunga/riba yang merugikan.',
    },
    {
      q: 'Kapan kavling bisa langsung dibangun rumah atau tempat usaha?',
      a: 'Begitu proses akad dan pembayaran DP/pembayaran pertama diselesaikan, kavling siap serah terima fisik (patok BPN siap) dan dapat langsung mulai dibangun rumah tinggal maupun kebun produktif.',
    },
    {
      q: 'Apa saja fasilitas yang sudah disediakan di lokasi proyek?',
      a: 'Setiap kawasan kavling dilengkapi jalan cor beton lebar minimal 6 meter (muat 2 mobil papasan), saluran drainase/parit beton tertutup, tiang jaringan listrik PLN, pintu gerbang kawasan (One Gate System), serta area musala/masjid.',
    },
    {
      q: 'Apakah saya bisa melakukan survei lokasi gratis terlebih dahulu?',
      a: 'Tentu saja! Kami memfasilitasi survei lokasi bersama tim konsultan setiap hari (Senin-Minggu). Anda dapat memesan jadwal survei melalui formulir di bawah ini atau via WhatsApp.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Pilih Proyek & Kavling',
      desc: 'Pilih lokasi terbaik dan nomor kavling sesuai kebutuhan hunian atau investasi masa depan Anda melalui peta interaktif kami.',
      icon: Compass,
    },
    {
      step: '02',
      title: 'Survei Lokasi Gratis',
      desc: 'Didampingi konsultan resmi kami untuk cek langsung kondisi fisik lahan, patok batas, lingkungan sekitar, dan keaslian berkas legalitas.',
      icon: Calendar,
    },
    {
      step: '03',
      title: 'Booking Fee & Pilih Skema',
      desc: 'Kunci nomor kavling pilihan Anda dengan booking fee ringan mulai Rp1 Juta, lalu tentukan skema Cash Keras atau Cicilan Syariah.',
      icon: Banknote,
    },
    {
      step: '04',
      title: 'Akad Notaris & Serah Terima',
      desc: 'Penandatanganan berkas legalitas di hadapan notaris resmi, serah terima fisik patok kavling, dan siap langsung dibangun.',
      icon: FileCheck2,
    },
  ];

  const valueProps = [
    {
      icon: ShieldCheck,
      title: '100% Legalitas SHM Aman',
      desc: 'Tanah darat bersertifikat, bebas sengketa lahan, diproses transparan di hadapan PPAT/Notaris terpercaya.',
    },
    {
      icon: Banknote,
      title: 'Cicilan Syariah Tanpa Riba',
      desc: 'Langsung cicil ke developer tanpa BI Checking, tanpa biaya asuransi tersembunyi, tanpa denda dan sita.',
    },
    {
      icon: Award,
      title: 'Kawasan Bebas Banjir',
      desc: 'Kontur tanah darat asli yang padat dan tinggi di kawasan berkembang Sukatani & Cikarang Utara.',
    },
    {
      icon: Layers,
      title: 'Infrastruktur Cor 6 Meter',
      desc: 'Row jalan lebar cor beton muat 2 mobil, drainase rapi, jaringan listrik PLN, dan sarana masjid jami.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 py-6 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-gradient-to-b from-white via-brand-50/30 to-white shadow-sm p-6 sm:p-12 lg:p-16">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-brand-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-primary text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Peluang Investasi Properti Terbaik di Bekasi</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Miliki Kavling Siap Bangun Impian{' '}
                <span className="text-primary underline decoration-brand-200 underline-offset-8">
                  Halal & Legal SHM
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Pilihan tanah kavling strategis di Sukatani & Cikarang. Bebas banjir, jalan cor beton 6 meter, siap serah terima dan cicil syariah tanpa bunga tanpa ribet.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link to="/projects">
                  <Button size="lg" className="shadow-md shadow-brand-500/20" icon={ArrowRight} iconPosition="right">
                    Jelajahi Peta & Kavling
                  </Button>
                </Link>
                <a href="#survey-form">
                  <Button variant="outline" size="lg" icon={Calendar}>
                    Jadwalkan Survei Lokasi
                  </Button>
                </a>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Legalitas SHM Aman</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">0%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Riba, Bunga & Denda</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">6m+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Row Jalan Cor Beton</div>
                </div>
              </div>
            </div>

            {/* Right Hero Card / Visual Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sm:p-6 space-y-5">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
                    alt="Kavling Permata Sakinah"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                      UNIT TERSEDIA
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm">
                    <div className="text-[10px] text-slate-500 font-medium">Harga Mulai Dari</div>
                    <div className="text-sm font-bold text-primary">Rp 45.000.000</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Permata Sakinah Cikarang</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> Sukatani, Kab. Bekasi
                      </p>
                    </div>
                    <Badge variant="primary">Siap Bangun</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Luas Kavling:</span>
                      <strong className="text-slate-800">60 m² - 120 m²</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Skema Bayar:</span>
                      <strong className="text-slate-800">Cash / Cicil 24 Bln</strong>
                    </div>
                  </div>

                  <Link to="/projects/prj_001" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Lihat Site Plan Interaktif
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION / KENAPA PERMATA SAKINAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Keunggulan Utama
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Mengapa Ratusan Konsumen Memilih Permata Sakinah?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Investasi tanah dengan rasa tenang lahir dan batin berkat sistem syariah murni dan legalitas hukum yang kuat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="hover:border-primary/50 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-primary mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. PROYEK UNGGULAN & FEATURED LOTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-wider">Pilihan Lokasi</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Koleksi Proyek Kavling Siap Bangun
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Semua kavling telah dilengkapi patok batas resmi dan akses jalan beton
            </p>
          </div>
          <Link to="/projects">
            <Button variant="outline" size="sm" icon={ChevronRight} iconPosition="right">
              Lihat Semua Proyek & Lot
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="hover:border-slate-300 transition-all overflow-hidden flex flex-col" padding="none">
              <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={project.cover_image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold">
                    {project.total_lots} Total Kavling
                  </span>
                  <Badge variant="primary" size="md">
                    {project.available_lots} Kavling Tersedia
                  </Badge>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{project.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Facilities list */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Fasilitas Kawasan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.facilities?.slice(0, 4).map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Harga Mulai</span>
                    <span className="text-base font-extrabold text-primary">
                      Rp 45.000.000
                    </span>
                  </div>
                  <Link to={`/projects/${project.id}`}>
                    <Button size="sm">
                      Buka Site Plan & Booking
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. ALUR PROSES PEMBELIAN / CARA MEMBELI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Langkah Mudah
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            4 Langkah Mudah Memiliki Kavling
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Proses transparan, anti-ribet, didampingi penuh mulai dari survei hingga akad notaris.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-brand-200 font-mono">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FORMULIR JADWALKAN SURVEI & KONSULTASI (HIGH CONVERTING CTA) */}
      <section id="survey-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          {/* Subtle decor circles */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/60 border border-brand-500/30 text-brand-200 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-brand-300" />
                <span>Layanan Survei Gratis & Pendampingan</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Ingin Cek Langsung Lokasi & Patok Kavling?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Jadwalkan kunjungan Anda bersama tim kami. Dapatkan konsultasi denah kavling, cek keabsahan berkas legalitas, dan bonus voucher booking khusus bulan ini!
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Survei lokasi tanpa dipungut biaya apapun (Gratis)</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bisa diantar langsung dari titik kumpul stasiun terdekat</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Konsultasi simulasi cicilan langsung di tempat</span>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Permata%20Sakinah,%20saya%20tertarik%20untuk%20survei%20lokasi%20kavling."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Hubungi Langsung via WhatsApp Konsultan
                </a>
              </div>
            </div>

            {/* Form Card */}
            <div className="lg:col-span-6">
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
                {formSubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Jadwal Survei Berhasil Diterima!</h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                      Terima kasih <strong className="text-slate-900">{leadForm.name}</strong>. Tim konsultan Permata Sakinah akan menghubungi nomor <strong className="text-slate-900">{leadForm.phone}</strong> via WhatsApp dalam 1x24 jam untuk konfirmasi titik kumpul.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormSubmitted(false);
                        setLeadForm({
                          name: '',
                          phone: '',
                          preferredProject: 'prj_001',
                          surveyDate: '',
                          notes: '',
                        });
                      }}
                    >
                      Kirim Formulir Lain
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Form Pemesanan Jadwal Survei</h3>
                    <p className="text-xs text-slate-500 -mt-2">
                      Isi data singkat berikut untuk reservasi mobil pendamping survei
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Pak Herman"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nomor WhatsApp
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0812xxxxxxxx"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Rencana Tanggal Survei
                        </label>
                        <input
                          type="date"
                          required
                          value={leadForm.surveyDate}
                          onChange={(e) => setLeadForm({ ...leadForm, surveyDate: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pilihan Kawasan Kavling
                      </label>
                      <select
                        value={leadForm.preferredProject}
                        onChange={(e) => setLeadForm({ ...leadForm, preferredProject: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.location})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Catatan Khusus (Opsional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Contoh: Rencana beli untuk rumah kebun / butuh info jemputan stasiun"
                        value={leadForm.notes}
                        onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full justify-center" icon={Send}>
                      Konfirmasi Jadwal Survei Saya
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ (PERTANYAAN SERING DIAJUKAN) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Pertanyaan Umum
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pertanyaan yang Kerap Ditanyakan Calon Pembeli
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Keterbukaan informasi adalah komitmen utama kami dalam setiap transaksi kavling.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-primary transition-colors text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-50 via-white to-brand-50 border border-brand-200/70 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 max-w-2xl mx-auto leading-tight">
            Amankan Kavling Strategis Anda Sekarang Sebelum Kehabisan Unit Terbaik
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Unit sudut dan kavling dekat gerbang utama sangat terbatas. Cek ketersediaan lot sekarang juga atau hubungi kami untuk konsultasi.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/projects">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Pilih Unit di Site Plan
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Daftar Akun Customer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
