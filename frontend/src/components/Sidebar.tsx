import React from 'react';
import {
  Flame, TrendingUp, Building2, Package, FileText, CalendarDays, BarChart3,
  BellRing, Plug, Lightbulb, QrCode, Users as UsersIcon, Crown,
  Settings as SettingsIcon, HelpCircle, ShieldCheck,
} from 'lucide-react';
import type { Tenant, PermissionKey } from '../types';

export type ActiveTab =
  | 'overview' | 'sites' | 'stock' | 'users' | 'settings' | 'qr-codes' | 'billing'
  | 'compliance' | 'calendar' | 'reports' | 'help' | 'quotes' | 'fire-alarm'
  | 'pat-testing' | 'emergency-lighting' | 'platform-admin';

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

const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab, tenant, hasPermission, isPlatformAdmin }) => {
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
    ...(tenant.fireAlarmEnabled || tenant.patTestingEnabled || tenant.emergencyLightingEnabled
      ? [{
          label: 'Modules',
          items: [
            ...(tenant.fireAlarmEnabled ? [{ tab: 'fire-alarm' as ActiveTab, label: 'Fire Alarm', icon: BellRing }] : []),
            ...(tenant.patTestingEnabled ? [{ tab: 'pat-testing' as ActiveTab, label: 'PAT Testing', icon: Plug }] : []),
            ...(tenant.emergencyLightingEnabled ? [{ tab: 'emergency-lighting' as ActiveTab, label: 'Emergency Lighting', icon: Lightbulb }] : []),
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

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = activeTab === item.tab;
    return (
      <button
        key={item.tab}
        type="button"
        onClick={() => setActiveTab(item.tab)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-brand-red text-white'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon size={17} className="shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 bg-brand-ink h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-8 h-8 rounded-md bg-brand-red flex items-center justify-center shrink-0">
          <Flame size={18} className="text-white" />
        </div>
        <span className="font-display font-semibold text-white text-[15px] tracking-tight">FirexCheck</span>
      </div>

      <nav className="flex-1 px-3 space-y-5 pb-4">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5 font-mono text-[10px] uppercase tracking-wider text-gray-500">
              {group.label}
            </div>
            <div className="space-y-0.5">{group.items.map(renderItem)}</div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-0.5 border-t border-white/10 pt-3">
        {bottomItems.map(renderItem)}
      </div>
    </aside>
  );
};

export default Sidebar;
