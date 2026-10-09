import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Search as SearchIcon } from 'lucide-react';
import api from '../../services/api/adapter';
import { Card, Badge, Button, LoadingState, ErrorState, EmptyState } from '../../components/common';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProjects();
      if (res.success) {
        setProjects(res.data);
      } else {
        throw new Error(res.error?.message || 'Gagal memuat proyek');
      }
    } catch (err) {
      setError(err.message || 'Terjadi gangguan saat memuat data proyek');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...projects];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    setFilteredProjects(result);
  }, [search, projects]);

  if (loading) return <LoadingState text="Memuat daftar proyek..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Daftar Proyek Kavling</h1>
          <p className="text-sm text-slate-600 mt-1">
            Eksplorasi lokasi kavling siap bangun Permata Sakinah dengan lingkungan islami dan legalitas terjamin.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari lokasi atau nama proyek..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          title="Proyek Tidak Ditemukan"
          description={`Tidak ada lokasi proyek yang sesuai dengan pencarian "${search}".`}
          actionText="Tampilkan Semua Proyek"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} padding="none">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img src={project.cover_image} alt={project.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <Badge variant="primary">Tersedia {project.available_lots} Unit</Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.location}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.facilities?.map((f, i) => (
                    <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Kavling</span>
                    <span className="text-sm font-semibold text-slate-800">{project.total_lots} Kavling</span>
                  </div>
                  <Link to={`/projects/${project.id}`}>
                    <Button size="sm" icon={ArrowRight} iconPosition="right">
                      Lihat Kavling
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
