import React, { useMemo, useState } from 'react';
import type { Extinguisher } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  /** parent handles id, state update, and optional API call */
  onCreate: (payload: Partial<Extinguisher>) => Promise<void> | void;
  /** optional accent color for the primary button */
  primaryColor?: string;
};

const TYPES = [
  'CO2 2kg',
  'CO2 5kg',
  'Water 6L',
  'Water 9L',
  'Foam 6L',
  'Dry Powder 6KG',
  'Dry Powder D Class',
  'Dry Powder 3KG',
  'Wet Chemical',
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
    manufacturer: '',
    model: '',
    serialNumber: '',
    installDate: todayISO,
    expiryDate: '', // gets auto-set from installDate + type
    lastInspection: todayISO, // use “extended” wording in label below
    nextInspection: defaultNextInspection,
    lastMaintenance: todayISO,
    nextMaintenance: defaultNextMaintenance,
    status: 'Active',
    condition: 'Good',
    serviceType: 'Commission Service',
    inspector: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const patch = (kv: Partial<Extinguisher>) => setForm((prev) => ({ ...prev, ...kv }));

  const handleChange = (key: keyof Extinguisher, value: string) => {
    patch({ [key]: value } as Partial<Extinguisher>);
  };

  // Keep expiry date up-to-date when install date or type changes
  const updateExpiry = (nextType = form.type, nextInstall = form.installDate) => {
    if (!nextInstall) return;
    const base = new Date(nextInstall);
    const yearsToAdd = isCO2(nextType) ? 10 : 20;
    patch({ expiryDate: iso(addYears(base, yearsToAdd)) });
  };

  const handleInstallDate = (value: string) => {
    patch({ installDate: value });
    updateExpiry(form.type, value);
  };

  const handleType = (value: string) => {
    patch({ type: value });
    if (form.installDate) updateExpiry(value, form.installDate);
  };

  const handleSave = async () => {
    setError(null);

    if (!form.location || !form.building || !form.type) {
      setError('Please fill Location, Building and Type.');
      return;
    }

    // Ensure expiry is populated
    if (!form.expiryDate && form.installDate) updateExpiry();

    try {
      setSubmitting(true);
      await onCreate({ ...form });
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
              <label className="block mb-1 text-sm text-gray-600">Type *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.type || ''}
                onChange={(e) => handleType(e.target.value)}
              >
                <option value="" disabled>
                  Select type…
                </option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
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
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Inspector name"
                value={form.inspector || ''}
                onChange={(e) => handleChange('inspector', e.target.value)}
              />
            </div>
          </div>

          {/* Service & Extended Inspection block */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Last Service Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.lastMaintenance || todayISO}
                onChange={(e) => handleChange('lastMaintenance', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Next Service Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.nextMaintenance || defaultNextMaintenance}
                onChange={(e) => handleChange('nextMaintenance', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Expiry Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.expiryDate || ''}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Last Extended Inspection</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.lastInspection || todayISO}
                onChange={(e) => handleChange('lastInspection', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Next Extended Inspection</label>
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
