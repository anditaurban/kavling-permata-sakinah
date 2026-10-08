import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({
  trigger,
  items = [],
  align = 'right',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute z-30 mt-1.5 w-48 rounded-lg bg-white shadow-lg border border-slate-200 py-1 focus:outline-none ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="my-1 border-t border-slate-100" />;
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  item.onClick && item.onClick();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 transition-colors ${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                } ${item.disabled ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5 shrink-0" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
