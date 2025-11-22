import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, AlertTriangle, TrendingDown } from 'lucide-react';
import type { InventoryItem } from '../types';
import {
  fetchInventoryItems,
  fetchLowStockItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../lib/api';

const CATEGORIES = [
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

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [allItems, lowStock] = await Promise.all([
        fetchInventoryItems(),
        fetchLowStockItems()
      ]);
      setItems(allItems);
      setLowStockItems(lowStock);
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

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || item.category === categoryFilter;

    const matchesLowStock = !showLowStockOnly || item.quantityInStock <= item.minStockLevel;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-sm text-gray-600">Manage spare parts and consumables inventory</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="p-4 border-l-4 border-orange-500 rounded-lg bg-orange-50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} className="text-orange-600" />
            <h3 className="font-semibold text-orange-900">Low Stock Alert</h3>
          </div>
          <p className="text-sm text-orange-800">
            {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} below minimum stock level
          </p>
          <button
            onClick={() => setShowLowStockOnly(true)}
            className="mt-2 text-sm font-medium text-orange-700 hover:text-orange-900"
          >
            View low stock items →
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by part name or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            showLowStockOnly
              ? 'bg-orange-100 border-orange-300 text-orange-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <TrendingDown size={16} />
          Low Stock Only
        </button>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const isLowStock = item.quantityInStock <= item.minStockLevel;
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 ${isLowStock ? 'bg-orange-50' : ''}`}>
                    <td className="px-6 py-4 font-mono text-sm">{item.partNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-gray-400" />
                        {item.partName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${isLowStock ? 'text-orange-600' : 'text-gray-900'}`}>
                        {item.quantityInStock}
                        {isLowStock && <AlertTriangle size={14} className="inline ml-1" />}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.minStockLevel}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.unitPrice ? `£${(item.unitPrice / 100).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-center text-gray-500" colSpan={7}>
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
        supplierPartNo: form.supplierPartNo || undefined,
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
