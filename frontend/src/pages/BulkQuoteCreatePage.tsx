// src/pages/BulkQuoteCreatePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2, Save, Send, ArrowLeft, ChevronDown, ChevronUp, Package, Building2, MapPin, Wrench } from 'lucide-react';
import { createBulkQuote, fetchInventoryItems } from '../lib/api';
import { STANDARD_SERVICE_PARTS } from '../constants/standardServiceParts';
import type { InventoryItem, Extinguisher } from '../types';

interface QuoteLine {
  extinguisherId: string;
  inventoryItemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  isLabour: boolean;
  lineTotal: number;
}

interface ExtinguisherGroup {
  extinguisher: Extinguisher;
  lines: QuoteLine[];
  isExpanded: boolean;
}

const BulkQuoteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get extinguishers passed from the dialog
  const passedExtinguishers = (location.state?.extinguishers as Extinguisher[]) || [];

  const [extinguisherGroups, setExtinguisherGroups] = useState<ExtinguisherGroup[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [vatRate, setVatRate] = useState<number>(20);
  const [notes, setNotes] = useState<string>('');
  const [termsConditions, setTermsConditions] = useState<string>('Payment due within 30 days of quote acceptance.\nAll work to be carried out in accordance with BS 5306 standards.');
  const [validDays, setValidDays] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStandardParts, setShowStandardParts] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (passedExtinguishers.length === 0) {
          setError('No extinguishers selected. Please go back and select extinguishers.');
          setLoading(false);
          return;
        }

        const inventoryData = await fetchInventoryItems();
        setInventoryItems(inventoryData);

        // Initialize groups with one empty line per extinguisher
        const groups: ExtinguisherGroup[] = passedExtinguishers.map(ext => ({
          extinguisher: ext,
          lines: [],
          isExpanded: true,
        }));
        setExtinguisherGroups(groups);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleGroupExpanded = (extId: string) => {
    setExtinguisherGroups(groups =>
      groups.map(g =>
        g.extinguisher.id === extId ? { ...g, isExpanded: !g.isExpanded } : g
      )
    );
  };

  const addLine = (extId: string, isLabour: boolean = false) => {
    setExtinguisherGroups(groups =>
      groups.map(g => {
        if (g.extinguisher.id === extId) {
          return {
            ...g,
            lines: [...g.lines, {
              extinguisherId: extId,
              description: '',
              quantity: 1,
              unitPrice: 0,
              isLabour,
              lineTotal: 0,
            }],
          };
        }
        return g;
      })
    );
  };

  const addStandardPart = (extId: string, part: typeof STANDARD_SERVICE_PARTS[number]) => {
    setExtinguisherGroups(groups =>
      groups.map(g => {
        if (g.extinguisher.id === extId) {
          return {
            ...g,
            lines: [...g.lines, {
              extinguisherId: extId,
              description: part.name + (part.description ? ` - ${part.description}` : ''),
              quantity: 1,
              unitPrice: part.defaultPrice,
              isLabour: 'isLabour' in part ? part.isLabour! : false,
              lineTotal: part.defaultPrice,
            }],
          };
        }
        return g;
      })
    );
    setShowStandardParts(null);
  };

  const removeLine = (extId: string, lineIndex: number) => {
    setExtinguisherGroups(groups =>
      groups.map(g => {
        if (g.extinguisher.id === extId) {
          return {
            ...g,
            lines: g.lines.filter((_, i) => i !== lineIndex),
          };
        }
        return g;
      })
    );
  };

  const removeExtinguisher = (extId: string) => {
    setExtinguisherGroups(groups => groups.filter(g => g.extinguisher.id !== extId));
  };

  const updateLine = (extId: string, lineIndex: number, updates: Partial<QuoteLine>) => {
    setExtinguisherGroups(groups =>
      groups.map(g => {
        if (g.extinguisher.id === extId) {
          const newLines = [...g.lines];
          newLines[lineIndex] = { ...newLines[lineIndex], ...updates };
          newLines[lineIndex].lineTotal = newLines[lineIndex].quantity * newLines[lineIndex].unitPrice;
          return { ...g, lines: newLines };
        }
        return g;
      })
    );
  };

  const selectInventoryItem = (extId: string, lineIndex: number, itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (item) {
      updateLine(extId, lineIndex, {
        inventoryItemId: item.id,
        description: item.partName,
        unitPrice: (item.customerPrice || item.unitPrice || 0) / 100,
      });
    }
  };

  // Calculate totals
  const allLines = extinguisherGroups.flatMap(g => g.lines);
  const subtotal = allLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const vatAmount = (subtotal * vatRate) / 100;
  const totalAmount = subtotal + vatAmount;

  const handleSave = async (sendToCustomer: boolean = false) => {
    const linesWithData = allLines.filter(line => line.description && line.unitPrice > 0);

    if (linesWithData.length === 0) {
      setError('Please add at least one line item with a description and price');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + validDays);

      const quote = await createBulkQuote({
        isBulkQuote: true,
        validUntil: validUntil.toISOString(),
        vatRate,
        notes: notes || undefined,
        termsConditions: termsConditions || undefined,
        lines: linesWithData.map(({ lineTotal, ...line }) => line),
      });

      navigate(`/quotes/${quote.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quote');
    } finally {
      setSaving(false);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Out of Service':
        return 'bg-red-100 text-red-800';
      case 'Needs Attention':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error && extinguisherGroups.length === 0) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/quotes')}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Quotes
        </button>
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
        <h1 className="text-2xl font-bold text-gray-900">Create Bulk Quote</h1>
        <p className="text-gray-600">
          Generating quote for {extinguisherGroups.length} extinguisher{extinguisherGroups.length !== 1 ? 's' : ''} needing service
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Extinguisher Groups */}
          {extinguisherGroups.map((group) => (
            <div key={group.extinguisher.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              {/* Group Header */}
              <div
                className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => toggleGroupExpanded(group.extinguisher.id)}
              >
                <div className="flex items-center gap-4">
                  <button className="p-1">
                    {group.isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{group.extinguisher.building}</span>
                      <span className="text-gray-400">-</span>
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{group.extinguisher.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <span>{group.extinguisher.type}</span>
                      {group.extinguisher.capacity && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span>{group.extinguisher.capacity}</span>
                        </>
                      )}
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getConditionColor(group.extinguisher.condition)}`}>
                        {group.extinguisher.condition}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {group.lines.length} item{group.lines.length !== 1 ? 's' : ''} -
                    £{group.lines.reduce((sum, l) => sum + l.lineTotal, 0).toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExtinguisher(group.extinguisher.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Remove extinguisher from quote"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Group Content */}
              {group.isExpanded && (
                <div className="p-4">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => addLine(group.extinguisher.id, false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700"
                    >
                      <Plus size={16} />
                      Add Part
                    </button>
                    <button
                      onClick={() => addLine(group.extinguisher.id, true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-violet-700 bg-violet-100 rounded-lg hover:bg-violet-200"
                    >
                      <Plus size={16} />
                      Add Labour
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowStandardParts(showStandardParts === group.extinguisher.id ? null : group.extinguisher.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200"
                      >
                        <Wrench size={16} />
                        Standard Service Parts
                        <ChevronDown size={14} />
                      </button>

                      {/* Standard Parts Dropdown */}
                      {showStandardParts === group.extinguisher.id && (
                        <div className="absolute z-10 mt-1 w-72 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                          {['Seals', 'Safety', 'Gauges', 'Hoses', 'Nozzles', 'Valves', 'Mounting', 'Labels', 'Internal', 'Labour'].map(category => {
                            const categoryParts = STANDARD_SERVICE_PARTS.filter(p => p.category === category);
                            if (categoryParts.length === 0) return null;
                            return (
                              <div key={category}>
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                                  {category}
                                </div>
                                {categoryParts.map(part => (
                                  <button
                                    key={part.id}
                                    onClick={() => addStandardPart(group.extinguisher.id, part)}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
                                  >
                                    <span className="text-sm">{part.name}</span>
                                    <span className="text-sm text-gray-500">£{part.defaultPrice.toFixed(2)}</span>
                                  </button>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Line Items */}
                  {group.lines.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No line items added</p>
                      <p className="text-sm">Add parts or labour for this extinguisher</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {group.lines.map((line, lineIndex) => (
                        <div key={lineIndex} className="p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 space-y-2">
                              {/* Inventory Item Selector (for parts only) */}
                              {!line.isLabour && (
                                <select
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  value={line.inventoryItemId || ''}
                                  onChange={(e) => selectInventoryItem(group.extinguisher.id, lineIndex, e.target.value)}
                                >
                                  <option value="">-- Custom / Select from inventory --</option>
                                  {inventoryItems.map(item => (
                                    <option key={item.id} value={item.id}>
                                      {item.partName} ({item.partNumber}) - £{((item.customerPrice || item.unitPrice || 0) / 100).toFixed(2)}
                                    </option>
                                  ))}
                                </select>
                              )}

                              <div className="grid grid-cols-12 gap-2">
                                {/* Description */}
                                <div className="col-span-6">
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    value={line.description}
                                    onChange={(e) => updateLine(group.extinguisher.id, lineIndex, { description: e.target.value })}
                                    placeholder={line.isLabour ? "Labour description" : "Part description"}
                                  />
                                </div>

                                {/* Quantity */}
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    className="w-full px-2 py-2 text-sm text-center border border-gray-300 rounded-lg"
                                    value={line.quantity}
                                    onChange={(e) => updateLine(group.extinguisher.id, lineIndex, { quantity: parseFloat(e.target.value) || 0 })}
                                    min="0"
                                    step="0.1"
                                    title="Quantity"
                                  />
                                </div>

                                {/* Unit Price */}
                                <div className="col-span-2">
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
                                    <input
                                      type="number"
                                      className="w-full pl-5 pr-2 py-2 text-sm border border-gray-300 rounded-lg"
                                      value={line.unitPrice}
                                      onChange={(e) => updateLine(group.extinguisher.id, lineIndex, { unitPrice: parseFloat(e.target.value) || 0 })}
                                      min="0"
                                      step="0.01"
                                      title="Unit Price"
                                    />
                                  </div>
                                </div>

                                {/* Line Total */}
                                <div className="col-span-2 flex items-center justify-end font-medium text-sm">
                                  £{line.lineTotal.toFixed(2)}
                                </div>
                              </div>

                              {line.isLabour && (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                                  Labour
                                </span>
                              )}
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeLine(group.extinguisher.id, lineIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Remove line"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

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
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Extinguishers</span>
                  <span>{extinguisherGroups.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Line Items</span>
                  <span>{allLines.length}</span>
                </div>
              </div>
              <div className="pt-4 border-t space-y-3">
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
                  <span className="text-xl font-bold text-violet-600">£{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="space-y-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving || allLines.length === 0}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving || allLines.length === 0}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 text-violet-700 bg-violet-100 rounded-lg hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Click outside to close dropdown */}
      {showStandardParts && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowStandardParts(null)}
        />
      )}
    </div>
  );
};

export default BulkQuoteCreatePage;
