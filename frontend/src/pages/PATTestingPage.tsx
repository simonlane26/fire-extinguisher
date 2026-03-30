import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Plus, Trash2, ClipboardList, Settings, AlertTriangle, CheckCircle,
  Clock, Plug, X, ChevronRight, Laptop, Monitor, Printer, Coffee,
  Smartphone, Tv, Wrench, Wind, Zap, Upload, Download,
} from 'lucide-react';
import {
  patGetAppliances, patCreateAppliance, patUpdateAppliance, patDeleteAppliance,
  patGetTests, patCreateTest, patDeleteTest, fetchSites, importPATCsv,
} from '../lib/api';
import type { PATAppliance, PATTest, Site } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('en-GB') : '—';

function patStatus(appliance: Pick<PATAppliance, 'nextTestDue' | 'tests'>): {
  label: string; cls: string; dot: string; icon: React.ReactNode;
} {
  if (appliance.tests?.[0]?.outcome === 'fail')
    return { label: 'Non Compliant', cls: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500', icon: <AlertTriangle size={12} /> };
  if (!appliance.nextTestDue)
    return { label: 'Never Tested', cls: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', icon: <Clock size={12} /> };
  const days = (new Date(appliance.nextTestDue).getTime() - Date.now()) / 86_400_000;
  if (days < 0)   return { label: 'Overdue',    cls: 'bg-red-100 text-red-700',    dot: 'bg-red-500',    icon: <AlertTriangle size={12} /> };
  if (days <= 30) return { label: 'Due Soon',   cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500',  icon: <Clock size={12} /> };
  return             { label: 'Compliant',   cls: 'bg-green-100 text-green-700',  dot: 'bg-green-500',  icon: <CheckCircle size={12} /> };
}

function applianceIcon(description: string): React.ReactNode {
  const d = description.toLowerCase();
  if (/laptop|notebook|macbook/.test(d))                           return <Laptop size={14} />;
  if (/monitor|screen|display/.test(d))                            return <Monitor size={14} />;
  if (/printer|scanner|copier/.test(d))                            return <Printer size={14} />;
  if (/kettle|coffee|microwave|toaster|fridge|oven/.test(d))       return <Coffee size={14} />;
  if (/phone|charger|mobile|tablet/.test(d))                       return <Smartphone size={14} />;
  if (/tv|television|projector/.test(d))                           return <Tv size={14} />;
  if (/drill|grinder|saw|tool/.test(d))                            return <Wrench size={14} />;
  if (/fan|heater|air/.test(d))                                    return <Wind size={14} />;
  if (/extension|lead|reel|strip/.test(d))                         return <Zap size={14} />;
  return <Plug size={14} />;
}

// ─── Add Appliance Modal ───────────────────────────────────────────────────────

interface AddApplianceModalProps {
  sites: Site[];
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

const AddApplianceModal: React.FC<AddApplianceModalProps> = ({ sites, onClose, onSave }) => {
  const [form, setForm] = useState({
    siteId: sites[0]?.id ?? '',
    applianceRef: '',
    description: '',
    location: '',
    applianceClass: 'I',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plug size={18} className="text-violet-600" /> Add Appliance
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site *</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" required
              value={form.siteId} onChange={e => setForm(f => ({ ...f, siteId: e.target.value }))}>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID No. *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="e.g. ID001"
                value={form.applianceRef} onChange={e => setForm(f => ({ ...f, applianceRef: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.applianceClass} onChange={e => setForm(f => ({ ...f, applianceClass: e.target.value }))}>
                <option value="I">Class I (Earthed)</option>
                <option value="II">Class II (Double Insulated)</option>
                <option value="III">Class III (SELV)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="e.g. Kettle, Laptop, Drill"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="e.g. Kitchen, Office 1"
              value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-violet-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-violet-700 disabled:opacity-50">
              {saving ? 'Saving…' : 'Add Appliance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Log Test Modal ───────────────────────────────────────────────────────────

interface LogTestModalProps {
  appliance: PATAppliance;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

const LogTestModal: React.FC<LogTestModalProps> = ({ appliance, onClose, onSave }) => {
  const [form, setForm] = useState({
    testedBy: '',
    testedAt: new Date().toISOString().slice(0, 10),
    visualInspect: 'pass',
    earthOhms: '',
    insulationMohms: '',
    functionalCheck: 'pass',
    outcome: 'pass',
    nextTestDate: '',
    reportRef: '',
    comments: '',
  });
  const [saving, setSaving] = useState(false);
  const isClassI = appliance.applianceClass !== 'II' && appliance.applianceClass !== 'III';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data: Record<string, unknown> = {
      testedBy: form.testedBy,
      testedAt: form.testedAt,
      visualInspect: form.visualInspect,
      functionalCheck: form.functionalCheck,
      outcome: form.outcome,
      nextTestDate: form.nextTestDate || undefined,
      reportRef: form.reportRef || undefined,
      comments: form.comments || undefined,
    };
    if (form.earthOhms) data.earthOhms = parseFloat(form.earthOhms);
    if (form.insulationMohms) data.insulationMohms = parseFloat(form.insulationMohms);
    try { await onSave(data); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold">Log PAT Test</h2>
            <p className="text-sm text-gray-500">{appliance.applianceRef} — {appliance.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tested By *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" required
                value={form.testedBy} onChange={e => setForm(f => ({ ...f, testedBy: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" required
                value={form.testedAt} onChange={e => setForm(f => ({ ...f, testedAt: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visual Inspect</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.visualInspect} onChange={e => setForm(f => ({ ...f, visualInspect: e.target.value }))}>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Functional Check</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.functionalCheck} onChange={e => setForm(f => ({ ...f, functionalCheck: e.target.value }))}>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="na">N/A</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Outcome</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {isClassI && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Earth Continuity (Ω)</label>
                <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 0.05"
                  value={form.earthOhms} onChange={e => setForm(f => ({ ...f, earthOhms: e.target.value }))} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insulation Resistance (MΩ)</label>
              <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 2.0"
                value={form.insulationMohms} onChange={e => setForm(f => ({ ...f, insulationMohms: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Test Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.nextTestDate} onChange={e => setForm(f => ({ ...f, nextTestDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Ref.</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. PAT-2026-001"
                value={form.reportRef} onChange={e => setForm(f => ({ ...f, reportRef: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
              value={form.comments} onChange={e => setForm(f => ({ ...f, comments: e.target.value }))} />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-violet-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-violet-700 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Test Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── Compliance Summary Card ──────────────────────────────────────────────────

const PATComplianceCard: React.FC<{ appliances: PATAppliance[] }> = ({ appliances }) => {
  const today = Date.now();
  const latestFailed  = (a: PATAppliance) => a.tests?.[0]?.outcome === 'fail';
  const nonCompliant  = appliances.filter(a => latestFailed(a));
  const compliant     = appliances.filter(a => !latestFailed(a) && !!a.nextTestDue && new Date(a.nextTestDue).getTime() - today > 30 * 86_400_000);
  const dueSoon       = appliances.filter(a => !latestFailed(a) && !!a.nextTestDue && new Date(a.nextTestDue).getTime() - today <= 30 * 86_400_000 && new Date(a.nextTestDue).getTime() > today);
  const overdue       = appliances.filter(a => !latestFailed(a) && !!a.nextTestDue && new Date(a.nextTestDue).getTime() <= today);
  const neverTested   = appliances.filter(a => !latestFailed(a) && !a.nextTestDue);

  const upcoming = appliances
    .filter(a => !latestFailed(a) && a.nextTestDue && new Date(a.nextTestDue).getTime() > today)
    .sort((a, b) => new Date(a.nextTestDue!).getTime() - new Date(b.nextTestDue!).getTime())[0];

  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <CheckCircle size={14} className="text-violet-600" /> PAT Compliance
          </h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="text-gray-500">Total appliances: <span className="font-semibold text-gray-800">{appliances.length}</span></div>
            <div className="flex items-center gap-1.5 text-green-700"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Compliant: <span className="font-semibold">{compliant.length}</span></div>
            <div className="flex items-center gap-1.5 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />Due Soon: <span className="font-semibold">{dueSoon.length}</span></div>
            <div className="flex items-center gap-1.5 text-red-700"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Overdue: <span className="font-semibold">{overdue.length}</span></div>
            {nonCompliant.length > 0 && <div className="flex items-center gap-1.5 text-orange-800"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />Non Compliant: <span className="font-semibold">{nonCompliant.length}</span></div>}
            {neverTested.length > 0 && <div className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />Never Tested: <span className="font-semibold">{neverTested.length}</span></div>}
          </div>
        </div>
        {upcoming && (
          <div className="text-sm text-gray-500 bg-gray-50 border rounded-lg px-3 py-2">
            Next test due: <span className="font-semibold text-gray-800">{fmt(upcoming.nextTestDue)}</span>
            <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{upcoming.applianceRef} — {upcoming.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

type Tab = 'history' | 'details';

const PATTestingPage: React.FC<{ initialSelectId?: string }> = ({ initialSelectId }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [appliances, setAppliances] = useState<PATAppliance[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectId ?? null);
  const [tests, setTests] = useState<PATTest[]>([]);
  const [filterSiteId, setFilterSiteId] = useState<string>('all');
  const [tab, setTab] = useState<Tab>('history');
  const [showAddAppliance, setShowAddAppliance] = useState(false);
  const [showLogTest, setShowLogTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testsLoading, setTestsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PATAppliance>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const patImportRef = useRef<HTMLInputElement>(null);

  const selectedAppliance = appliances.find(a => a.id === selectedId) ?? null;

  const loadAppliances = useCallback(async () => {
    setLoading(true);
    try {
      const data = await patGetAppliances(filterSiteId !== 'all' ? filterSiteId : undefined);
      setAppliances(data);
      if (selectedId && !data.find((a: PATAppliance) => a.id === selectedId)) setSelectedId(null);
      else if (initialSelectId && data.find((a: PATAppliance) => a.id === initialSelectId)) setSelectedId(initialSelectId);
    } catch { setError('Failed to load appliances'); }
    finally { setLoading(false); }
  }, [filterSiteId, selectedId, initialSelectId]);

  useEffect(() => {
    fetchSites().then(setSites).catch(() => {});
  }, []);

  useEffect(() => { loadAppliances(); }, [filterSiteId]);

  useEffect(() => {
    if (!selectedId) { setTests([]); return; }
    setTestsLoading(true);
    patGetTests(selectedId)
      .then(setTests)
      .catch(() => setTests([]))
      .finally(() => setTestsLoading(false));
  }, [selectedId]);

  useEffect(() => {
    if (selectedAppliance) setEditForm(selectedAppliance);
  }, [selectedAppliance]);

  const handleAddAppliance = async (data: Record<string, unknown>) => {
    await patCreateAppliance(data);
    setShowAddAppliance(false);
    await loadAppliances();
  };

  const handleLogTest = async (data: Record<string, unknown>) => {
    if (!selectedId) return;
    await patCreateTest(selectedId, data);
    setShowLogTest(false);
    const [updatedTests, updatedAppliances] = await Promise.all([
      patGetTests(selectedId),
      patGetAppliances(filterSiteId !== 'all' ? filterSiteId : undefined),
    ]);
    setTests(updatedTests);
    setAppliances(updatedAppliances);
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm('Delete this test record?')) return;
    await patDeleteTest(id);
    setTests(t => t.filter(x => x.id !== id));
  };

  const handleDeleteAppliance = async (id: string) => {
    if (!confirm('Delete this appliance and all its test records?')) return;
    await patDeleteAppliance(id);
    setSelectedId(null);
    await loadAppliances();
  };

  const handleSaveDetails = async () => {
    if (!selectedId) return;
    setEditSaving(true);
    try {
      await patUpdateAppliance(selectedId, editForm as Record<string, unknown>);
      await loadAppliances();
    } finally { setEditSaving(false); }
  };

  const handlePATImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImporting(true);
      setImportResult(null);
      const result = await importPATCsv(file);
      setImportResult({ imported: result.imported, errors: result.errors });
      if (result.imported > 0) {
        const data = await patGetAppliances(filterSiteId !== 'all' ? filterSiteId : undefined);
        setAppliances(data);
      }
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
      if (patImportRef.current) patImportRef.current.value = '';
    }
  };

  const filteredAppliances = appliances;

  const outcomeBadge = (outcome: string) =>
    outcome === 'pass'
      ? <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">PASS</span>
      : <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">FAIL</span>;

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Compliance summary */}
      {!loading && appliances.length > 0 && <PATComplianceCard appliances={appliances} />}

      <div className="flex flex-1 overflow-hidden">
      {/* Left panel — Appliance list */}
      <div className="w-72 bg-white border-r flex flex-col flex-shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plug size={16} className="text-violet-600" /> Appliances
            </h2>
            <button
              onClick={() => setShowAddAppliance(true)}
              className="flex items-center gap-1 text-xs bg-violet-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-violet-700"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <a href="/pat-import-template.csv" download className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-violet-600 border border-violet-300 rounded-lg hover:bg-violet-50">
              <Download size={12} /> Template
            </a>
            <button onClick={() => patImportRef.current?.click()} disabled={importing} className="flex-1 flex items-center justify-center gap-1 text-xs bg-violet-100 text-violet-700 border border-violet-300 px-2 py-1.5 rounded-lg hover:bg-violet-200 disabled:opacity-50">
              <Upload size={12} /> {importing ? 'Importing…' : 'Import CSV'}
            </button>
          </div>
          <input ref={patImportRef} type="file" accept=".csv" onChange={handlePATImport} className="hidden" />
          {importResult && (
            <div className={`text-xs px-3 py-1.5 rounded-lg mb-2 ${importResult.errors > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
              {importResult.imported} imported{importResult.errors > 0 ? `, ${importResult.errors} skipped` : ' successfully'}
            </div>
          )}
          <select
            className="w-full border rounded-lg px-3 py-1.5 text-sm"
            value={filterSiteId}
            onChange={e => { setFilterSiteId(e.target.value); setSelectedId(null); }}
          >
            <option value="all">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-sm text-gray-400 p-4">Loading…</p>}
          {error && <p className="text-sm text-red-500 p-4">{error}</p>}
          {!loading && filteredAppliances.length === 0 && (
            <div className="p-6 text-center">
              <Plug size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No appliances yet</p>
              <p className="text-xs text-gray-400 mt-1">Add your first appliance to get started</p>
            </div>
          )}
          {filteredAppliances.map(a => {
            const status = patStatus(a);
            return (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 flex items-start justify-between gap-2 ${selectedId === a.id ? 'bg-violet-50 border-l-2 border-l-violet-600' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`flex-shrink-0 text-gray-400 ${selectedId === a.id ? 'text-violet-500' : ''}`}>
                      {applianceIcon(a.description)}
                    </span>
                    <span className="text-xs font-mono font-semibold text-violet-700">{a.applianceRef}</span>
                    {a.applianceClass && <span className="text-xs text-gray-400">Class {a.applianceClass}</span>}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{a.description}</p>
                  <p className="text-xs text-gray-500 truncate">{a.location}{a.site ? ` · ${a.site.name}` : ''}</p>
                  {a.nextTestDue && (
                    <p className="text-xs text-gray-400 mt-0.5">Due: <span className="font-medium">{fmt(a.nextTestDue)}</span></p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${status.cls}`}>
                    {status.icon} {status.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      {!selectedAppliance ? (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <Plug size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Select an appliance</p>
            <p className="text-sm text-gray-400 mt-1">or add a new one to get started</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Appliance header */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                    {selectedAppliance.applianceRef}
                  </span>
                  {selectedAppliance.applianceClass && (
                    <span className="text-xs text-gray-500">Class {selectedAppliance.applianceClass}</span>
                  )}
                  {(() => { const s = patStatus(selectedAppliance); return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${s.cls}`}>
                      {s.icon} {s.label}
                    </span>
                  ); })()}
                </div>
                <h1 className="text-xl font-bold text-gray-900 mt-1">{selectedAppliance.description}</h1>
                <p className="text-sm text-gray-500">
                  {selectedAppliance.location}
                  {selectedAppliance.site ? ` · ${selectedAppliance.site.name}` : ''}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>Last tested: <strong>{fmt(selectedAppliance.lastTestedAt)}</strong></span>
                  <span>Next due: <strong>{fmt(selectedAppliance.nextTestDue)}</strong></span>
                  <span>Tests logged: <strong>{selectedAppliance._count?.tests ?? tests.length}</strong></span>
                </div>
              </div>
              <div className="flex gap-2">
                {tab === 'history' && (
                  <button
                    onClick={() => setShowLogTest(true)}
                    className="flex items-center gap-1.5 bg-violet-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-violet-700"
                  >
                    <Plus size={15} /> Log Test
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAppliance(selectedAppliance.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 border"
                  title="Delete appliance"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 border-b -mb-4">
              {([
                { key: 'history', label: 'Test History', icon: <ClipboardList size={14} /> },
                { key: 'details', label: 'Appliance Details', icon: <Settings size={14} /> },
              ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    tab === key
                      ? 'border-violet-600 text-violet-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-6">
            {tab === 'history' && (
              <div>
                {testsLoading && <p className="text-sm text-gray-400">Loading…</p>}
                {!testsLoading && tests.length === 0 && (
                  <div className="text-center py-12">
                    <ClipboardList size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500">No test records yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Log Test" to record the first PAT test</p>
                  </div>
                )}
                <div className="space-y-3">
                  {tests.map(t => (
                    <div key={t.id} className="bg-white border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {outcomeBadge(t.outcome)}
                            <span className="text-sm font-medium text-gray-900">{fmt(t.testedAt)}</span>
                            <span className="text-xs text-gray-500">by {t.testedBy}</span>
                            {t.reportRef && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{t.reportRef}</span>}
                          </div>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-gray-600">
                            <span>Visual: <strong className={t.visualInspect === 'pass' ? 'text-green-700' : 'text-red-700'}>{t.visualInspect.toUpperCase()}</strong></span>
                            {t.earthOhms != null && <span>Earth: <strong>{t.earthOhms}Ω</strong></span>}
                            {t.insulationMohms != null && <span>Insulation: <strong>{t.insulationMohms}MΩ</strong></span>}
                            <span>Functional: <strong className={t.functionalCheck === 'pass' ? 'text-green-700' : t.functionalCheck === 'fail' ? 'text-red-700' : 'text-gray-500'}>{t.functionalCheck.toUpperCase()}</strong></span>
                            {t.nextTestDate && <span>Next test: <strong>{fmt(t.nextTestDate)}</strong></span>}
                          </div>
                          {t.comments && <p className="text-xs text-gray-500 mt-1 italic">{t.comments}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteTest(t.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 rounded hover:bg-red-50 flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'details' && (
              <div className="max-w-lg">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID No.</label>
                      <input className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={editForm.applianceRef ?? ''} onChange={e => setEditForm(f => ({ ...f, applianceRef: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={editForm.applianceClass ?? 'I'} onChange={e => setEditForm(f => ({ ...f, applianceClass: e.target.value }))}>
                        <option value="I">Class I (Earthed)</option>
                        <option value="II">Class II (Double Insulated)</option>
                        <option value="III">Class III (SELV)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editForm.location ?? ''} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3}
                      value={editForm.notes ?? ''} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <button
                    onClick={handleSaveDetails}
                    disabled={editSaving}
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
                  >
                    {editSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddAppliance && (
        <AddApplianceModal sites={sites} onClose={() => setShowAddAppliance(false)} onSave={handleAddAppliance} />
      )}
      {showLogTest && selectedAppliance && (
        <LogTestModal appliance={selectedAppliance} onClose={() => setShowLogTest(false)} onSave={handleLogTest} />
      )}
      </div>
    </div>
  );
};

export default PATTestingPage;
