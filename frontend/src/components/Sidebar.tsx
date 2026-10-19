import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import {
  Flame, TrendingUp, Building2, Package, FileText, CalendarDays, BarChart3,
  BellRing, Plug, Lightbulb, DoorClosed, QrCode, Users as UsersIcon, Crown,
  Settings as SettingsIcon, HelpCircle, ShieldCheck, ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { Tenant, PermissionKey } from '../types';
import './Sidebar.css';

export type ActiveTab =
  | 'overview' | 'sites' | 'stock' | 'users' | 'settings' | 'qr-codes' | 'billing'
  | 'compliance' | 'calendar' | 'reports' | 'help' | 'quotes' | 'fire-alarm'
  | 'pat-testing' | 'emergency-lighting' | 'fire-doors' | 'platform-admin';

type NavItem = {
  tab: ActiveTab;
  label: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

type Props = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  tenant: Tenant;
  hasPermission: (perm: PermissionKey) => boolean;
  isPlatformAdmin?: boolean;
};

const COLLAPSE_KEY = 'fxc_sidebar_collapsed';

const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab, tenant, hasPermission, isPlatformAdmin }) => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const navId = useId();

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        // localStorage unavailable — collapse state just won't persist
      }
      return next;
    });
  };

  const groups: NavGroup[] = [
    {
      label: 'Register',
      items: [
        { tab: 'compliance', label: 'Dashboard', icon: TrendingUp },
        { tab: 'overview', label: 'Extinguishers', icon: Flame },
        { tab: 'sites', label: 'Sites', icon: Building2 },
        ...(tenant.stockManagementEnabled !== false ? [{ tab: 'stock' as ActiveTab, label: 'Stock', icon: Package }] : []),
        { tab: 'quotes', label: 'Quotes', icon: FileText },
        { tab: 'calendar', label: 'Calendar', icon: CalendarDays },
        { tab: 'reports', label: 'Reports', icon: BarChart3 },
      ],
    },
    ...(tenant.fireAlarmEnabled || tenant.patTestingEnabled || tenant.emergencyLightingEnabled || tenant.fireDoorsEnabled
      ? [{
          label: 'Modules',
          items: [
            ...(tenant.fireAlarmEnabled ? [{ tab: 'fire-alarm' as ActiveTab, label: 'Fire Alarm', icon: BellRing }] : []),
            ...(tenant.patTestingEnabled ? [{ tab: 'pat-testing' as ActiveTab, label: 'PAT Testing', icon: Plug }] : []),
            ...(tenant.emergencyLightingEnabled ? [{ tab: 'emergency-lighting' as ActiveTab, label: 'Emergency Lighting', icon: Lightbulb }] : []),
            ...(tenant.fireDoorsEnabled ? [{ tab: 'fire-doors' as ActiveTab, label: 'Fire Doors', icon: DoorClosed }] : []),
          ],
        }]
      : []),
    {
      label: 'Manage',
      items: [
        { tab: 'qr-codes', label: 'QR Codes', icon: QrCode },
        ...(hasPermission('VIEW_USERS') ? [{ tab: 'users' as ActiveTab, label: 'Users', icon: UsersIcon }] : []),
        ...(hasPermission('VIEW_BILLING') ? [{ tab: 'billing' as ActiveTab, label: 'Billing', icon: Crown }] : []),
        ...(hasPermission('MANAGE_SETTINGS') ? [{ tab: 'settings' as ActiveTab, label: 'Settings', icon: SettingsIcon }] : []),
      ],
    },
  ];

  const bottomItems: NavItem[] = [
    { tab: 'help', label: 'Help', icon: HelpCircle },
    ...(isPlatformAdmin ? [{ tab: 'platform-admin' as ActiveTab, label: 'Platform', icon: ShieldCheck }] : []),
  ];

  // Flattened in visual order, for arrow-key roving focus across groups + footer
  const flatItems: NavItem[] = [...groups.flatMap((g) => g.items), ...bottomItems];
  const activeInFooter = bottomItems.some((i) => i.tab === activeTab);

  const rowRefs = useRef<Map<ActiveTab, HTMLButtonElement>>(new Map());
  const navBarRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLDivElement>(null);
  const footerBarRef = useRef<HTMLDivElement>(null);
  const footerListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const row = rowRefs.current.get(activeTab);
    if (!row) return;
    const target = activeInFooter ? footerBarRef.current : navBarRef.current;
    if (target) {
      target.style.setProperty('--y', `${row.offsetTop}px`);
    }
  }, [activeTab, collapsed, activeInFooter]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const dir = e.key === 'ArrowDown' ? 1 : -1;
    const nextIdx = (idx + dir + flatItems.length) % flatItems.length;
    rowRefs.current.get(flatItems[nextIdx].tab)?.focus();
  };

  const renderItem = (item: NavItem, idx: number) => {
    const Icon = item.icon;
    const active = activeTab === item.tab;
    return (
      <button
        key={item.tab}
        ref={(el) => {
          if (el) rowRefs.current.set(item.tab, el);
        }}
        type="button"
        aria-current={active ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
        onClick={() => setActiveTab(item.tab)}
        onKeyDown={(e) => handleKeyDown(e, idx)}
        className="sb-row"
      >
        <span className="sb-icon"><Icon size={17} /></span>
        <span className="sb-label">{item.label}</span>
      </button>
    );
  };

  let flatIdx = -1;

  return (
    <div className="sb-wrap hidden md:flex">
      <aside className="sb" data-collapsed={collapsed}>
        <div className="flex items-center gap-2 px-5 py-5 sb-header">
          <div className="w-8 h-8 rounded-md bg-brand-red flex items-center justify-center shrink-0">
            <Flame size={18} className="text-white" />
          </div>
          <span className="sb-title font-display font-semibold text-white text-[15px] tracking-tight">FirexCheck</span>
        </div>

        <div className="sb-scroll" id={navId}>
          <div className="sb-list" ref={navListRef}>
            <div className="sb-bar" ref={navBarRef} style={{ opacity: activeInFooter ? 0 : 1 }} aria-hidden="true" />
            {groups.map((group) => (
              <div key={group.label} className="sb-group">
                <div className="sb-group-label">{group.label}</div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    flatIdx++;
                    return renderItem(item, flatIdx);
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sb-footer">
          <div className="sb-list" ref={footerListRef}>
            <div className="sb-bar" ref={footerBarRef} style={{ opacity: activeInFooter ? 1 : 0 }} aria-hidden="true" />
            <div className="space-y-0.5">
              {bottomItems.map((item) => {
                flatIdx++;
                return renderItem(item, flatIdx);
              })}
            </div>
          </div>
        </div>
      </aside>

      <button
        type="button"
        className="sb-toggle"
        aria-expanded={!collapsed}
        aria-controls={navId}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={toggleCollapsed}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};

export default Sidebar;
