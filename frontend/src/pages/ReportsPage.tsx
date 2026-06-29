import React, { useState, useEffect } from 'react';
import { FileText, Users, Filter, MapPin, BellRing, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { getAuthHeaders, fetchExtinguishers, fetchSites, faGetSystems, patGetAppliances, downloadPATTestReport, elGetLuminaires, downloadEmergencyLightingReport } from '../lib/api';
import type { Site, FireAlarmSystem } from '../types';

// Determine API base URL based on environment
const getApiBase = () => {
  // In production, always use the environment variable
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }

  // Check if we're on localhost (development)
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalhost) {
    // In development, use current hostname with port 3000
    const protocol = window.location.protocol; // http: or https:
    return `${protocol}//${hostname}:3000/api/v1`;
  } else {
    // In production (Railway), use relative path (same domain, different path)
    return '/api/v1';
  }
};

const API_BASE = getApiBase();

type Props = {
  primaryColor?: string;
  buildingFilter?: string;
  typeFilter?: string;
  statusFilter?: string;
  fireAlarmEnabled?: boolean;
  patTestingEnabled?: boolean;
  emergencyLightingEnabled?: boolean;
};

const FIRE_ALARM_DATE_RANGES = [
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', days: 91 },
  { label: 'Last 12 months', days: 365 },
  { label: 'All time', days: 0 },
];

