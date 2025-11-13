// src/App.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Eye,
  QrCode,
  Users as UsersIcon,
  Building2,
  Crown,
  Shield,
  Flame,
  Settings as SettingsIcon,
  Download,
  Upload,
} from 'lucide-react';

import QRScanner from './components/QRScanner';
import AddExtinguisherModal from './components/AddExtinguisherModal';
import ExtinguisherDetails from './components/ExtinguisherDetails';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import QrCodesPage from './pages/QrCodesPage';
import BillingPage from './pages/BillingPage';
import RoleSwitcherModal from './components/RoleSwitcher';
import GenerateReportButton from './components/GenerateReportButton';
import TabButton from './components/TabButton';
import { addExtinguisher, fetchExtinguishers, exportExtinguishersCsv, importExtinguishersCsv } from './lib/api';
import { AuthContext, type AuthCtx } from './components/AuthWrapper';
import type {
  Extinguisher,
  Tenant,
  User,
  AuthedUser,
  RoleKey,
  PermissionKey,
} from './types';

/* ----------------------------- Context contracts ----------------------------- */
export type TenantCtx = {
  tenant: Tenant;
  loading: boolean;
  error: string | null;
  switchTenant: (sub: string) => void;
  updateTenant: (u: Partial<Tenant>) => void;
};

const TenantContext = createContext<TenantCtx | null>(null);

/* -------------------------------- Mock data --------------------------------- */
const MOCK_CURRENT_USER: AuthedUser = {
  id: 'current_user',
  name: 'Demo Admin',
  email: 'admin@demo.com',
  role: 'admin',
  status: 'active',
  lastLogin: 'Never',
  createdAt: new Date().toISOString().split('T')[0],
  tenantId: 'tenant-demo',
};

const MOCK_TENANTS: Record<string, Tenant> = {
  demo: {
    id: 'tenant-demo',
    companyName: 'Demo Company',
    subdomain: 'demo',
    logoUrl: null,
    primaryColor: '#7c3aed',
    secondaryColor: '#5b21b6',
    subscriptionPlan: 'trial',
    subscriptionStatus: 'trial',
    createdAt: '2024-12-01',
  },
};

const SUBSCRIPTION_PLANS: Record<
  Tenant['subscriptionPlan'],
  { name: string; price: string }
> = {
  trial: { name: 'Trial', price: 'Free' },
  starter: { name: 'Starter', price: '$29/month' },
  professional: { name: 'Professional', price: '$99/month' },
  enterprise: { name: 'Enterprise', price: 'Custom' },
};

const USER_ROLES: Record<RoleKey, { name: string; description: string }> = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full system access including billing and user management',
  },
  admin: {
    name: 'Administrator',
    description: 'Manage users and extinguishers, view reports',
  },
  manager: {
    name: 'Manager',
    description: 'Manage extinguishers and view reports',
  },
  inspector: {
    name: 'Inspector',
    description: 'Inspect extinguishers and view basic information',
  },
  viewer: {
    name: 'Viewer',
    description: 'Read-only access to extinguisher data',
  },
};

const PERMISSIONS: Record<PermissionKey, RoleKey[]> = {
  VIEW_USERS: ['super_admin', 'admin', 'manager'],
  ADD_USERS: ['super_admin', 'admin'],
  EDIT_USERS: ['super_admin', 'admin'],
  DELETE_USERS: ['super_admin'],
  VIEW_EXTINGUISHERS: ['super_admin', 'admin', 'manager', 'inspector', 'viewer'],
  ADD_EXTINGUISHERS: ['super_admin', 'admin', 'manager'],
  EDIT_EXTINGUISHERS: ['super_admin', 'admin', 'manager'],
  DELETE_EXTINGUISHERS: ['super_admin'],
  PERFORM_INSPECTIONS: ['super_admin', 'admin', 'manager', 'inspector'],
  VIEW_INSPECTIONS: ['super_admin', 'admin', 'manager', 'inspector', 'viewer'],
  VIEW_REPORTS: ['super_admin', 'admin', 'manager'],
  VIEW_BILLING: ['super_admin'],
  MANAGE_SETTINGS: ['super_admin', 'admin'],
};

