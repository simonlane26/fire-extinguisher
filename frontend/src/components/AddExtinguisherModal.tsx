import React, { useMemo, useState, useEffect } from 'react';
import type { Extinguisher, Site } from '../types';
import { fetchSites, getAuthHeaders, fetchExtinguisherTypes } from '../lib/api';

// Determine API base URL based on environment
const getApiBase = () => {
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  if (isLocalhost) {
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:3000/api/v1`;
  } else {
    return '/api/v1';
  }
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** parent handles id, state update, and optional API call */
  onCreate: (payload: Partial<Extinguisher>) => Promise<void> | void;
  /** optional accent color for the primary button */
  primaryColor?: string;
};

const TYPES = [
  'CO2',
  'Water',
  'Foam',
  'Dry Powder',
  'Dry Powder D Class',
  'Wet Chemical',
  'Fire Blanket',
  'Aqua Spray',
  'Lithium',
  'Zenova',
  'Lith Ex',
  'P50 Foam',
  'P50 Powder',
  'P50 Water Mist',
  'P50 Eco',
  'P50 F Class',
];

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Needs Attention', 'Out of Service'] as const;
const STATUSES = ['Active', 'Inactive'] as const;
const SERVICE_TYPES = [
  'Commission Service',
  'Extended Service',
  'Annual Inspection',
  'Monthly Check',
  'Pressure Test',
  'Discharge Test',
  'Maintenance',
  'Repair',
] as const;

// --- helpers ---
const iso = (d: Date) => d.toISOString().split('T')[0];
const addDays = (base: Date, days: number) => {
  const dt = new Date(base);
  dt.setDate(dt.getDate() + days);
  return dt;
};
const addYears = (base: Date, years: number) => {
  const dt = new Date(base);
  dt.setFullYear(dt.getFullYear() + years);
  return dt;
};
const isCO2 = (t?: string) => t?.toLowerCase().startsWith('co2');

const AddExtinguisherModal: React.FC<Props> = ({
  open,
  onClose,
  onCreate,
  primaryColor = '#7c3aed',
}) => {
  const today = useMemo(() => new Date(), []);
  const todayISO = useMemo(() => iso(today), [today]);

  const defaultNextInspection = useMemo(() => iso(addDays(today, 30)), [today]);
  const defaultNextMaintenance = useMemo(() => iso(addDays(today, 365)), [today]);

  const [form, setForm] = useState<Partial<Extinguisher>>({
    location: '',
    building: '',
    floor: '',
    type: '',
    capacity: '',
    weight: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    installDate: todayISO,
    expiryDate: '', // gets auto-set from installDate + type
    lastInspection: todayISO, // use "extended" wording in label below
    nextInspection: defaultNextInspection,
    lastMaintenance: todayISO,
    nextMaintenance: defaultNextMaintenance,
    status: 'Active',
    condition: 'Good',
    serviceType: 'Commission Service',
    inspector: '',
    notes: '',
    siteId: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [extinguisherTypes, setExtinguisherTypes] = useState<Array<{ type: string; name: string; stock: number }>>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Load sites, users, and extinguisher types when modal opens
  useEffect(() => {
    if (open) {
      loadSites();
      loadUsers();
      loadExtinguisherTypes();
    }
  }, [open]);

  async function loadSites() {
    try {
      setLoadingSites(true);
      const data = await fetchSites();
      setSites(data.filter(site => site.status === 'active'));
    } catch (err) {
      console.error('Failed to load sites:', err);
    } finally {
      setLoadingSites(false);
    }
  }

  async function loadUsers() {
    try {
      setLoadingUsers(true);
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/reports/users`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function loadExtinguisherTypes() {
    try {
      setLoadingTypes(true);
      const data = await fetchExtinguisherTypes();
      setExtinguisherTypes(data);
    } catch (err) {
      console.error('Failed to load extinguisher types:', err);
    } finally {
      setLoadingTypes(false);
    }
  }

  if (!open) return null;

  const patch = (kv: Partial<Extinguisher>) => setForm((prev) => ({ ...prev, ...kv }));

  const handleChange = (key: keyof Extinguisher, value: string) => {
    patch({ [key]: value } as Partial<Extinguisher>);
  };

  // Helper to determine extended service interval
  const getExtendedServiceYears = (type?: string) => {
    if (!type) return 5;
    const lowerType = type.toLowerCase();
    // CO2 and P50 types: 10 years
    if (lowerType.includes('co2') || lowerType.includes('p50')) return 10;
    // Foam, Water, Powder: 5 years
    return 5;
  };

  // Keep expiry date up-to-date when install date or type changes
  const updateExpiry = (nextType = form.type, nextInstall = form.installDate) => {
    if (!nextInstall) return;
    const base = new Date(nextInstall);
    const yearsToAdd = isCO2(nextType) ? 10 : 20;
    patch({ expiryDate: iso(addYears(base, yearsToAdd)) });
  };

  // Update next extended service date based on last extended date and type
  const updateNextMaintenance = (nextType = form.type, lastMaintenance = form.lastMaintenance) => {
    if (!lastMaintenance) return;
    const base = new Date(lastMaintenance);
    const yearsToAdd = getExtendedServiceYears(nextType);
    patch({ nextMaintenance: iso(addYears(base, yearsToAdd)) });
  };

  const handleInstallDate = (value: string) => {
    patch({ installDate: value });
    updateExpiry(form.type, value);
  };

  const handleType = (value: string) => {
    patch({ type: value });
    if (form.installDate) updateExpiry(value, form.installDate);
    if (form.lastMaintenance) updateNextMaintenance(value, form.lastMaintenance);
  };

  const handleLastMaintenance = (value: string) => {
    patch({ lastMaintenance: value });
    updateNextMaintenance(form.type, value);
  };

  const handleSave = async () => {
    setError(null);

    if (!form.location || !form.building || !form.type) {
      setError('Please fill Location, Building and Type.');
      return;
    }

    // Ensure expiry is populated
    if (!form.expiryDate && form.installDate) updateExpiry();

    // Prepare payload - convert empty siteId to undefined
    const payload = { ...form };
    if (!payload.siteId) {
      delete payload.siteId;
    }

    try {
      setSubmitting(true);
      await onCreate(payload);
      setSubmitting(false);
      onClose();
    } catch (e: any) {
      setSubmitting(false);
      setError(e?.message ?? 'Failed to add extinguisher');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Add New Extinguisher</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {error && (
            <div className="p-2 text-sm text-red-700 border border-red-200 rounded bg-red-50">
              {error}
            </div>
          )}

          {/* Basic / Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Location *</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Main Lobby"
                value={form.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Building *</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Building A"
                value={form.building || ''}
                onChange={(e) => handleChange('building', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Floor</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 1st Floor"
                value={form.floor || ''}
                onChange={(e) => handleChange('floor', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Site</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.siteId || ''}
                onChange={(e) => handleChange('siteId', e.target.value)}
                disabled={loadingSites}
              >
                <option value="">No site (optional)</option>
                {loadingSites && <option disabled>Loading sites...</option>}
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Type *</label>
              {loadingTypes ? (
                <div className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg">
                  Loading types...
                </div>
              ) : extinguisherTypes.length > 0 ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={form.type || ''}
                  onChange={(e) => handleType(e.target.value)}
                >
                  <option value="" disabled>
                    Select type from inventory…
                  </option>
                  {extinguisherTypes.map((et) => (
                    <option key={et.type} value={et.type}>
                      {et.type} ({et.stock} in stock)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3 py-2 text-sm text-orange-600 border border-orange-300 rounded-lg bg-orange-50">
                  No extinguishers in stock. Please add extinguishers to your inventory first.
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only types currently in stock are shown
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Capacity</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 6 kg / 6 L"
                value={form.capacity || ''}
                onChange={(e) => handleChange('capacity', e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Weight</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 2kg, 6kg, 9kg"
                value={form.weight || ''}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Install Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.installDate || ''}
                onChange={(e) => handleInstallDate(e.target.value)}
              />
            </div>
          </div>

          {/* Manufacturer / Model / Serial */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Manufacturer</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.manufacturer || ''}
                onChange={(e) => handleChange('manufacturer', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Model</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.model || ''}
                onChange={(e) => handleChange('model', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Serial Number</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.serialNumber || ''}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
              />
            </div>
          </div>

          {/* Status / Condition / Service Type / Inspector */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.status || 'Active'}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Condition</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.condition || 'Good'}
                onChange={(e) => handleChange('condition', e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Service Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.serviceType || 'Commission Service'}
                onChange={(e) => handleChange('serviceType', e.target.value)}
              >
                {SERVICE_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Inspector</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.inspector || ''}
                onChange={(e) => handleChange('inspector', e.target.value)}
              >
                <option value="">Select inspector...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service & Extended Inspection block */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Last Extended Service Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.lastMaintenance || todayISO}
                onChange={(e) => handleLastMaintenance(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Next extended service auto-calculates: {getExtendedServiceYears(form.type)} years from this date
              </p>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Next Extended Service Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.nextMaintenance || defaultNextMaintenance}
                onChange={(e) => handleChange('nextMaintenance', e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Auto-calculated from last extended service date
              </p>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Expiry Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.expiryDate || ''}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Auto-calculated: CO2 = 10 years, Powder/Water/Foam/P50 = 20 years from install date
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Last Service Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.lastInspection || todayISO}
                onChange={(e) => handleChange('lastInspection', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Next Service Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.nextInspection || defaultNextInspection}
                onChange={(e) => handleChange('nextInspection', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Notes</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Additional notes…"
              value={form.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {submitting ? 'Saving…' : 'Add Extinguisher'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExtinguisherModal;
