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
  Package,
  HelpCircle,
  Search,
  Filter,
  X,
  LogOut,
  FileText,
  TrendingUp,
  Cloud,
  CloudOff,
} from 'lucide-react';

import QRScanner from './components/QRScanner';
import HintTooltip from './components/HintTooltip';
import GettingStartedPanel from './components/GettingStartedPanel';
import AddExtinguisherModal from './components/AddExtinguisherModal';
import EditExtinguisherModal from './components/EditExtinguisherModal';
import ExtinguisherDetails from './components/ExtinguisherDetails';
import SimpleInspectionForm from './components/SimpleInspectionForm';
import { SyncStatusBadge } from './components/SyncStatusBadge';
import FeedbackButton from './components/FeedbackButton';
import { offlineDB } from './lib/offline/database';
import { syncManager } from './lib/offline/syncManager';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import SitesPage from './pages/SitesPage';
import QrCodesPage from './pages/QrCodesPage';
import BillingPage from './pages/BillingPage';
import InventoryPage from './pages/InventoryPage';
import HelpPage from './pages/HelpPage';
import ReportsPage from './pages/ReportsPage';
import ComplianceDashboard from './pages/ComplianceDashboard';
import QuotesListPage from './pages/QuotesListPage';
import QuoteCreatePage from './pages/QuoteCreatePage';
import QuoteDetailPage from './pages/QuoteDetailPage';
import RoleSwitcherModal from './components/RoleSwitcher';
import TabButton from './components/TabButton';
import Footer from './components/Footer';
import { addExtinguisher, updateExtinguisher, fetchExtinguishers, fetchExtinguisherById, exportExtinguishersCsv, importExtinguishersCsv, updateUserRole, updateTenantSettings, updateOtherUserRole, getUsers, fetchSites, fetchMonthlyInspectionCount } from './lib/api';
import { addExtinguisherOffline } from './lib/offline/offlineApi';
import { AuthContext, type AuthCtx } from './components/AuthWrapper';
import type {
  Extinguisher,
  Tenant,
  User,
  AuthedUser,
  RoleKey,
  PermissionKey,
  Site,
} from './types';

/* ----------------------------- Context contracts ----------------------------- */
export type TenantCtx = {
  tenant: Tenant;
  loading: boolean;
  error: string | null;
  switchTenant: (sub: string) => void;
  updateTenant: (u: Partial<Tenant>) => Promise<void>;
};

const TenantContext = createContext<TenantCtx | null>(null);

/* -------------------------------- Mock data --------------------------------- */
const MOCK_CURRENT_USER: AuthedUser = {
  id: 'current_user',
  name: 'Admin',
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
  VIEW_USERS: ['super_admin', 'admin'],
  ADD_USERS: ['super_admin', 'admin'],
  EDIT_USERS: ['super_admin', 'admin'],
  DELETE_USERS: ['super_admin'],
  VIEW_EXTINGUISHERS: ['super_admin', 'admin', 'manager', 'inspector', 'viewer'],
  ADD_EXTINGUISHERS: ['super_admin', 'admin', 'manager', 'inspector'],
  EDIT_EXTINGUISHERS: ['super_admin', 'admin', 'manager', 'inspector'],
  DELETE_EXTINGUISHERS: ['super_admin', 'admin'],
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

  const updateTenant = async (u: Partial<Tenant>) => {
    try {
      // Update tenant in database
      const response = await updateTenantSettings(u);

      // Update local state with response from server
      setTenant(response.tenant);

      // Also update the current user's tenant reference
      actx.setCurrentUser({
        ...actx.currentUser,
        tenant: response.tenant,
      });
    } catch (error) {
      console.error('Failed to update tenant:', error);
      alert('Failed to save settings. Please try again.');
      throw error; // Re-throw so SettingsPage can handle it
    }
  };

  return (
    <TenantContext.Provider
      value={{ tenant, loading, error, switchTenant, updateTenant }}
    >
      {children}
    </TenantContext.Provider>
  );
};