const ReportsPage: React.FC<Props> = ({
  primaryColor = '#7c3aed',
  buildingFilter = 'all',
  typeFilter = 'all',
  statusFilter = 'all',
  fireAlarmEnabled = false,
  patTestingEnabled = false,
  emergencyLightingEnabled = false,
}) => {
  const [generatingUsers, setGeneratingUsers] = useState(false);
  const [generatingByType, setGeneratingByType] = useState(false);
  const [generatingBySite, setGeneratingBySite] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(typeFilter);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [extinguisherTypes, setExtinguisherTypes] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sites, setSites] = useState<Site[]>([]);

  // Fire alarm export state
  const [faSystems, setFaSystems] = useState<FireAlarmSystem[]>([]);
  const [faSelectedSystem, setFaSelectedSystem] = useState<string>('all');
  const [faDateRange, setFaDateRange] = useState<number>(365);
  const [faExporting, setFaExporting] = useState(false);
  const [faWeeklyExporting, setFaWeeklyExporting] = useState(false);
  const [faFaultExporting, setFaFaultExporting] = useState(false);
  const [faEngineerExporting, setFaEngineerExporting] = useState(false);
  const [faWeeklyOpen, setFaWeeklyOpen] = useState(false);
  const [faFaultOpen, setFaFaultOpen] = useState(false);
  const [faEngineerOpen, setFaEngineerOpen] = useState(false);

  // PAT testing export state
  const [patSelectedSite, setPatSelectedSite] = useState<string>('all');
  const [patDateRange, setPatDateRange] = useState<number>(365);
  const [patExporting, setPatExporting] = useState(false);
  const [patHasAppliances, setPatHasAppliances] = useState(false);

  // Emergency Lighting export state
  const [elSelectedSite, setElSelectedSite] = useState<string>('all');
  const [elDateRange, setElDateRange] = useState<number>(365);
  const [elExporting, setElExporting] = useState(false);
  const [elHasLuminaires, setElHasLuminaires] = useState(false);

  // Batch Certificate state
  const [certSiteFilter, setCertSiteFilter] = useState<string>('all');
  const [certBuildingFilter, setCertBuildingFilter] = useState<string>('all');
  const [certTypeFilter, setCertTypeFilter] = useState<string>('all');
  const [generatingCert, setGeneratingCert] = useState(false);
  const [buildings, setBuildings] = useState<string[]>([]);

  useEffect(() => {
    fetchExtinguisherTypes();
    fetchUsers();
    fetchSites().then(setSites).catch(() => {});
  }, []);

  useEffect(() => {
    if (fireAlarmEnabled) {
      faGetSystems().then(setFaSystems).catch(() => {});
    }
  }, [fireAlarmEnabled]);

  useEffect(() => {
    if (patTestingEnabled) {
      patGetAppliances().then((a: any[]) => setPatHasAppliances(a.length > 0)).catch(() => {});
    }
  }, [patTestingEnabled]);

  useEffect(() => {
    if (emergencyLightingEnabled) {
      elGetLuminaires().then((l: any[]) => setElHasLuminaires(l.length > 0)).catch(() => {});
    }
  }, [emergencyLightingEnabled]);

  const fetchExtinguisherTypes = async () => {
    try {
      const extinguishers = await fetchExtinguishers();

      const types = [...new Set(extinguishers.map((e: any) => e.type))].sort();
      setExtinguisherTypes(types as string[]);

      const uniqueBuildings = [...new Set(
        extinguishers.map((e: any) => e.building).filter(Boolean)
      )].sort();
      setBuildings(uniqueBuildings as string[]);
    } catch (error) {
      console.error('Failed to fetch extinguisher types:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/users`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const generateUserReport = async () => {
    try {
      setGeneratingUsers(true);

      // Build query params with user filter
      const params = new URLSearchParams();
      if (selectedUser !== 'all') params.append('userId', selectedUser);

      const queryString = params.toString();
      const url = `${API_BASE}/reports/users/report${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to generate user report');

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      alert(error?.message || 'Failed to generate user report');
    } finally {
      setGeneratingUsers(false);
    }
  };

  const generateExtinguishersByTypeReport = async () => {
    try {
      setGeneratingByType(true);

      // Build query params with filters
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (buildingFilter !== 'all') params.append('building', buildingFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const queryString = params.toString();
      const url = `${API_BASE}/reports/extinguishers/by-type${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to generate extinguishers report');

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      alert(error?.message || 'Failed to generate extinguishers report');
    } finally {
      setGeneratingByType(false);
    }
  };

  const generateFireAlarmReport = async () => {
    try {
      setFaExporting(true);
      const params = new URLSearchParams();
      if (faSelectedSystem !== 'all') params.append('systemId', faSelectedSystem);
      params.append('days', String(faDateRange));

      const res = await fetch(`${API_BASE}/reports/fire-alarm/logbook?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to generate fire alarm report');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      alert(err?.message || 'Failed to generate fire alarm report');
    } finally {
      setFaExporting(false);
    }
  };

  const generateFireAlarmWeeklyReport = async () => {
    try {
      setFaWeeklyExporting(true);
      const params = new URLSearchParams();
      if (faSelectedSystem !== 'all') params.append('systemId', faSelectedSystem);
      params.append('days', String(faDateRange));
      const res = await fetch(`${API_BASE}/reports/fire-alarm/weekly-tests?${params.toString()}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      alert(err?.message || 'Failed to generate weekly test report');
    } finally {
      setFaWeeklyExporting(false);
    }
  };

  const generateFireAlarmFaultReport = async () => {
    try {
      setFaFaultExporting(true);
      const params = new URLSearchParams();
      if (faSelectedSystem !== 'all') params.append('systemId', faSelectedSystem);
      params.append('days', String(faDateRange));
      const res = await fetch(`${API_BASE}/reports/fire-alarm/fault-history?${params.toString()}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      alert(err?.message || 'Failed to generate fault history report');
    } finally {
      setFaFaultExporting(false);
    }
  };

  const generateFireAlarmEngineerReport = async () => {
    try {
      setFaEngineerExporting(true);
      const params = new URLSearchParams();
      if (faSelectedSystem !== 'all') params.append('systemId', faSelectedSystem);
      params.append('days', String(faDateRange));
      const res = await fetch(`${API_BASE}/reports/fire-alarm/engineer-visits?${params.toString()}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      alert(err?.message || 'Failed to generate engineer maintenance report');
    } finally {
      setFaEngineerExporting(false);
    }
  };

  const generateExtinguishersBySiteReport = async () => {
    try {
      setGeneratingBySite(true);
      const params = new URLSearchParams();
      if (selectedSite !== 'all') params.append('siteId', selectedSite);
      const queryString = params.toString();
      const url = `${API_BASE}/reports/extinguishers/by-site${queryString ? `?${queryString}` : ''}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to generate site report');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      alert(error?.message || 'Failed to generate site report');
    } finally {
      setGeneratingBySite(false);
    }
  };

  const generateBatchCertificate = async () => {
    try {
      setGeneratingCert(true);
      const params = new URLSearchParams();
      if (certSiteFilter !== 'all') params.append('siteId', certSiteFilter);
      if (certBuildingFilter !== 'all') params.append('building', certBuildingFilter);
      if (certTypeFilter !== 'all') params.append('type', certTypeFilter);
      const res = await fetch(`${API_BASE}/reports/extinguishers/batch-certificate?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to generate batch certificate');
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      alert(err?.message || 'Failed to generate batch certificate');
    } finally {
      setGeneratingCert(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
        Reports
      </h1>

      <p className="text-gray-600 mb-8">
        Generate comprehensive PDF reports for your fire safety management system.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management Report */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Users size={24} style={{ color: primaryColor }} />
            </div>
            <h2 className="text-xl font-semibold">User Management Report</h2>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            Generate a detailed report of all users in your organization, including their roles, status, and activity.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRing: primaryColor }}
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={generateUserReport}
            disabled={generatingUsers}
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <FileText size={16} />
            {generatingUsers ? 'Generating...' : 'Generate User Report'}
          </button>
        </div>

        {/* Extinguishers by Type Report */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Filter size={24} style={{ color: primaryColor }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Extinguishers by Type</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  Most commonly used
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Perfect for audits &amp; client handover</p>
            </div>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            Generate a report grouped by extinguisher type, with detailed inventory and service information.
          </p>

          {(buildingFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {buildingFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Building: {buildingFilter}
                  </span>
                )}
                {typeFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Type: {typeFilter}
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Status: {statusFilter}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-700 mt-2">Report will include only filtered extinguishers</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRing: primaryColor }}
            >
              <option value="all">All Types</option>
              {extinguisherTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button
            onClick={generateExtinguishersByTypeReport}
            disabled={generatingByType}
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <FileText size={16} />
            {generatingByType ? 'Generating...' : 'Generate Type Report'}
          </button>
        </div>

        {/* Extinguishers by Site Report */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
              <MapPin size={24} style={{ color: primaryColor }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Extinguishers by Site</h2>
              <p className="text-xs text-gray-400 mt-0.5">Full breakdown per location</p>
            </div>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            Generate a report grouped by site, showing all extinguishers at each location with service status.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Site
            </label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              aria-label="Filter by site"
            >
              <option value="all">All Sites</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={generateExtinguishersBySiteReport}
            disabled={generatingBySite}
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <FileText size={16} />
            {generatingBySite ? 'Generating...' : 'Generate Site Report'}
          </button>
        </div>
        {/* Batch Certificate of Inspection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
              <FileText size={24} style={{ color: primaryColor }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Certificate of Inspection</h2>
              <p className="text-xs text-gray-400 mt-0.5">Batch certificate for multiple extinguishers</p>
            </div>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            Generate a single inspection certificate listing all extinguishers matching your selected filters, in the same style as individual certificates.
          </p>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
              <select
                title="Filter by site"
                value={certSiteFilter}
                onChange={(e) => setCertSiteFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
              >
                <option value="all">All Sites</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
              <select
                title="Filter by building"
                value={certBuildingFilter}
                onChange={(e) => setCertBuildingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
              >
                <option value="all">All Buildings</option>
                {buildings.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                title="Filter by type"
                value={certTypeFilter}
                onChange={(e) => setCertTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
              >
                <option value="all">All Types</option>
                {extinguisherTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={generateBatchCertificate}
            disabled={generatingCert}
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <FileText size={16} />
            {generatingCert ? 'Generating...' : 'Generate Batch Certificate'}
          </button>
        </div>

        {/* Fire Alarm Reports — unified card */}
        {fireAlarmEnabled && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
                <BellRing size={24} style={{ color: primaryColor }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Fire Alarm Logbook</h2>
                <p className="text-xs text-gray-400 mt-0.5">BS 5839-1 inspection log export</p>
              </div>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
              Generate a PDF report of fire alarm log entries for audits, handover, or your own records.
            </p>

            {/* Shared selectors */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System</label>
                <select
                  value={faSelectedSystem}
                  onChange={(e) => setFaSelectedSystem(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                >
                  <option value="all">All Systems ({faSystems.length})</option>
                  {faSystems.map((s) => (
                    <option key={s.id} value={s.id}>{s.name || s.systemRef}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={faDateRange}
                  onChange={(e) => setFaDateRange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                >
                  {FIRE_ALARM_DATE_RANGES.map((r) => (
                    <option key={r.days} value={r.days}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main logbook button */}
            <button
              type="button"
              onClick={generateFireAlarmReport}
              disabled={faExporting || faSystems.length === 0}
              className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 mb-3"
              style={{ backgroundColor: primaryColor }}
            >
              <FileText size={16} />
              {faExporting ? 'Generating...' : 'Generate Logbook Report (PDF)'}
            </button>

            {/* Weekly Test Log — collapsible */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
              <button
                type="button"
                onClick={() => setFaWeeklyOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" /> Weekly Test Log
                </span>
                {faWeeklyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {faWeeklyOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-3">PDF log of all weekly fire alarm tests with checklist results, suitable for compliance audits.</p>
                  <button
                    type="button"
                    onClick={generateFireAlarmWeeklyReport}
                    disabled={faWeeklyExporting || faSystems.length === 0}
                    className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <FileText size={16} />
                    {faWeeklyExporting ? 'Generating...' : 'Generate Weekly Test Log (PDF)'}
                  </button>
                </div>
              )}
            </div>

            {/* Fault History — collapsible */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
              <button
                type="button"
                onClick={() => setFaFaultOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText size={14} className="text-red-400" /> Fault History
                </span>
                {faFaultOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {faFaultOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-3">Full history of reported faults with severity, remedial actions taken, and resolution status.</p>
                  <button
                    type="button"
                    onClick={generateFireAlarmFaultReport}
                    disabled={faFaultExporting || faSystems.length === 0}
                    className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 bg-red-600"
                  >
                    <FileText size={16} />
                    {faFaultExporting ? 'Generating...' : 'Generate Fault History (PDF)'}
                  </button>
                </div>
              )}
            </div>

            {/* Engineer Maintenance Report — collapsible */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
              <button
                type="button"
                onClick={() => setFaEngineerOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-400" /> Engineer Maintenance Report
                </span>
                {faEngineerOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {faEngineerOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-3">Record of all engineer visits including work carried out, outcomes, and next recommended actions.</p>
                  <button
                    type="button"
                    onClick={generateFireAlarmEngineerReport}
                    disabled={faEngineerExporting || faSystems.length === 0}
                    className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 bg-indigo-600"
                  >
                    <FileText size={16} />
                    {faEngineerExporting ? 'Generating...' : 'Generate Engineer Report (PDF)'}
                  </button>
                </div>
              )}
            </div>

            {faSystems.length === 0 && (
              <p className="text-xs text-gray-400 mt-2 text-center">No fire alarm systems configured yet.</p>
            )}
          </div>
        )}
      </div>

      {/* PAT Testing Report */}
      {patTestingEnabled && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">PAT Testing Report</h2>
              <p className="text-sm text-gray-500 mt-1">
                Full appliance register with test results — matches the standard PAT Test Report form layout.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
              <select
                title="Site filter"
                value={patSelectedSite}
                onChange={e => setPatSelectedSite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Sites</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                title="Date range filter"
                value={patDateRange}
                onChange={e => setPatDateRange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {FIRE_ALARM_DATE_RANGES.map(r => <option key={r.days} value={r.days}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              setPatExporting(true);
              try { await downloadPATTestReport(patSelectedSite !== 'all' ? patSelectedSite : undefined, patDateRange); }
              catch { alert('Failed to generate PAT report'); }
              finally { setPatExporting(false); }
            }}
            disabled={patExporting || !patHasAppliances}
            className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {patExporting ? 'Generating…' : 'Generate PAT Test Report (PDF)'}
          </button>
          {!patHasAppliances && (
            <p className="text-xs text-gray-400 mt-2 text-center">Add appliances in the PAT Testing tab first</p>
          )}
        </div>
      )}

      {/* Emergency Lighting Report */}
      {emergencyLightingEnabled && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Lightbulb size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Emergency Lighting Report</h3>
                <p className="text-sm text-gray-500 mt-0.5">BS 5266-1:2016 compliant test log</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Site</label>
              <select
                title="Site filter"
                value={elSelectedSite}
                onChange={e => setElSelectedSite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Sites</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
              <select
                title="Date range"
                value={elDateRange}
                onChange={e => setElDateRange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 3 months</option>
                <option value={180}>Last 6 months</option>
                <option value={365}>Last 12 months</option>
                <option value={0}>All time</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              setElExporting(true);
              try { await downloadEmergencyLightingReport(elSelectedSite !== 'all' ? elSelectedSite : undefined, elDateRange); }
              catch { alert('Failed to generate emergency lighting report'); }
              finally { setElExporting(false); }
            }}
            disabled={elExporting || !elHasLuminaires}
            className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {elExporting ? 'Generating…' : 'Generate Emergency Lighting Report (PDF)'}
          </button>
          {!elHasLuminaires && (
            <p className="text-xs text-gray-400 mt-2 text-center">Add luminaires in the Emergency Lighting tab first</p>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Additional Reports</h3>
        <p className="text-sm text-blue-800">
          For individual extinguisher history reports and certificates, visit the Inventory page and use the report options in each extinguisher's detail view.
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
