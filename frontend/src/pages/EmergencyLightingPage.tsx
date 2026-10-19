import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Plus, Trash2, ClipboardList, Settings, AlertTriangle, CheckCircle,
  Clock, Lightbulb, X, ChevronRight, Upload, Download, Search,
} from 'lucide-react';
import {
  elGetLuminaires, elCreateLuminaire, elUpdateLuminaire, elDeleteLuminaire,
  elGetTests, elCreateTest, elDeleteTest, fetchSites, importELCsv,
} from '../lib/api';
import type { EmergencyLuminaire, EmergencyLightTest, Site } from '../types';
import ComplianceRing from '../components/ComplianceRing';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('en-GB') : '—';

const LUMINAIRE_TYPE_LABELS: Record<string, string> = {
  escape_route: 'Escape Route',
  open_area:    'Open Area',
  high_risk:    'High Risk',
  stairwell:    'Stairwell',
};

const TEST_TYPE_LABELS: Record<string, string> = {
  daily:        'Daily Visual',
  monthly:      'Monthly (30s)',
  annual:       'Annual Duration',
  three_yearly: '3-Yearly',
};

function elStatus(luminaire: EmergencyLuminaire): {
  label: string; cls: string; icon: React.ReactNode;
} {
  // If the most recent test was a fail, show Non Compliant (distinct from a missed schedule)
  if (luminaire.tests && luminaire.tests.length > 0 && luminaire.tests[0].outcome === 'fail') {
    return { label: 'Non Compliant', cls: 'bg-orange-100 text-orange-800', icon: <AlertTriangle size={12} /> };
  }

  const dates = [
    luminaire.nextMonthlyDue,
    luminaire.nextAnnualDue,
    luminaire.nextThreeYearlyDue,
  ].filter(Boolean) as string[];

  if (dates.length === 0) return { label: 'Never Tested', cls: 'bg-gray-100 text-gray-600', icon: <Clock size={12} /> };

  const now = Date.now();
  let earliest = Infinity;
  for (const d of dates) {
    const diff = new Date(d).getTime() - now;
    if (diff < earliest) earliest = diff;
  }

  const days = earliest / 86_400_000;
  if (days < 0)    return { label: 'Overdue',    cls: 'bg-red-100 text-red-700',    icon: <AlertTriangle size={12} /> };
  if (days <= 30)  return { label: 'Due Soon',   cls: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> };
  return { label: 'Compliant', cls: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> };
}

function elStatusKey(luminaire: EmergencyLuminaire): 'compliant' | 'attention' | 'overdue' {
  const label = elStatus(luminaire).label;
  if (label === 'Overdue') return 'overdue';
  if (label === 'Compliant') return 'compliant';
  return 'attention';
}

const EL_STRIPE_CLS: Record<string, string> = {
  compliant: 'bg-green-500',
  attention: 'bg-amber-500',
  overdue: 'bg-red-500',
};

