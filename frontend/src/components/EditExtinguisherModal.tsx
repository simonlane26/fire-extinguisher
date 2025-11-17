import React, { useMemo, useState, useEffect } from 'react';
import type { Extinguisher, Site, InventoryItem } from '../types';
import { fetchSites, fetchInventoryItems, recordPartUsage } from '../lib/api';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  extinguisher: Extinguisher | null;
  onUpdate: (id: string, payload: Partial<Extinguisher>) => Promise<void> | void;
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
const STATUSES = ['Active', 'Out of Service'] as const;
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

const EditExtinguisherModal: React.FC<Props> = ({
  open,
  onClose,
  extinguisher,
  onUpdate,
  primaryColor = '#7c3aed',
}) => {
  const [form, setForm] = useState<Partial<Extinguisher>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [partsUsed, setPartsUsed] = useState<Array<{ itemId: string; quantity: number; notes?: string }>>([]);

  // Load sites and populate form when modal opens
  useEffect(() => {
    if (open && extinguisher) {
      loadSites();
      // Pre-fill form with current extinguisher data
      setForm({
        location: extinguisher.location || '',
        building: extinguisher.building || '',
        floor: extinguisher.floor || '',
        type: extinguisher.type || '',
        capacity: extinguisher.capacity || '',
        manufacturer: extinguisher.manufacturer || '',
        model: extinguisher.model || '',
        serialNumber: extinguisher.serialNumber || '',
        installDate: extinguisher.installDate || '',
        expiryDate: extinguisher.expiryDate || '',
        lastInspection: extinguisher.lastInspection || '',
        nextInspection: extinguisher.nextInspection || '',
        lastMaintenance: extinguisher.lastMaintenance || '',
        nextMaintenance: extinguisher.nextMaintenance || '',
        status: extinguisher.status || 'Active',
        condition: extinguisher.condition || 'Good',
        serviceType: extinguisher.serviceType || 'Annual Inspection',
        inspector: extinguisher.inspector || '',
        notes: extinguisher.notes || '',
        siteId: extinguisher.siteId || '',
      });
    }
  }, [open, extinguisher]);

  async function loadSites() {
    try {
      setLoadingSites(true);
      const [sitesData, inventoryData] = await Promise.all([
        fetchSites(),
        fetchInventoryItems()
      ]);
      setSites(sitesData.filter(site => site.status === 'active'));
      setInventoryItems(inventoryData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoadingSites(false);
    }
  }

  if (!open || !extinguisher) return null;

  const handleChange = (key: keyof Extinguisher, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError(null);

    if (!form.location || !form.building || !form.type) {
      setError('Please fill Location, Building and Type.');
      return;
    }

    // Prepare payload - convert empty siteId to undefined
    const payload = { ...form };
    if (!payload.siteId) {
      delete payload.siteId;
    }

    try {
      setSubmitting(true);

      // Update extinguisher
      await onUpdate(extinguisher.id, payload);

      // Record parts usage if any
      for (const part of partsUsed) {
        if (part.itemId && part.quantity > 0) {
          await recordPartUsage({
            inventoryItemId: part.itemId,
            extinguisherId: extinguisher.id,
            quantityUsed: part.quantity,
            usedBy: form.inspector || undefined,
            notes: part.notes,
          });
        }
      }

      setSubmitting(false);
      onClose();
    } catch (e: any) {
      setSubmitting(false);
      setError(e?.message ?? 'Failed to update extinguisher');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Edit Extinguisher - {extinguisher.id}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
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
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.type || ''}
                onChange={(e) => handleChange('type', e.target.value)}
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
              <label className="block mb-1 text-sm text-gray-600">Weight</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 2kg, 6kg, 9kg"
                value={form.weight || ''}
                onChange={(e) => handleChange('weight', e.target.value)}
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
                value={form.serviceType || 'Annual Inspection'}
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

          {/* Service & Extended Inspection dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Last Service Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.lastMaintenance || ''}
                onChange={(e) => handleChange('lastMaintenance', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Next Service Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.nextMaintenance || ''}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Last Extended Inspection</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.lastInspection || ''}
                onChange={(e) => handleChange('lastInspection', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Next Extended Inspection</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.nextInspection || ''}
                onChange={(e) => handleChange('nextInspection', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Install Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.installDate || ''}
                onChange={(e) => handleChange('installDate', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Service Notes</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Add service notes…"
              value={form.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          {/* Parts Used */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Parts Used During Service</label>
              <button
                type="button"
                onClick={() => setPartsUsed([...partsUsed, { itemId: '', quantity: 1 }])}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
              >
                <Plus size={14} />
                Add Part
              </button>
            </div>

            {partsUsed.length === 0 && (
              <p className="text-sm text-gray-500 italic">No parts used yet. Click "Add Part" to record usage.</p>
            )}

            <div className="space-y-2">
              {partsUsed.map((part, idx) => (
                <div key={idx} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <select
                      className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 rounded-lg"
                      value={part.itemId}
                      onChange={(e) => {
                        const updated = [...partsUsed];
                        updated[idx].itemId = e.target.value;
                        setPartsUsed(updated);
                      }}
                    >
                      <option value="">Select part...</option>
                      {inventoryItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.partNumber} - {item.partName} (Stock: {item.quantityInStock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="Qty"
                      value={part.quantity}
                      onChange={(e) => {
                        const updated = [...partsUsed];
                        updated[idx].quantity = parseInt(e.target.value) || 1;
                        setPartsUsed(updated);
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPartsUsed(partsUsed.filter((_, i) => i !== idx));
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
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
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExtinguisherModal;
