import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import api from '../../services/api/adapter';
import { Card, Badge, Button, LoadingState } from '../../components/common';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingState text="Memuat daftar proyek..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Daftar Proyek Kavling</h1>
        <p className="text-sm text-slate-600 mt-1">
          Eksplorasi lokasi kavling siap bangun Permata Sakinah dengan lingkungan islami dan legalitas terjamin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
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
    </div>
  );
}
