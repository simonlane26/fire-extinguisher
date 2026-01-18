// Bulk Quote Filter and Preview Dialog
import { useState, useEffect } from 'react';
import { X, Filter, FileText, AlertTriangle, Building2, MapPin, Loader2 } from 'lucide-react';
import { fetchBulkQuoteFilters, fetchExtinguishersForBulkQuote } from '../lib/api';
import type { Extinguisher } from '../types';

interface BulkQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuote: (extinguishers: Extinguisher[]) => void;
}

export function BulkQuoteDialog({ isOpen, onClose, onCreateQuote }: BulkQuoteDialogProps) {
  const [loading, setLoading] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter options
  const [availableSites, setAvailableSites] = useState<{ id: string; name: string }[]>([]);
  const [availableBuildings, setAvailableBuildings] = useState<string[]>([]);
  const [availableConditions, setAvailableConditions] = useState<string[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);

  // Selected filters
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['Out of Service', 'Needs Attention']);

  // Preview
  const [previewExtinguishers, setPreviewExtinguishers] = useState<Extinguisher[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Load filter options when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadFilters();
    }
  }, [isOpen]);

  const loadFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = await fetchBulkQuoteFilters();
      setAvailableSites(filters.sites);
      setAvailableBuildings(filters.buildings);
      setAvailableConditions(filters.conditions);
      setTotalAvailable(filters.totalCount);

      // Default to all conditions
      setSelectedConditions(filters.conditions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load filter options');
    } finally {
      setLoading(false);
    }
  };

  const loadPreview = async () => {
    setLoadingPreview(true);
    setError(null);
    try {
      const extinguishers = await fetchExtinguishersForBulkQuote({
        siteId: selectedSite || undefined,
        building: selectedBuilding || undefined,
        conditions: selectedConditions.length > 0 ? selectedConditions : undefined,
      });
      setPreviewExtinguishers(extinguishers);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load extinguishers');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleCreateQuote = () => {
    if (previewExtinguishers.length > 0) {
      onCreateQuote(previewExtinguishers);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Out of Service':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Needs Attention':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Generate Bulk Quote</h2>
              <p className="text-sm text-gray-500">
                Create a single quote for multiple extinguishers needing service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
              <span className="ml-3 text-gray-600">Loading filter options...</span>
            </div>
          ) : error && !showPreview ? (
            <div className="flex items-center justify-center py-12 text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          ) : totalAvailable === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Extinguishers Need Service</h3>
              <p className="text-gray-500">
                All extinguishers are in good condition. There are no items marked as
                "Out of Service" or "Needs Attention".
              </p>
            </div>
          ) : !showPreview ? (
            <div className="space-y-6">
              {/* Info banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>{totalAvailable} extinguisher{totalAvailable !== 1 ? 's' : ''}</strong> currently need attention.
                      Use the filters below to select which ones to include in the quote.
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Filter className="w-4 h-4" />
                  Filter Options
                </div>

                {/* Site filter */}
                {availableSites.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site
                    </label>
                    <select
                      value={selectedSite}
                      onChange={(e) => setSelectedSite(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      <option value="">All Sites</option>
                      {availableSites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Building filter */}
                {availableBuildings.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Building
                    </label>
                    <select
                      value={selectedBuilding}
                      onChange={(e) => setSelectedBuilding(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      <option value="">All Buildings</option>
                      {availableBuildings.map(building => (
                        <option key={building} value={building}>{building}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Condition filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableConditions.map(condition => (
                      <button
                        key={condition}
                        type="button"
                        onClick={() => handleConditionToggle(condition)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                          selectedConditions.includes(condition)
                            ? getConditionColor(condition)
                            : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {previewExtinguishers.length} Extinguisher{previewExtinguishers.length !== 1 ? 's' : ''} Selected
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  Back to Filters
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Building</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {previewExtinguishers.map((ext) => (
                      <tr key={ext.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {ext.location}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {ext.building}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {ext.type} {ext.capacity && `(${ext.capacity})`}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(ext.condition)}`}>
                            {ext.condition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          {!showPreview ? (
            <button
              onClick={loadPreview}
              disabled={loading || totalAvailable === 0 || selectedConditions.length === 0 || loadingPreview}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPreview ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4" />
                  Preview Selection
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleCreateQuote}
              disabled={previewExtinguishers.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              Create Quote ({previewExtinguishers.length} items)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
