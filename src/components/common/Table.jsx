import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function Table({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  emptyMessage = 'Tidak ada data ditemukan.',
  emptyTitle,
  emptyDescription,
  emptyActionText,
  onEmptyAction,
  onRowClick,
  className = '',
}) {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs ${className}`}>
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.header}
                scope="col"
                className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Memuat data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <h5 className="text-sm font-semibold text-slate-800">
                    {emptyTitle || emptyMessage}
                  </h5>
                  {emptyDescription && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {emptyDescription}
                    </p>
                  )}
                  {emptyActionText && onEmptyAction && (
                    <div className="mt-3">
                      <Button variant="outline" size="sm" onClick={onEmptyAction}>
                        {emptyActionText}
                      </Button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row[keyField] || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.header}
                    className={`px-4 py-3 text-slate-700 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row, index) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