const hasPermissionFor = (role: RoleKey, perm: PermissionKey) =>
  PERMISSIONS[perm]?.includes(role) || false;

/* -------------------------------- Providers --------------------------------- */
const TenantProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const actx = useContext(AuthContext);
  if (!actx) throw new Error('TenantProvider must be used within AuthWrapper');

  const [tenant, setTenant] = useState<Tenant>(actx.currentUser.tenant);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Update tenant when currentUser changes
  useEffect(() => {
    if (actx.currentUser.tenant) {
      setTenant(actx.currentUser.tenant);
    }
  }, [actx.currentUser]);

  const switchTenant = (sub: string) => {
    // In a real app, this would switch to a different tenant the user has access to
    console.log('Switch tenant not implemented:', sub);
  };

  const updateTenant = (u: Partial<Tenant>) =>
    setTenant((prev) => ({ ...prev, ...u }));

  return (
    <TenantContext.Provider
      value={{ tenant, loading, error, switchTenant, updateTenant }}
    >
      {children}
    </TenantContext.Provider>
  );
};

/* --------------------------------- Helpers ---------------------------------- */
function computeKpis(list: Extinguisher[]) {
  const total = list.length;
  const active = list.filter((e) => e.status === 'Active').length;
  const needs =
    list.filter(
      (e) => e.condition === 'Needs Attention' || e.status !== 'Active',
    ).length;
  return { total, active, needs, planLimit: { used: total, limit: 10 } };
}

type KpiProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  bg: string;
  iconBg?: string;
};

