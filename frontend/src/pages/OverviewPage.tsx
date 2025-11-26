import React, { useState, useRef, useEffect } from 'react';
import { useTenant } from '../../../src/api/components/contexts/TenantContext';
import { useExtinguishers } from '../../../src/api/components/hooks/useExtinguishers';
import ExtinguisherTable from '../components/extinguishers/ExtinguisherTable';
import AddExtinguisherModal from '../components/AddExtinguisherModal';
import type { Extinguisher } from '../../../src/api/components/types';
import { exportExtinguishersCsv, importExtinguishersCsv, fetchSites } from '../lib/api';
import { Download, Upload, Search, Filter, X } from 'lucide-react';
import type { Site } from '../types';

const OverviewPage: React.FC = () => {
  const { tenant } = useTenant();
  const { items, loading, error, add, refresh } = useExtinguishers(tenant.id);
  const [openAdd, setOpenAdd] = useState(false);
  const [selected, setSelected] = useState<Extinguisher | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

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

  // Get unique values for filters
  const buildings = Array.from(new Set(items.map((item: Extinguisher) => item.building).filter(Boolean))) as string[];
  const types = Array.from(new Set(items.map((item: Extinguisher) => item.type).filter(Boolean))) as string[];
  const statuses = Array.from(new Set(items.map((item: Extinguisher) => item.status).filter(Boolean))) as string[];
  const conditions = Array.from(new Set(items.map((item: Extinguisher) => item.condition).filter(Boolean))) as string[];

  // Filter extinguishers
  const filteredItems = items.filter((item: Extinguisher) => {
    // Site filter
    if (selectedSiteId !== 'all' && item.siteId !== selectedSiteId) return false;

    // Search filter (location, building, type, serial number)
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

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSiteId('all');
    setBuildingFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setConditionFilter('all');
  };

  const activeFilterCount = [
    searchQuery,
    selectedSiteId !== 'all',
    buildingFilter !== 'all',
    typeFilter !== 'all',
    statusFilter !== 'all',
    conditionFilter !== 'all'
  ].filter(Boolean).length;

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
        refresh(); // Refresh the list
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

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Extinguishers</h2>
          <div className="flex gap-2">
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
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by location, building, type, serial number, or manufacturer..."
            className="flex-1 outline-none text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Filter Options</h3>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Site Filter */}
              {sites.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                  <select
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    aria-label="Filter by site"
                  >
                    <option value="all">All Sites</option>
                    <option value="">No Site Assigned</option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Building Filter */}
              {buildings.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                  <select
                    value={buildingFilter}
                    onChange={(e) => setBuildingFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    aria-label="Filter by building"
                  >
                    <option value="all">All Buildings</option>
                    {buildings.map((building) => (
                      <option key={building} value={building}>
                        {building}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Type Filter */}
              {types.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    aria-label="Filter by type"
                  >
                    <option value="all">All Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              {statuses.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Statuses</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Condition Filter */}
              {conditions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    aria-label="Filter by condition"
                  >
                    <option value="all">All Conditions</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Count and Actions */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing <span className="font-semibold text-gray-900">{filteredItems.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{items.length}</span> extinguishers
          </div>
          <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || items.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            disabled={importing}
            className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            {importing ? 'Importing...' : 'Import CSV'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload CSV file"
          />
          <button
            type="button"
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add Extinguisher
          </button>
          </div>
        </div>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {importResult && (
        <div className={`p-4 rounded ${importResult.errors > 0 ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'}`}>
          Import complete: {importResult.imported} extinguishers imported
          {importResult.errors > 0 && `, ${importResult.errors} errors occurred (check console)`}
        </div>
      )}
      <ExtinguisherTable items={filteredItems} onView={setSelected} />
      <AddExtinguisherModal open={openAdd} onClose={() => setOpenAdd(false)} onCreate={add} />
      {/* You can add a DetailsModal and pass `selected` */}
    </div>
  );
};

export default OverviewPage;
