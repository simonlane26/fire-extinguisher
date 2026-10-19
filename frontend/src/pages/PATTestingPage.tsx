import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Plus, Trash2, ClipboardList, Settings, AlertTriangle, CheckCircle,
  Clock, Plug, X, ChevronRight, Laptop, Monitor, Printer, Coffee,
  Smartphone, Tv, Wrench, Wind, Zap, Upload, Download, Search,
} from 'lucide-react';
import {
  patGetAppliances, patCreateAppliance, patUpdateAppliance, patDeleteAppliance,
  patGetTests, patCreateTest, patDeleteTest, fetchSites, importPATCsv,
} from '../lib/api';
import type { PATAppliance, PATTest, Site } from '../types';
import ComplianceRing from '../components/ComplianceRing';

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

function patStatusKey(appliance: Pick<PATAppliance, 'nextTestDue' | 'tests'>): 'compliant' | 'attention' | 'overdue' {
  const label = patStatus(appliance).label;
  if (label === 'Overdue') return 'overdue';
  if (label === 'Compliant') return 'compliant';
  return 'attention';
}

const PAT_STRIPE_CLS: Record<string, string> = {
  compliant: 'bg-green-500',
  attention: 'bg-amber-500',
  overdue: 'bg-red-500',
};

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
            <Plug size={18} className="text-brand-red" /> Add Appliance
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
            <button type="submit" disabled={saving} className="flex-1 bg-brand-red text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-red-dark disabled:opacity-50">
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
            <button type="submit" disabled={saving} className="flex-1 bg-brand-red text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-red-dark disabled:opacity-50">
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
  const total     = appliances.length;
  const compliant = appliances.filter(a => patStatusKey(a) === 'compliant').length;
  const attention = appliances.filter(a => patStatusKey(a) === 'attention').length;
  const overdue   = appliances.filter(a => patStatusKey(a) === 'overdue').length;
  const pct = total > 0 ? Math.round((compliant / total) * 100) : 0;

  return (
    <div className="flex items-center gap-5 bg-white border border-brand-line rounded-xl px-5 py-4 mb-5">
      <ComplianceRing
        size={56}
        strokeWidth={5}
        total={total}
        centerLabel={<span className="text-[15px] font-bold">{pct}%</span>}
        segments={[
          { value: compliant, color: '#16A34A' },
          { value: attention, color: '#D97706' },
          { value: overdue, color: '#DC2626' },
        ]}
      />
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-[22px] font-bold text-brand-ink leading-none tabular-nums">{total}</div>
          <div className="text-[11px] text-brand-ink-muted mt-1">Total appliances</div>
        </div>
        <div>
          <div className="text-[22px] font-bold text-brand-ink leading-none tabular-nums">{compliant}</div>
          <div className="text-[11px] text-brand-ink-muted mt-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />Compliant</div>
        </div>
        <div>
          <div className="text-[22px] font-bold text-brand-ink leading-none tabular-nums">{attention}</div>
          <div className="text-[11px] text-brand-ink-muted mt-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />Needs attention</div>
        </div>
        <div>
          <div className="text-[22px] font-bold text-brand-ink leading-none tabular-nums">{overdue}</div>
          <div className="text-[11px] text-brand-ink-muted mt-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />Overdue</div>
        </div>
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
  const [search, setSearch] = useState('');
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

  const filteredAppliances = appliances.filter(a => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return a.applianceRef.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || (a.site?.name ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="flex h-full min-h-screen bg-brand-bg">
      {/* List panel */}
      <aside className="w-80 shrink-0 border-r border-brand-line bg-white flex flex-col">
        <div className="p-4 border-b border-brand-line">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[13px] font-semibold text-brand-ink">Appliances</span>
              <span className="text-xs text-brand-ink-muted"> · {appliances.length} appliance{appliances.length === 1 ? '' : 's'}</span>
            </div>
            <button
              onClick={() => setShowAddAppliance(true)}
              className="flex items-center gap-1 text-xs font-medium bg-brand-red text-white px-2.5 py-1.5 rounded-lg hover:bg-brand-red-dark"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <a href="/pat-import-template.csv" download className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-brand-ink-muted border border-brand-line rounded-lg hover:border-brand-ink-faint">
              <Download size={12} /> Template
            </a>
            <button onClick={() => patImportRef.current?.click()} disabled={importing} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-brand-ink-muted border border-brand-line rounded-lg px-2 py-1.5 hover:border-brand-ink-faint disabled:opacity-50">
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
            className="w-full border border-brand-line rounded-lg px-2 py-1.5 text-sm text-brand-ink mb-2"
            value={filterSiteId}
            onChange={e => { setFilterSiteId(e.target.value); setSelectedId(null); }}
          >
            <option value="all">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search appliances…"
              className="w-full border border-brand-line rounded-lg pl-8 pr-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-red"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-sm text-brand-ink-muted p-4">Loading…</p>}
          {error && <p className="text-sm text-red-500 p-4">{error}</p>}
          {!loading && filteredAppliances.length === 0 && (
            <div className="p-6 text-center text-sm text-brand-ink-muted">
              <Plug size={32} className="text-brand-ink-faint mx-auto mb-2" />
              {appliances.length === 0 ? 'No appliances yet' : 'No appliances match your search'}
            </div>
          )}
          {filteredAppliances.map(a => {
            const status = patStatus(a);
            const stripe = PAT_STRIPE_CLS[patStatusKey(a)];
            const isSelected = selectedId === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`w-full flex text-left px-4 py-2.5 border-l-[3px] transition-colors ${isSelected ? 'bg-brand-red-tint border-l-brand-red' : 'border-l-transparent hover:bg-brand-bg'}`}
              >
                <span className={`w-1 rounded mr-3 shrink-0 ${stripe}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`shrink-0 text-brand-ink-faint ${isSelected ? 'text-brand-red' : ''}`}>{applianceIcon(a.description)}</span>
                    <span className="font-mono text-[13px] font-semibold text-brand-ink truncate">{a.applianceRef}</span>
                  </div>
                  <div className="text-xs text-brand-ink-muted truncate mt-0.5">{a.description} · {a.location}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${status.cls}`}>{status.label}</span>
                    <span className="text-[11px] text-brand-ink-faint tabular-nums">Due: {fmt(a.nextTestDue)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Detail panel */}
      <main className="flex-1 overflow-y-auto p-6 min-w-0">
        {!selectedAppliance ? (
          <div className="h-full flex items-center justify-center text-brand-ink-muted">
            <div className="text-center">
              <Plug size={48} className="mx-auto mb-3 text-brand-ink-faint" />
              <p className="text-sm">Select an appliance to view details</p>
            </div>
          </div>
        ) : (
          <>
            {!loading && appliances.length > 0 && <PATComplianceCard appliances={appliances} />}

            {/* Detail header */}
            <div className="bg-white border border-brand-line rounded-xl p-5 mb-5">
              <div className="flex items-start justify-between gap-4 mb-3.5">
                <div className="min-w-0">
                  <div className="font-mono text-xl font-bold text-brand-ink">{selectedAppliance.applianceRef}</div>
                  <div className="flex items-center gap-1.5 text-sm text-brand-ink-muted mt-0.5">
                    {[selectedAppliance.site?.name, selectedAppliance.location].filter(Boolean).map((part, i, arr) => (
                      <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < arr.length - 1 && <span className="text-brand-ink-faint">›</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] text-brand-ink-muted">Next test due</div>
                  <div className="text-base font-bold tabular-nums text-brand-ink">{fmt(selectedAppliance.nextTestDue)}</div>
                  <button onClick={() => handleDeleteAppliance(selectedAppliance.id)} className="text-[11px] text-red-400 hover:text-red-600 mt-1 inline-flex items-center gap-1" title="Delete appliance">
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {selectedAppliance.applianceClass && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">Class {selectedAppliance.applianceClass}</span>}
                {selectedAppliance.site && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">{selectedAppliance.site.name}</span>}
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-[11px] text-brand-ink-faint">Last tested</div>
                  <div className="text-[13px] font-medium text-brand-ink tabular-nums">{fmt(selectedAppliance.lastTestedAt)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-brand-ink-faint">Description</div>
                  <div className="text-[13px] font-medium text-brand-ink">{selectedAppliance.description}</div>
                </div>
                <div>
                  <div className="text-[11px] text-brand-ink-faint">Tests logged</div>
                  <div className="text-[13px] font-medium text-brand-ink tabular-nums">{selectedAppliance._count?.tests ?? tests.length}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white border border-brand-line border-b-0 rounded-t-xl overflow-hidden">
              {([
                { key: 'history', label: 'Test History', icon: <ClipboardList size={14} /> },
                { key: 'details', label: 'Appliance Details', icon: <Settings size={14} /> },
              ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
                    tab === key ? 'border-brand-red text-brand-red' : 'border-transparent text-brand-ink-muted hover:text-brand-ink'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-white border border-brand-line rounded-b-xl p-5">
              {tab === 'history' && (
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-sm font-semibold text-brand-ink">{tests.length} test{tests.length === 1 ? '' : 's'}</h3>
                    <button
                      onClick={() => setShowLogTest(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-red text-white rounded-lg text-xs font-semibold hover:bg-brand-red-dark"
                    >
                      <Plus size={14} /> Log Test
                    </button>
                  </div>

                  {testsLoading && <p className="text-sm text-brand-ink-muted">Loading…</p>}
                  {!testsLoading && tests.length === 0 && (
                    <div className="text-center py-10 text-brand-ink-muted">
                      <ClipboardList size={32} className="mx-auto mb-2 text-brand-ink-faint" />
                      <p className="text-sm">No test records yet</p>
                    </div>
                  )}
                  <div className="flex flex-col">
                    {tests.map((t, i) => {
                      const isPass = t.outcome === 'pass';
                      return (
                        <div key={t.id} className={`flex items-start gap-3 py-2.5 ${i < tests.length - 1 ? 'border-b border-brand-line/60' : ''}`}>
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isPass ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {isPass ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className={`text-[13px] font-semibold ${isPass ? 'text-green-700' : 'text-red-700'}`}>{isPass ? 'Pass' : 'Fail'}</div>
                            <div className="text-xs text-brand-ink-muted mt-0.5">
                              by {t.testedBy}
                              {t.earthOhms != null && ` · Earth: ${t.earthOhms}Ω`}
                              {t.insulationMohms != null && ` · Insulation: ${t.insulationMohms}MΩ`}
                              {t.reportRef && ` · ${t.reportRef}`}
                            </div>
                            {t.comments && <p className="text-xs text-brand-ink-faint mt-0.5">{t.comments}</p>}
                          </div>
                          <div className="text-[11px] text-brand-ink-faint text-right shrink-0 tabular-nums leading-snug">
                            {fmt(t.testedAt)}
                            {t.nextTestDate && <><br />Next due: {fmt(t.nextTestDate)}</>}
                            <button
                              onClick={() => handleDeleteTest(t.id)}
                              className="block ml-auto mt-1 text-red-300 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {tab === 'details' && (
                <div className="max-w-md">
                  <h3 className="font-medium text-brand-ink mb-4">Appliance Details</h3>
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
                      className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-red-dark disabled:opacity-50"
                    >
                      {editSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {showAddAppliance && (
        <AddApplianceModal sites={sites} onClose={() => setShowAddAppliance(false)} onSave={handleAddAppliance} />
      )}
      {showLogTest && selectedAppliance && (
        <LogTestModal appliance={selectedAppliance} onClose={() => setShowLogTest(false)} onSave={handleLogTest} />
      )}
    </div>
  );
};

export default PATTestingPage;
