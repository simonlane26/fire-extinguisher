import React, { useState, useRef, useEffect } from 'react';
import { Cloud, CloudOff, Download, LogOut, ChevronDown } from 'lucide-react';
import type { ActiveTab } from './Sidebar';

const PAGE_COPY: Record<ActiveTab, { title: string; desc: string }> = {
  overview: { title: 'Extinguishers', desc: 'View, search and manage all extinguishers across your sites.' },
  sites: { title: 'Sites', desc: 'Manage the sites and buildings in your fire safety register.' },
  stock: { title: 'Stock', desc: 'Track parts and consumables used during servicing.' },
  users: { title: 'Users', desc: 'Manage who has access to your fire safety register.' },
  settings: { title: 'Settings', desc: 'Company details, branding and account preferences.' },
  'qr-codes': { title: 'QR Codes', desc: 'Generate and print QR tags for your extinguishers.' },
  billing: { title: 'Billing', desc: 'Manage your subscription plan and payment details.' },
  compliance: { title: 'Compliance Dashboard', desc: 'Real-time overview of your fire safety compliance.' },
  calendar: { title: 'Calendar', desc: 'Upcoming inspections and scheduled maintenance.' },
  reports: { title: 'Reports', desc: 'Generate and export compliance reports.' },
  help: { title: 'Help & Documentation', desc: 'Guides and answers for using FirexCheck.' },
  quotes: { title: 'Quotes', desc: 'Create and send quotes for supply and servicing.' },
  'fire-alarm': { title: 'Fire Alarm Logbook', desc: 'BS 5839-1 testing, servicing and fault logs.' },
  'pat-testing': { title: 'PAT Testing', desc: 'Portable appliance test records and schedules.' },
  'emergency-lighting': { title: 'Emergency Lighting', desc: 'BS 5266-1 luminaire testing and compliance.' },
  'platform-admin': { title: 'Platform Admin', desc: 'Manage tenants across the platform.' },
};

type Props = {
  activeTab: ActiveTab;
  userName: string;
  userRole: string;
  isOnline: boolean;
  onDownload: () => void;
  onLogout: () => void;
};

const TopHeader: React.FC<Props> = ({ activeTab, userName, userRole, isOnline, onDownload, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const copy = PAGE_COPY[activeTab] ?? { title: 'FirexCheck', desc: '' };
  const initials = userName
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-brand-line">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
        <div className="min-w-0">
          <h1 className="font-display font-semibold text-lg sm:text-xl text-brand-ink truncate">{copy.title}</h1>
          {copy.desc && <p className="text-xs sm:text-sm text-brand-inkMuted mt-0.5 hidden sm:block">{copy.desc}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isOnline ? 'bg-brand-green/10 text-brand-green' : 'bg-amber-100 text-brand-amber'
          }`}>
            {isOnline ? <Cloud size={13} /> : <CloudOff size={13} />}
            {isOnline ? 'Online' : 'Offline'}
          </div>

          {isOnline && (
            <button
              type="button"
              onClick={onDownload}
              title="Download data for offline use"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-inkMuted border border-brand-line hover:border-brand-red hover:text-brand-red transition-colors"
            >
              <Download size={13} /> Download
            </button>
          )}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-lg hover:bg-brand-bg transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-semibold flex items-center justify-center shrink-0">
                {initials || '?'}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <div className="text-xs font-medium text-brand-ink">{userName}</div>
                <div className="text-[11px] text-brand-inkMuted">{userRole}</div>
              </div>
              <ChevronDown size={14} className="text-brand-inkMuted hidden md:block" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-brand-line rounded-lg shadow-lg py-1 z-40">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-ink hover:bg-brand-bg transition-colors"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
