import React, { useState, useRef, useEffect } from 'react';
import { useTenant } from '../../../src/api/components/contexts/TenantContext';
import { useExtinguishers } from '../../../src/api/components/hooks/useExtinguishers';
import ExtinguisherTable from '../components/extinguishers/ExtinguisherTable';
import AddExtinguisherModal from '../components/AddExtinguisherModal';
import type { Extinguisher } from '../../../src/api/components/types';
import { exportExtinguishersCsv, importExtinguishersCsv, fetchSites } from '../lib/api';
import { Download, Upload } from 'lucide-react';
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

  // Filter extinguishers by selected site
  const filteredItems = selectedSiteId === 'all'
    ? items
    : items.filter(item => item.siteId === selectedSiteId);

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Extinguishers</h2>
          {sites.length > 0 && (
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Sites</option>
              <option value="">No Site Assigned</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting || items.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
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
          />
          <button onClick={() => setOpenAdd(true)} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            Add Extinguisher
          </button>
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
