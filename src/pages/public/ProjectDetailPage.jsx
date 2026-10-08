import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import api from '../../services/api/adapter';
import { Button, Card, StatusBadge, PriceDisplay, LoadingState, ErrorState } from '../../components/common';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        const pRes = await api.getProjectById(id);
        if (!pRes.success) throw new Error(pRes.error.message);
        setProject(pRes.data);

        const lRes = await api.getLots(pRes.data.id);
        if (lRes.success) setLots(lRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) return <LoadingState text="Memuat detail proyek..." />;
  if (error || !project) return <ErrorState message={error || 'Proyek tidak ditemukan'} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Proyek
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {project.location}
            </p>
          </div>
          <Link to="/pos">
            <Button size="sm">Buka di POS</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={project.cover_image} alt={project.name} className="w-full h-full object-cover" />
          </div>

          <Card title="Deskripsi Proyek">
            <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Fasilitas & Keunggulan</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

        <div>
          <Card title="Kavling Tersedia" subtitle={`Total: ${lots.length} unit terdaftar`}>
            <div className="space-y-3">
              {lots.map((lot) => (
                <div
                  key={lot.id}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between bg-slate-50/50"
                >
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{lot.code}</span>
                    <span className="text-xs text-slate-500">Luas: {lot.area_m2} m²</span>
                  </div>
                  <div className="text-right">
                    <PriceDisplay amount={lot.price} size="sm" className="block text-primary" />
                    <StatusBadge status={lot.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
