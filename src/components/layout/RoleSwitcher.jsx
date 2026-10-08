import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ChevronDown } from 'lucide-react';
import Dropdown from '../common/Dropdown';

export default function RoleSwitcher() {
  const { role, switchRole, currentUser, availableUsers } = useAuth();

  const roleColors = {
    OWNER: 'bg-purple-100 text-purple-800 border-purple-200',
    ADMIN: 'bg-brand-50 text-primary border-brand-200',
    STAFF: 'bg-blue-100 text-blue-800 border-blue-200',
    CUSTOMER: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const dropdownItems = availableUsers.map((user) => ({
    label: `${user.role}: ${user.name}`,
    onClick: () => switchRole(user.role),
  }));

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-slate-500 hidden sm:inline">Simulasi Role:</span>
      <Dropdown
        align="right"
        trigger={
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
              roleColors[role] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{role}</span>
            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
          </button>
        }
        items={dropdownItems}
      />
    </div>
  );
}
