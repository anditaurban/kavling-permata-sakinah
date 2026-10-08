import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 ${className}`}>
      <div className="text-xs text-slate-500">
        Menampilkan <span className="font-medium text-slate-700">{startItem}</span> -{' '}
        <span className="font-medium text-slate-700">{endItem}</span> dari{' '}
        <span className="font-medium text-slate-700">{totalItems}</span> data
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>
        <span className="text-xs px-2 text-slate-600 font-medium">
          {currentPage} / {Math.max(1, totalPages)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman Selanjutnya"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
