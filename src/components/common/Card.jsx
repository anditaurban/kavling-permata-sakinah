import React from 'react';

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  footer,
  padding = 'normal',
}) {
  const paddings = {
    none: 'p-0',
    tight: 'p-3',
    normal: 'p-5 sm:p-6',
    spacious: 'p-6 sm:p-8',
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}
      <div className={paddings[padding] || paddings.normal}>{children}</div>
      {footer && (
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}
