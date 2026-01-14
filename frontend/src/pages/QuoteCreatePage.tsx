// src/pages/QuoteCreatePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Save, Send, ArrowLeft } from 'lucide-react';
import { createQuote, fetchInventoryItems, fetchExtinguisher } from '../lib/api';
import type { InventoryItem, Extinguisher } from '../types';

interface QuoteLine {
  inventoryItemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  isLabour: boolean;
  lineTotal: number;
}

const QuoteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const extinguisherId = searchParams.get('extinguisherId') || '';
  const inspectionId = searchParams.get('inspectionId') || undefined;

  const [extinguisher, setExtinguisher] = useState<Extinguisher | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [vatRate, setVatRate] = useState<number>(20);
  const [notes, setNotes] = useState<string>('');
  const [termsConditions, setTermsConditions] = useState<string>('Payment due within 30 days of quote acceptance.\nAll work to be carried out in accordance with BS 5306 standards.');
  const [validDays, setValidDays] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [extData, inventoryData] = await Promise.all([
          fetchExtinguisher(extinguisherId),
          fetchInventoryItems(),
        ]);
        setExtinguisher(extData);
        setInventoryItems(inventoryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (extinguisherId) {
      loadData();
    } else {
      setError('No extinguisher ID provided');
      setLoading(false);
    }
  }, [extinguisherId]);

  const addLine = (isLabour: boolean = false) => {
    setLines([...lines, {
      description: '',
      quantity: 1,
      unitPrice: 0,
      isLabour,
      lineTotal: 0,
    }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, updates: Partial<QuoteLine>) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], ...updates };
    // Recalculate line total
    newLines[index].lineTotal = newLines[index].quantity * newLines[index].unitPrice;
    setLines(newLines);
  };

  const selectInventoryItem = (index: number, itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (item) {
      updateLine(index, {
        inventoryItemId: item.id,
        description: item.partName,
        unitPrice: item.customerPrice || item.unitPrice || 0,
      });
    }
  };

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const vatAmount = (subtotal * vatRate) / 100;
  const totalAmount = subtotal + vatAmount;

  const handleSave = async (sendToCustomer: boolean = false) => {
    if (lines.length === 0) {
      setError('Please add at least one line item');
      return;
    }

    if (lines.some(line => !line.description || line.unitPrice <= 0)) {
      setError('Please fill in all line item details');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + validDays);

      const quote = await createQuote({
        extinguisherId,
        inspectionId,
        validUntil: validUntil.toISOString(),
        vatRate,
        notes: notes || undefined,
        termsConditions: termsConditions || undefined,
        lines: lines.map(({ lineTotal, ...line }) => line),
      });

      // If sending, update status
      if (sendToCustomer && quote.id) {
        // TODO: Call updateQuote with status: 'sent'
        // await updateQuote(quote.id, { status: 'sent' });
      }

      navigate(`/quotes/${quote.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quote');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error && !extinguisher) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/quotes')}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Quotes
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create Quote</h1>
        <p className="text-gray-600">Generate a quote for failed extinguisher repairs</p>
      </div>

      {/* Error Alert */}
      {error && extinguisher && (
        <div className="p-4 mb-6 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Extinguisher Info */}
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Extinguisher Details</h2>
            {extinguisher && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-500">Location</label>
                  <p className="font-medium">{extinguisher.location}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Building</label>
                  <p className="font-medium">{extinguisher.building}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <p className="font-medium">{extinguisher.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Capacity</label>
                  <p className="font-medium">{extinguisher.capacity || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Line Items</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => addLine(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <Plus size={16} />
                  Add Part
                </button>
                <button
                  onClick={() => addLine(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200"
                >
                  <Plus size={16} />
                  Add Labour
                </button>
              </div>
            </div>

            {lines.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p>No line items added yet</p>
                <p className="text-sm">Click "Add Part" or "Add Labour" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lines.map((line, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Inventory Item Selector (for parts only) */}
                        {!line.isLabour && (
                          <div>
                            <label className="block mb-1 text-sm font-medium">Select Part (Optional)</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              value={line.inventoryItemId || ''}
                              onChange={(e) => selectInventoryItem(index, e.target.value)}
                            >
                              <option value="">-- Custom Description --</option>
                              {inventoryItems.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.partName} ({item.partNumber}) - £{(item.customerPrice || item.unitPrice || 0).toFixed(2)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Description */}
                        <div>
                          <label className="block mb-1 text-sm font-medium">Description</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={line.description}
                            onChange={(e) => updateLine(index, { description: e.target.value })}
                            placeholder={line.isLabour ? "e.g., Annual service and inspection" : "e.g., Replace pressure gauge"}
                          />
                        </div>

                        {/* Quantity and Unit Price */}
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block mb-1 text-sm font-medium">Quantity</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              value={line.quantity}
                              onChange={(e) => updateLine(index, { quantity: parseFloat(e.target.value) || 0 })}
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium">Unit Price (£)</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              value={line.unitPrice}
                              onChange={(e) => updateLine(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium">Line Total</label>
                            <div className="flex items-center h-10 px-3 font-medium bg-gray-100 border border-gray-300 rounded-lg">
                              £{line.lineTotal.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeLine(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remove line"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Labour Badge */}
                    {line.isLabour && (
                      <div className="mt-2">
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                          Labour
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes and Terms */}
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Additional Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes or special instructions..."
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Terms & Conditions</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  placeholder="Payment terms, warranty information, etc."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Quote Settings */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Quote Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Valid for (days)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={validDays}
                    onChange={(e) => setValidDays(parseInt(e.target.value) || 30)}
                    min="1"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">VAT Rate (%)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={vatRate}
                    onChange={(e) => setVatRate(parseFloat(e.target.value) || 20)}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Quote Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT ({vatRate}%)</span>
                  <span className="font-medium">£{vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-indigo-600">£{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="space-y-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving || lines.length === 0}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving || lines.length === 0}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  Save & Send to Customer
                </button>
                <button
                  onClick={() => navigate('/quotes')}
                  disabled={saving}
                  className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCreatePage;