function testTypeStatus(nextDue: string | null | undefined): {
  label: string; cls: string; tick: React.ReactNode;
} {
  if (!nextDue) return { label: 'Not tested', cls: 'text-gray-400', tick: <span>—</span> };
  const days = (new Date(nextDue).getTime() - Date.now()) / 86_400_000;
  const dateStr = new Date(nextDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  if (days < 0)    return { label: 'Overdue',         cls: 'text-red-600',   tick: <AlertTriangle size={10} /> };
  if (days <= 30)  return { label: `Due ${dateStr}`,  cls: 'text-amber-600', tick: <Clock size={10} /> };
  return             { label: `Due ${dateStr}`,  cls: 'text-green-600', tick: <CheckCircle size={10} /> };
}

// ─── Compliance Card ──────────────────────────────────────────────────────────

const ELComplianceCard: React.FC<{ luminaires: EmergencyLuminaire[] }> = ({ luminaires }) => {
  const total     = luminaires.length;
  const compliant = luminaires.filter(l => elStatusKey(l) === 'compliant').length;
  const attention = luminaires.filter(l => elStatusKey(l) === 'attention').length;
  const overdue   = luminaires.filter(l => elStatusKey(l) === 'overdue').length;
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
          <div className="text-[11px] text-brand-ink-muted mt-1">Total fittings</div>
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

// ─── Add Luminaire Modal ──────────────────────────────────────────────────────

interface AddLuminaireModalProps {
  sites: Site[];
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

const AddLuminaireModal: React.FC<AddLuminaireModalProps> = ({ sites, onClose, onSave }) => {
  const [form, setForm] = useState({
    siteId: sites[0]?.id ?? '',
    luminaireRef: '',
    description: '',
    location: '',
    luminaireType: 'escape_route',
    fittingType: 'self_contained',
    zone: '',
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb size={18} className="text-brand-red" /> Add Luminaire
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Ref / ID *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="e.g. EL-001"
                value={form.luminaireRef} onChange={e => setForm(f => ({ ...f, luminaireRef: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Luminaire Type *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" required
                value={form.luminaireType} onChange={e => setForm(f => ({ ...f, luminaireType: e.target.value }))}>
                <option value="escape_route">Escape Route</option>
                <option value="open_area">Open Area</option>
                <option value="high_risk">High Risk</option>
                <option value="stairwell">Stairwell</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="e.g. Non-Maintained LED"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="e.g. Main Corridor"
              value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fitting Type</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.fittingType} onChange={e => setForm(f => ({ ...f, fittingType: e.target.value }))}>
                <option value="self_contained">Self-Contained</option>
                <option value="central_battery">Central Battery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone / Circuit</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. Zone A"
                value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-brand-red-dark disabled:opacity-50">
              {saving ? 'Saving…' : 'Add Luminaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Log Test Modal ───────────────────────────────────────────────────────────

interface LogTestModalProps {
  luminaire: EmergencyLuminaire;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

const LogTestModal: React.FC<LogTestModalProps> = ({ luminaire, onClose, onSave }) => {
  const [form, setForm] = useState({
    testType: 'monthly',
    testedBy: '',
    testedAt: new Date().toISOString().slice(0, 10),
    durationSecs: '',
    durationMins: '',
    luxReading: '',
    outcome: 'pass',
    defectsFound: '',
    remedialAction: '',
    nextTestDate: '',
    comments: '',
    reportRef: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        testType: form.testType,
        testedBy: form.testedBy,
        testedAt: form.testedAt,
        outcome: form.outcome,
        ...(form.nextTestDate && { nextTestDate: form.nextTestDate }),
        ...(form.comments && { comments: form.comments }),
        ...(form.reportRef && { reportRef: form.reportRef }),
      };
      if (form.testType === 'monthly' && form.durationSecs) payload.durationSecs = Number(form.durationSecs);
      if (['annual', 'three_yearly'].includes(form.testType)) {
        if (form.durationMins) payload.durationMins = Number(form.durationMins);
        if (form.luxReading) payload.luxReading = Number(form.luxReading);
        if (form.defectsFound) payload.defectsFound = form.defectsFound;
        if (form.remedialAction) payload.remedialAction = form.remedialAction;
      }
      await onSave(payload);
    } finally { setSaving(false); }
  };

  const isAnnual = ['annual', 'three_yearly'].includes(form.testType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClipboardList size={18} className="text-brand-red" /> Log Test
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-5 py-3 bg-brand-red-tint border-b border-brand-line text-sm text-brand-red-dark">
          <span className="font-medium">{luminaire.luminaireRef}</span> — {luminaire.description}
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Type *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" required
                value={form.testType} onChange={e => setForm(f => ({ ...f, testType: e.target.value }))}>
                <option value="daily">Daily Visual</option>
                <option value="monthly">Monthly (30s)</option>
                <option value="annual">Annual Duration</option>
                <option value="three_yearly">3-Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" required
                value={form.testedAt} onChange={e => setForm(f => ({ ...f, testedAt: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tested By *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="Technician name"
              value={form.testedBy} onChange={e => setForm(f => ({ ...f, testedBy: e.target.value }))} />
          </div>

          {form.testType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration Achieved (seconds)</label>
              <input type="number" min="0" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 30 (minimum required)"
                value={form.durationSecs} onChange={e => setForm(f => ({ ...f, durationSecs: e.target.value }))} />
            </div>
          )}

          {isAnnual && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                    <span className="text-xs text-gray-400 ml-1">
                      {luminaire.luminaireType === 'high_risk' ? 'min. 60' : 'min. 180'}
                    </span>
                  </label>
                  <input type="number" min="0" className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder={luminaire.luminaireType === 'high_risk' ? '60' : '180'}
                    value={form.durationMins} onChange={e => setForm(f => ({ ...f, durationMins: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lux Reading (lx)</label>
                  <input type="number" min="0" step="0.1" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 1.0"
                    value={form.luxReading} onChange={e => setForm(f => ({ ...f, luxReading: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Defects Found</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Describe any defects…"
                  value={form.defectsFound} onChange={e => setForm(f => ({ ...f, defectsFound: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remedial Action</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Action taken or required…"
                  value={form.remedialAction} onChange={e => setForm(f => ({ ...f, remedialAction: e.target.value }))} />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Outcome *</label>
            <div className="flex gap-3">
              {['pass', 'fail'].map(v => (
                <label key={v} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                  form.outcome === v
                    ? v === 'pass' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="outcome" value={v} checked={form.outcome === v}
                    onChange={() => setForm(f => ({ ...f, outcome: v }))} className="sr-only" />
                  {v === 'pass' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                  {v.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Test Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.nextTestDate} onChange={e => setForm(f => ({ ...f, nextTestDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Ref</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. EL-2026-001"
                value={form.reportRef} onChange={e => setForm(f => ({ ...f, reportRef: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
              value={form.comments} onChange={e => setForm(f => ({ ...f, comments: e.target.value }))} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-brand-red-dark disabled:opacity-50">
              {saving ? 'Saving…' : 'Log Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const EmergencyLightingPage: React.FC<{ initialSelectId?: string }> = ({ initialSelectId }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [luminaires, setLuminaires] = useState<EmergencyLuminaire[]>([]);
  const [tests, setTests] = useState<EmergencyLightTest[]>([]);
  const [selectedLuminaire, setSelectedLuminaire] = useState<EmergencyLuminaire | null>(null);
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'history' | 'details'>('history');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);
  const [detailForm, setDetailForm] = useState<Partial<EmergencyLuminaire>>({});
  const [savingDetail, setSavingDetail] = useState(false);
  const [elImporting, setElImporting] = useState(false);
  const [elImportResult, setElImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const elImportRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSites().then(setSites).catch(() => {});
  }, []);

  const loadLuminaires = useCallback(() => {
    setLoading(true);
    elGetLuminaires(siteFilter === 'all' ? undefined : siteFilter)
      .then((data: EmergencyLuminaire[]) => {
        setLuminaires(data);
        if (initialSelectId && !selectedLuminaire) {
          const match = data.find((l: EmergencyLuminaire) => l.id === initialSelectId);
          if (match) {
            setSelectedLuminaire(match);
            setDetailForm(match);
            setLoadingTests(true);
            elGetTests(match.id).then(setTests).catch(() => setTests([])).finally(() => setLoadingTests(false));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [siteFilter, initialSelectId]);

  useEffect(() => { loadLuminaires(); }, [loadLuminaires]);

  const selectLuminaire = (lum: EmergencyLuminaire) => {
    setSelectedLuminaire(lum);
    setDetailForm(lum);
    setActiveTab('history');
    setLoadingTests(true);
    elGetTests(lum.id).then(setTests).catch(() => setTests([])).finally(() => setLoadingTests(false));
  };

  const handleAddLuminaire = async (data: Record<string, unknown>) => {
    await elCreateLuminaire(data);
    setShowAddModal(false);
    loadLuminaires();
  };

  const handleLogTest = async (data: Record<string, unknown>) => {
    if (!selectedLuminaire) return;
    await elCreateTest(selectedLuminaire.id, data);
    setShowLogModal(false);
    setLoadingTests(true);
    elGetTests(selectedLuminaire.id).then(setTests).finally(() => setLoadingTests(false));
    loadLuminaires();
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm('Delete this test record?')) return;
    await elDeleteTest(id);
    if (selectedLuminaire) {
      elGetTests(selectedLuminaire.id).then(setTests);
    }
  };

  const handleDeleteLuminaire = async () => {
    if (!selectedLuminaire || !confirm(`Delete ${selectedLuminaire.luminaireRef}? All test history will be lost.`)) return;
    await elDeleteLuminaire(selectedLuminaire.id);
    setSelectedLuminaire(null);
    loadLuminaires();
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLuminaire) return;
    setSavingDetail(true);
    try {
      await elUpdateLuminaire(selectedLuminaire.id, detailForm as Record<string, unknown>);
      loadLuminaires();
    } finally { setSavingDetail(false); }
  };

  const handleELImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setElImporting(true);
      setElImportResult(null);
      const result = await importELCsv(file);
      setElImportResult({ imported: result.imported, errors: result.errors });
      if (result.imported > 0) loadLuminaires();
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setElImporting(false);
      if (elImportRef.current) elImportRef.current.value = '';
    }
  };

  const filteredLuminaires = luminaires.filter(l => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return l.luminaireRef.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || (l.site?.name ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="flex h-full min-h-screen bg-brand-bg">
      {/* List panel */}
      <aside className="w-80 shrink-0 border-r border-brand-line bg-white flex flex-col">
        <div className="p-4 border-b border-brand-line">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[13px] font-semibold text-brand-ink">Emergency Lighting</span>
              <span className="text-xs text-brand-ink-muted"> · {luminaires.length} fitting{luminaires.length === 1 ? '' : 's'}</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-xs font-medium bg-brand-red text-white px-2.5 py-1.5 rounded-lg hover:bg-brand-red-dark"
              title="Add Luminaire"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <a href="/el-import-template.csv" download className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-brand-ink-muted border border-brand-line rounded-lg hover:border-brand-ink-faint">
              <Download size={12} /> Template
            </a>
            <button onClick={() => elImportRef.current?.click()} disabled={elImporting} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-brand-ink-muted border border-brand-line rounded-lg px-2 py-1.5 hover:border-brand-ink-faint disabled:opacity-50">
              <Upload size={12} /> {elImporting ? 'Importing…' : 'Import CSV'}
            </button>
          </div>
          <input ref={elImportRef} type="file" accept=".csv" onChange={handleELImport} className="hidden" />
          {elImportResult && (
            <div className={`text-xs px-3 py-1.5 rounded-lg mb-2 ${elImportResult.errors > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
              {elImportResult.imported} imported{elImportResult.errors > 0 ? `, ${elImportResult.errors} skipped` : ' successfully'}
            </div>
          )}
          <select
            title="Site filter"
            value={siteFilter}
            onChange={e => setSiteFilter(e.target.value)}
            className="w-full border border-brand-line rounded-lg px-2 py-1.5 text-sm text-brand-ink mb-2"
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
              placeholder="Search luminaires…"
              className="w-full border border-brand-line rounded-lg pl-8 pr-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-red"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-brand-ink-muted text-center">Loading…</div>
          ) : filteredLuminaires.length === 0 ? (
            <div className="p-6 text-center text-sm text-brand-ink-muted">
              <Lightbulb size={32} className="mx-auto mb-2 text-brand-ink-faint" />
              {luminaires.length === 0 ? 'No luminaires registered' : 'No luminaires match your search'}
            </div>
          ) : (
            filteredLuminaires.map(lum => {
              const isSelected = selectedLuminaire?.id === lum.id;
              const monthly = testTypeStatus(lum.nextMonthlyDue);
              const annual  = testTypeStatus(lum.nextAnnualDue);
              const status = elStatus(lum);
              const stripe = EL_STRIPE_CLS[elStatusKey(lum)];
              return (
                <button
                  key={lum.id}
                  onClick={() => selectLuminaire(lum)}
                  className={`w-full flex text-left px-4 py-2.5 border-l-[3px] transition-colors ${isSelected ? 'bg-brand-red-tint border-l-brand-red' : 'border-l-transparent hover:bg-brand-bg'}`}
                >
                  <span className={`w-1 rounded mr-3 shrink-0 ${stripe}`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[13px] font-semibold text-brand-ink truncate">{lum.luminaireRef}</div>
                    <div className="text-xs text-brand-ink-muted truncate mt-0.5">{lum.description} · {lum.location}</div>
                    <div className="flex items-center gap-2 mt-1 mb-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${status.cls}`}>{status.label}</span>
                    </div>
                    {status.label !== 'Non Compliant' && (
                      <div className="space-y-0.5">
                        <div className={`flex items-center justify-between text-[11px] ${monthly.cls}`}>
                          <span className="text-brand-ink-faint">Monthly</span>
                          <span className="flex items-center gap-1 tabular-nums">{monthly.tick} {monthly.label}</span>
                        </div>
                        <div className={`flex items-center justify-between text-[11px] ${annual.cls}`}>
                          <span className="text-brand-ink-faint">Annual</span>
                          <span className="flex items-center gap-1 tabular-nums">{annual.tick} {annual.label}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Detail panel */}
      <main className="flex-1 overflow-y-auto p-6 min-w-0">
        {!selectedLuminaire ? (
          <div className="h-full flex items-center justify-center text-brand-ink-muted">
            <div className="text-center">
              <Lightbulb size={48} className="mx-auto mb-3 text-brand-ink-faint" />
              <p className="text-sm">Select a luminaire to view details</p>
            </div>
          </div>
        ) : (
          <>
            {!loading && luminaires.length > 0 && <ELComplianceCard luminaires={luminaires} />}

            {/* Detail header */}
            <div className="bg-white border border-brand-line rounded-xl p-5 mb-5">
              <div className="flex items-start justify-between gap-4 mb-3.5">
                <div className="min-w-0">
                  <div className="font-mono text-xl font-bold text-brand-ink">{selectedLuminaire.luminaireRef}</div>
                  <div className="flex items-center gap-1.5 text-sm text-brand-ink-muted mt-0.5">
                    {[selectedLuminaire.site?.name, selectedLuminaire.location].filter(Boolean).map((part, i, arr) => (
                      <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < arr.length - 1 && <span className="text-brand-ink-faint">›</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] text-brand-ink-muted">Next annual due</div>
                  <div className="text-base font-bold tabular-nums text-brand-ink">{fmt(selectedLuminaire.nextAnnualDue)}</div>
                  <button onClick={handleDeleteLuminaire} className="text-[11px] text-red-400 hover:text-red-600 mt-1 inline-flex items-center gap-1" title="Delete luminaire">
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {selectedLuminaire.luminaireType && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                    {LUMINAIRE_TYPE_LABELS[selectedLuminaire.luminaireType] ?? selectedLuminaire.luminaireType}
                  </span>
                )}
                {selectedLuminaire.site && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">{selectedLuminaire.site.name}</span>}
                {selectedLuminaire.zone && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-brand-bg text-brand-ink-muted">Zone: {selectedLuminaire.zone}</span>}
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-[11px] text-brand-ink-faint">Last tested</div>
                  <div className="text-[13px] font-medium text-brand-ink tabular-nums">{fmt(selectedLuminaire.lastTestedAt)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-brand-ink-faint">Monthly due</div>
                  <div className="text-[13px] font-medium text-brand-ink tabular-nums">{fmt(selectedLuminaire.nextMonthlyDue)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-brand-ink-faint">Description</div>
                  <div className="text-[13px] font-medium text-brand-ink">{selectedLuminaire.description}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white border border-brand-line border-b-0 rounded-t-xl overflow-hidden">
              {(['history', 'details'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab ? 'border-brand-red text-brand-red' : 'border-transparent text-brand-ink-muted hover:text-brand-ink'
                  }`}
                >
                  {tab === 'history' ? <><ClipboardList size={14} className="inline mr-1.5 -mt-0.5" />Test History</> : <><Settings size={14} className="inline mr-1.5 -mt-0.5" />Luminaire Details</>}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-white border border-brand-line rounded-b-xl p-5">
              {activeTab === 'history' && (
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-sm font-semibold text-brand-ink">{tests.length} test{tests.length === 1 ? '' : 's'}</h3>
                    <button
                      onClick={() => setShowLogModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-red text-white rounded-lg text-xs font-semibold hover:bg-brand-red-dark"
                    >
                      <Plus size={14} /> Log Test
                    </button>
                  </div>

                  {loadingTests ? (
                    <div className="text-sm text-brand-ink-muted">Loading…</div>
                  ) : tests.length === 0 ? (
                    <div className="text-center py-10 text-brand-ink-muted">
                      <ClipboardList size={32} className="mx-auto mb-2 text-brand-ink-faint" />
                      <p className="text-sm">No tests recorded yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {tests.map((test, i) => {
                        const isPassed = test.outcome === 'pass';
                        const dur = test.testType === 'monthly' && test.durationSecs != null
                          ? `${test.durationSecs}s`
                          : test.durationMins != null
                          ? `${test.durationMins} min`
                          : null;
                        return (
                          <div key={test.id} className={`flex items-start gap-3 py-2.5 ${i < tests.length - 1 ? 'border-b border-brand-line/60' : ''}`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isPassed ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {isPassed ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[13px] font-semibold ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
                                {TEST_TYPE_LABELS[test.testType] ?? test.testType}
                              </div>
                              <div className="text-xs text-brand-ink-muted mt-0.5">
                                by {test.testedBy}
                                {dur && ` · Duration: ${dur}`}
                                {test.luxReading != null && ` · Lux: ${test.luxReading} lx`}
                                {test.defectsFound && ` · ${test.defectsFound}`}
                              </div>
                              {test.comments && <p className="text-xs text-brand-ink-faint mt-0.5">{test.comments}</p>}
                            </div>
                            <div className="text-[11px] text-brand-ink-faint text-right shrink-0 tabular-nums leading-snug">
                              {fmt(test.testedAt)}
                              {test.nextTestDate && <><br />Next due: {fmt(test.nextTestDate)}</>}
                              <button
                                onClick={() => handleDeleteTest(test.id)}
                                className="block ml-auto mt-1 text-red-300 hover:text-red-500"
                                title="Delete test"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <form onSubmit={handleSaveDetails} className="max-w-md space-y-4">
                  <h3 className="font-medium text-brand-ink mb-4">Luminaire Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ref / ID</label>
                      <input className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={detailForm.luminaireRef ?? ''} onChange={e => setDetailForm(f => ({ ...f, luminaireRef: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Luminaire Type</label>
                      <select className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={detailForm.luminaireType ?? 'escape_route'} onChange={e => setDetailForm(f => ({ ...f, luminaireType: e.target.value }))}>
                        <option value="escape_route">Escape Route</option>
                        <option value="open_area">Open Area</option>
                        <option value="high_risk">High Risk</option>
                        <option value="stairwell">Stairwell</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={detailForm.description ?? ''} onChange={e => setDetailForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={detailForm.location ?? ''} onChange={e => setDetailForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fitting Type</label>
                      <select className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={detailForm.fittingType ?? 'self_contained'} onChange={e => setDetailForm(f => ({ ...f, fittingType: e.target.value }))}>
                        <option value="self_contained">Self-Contained</option>
                        <option value="central_battery">Central Battery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zone / Circuit</label>
                      <input className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={detailForm.zone ?? ''} onChange={e => setDetailForm(f => ({ ...f, zone: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3}
                      value={detailForm.notes ?? ''} onChange={e => setDetailForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={savingDetail} className="px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-brand-red-dark disabled:opacity-50">
                    {savingDetail ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </main>

      {showAddModal && (
        <AddLuminaireModal sites={sites} onClose={() => setShowAddModal(false)} onSave={handleAddLuminaire} />
      )}
      {showLogModal && selectedLuminaire && (
        <LogTestModal luminaire={selectedLuminaire} onClose={() => setShowLogModal(false)} onSave={handleLogTest} />
      )}
    </div>
  );
};

export default EmergencyLightingPage;
