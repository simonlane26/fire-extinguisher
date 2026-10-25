import React, { useState, useEffect } from 'react';
import {
  Package, Plus, Minus, Edit2, Trash2, AlertTriangle, CloudOff,
  CheckCircle2, PoundSterling, ChevronUp, ChevronDown, Search,
} from 'lucide-react';
import type { InventoryItem } from '../types';
import {
  fetchInventoryItems,
  fetchLowStockItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../lib/api';
import { getInventoryOffline } from '../lib/offline/offlineApi';
import { syncManager } from '../lib/offline/syncManager';

const CATEGORIES = [
  'Extinguisher',
  'Seals',
  'Valves',
  'Gauges',
  'Hoses',
  'Nozzles',
  'O-Rings',
  'Pins',
  'Tags',
  'Other'
];

type SortKey = 'partNumber' | 'partName' | 'category' | 'quantityInStock' | 'minStockLevel' | 'unitPrice' | 'value';

function stockHealth(item: InventoryItem): 'critical' | 'approaching' | 'healthy' {
  if (item.minStockLevel <= 0) return 'healthy';
  const ratio = item.quantityInStock / item.minStockLevel;
  if (ratio <= 1) return 'critical';
  if (ratio <= 1.5) return 'approaching';
  return 'healthy';
}

const HEALTH_BAR_CLS: Record<ReturnType<typeof stockHealth>, string> = {
  critical: 'bg-red-500',
  approaching: 'bg-amber-500',
  healthy: 'bg-green-500',
};

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isOffline, setIsOffline] = useState(!syncManager.getOnlineStatus());
  const [sortKey, setSortKey] = useState<SortKey>('quantityInStock');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setIsOffline(!syncManager.getOnlineStatus());

      // Use offline-aware API that falls back to cached data when offline
      const allItems = await getInventoryOffline();
      setItems(allItems as InventoryItem[]);

      // Low stock items - calculate from cached data when offline
      if (syncManager.getOnlineStatus()) {
        try {
          const lowStock = await fetchLowStockItems();
          setLowStockItems(lowStock);
        } catch {
          // Calculate low stock from loaded items
          const lowStock = allItems.filter((item: any) => item.quantityInStock <= item.minStockLevel);
          setLowStockItems(lowStock as InventoryItem[]);
        }
      } else {
        // Calculate low stock from cached items when offline
        const lowStock = allItems.filter((item: any) => item.quantityInStock <= item.minStockLevel);
        setLowStockItems(lowStock as InventoryItem[]);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inventory item? This cannot be undone.')) return;
    try {
      await deleteInventoryItem(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const categoryCounts = items.reduce<Record<string, number>>((acc, item) => {
    const cat = item.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const presentCategories = Object.keys(categoryCounts).sort();

  const totalInStock = items.reduce((sum, item) => sum + item.quantityInStock, 0);
  const totalStockValue = items.reduce((sum, item) => sum + item.quantityInStock * ((item.unitPrice ?? 0) / 100), 0);

  function itemValue(item: InventoryItem) {
    return item.quantityInStock * ((item.unitPrice ?? 0) / 100);
  }

  const filteredItems = items
    .filter(item => {
      const matchesSearch =
        item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || (item.category || 'Uncategorized') === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'partNumber': cmp = a.partNumber.localeCompare(b.partNumber); break;
        case 'partName': cmp = a.partName.localeCompare(b.partName); break;
        case 'category': cmp = (a.category || '').localeCompare(b.category || ''); break;
        case 'quantityInStock': cmp = a.quantityInStock - b.quantityInStock; break;
        case 'minStockLevel': cmp = a.minStockLevel - b.minStockLevel; break;
        case 'unitPrice': cmp = (a.unitPrice ?? 0) - (b.unitPrice ?? 0); break;
        case 'value': cmp = itemValue(a) - itemValue(b); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function SortHeader({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) {
    const active = sortKey === sortKeyName;
    return (
      <button
        onClick={() => handleSort(sortKeyName)}
        className={`flex items-center gap-1 text-xs font-medium uppercase ${active ? 'text-brand-ink' : 'text-brand-ink-muted'} hover:text-brand-ink`}
      >
        {label}
        {active && (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
      </button>
    );
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function adjustQuantity(item: InventoryItem, delta: number) {
    const next = item.quantityInStock + delta;
    if (next < 0) return;
    setAdjustingId(item.id);
    try {
      await updateInventoryItem(item.id, { quantityInStock: next });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update quantity');
    } finally {
      setAdjustingId(null);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} selected item${selectedIds.size !== 1 ? 's' : ''}? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteInventoryItem(id);
      }
      setSelectedIds(new Set());
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete selected items');
    } finally {
      setBulkDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading inventory...</div>
      </div>
    );
  }

  const worstLowStockItem = lowStockItems.length > 0
    ? [...lowStockItems].sort((a, b) => (a.quantityInStock - a.minStockLevel) - (b.quantityInStock - b.minStockLevel))[0]
    : null;

  return (
    <div className="space-y-5">
      {/* Offline Banner */}
      {isOffline && (
        <div className="flex items-center gap-2 p-3 text-brand-ink-muted bg-brand-bg border border-brand-line rounded-lg">
          <CloudOff size={18} />
          <span className="text-sm">
            You're viewing cached inventory data. Changes will sync when back online.
          </span>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-line rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-bg flex items-center justify-center text-brand-ink-muted shrink-0"><Package size={17} /></div>
          <div>
            <div className="text-xl font-bold text-brand-ink leading-none tabular-nums">{items.length}</div>
            <div className="text-[11px] text-brand-ink-muted mt-1">Unique parts</div>
          </div>
        </div>
        <div className="bg-white border border-brand-line rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0"><CheckCircle2 size={17} /></div>
          <div>
            <div className="text-xl font-bold text-brand-ink leading-none tabular-nums">{totalInStock}</div>
            <div className="text-[11px] text-brand-ink-muted mt-1">Total in stock</div>
          </div>
        </div>
        <div className="bg-white border border-brand-line rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0"><AlertTriangle size={17} /></div>
          <div>
            <div className="text-xl font-bold text-brand-ink leading-none tabular-nums">{lowStockItems.length}</div>
            <div className="text-[11px] text-brand-ink-muted mt-1">Low stock</div>
          </div>
        </div>
        <div className="bg-white border border-brand-line rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-bg flex items-center justify-center text-brand-red shrink-0"><PoundSterling size={17} /></div>
          <div>
            <div className="text-xl font-bold text-brand-ink leading-none tabular-nums">£{totalStockValue.toFixed(2)}</div>
            <div className="text-[11px] text-brand-ink-muted mt-1">Total stock value</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleAdd}
          disabled={isOffline}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium ${
            isOffline ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-red hover:bg-brand-red-dark'
          }`}
          title={isOffline ? 'Cannot add items while offline' : undefined}
        >
          <Plus size={18} />
          Add Part
        </button>
      </div>

      {/* Low Stock Alert */}
      {worstLowStockItem && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <p className="text-sm text-red-800 flex-1">
            <span className="font-semibold">{worstLowStockItem.partName}</span> ({worstLowStockItem.partNumber}) is at minimum level · {worstLowStockItem.quantityInStock} in stock, min level {worstLowStockItem.minStockLevel}
          </p>
          <button
            onClick={() => { setSearchTerm(worstLowStockItem.partNumber); setCategoryFilter(''); }}
            className="text-sm font-medium text-red-700 hover:text-red-900 shrink-0"
          >
            View item →
          </button>
        </div>
      )}

      {/* Search + category chips */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink-faint" />
          <input
            type="text"
            placeholder="Search by part name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-brand-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              categoryFilter === '' ? 'bg-brand-ink text-white border-brand-ink' : 'border-brand-line text-brand-ink-muted hover:bg-brand-bg'
            }`}
          >
            All <span className="opacity-70">{items.length}</span>
          </button>
          {presentCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                categoryFilter === cat ? 'bg-brand-ink text-white border-brand-ink' : 'border-brand-line text-brand-ink-muted hover:bg-brand-bg'
              }`}
            >
              {cat} <span className="opacity-70">{categoryCounts[cat]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-brand-ink text-white rounded-lg">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting || isOffline}
            className="ml-auto flex items-center gap-1.5 text-sm font-medium text-red-300 hover:text-red-200 disabled:opacity-50"
          >
            <Trash2 size={14} /> {bulkDeleting ? 'Deleting...' : 'Delete selected'}
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="text-sm text-white/70 hover:text-white">
            Clear
          </button>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-brand-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-bg">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={filteredItems.length > 0 && selectedIds.size === filteredItems.length}
                    onChange={toggleSelectAll}
                    className="rounded border-brand-line"
                  />
                </th>
                <th className="px-4 py-3 text-left"><SortHeader label="Part Number" sortKeyName="partNumber" /></th>
                <th className="px-4 py-3 text-left"><SortHeader label="Part Name" sortKeyName="partName" /></th>
                <th className="px-4 py-3 text-left"><SortHeader label="Category" sortKeyName="category" /></th>
                <th className="px-4 py-3 text-left"><SortHeader label="In Stock" sortKeyName="quantityInStock" /></th>
                <th className="px-4 py-3 text-left"><SortHeader label="Min Level" sortKeyName="minStockLevel" /></th>
                <th className="px-4 py-3 text-left"><SortHeader label="Unit Price" sortKeyName="unitPrice" /></th>
                <th className="px-4 py-3 text-left"><SortHeader label="Value" sortKeyName="value" /></th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {filteredItems.map((item) => {
                const health = stockHealth(item);
                const isCritical = health === 'critical';
                const barWidth = Math.min(100, Math.round((item.minStockLevel > 0 ? item.quantityInStock / item.minStockLevel : 2) * 40));
                return (
                  <tr key={item.id} className={`group hover:bg-brand-bg ${isCritical ? 'bg-red-50/60' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-brand-line"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-brand-ink-muted">{item.partNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-brand-ink font-medium">
                        <Package size={14} className="text-brand-ink-faint shrink-0" />
                        {item.partName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-brand-bg text-brand-ink-muted">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold tabular-nums ${isCritical ? 'text-red-600' : 'text-brand-ink'}`}>
                          {item.quantityInStock}
                        </span>
                        <div className="w-14 h-1.5 bg-brand-bg rounded-full overflow-hidden shrink-0">
                          <div className={`h-full rounded-full ${HEALTH_BAR_CLS[health]}`} style={{ width: `${barWidth}%` }} />
                        </div>
                        <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                          <button
                            onClick={() => adjustQuantity(item, -1)}
                            disabled={isOffline || adjustingId === item.id || item.quantityInStock <= 0}
                            className="w-5 h-5 flex items-center justify-center rounded border border-brand-line text-brand-ink-muted hover:bg-white disabled:opacity-40"
                            title="Decrease"
                          >
                            <Minus size={11} />
                          </button>
                          <button
                            onClick={() => adjustQuantity(item, 1)}
                            disabled={isOffline || adjustingId === item.id}
                            className="w-5 h-5 flex items-center justify-center rounded border border-brand-line text-brand-ink-muted hover:bg-white disabled:opacity-40"
                            title="Increase"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-ink-muted tabular-nums">{item.minStockLevel}</td>
                    <td className="px-4 py-3 text-sm text-brand-ink-muted tabular-nums">
                      {item.unitPrice ? `£${(item.unitPrice / 100).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-ink-muted tabular-nums">£{itemValue(item).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={isOffline}
                          className={`p-1.5 rounded ${
                            isOffline ? 'text-brand-ink-faint cursor-not-allowed' : 'text-brand-ink-muted hover:bg-brand-bg hover:text-brand-ink'
                          }`}
                          title={isOffline ? 'Cannot edit while offline' : 'Edit'}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isOffline}
                          className={`p-1.5 rounded ${
                            isOffline ? 'text-brand-ink-faint cursor-not-allowed' : 'text-brand-ink-faint hover:bg-red-50 hover:text-red-600'
                          }`}
                          title={isOffline ? 'Cannot delete while offline' : 'Delete'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-center text-brand-ink-muted" colSpan={9}>
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <InventoryModal
          item={editingItem}
          onClose={() => setShowModal(false)}
          onSave={async () => {
            await loadData();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

/* ===================== Inventory Modal ===================== */

type ModalProps = {
  item: InventoryItem | null;
  onClose: () => void;
  onSave: () => void;
};

const InventoryModal: React.FC<ModalProps> = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState({
    partNumber: item?.partNumber || '',
    partName: item?.partName || '',
    category: item?.category || '',
    extinguisherType: item?.supplierPartNo || '', // Reusing supplierPartNo field for extinguisher type
    description: item?.description || '',
    unitPrice: item?.unitPrice ? (item.unitPrice / 100).toString() : '',
    quantityInStock: item?.quantityInStock?.toString() || '0',
    minStockLevel: item?.minStockLevel?.toString() || '10',
    supplier: item?.supplier || '',
    supplierPartNo: item?.supplierPartNo || '',
    location: item?.location || '',
    notes: item?.notes || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.partNumber || !form.partName) {
      setError('Part Number and Part Name are required');
      return;
    }

    if (form.category === 'Extinguisher' && !form.extinguisherType.trim()) {
      setError('Extinguisher Type is required when category is Extinguisher');
      return;
    }

    try {
      setSubmitting(true);

      const payload: any = {
        partNumber: form.partNumber,
        partName: form.partName,
        category: form.category || undefined,
        description: form.description || undefined,
        unitPrice: form.unitPrice ? Math.round(parseFloat(form.unitPrice) * 100) : undefined,
        quantityInStock: parseInt(form.quantityInStock) || 0,
        minStockLevel: parseInt(form.minStockLevel) || 10,
        supplier: form.supplier || undefined,
        // For extinguishers, store the type in supplierPartNo field
        supplierPartNo: form.category === 'Extinguisher' ? form.extinguisherType : (form.supplierPartNo || undefined),
        location: form.location || undefined,
        notes: form.notes || undefined,
      };

      if (item) {
        await updateInventoryItem(item.id, payload);
      } else {
        await createInventoryItem(payload);
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">
            {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Part Number *</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.partNumber}
                onChange={(e) => handleChange('partNumber', e.target.value)}
                placeholder="e.g., SEAL-001"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Part Name *</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.partName}
                onChange={(e) => handleChange('partName', e.target.value)}
                placeholder="e.g., O-Ring Seal"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {form.category === 'Extinguisher' && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Extinguisher Type *</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={form.extinguisherType}
                  onChange={(e) => handleChange('extinguisherType', e.target.value)}
                  placeholder="e.g., CO2 2kg, Foam 6L, Powder 9kg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This should match the extinguisher 'Type' field exactly for automatic stock reduction
                </p>
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Unit Price (£)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.unitPrice}
                onChange={(e) => handleChange('unitPrice', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Quantity in Stock</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.quantityInStock}
                onChange={(e) => handleChange('quantityInStock', e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Min Stock Level</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.minStockLevel}
                onChange={(e) => handleChange('minStockLevel', e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Supplier</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Supplier Part No</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.supplierPartNo}
                onChange={(e) => handleChange('supplierPartNo', e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Storage Location</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Shelf A-3"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={form.notes}
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
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {submitting ? 'Saving...' : item ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