/* --------------------------------- Helpers ---------------------------------- */
// Monthly inspection limits per plan
const PLAN_INSPECTION_LIMITS: Record<Tenant['subscriptionPlan'], number> = {
  trial: 10,
  starter: 50,
  professional: 250,
  enterprise: 1000,
};

function computeKpis(list: Extinguisher[], plan: Tenant['subscriptionPlan'], monthlyInspections: number) {
  const total = list.length;
  const active = list.filter((e) => e.status === 'Active').length;
  const needs =
    list.filter(
      (e) => e.condition === 'Needs Attention' || e.status !== 'Active',
    ).length;
  const limit = PLAN_INSPECTION_LIMITS[plan] || 10;
  return { total, active, needs, planLimit: { used: monthlyInspections, limit } };
}

type KpiProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  bg: string;
  iconBg?: string;
  hint?: React.ReactNode;
};

const KpiCard: React.FC<KpiProps> = ({
  label,
  value,
  icon,
  bg,
  iconBg = 'bg-white/20',
  hint,
}) => (
  <div
    className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow ring-1 ring-black/5 ${bg} text-white`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs sm:text-sm opacity-80 inline-flex items-center">
          {label}{hint}
        </p>
        <p className="mt-0.5 sm:mt-1 text-lg sm:text-xl md:text-2xl font-semibold">{value}</p>
      </div>
      <div className={`hidden sm:grid size-8 md:size-10 place-items-center rounded-lg md:rounded-xl ${iconBg}`}>
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
  const { currentUser, setCurrentUser, hasPermission, logout } = actx;

  const [activeTab, setActiveTab] =
    useState<'overview' | 'sites' | 'stock' | 'users' | 'settings' | 'qr-codes' | 'billing' | 'compliance' | 'reports' | 'help' | 'quotes'>('overview');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<{ id: string; name: string } | null>(null);

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

  // State to track if offline DB is ready
  const [offlineReady, setOfflineReady] = useState(false);
  // Track online/offline status for header display
  const [isOnline, setIsOnline] = useState(true);
  // Monthly inspection count for plan limit tracking
  const [monthlyInspections, setMonthlyInspections] = useState(0);

  // Load from API (replaces demo data if backend is up) with offline caching
  useEffect(() => {
    (async () => {
      // Wait for offline DB to be ready first
      if (!offlineReady) {
        console.log('Waiting for offline DB to initialize...');
        return;
      }

      try {
        const data = await fetchExtinguishers(); // uses authenticated user's tenant

        // Also get any pending offline extinguishers and merge them
        try {
          const pending = await offlineDB.getAllPendingExtinguishers();
          const pendingAsExtinguishers = pending
            .filter(p => !p.synced)
            .map(p => ({
              id: p.id,
              location: p.location,
              building: p.building || '',
              floor: p.floor || '',
              type: p.type,
              capacity: p.capacity || '',
              manufacturer: p.manufacturer || '',
              serialNumber: p.serialNumber || '',
              installDate: p.installDate || '',
              expiryDate: p.expiryDate || '',
              status: p.status as any,
              condition: p.condition as any,
              notes: p.notes || '',
              _pendingSync: true,
            }));

          setExtinguishers([...data, ...pendingAsExtinguishers] as any);
        } catch {
          setExtinguishers(data);
        }

        // Cache for offline use
        try {
          await offlineDB.cacheExtinguishers(data);
          console.log('Extinguishers cached for offline use');
        } catch (cacheErr) {
          console.warn('Failed to cache extinguishers:', cacheErr);
        }
      } catch (err) {
        console.warn('API load failed, trying offline cache:', err);

        // Try to load from offline cache
        try {
          const cached = await offlineDB.getCachedExtinguishers();
          const pending = await offlineDB.getAllPendingExtinguishers();

          // Combine cached server data with pending offline data
          const pendingAsExtinguishers = pending
            .filter(p => !p.synced)
            .map(p => ({
              id: p.id,
              location: p.location,
              building: p.building || '',
              floor: p.floor || '',
              type: p.type,
              capacity: p.capacity || '',
              manufacturer: p.manufacturer || '',
              serialNumber: p.serialNumber || '',
              installDate: p.installDate || '',
              expiryDate: p.expiryDate || '',
              status: p.status as any,
              condition: p.condition as any,
              notes: p.notes || '',
              _pendingSync: true,
            }));

          const combined = [...(cached as any[]), ...pendingAsExtinguishers];

          if (combined.length > 0) {
            setExtinguishers(combined as any);
            console.log(`Loaded ${cached.length} cached + ${pendingAsExtinguishers.length} pending extinguishers from offline storage`);
          } else {
            console.log('No offline data available');
          }
        } catch (cacheErr) {
          console.warn('Offline cache also failed:', cacheErr);
        }
      }
    })();
  }, [tenant.id, offlineReady]);

  // Users (for UsersPage)
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    loadUsers();
  }, []);

  // Fetch monthly inspection count
  useEffect(() => {
    const loadMonthlyCount = async () => {
      try {
        const data = await fetchMonthlyInspectionCount();
        setMonthlyInspections(data.count);
      } catch (err) {
        console.error('Failed to fetch monthly inspection count:', err);
      }
    };
    loadMonthlyCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadMonthlyCount, 30000);
    return () => clearInterval(interval);
  }, []);
// Initialize offline database and sync on mount
useEffect(() => {
  const initOffline = async () => {
    try {
      await offlineDB.initialize();
      setOfflineReady(true);
      syncManager.startAutoSync(5); // Auto-sync every 5 minutes
      console.log('Offline mode initialized successfully');
    } catch (err) {
      console.error('Failed to initialize offline mode:', err);
      // Still set ready so app can function (just without offline support)
      setOfflineReady(true);
    }
  };

  initOffline();

  // Track online/offline status changes
  const checkStatus = () => {
    setIsOnline(syncManager.getOnlineStatus());
  };
  checkStatus();
  const statusInterval = setInterval(checkStatus, 2000);

  // Cleanup on unmount
  return () => {
    syncManager.stopAutoSync();
    clearInterval(statusInterval);
  };
}, []);
  const handleAddUser = (u: User) => setUsers((prev) => [...prev, u]);
  const handleUpdateUser = async (id: string, patch: Partial<User>) => {
    // If updating role, make API call
    if (patch.role) {
      try {
        const result = await updateOtherUserRole(id, patch.role);
        if (result.success) {
          // Update local state with the returned user data
          setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, ...result.user } : x)));
        }
      } catch (err) {
        console.error('Failed to update user role:', err);
        alert(err instanceof Error ? err.message : 'Failed to update user role');
      }
    } else {
      // For other updates, just update local state for now
      setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    }
  };

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
  const [openEdit, setOpenEdit] = useState(false);
  const [editingExtinguisher, setEditingExtinguisher] = useState<Extinguisher | null>(null);
  const [showSimpleForm, setShowSimpleForm] = useState(false);

  // CSV import/export
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Role switcher
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const handleSelectRole = async (role: RoleKey) => {
    try {
      // Update role in database
      const response = await updateUserRole(role);

      // Update local state with response from server
      setCurrentUser({
        ...response.user,
        name: USER_ROLES[role].name,
      });
      setShowRoleSwitcher(false);
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  // Sites state
  const [sites, setSites] = useState<Site[]>([]);

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    try {
      const data = await fetchSites();
      setSites(data.filter(site => site.status === 'active'));
    } catch (err) {
      console.error('Failed to load sites:', err);
    }
  }

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

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

  // Get unique values for filters
  const buildings = Array.from(new Set(extinguishers.map(e => e.building).filter(Boolean)));
  const types = Array.from(new Set(extinguishers.map(e => e.type).filter(Boolean)));
  const statuses = Array.from(new Set(extinguishers.map(e => e.status).filter(Boolean)));
  const conditions = Array.from(new Set(extinguishers.map(e => e.condition).filter(Boolean)));

  // Filter extinguishers
  const filteredExtinguishers = extinguishers.filter(item => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.location?.toLowerCase().includes(query) ||
        item.building?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.serialNumber?.toLowerCase().includes(query) ||
        item.manufacturer?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Site filter
    if (siteFilter !== 'all' && item.siteId !== siteFilter) return false;

    // Building filter
    if (buildingFilter !== 'all' && item.building !== buildingFilter) return false;

    // Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;

    // Condition filter
    if (conditionFilter !== 'all' && item.condition !== conditionFilter) return false;

    return true;
  });

  // Count active filters
  const activeFilterCount = [
    siteFilter !== 'all',
    buildingFilter !== 'all',
    typeFilter !== 'all',
    statusFilter !== 'all',
    conditionFilter !== 'all',
  ].filter(Boolean).length;

  // Helper functions for status and condition colors
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600 font-medium';
      case 'inactive':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-900';
    }
  };

  const getConditionColor = (condition: string) => {
    const cond = condition?.toLowerCase();
    if (cond === 'good' || cond === 'excellent') {
      return 'text-green-600 font-medium';
    } else if (cond === 'fair' || cond === 'needs attention') {
      return 'text-orange-600 font-medium';
    } else if (cond === 'out of service') {
      return 'text-red-600 font-medium';
    }
    return 'text-gray-900';
  };

  const { total, active, needs, planLimit } = computeKpis(extinguishers, tenant.subscriptionPlan, monthlyInspections);

  // Helper: next ID
  const getNextExtinguisherId = (list: Extinguisher[]) => {
    const nums = list
      .map((e) => parseInt(String(e.id).replace(/^FE/i, ''), 10))
      .filter((n) => Number.isFinite(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `FE${String(next).padStart(3, '0')}`;
  };

  // Update extinguisher after service
  const handleUpdate = async (id: string, payload: Partial<Extinguisher>) => {
    try {
      const updated = await updateExtinguisher(id, payload);
      // Update in local state
      setExtinguishers((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      console.error('Failed to update extinguisher:', err);
      alert('Failed to update extinguisher. Please try again.');
      throw err;
    }
  };

  // Handle edit button from details modal
  const handleEdit = (ext: Extinguisher) => {
    setEditingExtinguisher(ext);
    setOpenEdit(true);
  };

  // Handle delete extinguisher
  const handleDelete = async (id: string) => {
    try {
      // Remove from local state immediately
      setExtinguishers((prev) => prev.filter((e) => e.id !== id));
      // Optionally refresh from server to ensure sync
      const refreshed = await fetchExtinguishers();
      setExtinguishers(refreshed);
    } catch (err) {
      console.error('Failed to delete extinguisher:', err);
      // Refresh to restore state if delete failed
      const refreshed = await fetchExtinguishers();
      setExtinguishers(refreshed);
    }
  };

  // Create with optimistic UI + server reconcile (with offline support)
  const handleCreate = async (payload: Partial<Extinguisher>) => {
    const today = new Date().toISOString().split('T')[0];
    const type = payload.type ?? '';
    const years = type.startsWith('CO2') ? 10 : 20;
    const install = payload.installDate ?? today;
    const expiry = new Date(install);
    expiry.setFullYear(expiry.getFullYear() + years);

    const optimisticId = getNextExtinguisherId(extinguishers);
    const optimistic: Extinguisher = {
      id: optimisticId,
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
      // Use offline-aware API that handles both online and offline scenarios
      const result = await addExtinguisherOffline({
        siteId: payload.siteId,
        location: payload.location!,
        building: payload.building,
        floor: payload.floor,
        type: payload.type!,
        capacity: payload.capacity,
        manufacturer: payload.manufacturer,
        serialNumber: payload.serialNumber,
        installDate: payload.installDate,
        expiryDate: expiry.toISOString().split('T')[0],
        status: payload.status,
        condition: payload.condition,
        notes: payload.notes,
      });

      if (result.synced) {
        // Server responded - refresh from server to get the real data
        try {
          const refreshed = await fetchExtinguishers();
          setExtinguishers(refreshed);
        } catch {
          // If refresh fails, keep optimistic data with server ID
          setExtinguishers((prev) =>
            prev.map((e) => (e.id === optimisticId ? { ...e, id: result.id } : e))
          );
        }
      } else {
        // Saved offline - update ID to match offline ID
        setExtinguishers((prev) =>
          prev.map((e) => (e.id === optimisticId ? { ...e, id: result.id, _pendingSync: true } as any : e))
        );
        alert('Saved offline. Will sync when back online.');
      }
    } catch (err) {
      console.error('Failed to create extinguisher:', err);
      // rollback
      setExtinguishers((prev) => prev.filter((e) => e.id !== optimisticId));
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
    <div className="flex items-center gap-2 text-sm opacity-75">
      <span>Fire Safety Management System</span>
      <span className="opacity-50">•</span>
      <span className="font-medium">Firexcheck.com</span>
    </div>
  </div>
</div>


    {/* Right: Plan + Current User */}
    <div className="flex items-center space-x-2 md:space-x-4">
      <div className="hidden lg:flex items-center px-3 py-1 space-x-2 rounded-lg bg-white/20">
        <Crown size={16} />
        <span className="text-sm font-medium">
          {SUBSCRIPTION_PLANS[tenant.subscriptionPlan]?.name}
        </span>
      </div>
      <div className="hidden md:flex items-center px-2 py-1 space-x-1 rounded-lg bg-white/20">
        <Shield size={14} />
        <span className="text-xs font-medium">
          {currentUser.name}
        </span>
      </div>
      {/* Offline Status & Download Button */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className={`flex items-center px-2 py-1 space-x-1 rounded-lg ${isOnline ? 'bg-green-500/30' : 'bg-orange-500/30'}`}>
          {isOnline ? <Cloud size={14} /> : <CloudOff size={14} />}
          <span className="hidden sm:inline text-xs font-medium">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        {isOnline && (
          <button
            type="button"
            onClick={async () => {
              try {
                await syncManager.downloadExtinguishersForOffline();
                alert('Data downloaded for offline use!');
              } catch (error: any) {
                alert(`Download failed: ${error.message}`);
              }
            }}
            className="flex items-center px-2 py-1 space-x-1 text-white transition-colors rounded-lg bg-white/20 hover:bg-white/30"
            title="Download data for offline use"
          >
            <Download size={14} />
            <span className="hidden sm:inline text-xs font-medium">Download</span>
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={logout}
        className="flex items-center px-2 py-1 space-x-1 text-white transition-colors rounded-lg bg-white/20 hover:bg-white/30"
        title="Log out"
      >
        <LogOut size={14} />
        <span className="hidden sm:inline text-xs font-medium">Log Out</span>
      </button>
    </div>
  </div>
</header>
{/* Sync Status Badge - Fixed position in bottom-right */}
      <SyncStatusBadge />
      <FeedbackButton currentTab={activeTab} />
      <div className="p-3 sm:p-4 md:p-6 mx-auto space-y-4 sm:space-y-6 max-w-7xl">
        {/* KPI cards */}
        <section className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
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
            hint={
              <HintTooltip
                storageKey="kpi_needs_attention"
                content="Extinguishers flagged as 'Needs Attention' or with a non-Active status. Address these first to stay compliant."
              />
            }
          />
          <KpiCard
            label="Monthly Inspections"
            value={
              <span className={planLimit.used >= planLimit.limit * 0.9 ? 'text-yellow-200' : ''}>
                {planLimit.used}/{planLimit.limit}
              </span>
            }
            icon={<Crown className="size-6" />}
            bg={planLimit.used >= planLimit.limit ? 'bg-gradient-to-br from-red-600 to-red-500' : planLimit.used >= planLimit.limit * 0.8 ? 'bg-gradient-to-br from-amber-600 to-amber-500' : 'bg-gradient-to-br from-violet-600 to-violet-500'}
            hint={
              <HintTooltip
                storageKey="kpi_monthly_inspections"
                content="Inspections logged this calendar month vs. your plan's monthly limit. The limit resets on the 1st of each month."
              />
            }
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

            <TabButton
              active={activeTab === 'sites'}
              onClick={() => setActiveTab('sites')}
              primaryColor={tenant.primaryColor}
            >
              <Building2 size={16} />
              <span>Sites</span>
            </TabButton>

            <TabButton
              active={activeTab === 'stock'}
              onClick={() => setActiveTab('stock')}
              primaryColor={tenant.primaryColor}
            >
              <Package size={16} />
              <span>Stock</span>
            </TabButton>

            <TabButton
              active={activeTab === 'quotes'}
              onClick={() => setActiveTab('quotes')}
              primaryColor={tenant.primaryColor}
            >
              <FileText size={16} />
              <span>Quotes</span>
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

            <TabButton
              active={activeTab === 'compliance'}
              onClick={() => setActiveTab('compliance')}
              primaryColor={tenant.primaryColor}
            >
              <TrendingUp size={16} />
              <span>Compliance</span>
            </TabButton>

            <TabButton
              active={activeTab === 'reports'}
              onClick={() => setActiveTab('reports')}
              primaryColor={tenant.primaryColor}
            >
              <FileText size={16} />
              <span>Reports</span>
            </TabButton>

            <TabButton
              active={activeTab === 'help'}
              onClick={() => setActiveTab('help')}
              primaryColor={tenant.primaryColor}
            >
              <HelpCircle size={16} />
              <span>Help</span>
            </TabButton>
          </div>
        </div>
        {/* Sites tab */}
        {activeTab === 'sites' && (
          <SitesPage
            onViewSite={(siteId, siteName) => {
              setSiteFilter(siteId);
              setSelectedSiteFilter({ id: siteId, name: siteName });
              setActiveTab('overview');
            }}
          />
        )}

        {/* Stock tab */}
        {activeTab === 'stock' && <InventoryPage />}

        {/* Quotes tab */}
        {activeTab === 'quotes' && <QuotesListPage />}

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
            {/* Getting Started panel */}
            <GettingStartedPanel
              extinguisherCount={extinguishers.length}
              siteCount={sites.length}
              tenantCreatedAt={tenant.createdAt}
              monthlyInspections={monthlyInspections}
              primaryColor={tenant.primaryColor}
              onNavigate={(tab) => setActiveTab(tab)}
              onAddExtinguisher={() => setOpenAdd(true)}
            />

            {/* Site Filter Indicator */}
            {selectedSiteFilter && (
              <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Viewing extinguishers for: <span className="font-bold">{selectedSiteFilter.name}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSiteFilter('all');
                    setSelectedSiteFilter(null);
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View All Sites
                </button>
              </div>
            )}

            {/* Search and Filter Bar */}
            <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                  <input
                    type="text"
                    placeholder="Search by location, building, type, serial number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    showFilters
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Filter size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Filter Dropdowns */}
              {showFilters && (
                <div className="grid grid-cols-1 gap-3 pt-3 border-t md:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Site</label>
                    <select
                      value={siteFilter}
                      onChange={(e) => {
                        setSiteFilter(e.target.value);
                        if (e.target.value === 'all') {
                          setSelectedSiteFilter(null);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Sites</option>
                      {sites.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Building</label>
                    <select
                      value={buildingFilter}
                      onChange={(e) => setBuildingFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Buildings</option>
                      {buildings.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      {types.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Statuses</option>
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Condition</label>
                    <select
                      value={conditionFilter}
                      onChange={(e) => setConditionFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Conditions</option>
                      {conditions.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowQrScanner(true)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg shadow-sm hover:opacity-90"
                style={{
                  backgroundColor: tenant.primaryColor && tenant.primaryColor !== '#ffffff' && tenant.primaryColor !== '#fff' ? tenant.primaryColor : '#7c3aed',
                  color: '#ffffff'
                }}
              >
                <QrCode size={16} /> <span className="hidden sm:inline">Scan</span> QR
              </button>

              <button
                onClick={handleExport}
                disabled={exporting || extinguishers.length === 0}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              >
                <Download size={16} /> {exporting ? '...' : <><span className="hidden sm:inline">Export</span> CSV</>}
              </button>

              <button
                onClick={handleImportClick}
                disabled={importing}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#9333ea', color: '#ffffff' }}
              >
                <Upload size={16} /> {importing ? '...' : <><span className="hidden sm:inline">Import</span> CSV</>}
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
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg shadow-sm hover:opacity-90"
                style={{
                  backgroundColor: tenant.primaryColor && tenant.primaryColor !== '#ffffff' && tenant.primaryColor !== '#fff' ? tenant.primaryColor : '#7c3aed',
                  color: '#ffffff'
                }}
              >
                <Plus size={16} /> <span className="hidden sm:inline">Add</span> <span className="sm:hidden">+</span><span className="hidden sm:inline"> Extinguisher</span><span className="sm:hidden">Ext</span>
              </button>

              <button
                onClick={() => setShowSimpleForm(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm hover:opacity-90"
                style={{
                  backgroundColor: tenant.primaryColor && tenant.primaryColor !== '#ffffff' && tenant.primaryColor !== '#fff' ? tenant.primaryColor : '#7c3aed',
                  color: '#ffffff'
                }}
              >
                <FileText size={16} /> Simple Form
              </button>

              <button
                onClick={() => setShowRoleSwitcher(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm"
                style={{ backgroundColor: '#374151', color: '#ffffff' }}
              >
                <Shield size={16} /> Switch Role
              </button>
            </div>

            {importResult && (
              <div className={`p-4 rounded-lg ${importResult.errors > 0 ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'}`}>
                Import complete: {importResult.imported} extinguishers imported
                {importResult.errors > 0 && `, ${importResult.errors} errors occurred (check console)`}
              </div>
            )}

            <div className="overflow-x-auto bg-white shadow rounded-2xl">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-xs font-medium text-left text-gray-500 uppercase md:px-6">
                      ID
                    </th>
                    <th className="px-3 py-3 text-xs font-medium text-left text-gray-500 uppercase md:px-6">
                      Location
                    </th>
                    <th className="px-3 py-3 text-xs font-medium text-left text-gray-500 uppercase md:px-6">
                      Type
                    </th>
                    <th className="px-3 py-3 text-xs font-medium text-left text-gray-500 uppercase md:px-6">
                      Status
                    </th>
                    <th className="hidden px-3 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:table-cell md:px-6">
                      Condition
                    </th>
                    <th className="px-3 py-3 text-xs font-medium text-left text-gray-500 uppercase md:px-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExtinguishers.map((ext) => (
                    <tr key={ext.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-sm md:px-6 md:py-4">{ext.id}</td>
                      <td className="px-3 py-3 md:px-6 md:py-4">
                        <div className="text-sm text-gray-900 md:text-base">{ext.location}</div>
                        <div className="text-xs text-gray-500 md:text-sm">
                          {ext.building}
                          {ext.floor ? `, ${ext.floor}` : ''}
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4">
                        <div className="text-sm text-gray-900 md:text-base">{ext.type}</div>
                        <div className="text-xs text-gray-500 md:text-sm">{ext.capacity}</div>
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4">
                        <span className={getStatusColor(ext.status)}>{ext.status}</span>
                      </td>
                      <td className="hidden px-3 py-3 sm:table-cell md:px-6 md:py-4">
                        <span className={getConditionColor(ext.condition)}>{ext.condition}</span>
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4">
                        <button
                          onClick={() => openDetails(ext)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                          title="View details"
                          aria-label={`View ${ext.id}`}
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredExtinguishers.length === 0 && (
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
          <QrCodesPage
            primaryColor={tenant.primaryColor}
            buildingFilter={buildingFilter}
            allExtinguishers={extinguishers}
            logoUrl={tenant.logoUrl}
            tenantId={tenant.id}
          />
        )}

        {/* Billing tab */}
        {activeTab === 'billing' && hasPermission('VIEW_BILLING') && (
          <BillingPage tenant={tenant} primaryColor={tenant.primaryColor} />
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && hasPermission('MANAGE_SETTINGS') && (
          <SettingsPage tenant={tenant} updateTenant={updateTenant} />
        )}

        {/* Compliance Dashboard tab */}
        {activeTab === 'compliance' && (
          <ComplianceDashboard
            primaryColor={tenant.primaryColor}
            onNavigate={() => setActiveTab('overview')}
          />
        )}

        {/* Reports tab */}
        {activeTab === 'reports' && (
          <ReportsPage
            primaryColor={tenant.primaryColor}
            buildingFilter={buildingFilter}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
          />
        )}

        {/* Help tab */}
        {activeTab === 'help' && <HelpPage />}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditExtinguisherModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        extinguisher={editingExtinguisher}
        onUpdate={handleUpdate}
        primaryColor={tenant.primaryColor}
      />

      {showQrScanner && (
        <QRScanner
          onClose={() => setShowQrScanner(false)}
          onDetected={async (text) => {
            // Close scanner immediately to prevent multiple scans
            setShowQrScanner(false);

            // Extract extinguisher ID from scanned text
            // Handles both raw IDs and URLs like "https://domain.com/verify/{id}"
            let extinguisherId = text.trim();

            // If it's a URL, extract the ID from the path
            if (extinguisherId.includes('/verify/')) {
              const parts = extinguisherId.split('/verify/');
              extinguisherId = parts[1] || text;
              // Remove any query params, hash fragments, or trailing slashes
              extinguisherId = extinguisherId.split('?')[0].split('#')[0].replace(/\/$/, '');
            } else if (extinguisherId.startsWith('QR_')) {
              extinguisherId = extinguisherId.substring(3);
            }

            // Trim any whitespace
            extinguisherId = extinguisherId.trim();

            // First, try to find in the loaded extinguishers list
            let match =
              extinguishers.find(
                (e) => e.id === extinguisherId || e.id === text || `QR_${e.id}` === text,
              ) || null;

            // If not found locally, try fetching from API
            let fetchError = null;
            if (!match) {
              try {
                const fetched = await fetchExtinguisherById(extinguisherId);
                if (fetched) {
                  match = fetched;
                  // Add to local list if not already there
                  setExtinguishers((prev) => {
                    if (!prev.find(e => e.id === fetched.id)) {
                      return [...prev, fetched];
                    }
                    return prev;
                  });
                }
              } catch (err) {
                console.error('Failed to fetch extinguisher:', err);
                fetchError = err instanceof Error ? err.message : String(err);
              }
            }

            if (match) {
              setSelectedExtinguisher(match);
              setShowDetails(true);
            } else {
              const errorMsg = fetchError
                ? `Extinguisher not found.\n\nScanned ID: ${extinguisherId}\n\nError: ${fetchError}`
                : `Extinguisher not found.\n\nScanned ID: ${extinguisherId}\n\nThis extinguisher may not exist or may belong to a different organization.`;
              alert(errorMsg);
            }
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

      {showSimpleForm && (
        <SimpleInspectionForm
          onClose={() => setShowSimpleForm(false)}
          primaryColor={tenant.primaryColor}
          siteId={siteFilter !== 'all' ? siteFilter : undefined}
          siteName={selectedSiteFilter?.name}
        />
      )}

      {/* Footer */}
      <Footer primaryColor={tenant.primaryColor} />
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
