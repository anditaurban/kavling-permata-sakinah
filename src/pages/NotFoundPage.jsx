import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-5xl font-black text-primary font-mono">404</span>
      <h1 className="text-xl font-bold text-slate-900 mt-2">Halaman Tidak Ditemukan</h1>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
