import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
}) {
  return (
    <div className={`border-b border-slate-200 ${className}`}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-brand-100 text-primary' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