const KpiCard: React.FC<KpiProps> = ({
  label,
  value,
  icon,
  bg,
  iconBg = 'bg-white/20',
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-5 shadow ring-1 ring-black/5 ${bg} text-white`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
      <div className={`grid size-10 place-items-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
    </div>
  </div>
);

/* ------------------------------ Main App Shell ------------------------------- */
const FireExtinguisherApp: React.FC = () => {
  const tctx = useContext(TenantContext);
  const actx = useContext(AuthContext);
  if (!tctx || !actx) return null;

  const { tenant, updateTenant } = tctx;
  const { currentUser, setCurrentUser, hasPermission } = actx;

  const [activeTab, setActiveTab] =
    useState<'overview' | 'users' | 'settings' | 'qr-codes' | 'billing'>('overview');

  // Extinguishers state (seed with demo; will be replaced by API load)
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([
    {
      id: 'FE001',
      location: 'Main Lobby',
      building: 'Building A',
      floor: '1st Floor',
      type: 'Dry Powder 6KG',
      capacity: '6 kg',
      status: 'Active',
      condition: 'Good',
      manufacturer: 'Amerex',
      model: 'B500',
      serialNumber: 'AX123456',
      installDate: '2023-01-15',
      expiryDate: '2043-01-15',
      lastInspection: '2024-12-15',
      nextInspection: '2025-01-15',
      lastMaintenance: '2024-06-15',
      nextMaintenance: '2025-06-15',
      serviceType: 'Basic',
      inspector: 'John Smith',
      notes: 'Pressure gauge in green zone',
    },
    {
      id: 'FE002',
      location: 'Kitchen',
      building: 'Building A',
      floor: '1st Floor',
      type: 'Wet Chemical',
      capacity: '6 L',
      status: 'Active',
      condition: 'Needs Attention',
      manufacturer: 'Ansul',
      model: 'K-GUARD',
      serialNumber: 'AN789012',
      installDate: '2023-02-10',
      expiryDate: '2043-02-10',
      lastInspection: '2024-11-20',
      nextInspection: '2025-02-20',
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2025-02-10',
      serviceType: 'Extended',
      inspector: 'Sarah Johnson',
      notes: 'Pressure slightly low, monitor closely',
    },
  ]);

  // Load from API (replaces demo data if backend is up)
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchExtinguishers(); // uses authenticated user's tenant
        setExtinguishers(data);
      } catch (err) {
        console.warn('API load failed, keeping demo data:', err);
      }
    })();
  }, [tenant.id]);

  // Users (for UsersPage)
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user_1',
      name: 'John Smith',
      email: 'john.smith@demo.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-12-15',
      createdAt: '2024-01-15',
    },
    {
      id: 'user_2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@demo.com',
      role: 'inspector',
      status: 'active',
      lastLogin: '2024-12-14',
      createdAt: '2024-02-01',
    },
    {
      id: 'user_3',
      name: 'Mike Wilson',
      email: 'mike.wilson@demo.com',
      role: 'manager',
      status: 'inactive',
      lastLogin: '2024-12-10',
      createdAt: '2024-03-15',
    },
  ]);

  const handleAddUser = (u: User) => setUsers((prev) => [...prev, u]);
  const handleUpdateUser = (id: string, patch: Partial<User>) =>
    setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  // Detail modal
  const [selectedExtinguisher, setSelectedExtinguisher] =
    useState<Extinguisher | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const openDetails = (ext: Extinguisher) => {
    setSelectedExtinguisher(ext);
    setShowDetails(true);
  };

  // Add modal + QR
  const [openAdd, setOpenAdd] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  // CSV import/export
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Role switcher
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const handleSelectRole = (role: RoleKey) => {
    setCurrentUser({
      ...currentUser,
      role,
      name: `Demo ${USER_ROLES[role].name}`,
    });
    setShowRoleSwitcher(false);
  };

  // CSV Export handler
  const handleExport = async () => {
    try {
      setExporting(true);
      await exportExtinguishersCsv();
    } catch (err) {
      alert(`Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  // CSV Import handlers
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setImportResult(null);
      const result = await importExtinguishersCsv(file);
      setImportResult({ imported: result.imported, errors: result.errors });

      if (result.imported > 0) {
        // Refresh the extinguishers list
        const data = await fetchExtinguishers();
        setExtinguishers(data);
      }

      if (result.errors > 0) {
        console.error('Import errors:', result.details);
      }
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const { total, active, needs, planLimit } = computeKpis(extinguishers);

  // Helper: next ID
  const getNextExtinguisherId = (list: Extinguisher[]) => {
    const nums = list
      .map((e) => parseInt(String(e.id).replace(/^FE/i, ''), 10))
      .filter((n) => Number.isFinite(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `FE${String(next).padStart(3, '0')}`;
  };

  // Create with optimistic UI + server reconcile
  const handleCreate = async (payload: Partial<Extinguisher>) => {
    const today = new Date().toISOString().split('T')[0];
    const type = payload.type ?? '';
    const years = type.startsWith('CO2') ? 10 : 20;
    const install = payload.installDate ?? today;
    const expiry = new Date(install);
    expiry.setFullYear(expiry.getFullYear() + years);

    const optimistic: Extinguisher = {
      id: getNextExtinguisherId(extinguishers),
      location: payload.location!,
      building: payload.building!,
      floor: payload.floor ?? '',
      type,
      capacity: payload.capacity ?? '',
      manufacturer: payload.manufacturer ?? '',
      model: payload.model ?? '',
      serialNumber: payload.serialNumber ?? '',
      installDate: install,
      expiryDate: expiry.toISOString().split('T')[0],
      lastInspection: today,
      nextInspection: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      lastMaintenance: today,
      nextMaintenance: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      status: (payload.status as Extinguisher['status']) ?? 'Active',
      condition: (payload.condition as Extinguisher['condition']) ?? 'Good',
      serviceType: payload.serviceType ?? 'Commission',
      inspector: payload.inspector ?? '',
      notes: payload.notes ?? '',
    };

    // optimistic add
    setExtinguishers((prev) => [...prev, optimistic]);

    try {
      // send to server (make sure your API adds tenantId server-side or accept it here)
      const created = await addExtinguisher({
        ...payload,
        // tenantId: tenant.id, // uncomment if your API expects it in body
      });

      // replace optimistic with server row (assumes created is the real row)
      setExtinguishers((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = created;
        return copy;
      });
    } catch (err) {
      console.error('Failed to create extinguisher:', err);
      // rollback
      setExtinguishers((prev) => prev.filter((e) => e.id !== optimistic.id));
      alert('Failed to add extinguisher. Please try again.');
    }
  };

  const canAddUsers = hasPermission('ADD_USERS');
  const canEditUsers = hasPermission('EDIT_USERS');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
  className="p-4 text-white"
  style={{
    backgroundColor: tenant.primaryColor && tenant.primaryColor !== '#ffffff' && tenant.primaryColor !== '#fff' && tenant.primaryColor !== 'white' ? tenant.primaryColor : '#7c3aed'
  }}
>
  <div className="flex items-center justify-between mx-auto max-w-7xl">
    {/* Left: Logo + Titles */}
    <div className="flex items-center space-x-3">
  <img
    src={tenant?.logoUrl || '/logo.png'}
    alt={`${tenant?.companyName || 'Company'} logo`}
    className="object-contain w-auto h-10"
    onError={(e) => {
      const fallback = '/logo.png';
      if (e.currentTarget.src !== window.location.origin + fallback) {
        e.currentTarget.src = fallback;
      }
    }}
  />
  <div>
    <h1 className="text-xl font-bold">{tenant.companyName}</h1>
    <div className="text-sm opacity-75">Fire Safety Management System</div>
  </div>
</div>


    {/* Right: Plan + Current User */}
    <div className="flex items-center space-x-4">
      <div className="flex items-center px-3 py-1 space-x-2 rounded-lg bg-white/20">
        <Crown size={16} />
        <span className="text-sm font-medium">
          {SUBSCRIPTION_PLANS[tenant.subscriptionPlan]?.name}
        </span>
      </div>
      <div className="flex items-center px-3 py-1 space-x-2 rounded-lg bg-white/20">
        <Shield size={16} />
        <span className="text-sm font-medium">
          {currentUser.name} ({USER_ROLES[currentUser.role]?.name})
        </span>
      </div>
    </div>
  </div>
</header>

      <div className="p-6 mx-auto space-y-6 max-w-7xl">
        {/* KPI cards */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Extinguishers"
            value={total}
            icon={<Flame className="size-6" />}
            bg="bg-gradient-to-br from-indigo-600 to-indigo-500"
          />
          <KpiCard
            label="Active Units"
            value={active}
            icon={<CheckCircle className="size-6" />}
            bg="bg-gradient-to-br from-emerald-600 to-emerald-500"
          />
          <KpiCard
            label="Needs Attention"
            value={needs}
            icon={<AlertTriangle className="size-6" />}
            bg="bg-gradient-to-br from-amber-600 to-amber-500"
          />
          <KpiCard
            label="Plan Limit"
            value={
              <span>
                {planLimit.used}/{planLimit.limit}
              </span>
            }
            icon={<Crown className="size-6" />}
            bg="bg-gradient-to-br from-violet-600 to-violet-500"
          />
        </section>

        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              primaryColor={tenant.primaryColor}
            >
              Overview
            </TabButton>

            {hasPermission('VIEW_USERS') && (
              <TabButton
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
                primaryColor={tenant.primaryColor}
              >
                <UsersIcon size={16} />
                <span>Users</span>
              </TabButton>
            )}

            <TabButton
              active={activeTab === 'qr-codes'}
              onClick={() => setActiveTab('qr-codes')}
              primaryColor={tenant.primaryColor}
            >
              <QrCode size={16} />
              <span>QR Codes</span>
            </TabButton>

            {hasPermission('VIEW_BILLING') && (
              <TabButton
                active={activeTab === 'billing'}
                onClick={() => setActiveTab('billing')}
                primaryColor={tenant.primaryColor}
              >
                <Crown size={16} />
                <span>Billing</span>
              </TabButton>
            )}

            {hasPermission('MANAGE_SETTINGS') && (
              <TabButton
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                primaryColor={tenant.primaryColor}
              >
                <SettingsIcon size={16} />
                <span>Settings</span>
              </TabButton>
            )}
          </div>

          <GenerateReportButton
            tenantId={tenant.id}
            primaryColor={tenant.primaryColor}
            jobIds={[]}
            photoIds={[]}
            technicianName={currentUser.name}
          />
        </div>
        {/* Users tab */}
        {activeTab === 'users' && (
          <UsersPage
            users={users}
            primaryColor={tenant.primaryColor}
            currentRole={currentUser.role}
            canAdd={canAddUsers}
            canEdit={canEditUsers}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* Overview tab: actions + table */}
        {activeTab === 'overview' && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowQrScanner(true)}
                className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm hover:opacity-90"
                style={{
                  backgroundColor: tenant.primaryColor && tenant.primaryColor !== '#ffffff' && tenant.primaryColor !== '#fff' ? tenant.primaryColor : '#7c3aed',
                  color: '#ffffff'
                }}
              >
                <QrCode size={18} /> Scan QR
              </button>

              <button
                onClick={handleExport}
                disabled={exporting || extinguishers.length === 0}
                className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              >
                <Download size={18} /> {exporting ? 'Exporting...' : 'Export CSV'}
              </button>

              <button
                onClick={handleImportClick}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#9333ea', color: '#ffffff' }}
              >
                <Upload size={18} /> {importing ? 'Importing...' : 'Import CSV'}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => setOpenAdd(true)}
                className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm hover:opacity-90"
                style={{
                  backgroundColor: tenant.primaryColor && tenant.primaryColor !== '#ffffff' && tenant.primaryColor !== '#fff' ? tenant.primaryColor : '#7c3aed',
                  color: '#ffffff'
                }}
              >
                <Plus size={18} /> Add Extinguisher
              </button>

              <button
                onClick={() => setShowRoleSwitcher(true)}
                className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm"
                style={{ backgroundColor: '#374151', color: '#ffffff' }}
              >
                <Shield size={18} /> Switch Role (Demo)
              </button>
            </div>

            {importResult && (
              <div className={`p-4 rounded-lg ${importResult.errors > 0 ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'}`}>
                Import complete: {importResult.imported} extinguishers imported
                {importResult.errors > 0 && `, ${importResult.errors} errors occurred (check console)`}
              </div>
            )}

            <div className="overflow-hidden bg-white shadow rounded-2xl">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Condition
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {extinguishers.map((ext) => (
                    <tr key={ext.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{ext.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{ext.location}</div>
                        <div className="text-sm text-gray-500">
                          {ext.building}
                          {ext.floor ? `, ${ext.floor}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{ext.type}</div>
                        <div className="text-sm text-gray-500">{ext.capacity}</div>
                      </td>
                      <td className="px-6 py-4">{ext.status}</td>
                      <td className="px-6 py-4">{ext.condition}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openDetails(ext)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                          aria-label={`View ${ext.id}`}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {extinguishers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        No extinguishers yet. Click{' '}
                        <span className="font-medium">Add Extinguisher</span> to get
                        started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* QR Codes tab */}
        {activeTab === 'qr-codes' && (
          <QrCodesPage primaryColor={tenant.primaryColor} />
        )}

        {/* Billing tab */}
        {activeTab === 'billing' && (
          <BillingPage tenant={tenant} primaryColor={tenant.primaryColor} />
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && (
          <SettingsPage tenant={tenant} updateTenant={updateTenant} />
        )}
      </div>

      {/* Modals / overlays */}
      <AddExtinguisherModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreate={handleCreate}
        primaryColor={tenant.primaryColor}
      />

      <ExtinguisherDetails
        open={showDetails}
        onClose={() => setShowDetails(false)}
        data={selectedExtinguisher}
        primaryColor={tenant.primaryColor}
      />

      {showQrScanner && (
        <QRScanner
          onClose={() => setShowQrScanner(false)}
          onDetected={(text) => {
            const match =
              extinguishers.find(
                (e) => e.id === text || `QR_${e.id}` === text,
              ) || null;
            if (match) {
              setSelectedExtinguisher(match);
              setShowDetails(true);
            } else {
              alert(`Scanned: ${text}\nNo extinguisher found`);
            }
            setShowQrScanner(false);
          }}
        />
      )}

      <RoleSwitcherModal
        open={showRoleSwitcher}
        onClose={() => setShowRoleSwitcher(false)}
        currentRole={currentUser.role}
        roles={USER_ROLES}
        onSelect={handleSelectRole}
      />
    </div>
  );
};

/* -------------------------------- Root export -------------------------------- */
const App: React.FC = () => (
  <TenantProvider>
    <FireExtinguisherApp />
  </TenantProvider>
);

export default App;
