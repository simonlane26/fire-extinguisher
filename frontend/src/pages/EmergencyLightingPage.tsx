import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Plus, Trash2, ClipboardList, Settings, AlertTriangle, CheckCircle,
  Clock, Lightbulb, X, ChevronRight, Upload, Download,
} from 'lucide-react';
import {
  elGetLuminaires, elCreateLuminaire, elUpdateLuminaire, elDeleteLuminaire,
  elGetTests, elCreateTest, elDeleteTest, fetchSites, importELCsv,
} from '../lib/api';
import type { EmergencyLuminaire, EmergencyLightTest, Site } from '../types';

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
  const latestFailed = (l: EmergencyLuminaire) => l.tests?.[0]?.outcome === 'fail';
  const getStatus = (l: EmergencyLuminaire) => elStatus(l).label;
  const total       = luminaires.length;
  const failed      = luminaires.filter(l => latestFailed(l)).length;
  const compliant   = luminaires.filter(l => !latestFailed(l) && getStatus(l) === 'Compliant').length;
  const dueSoon     = luminaires.filter(l => !latestFailed(l) && getStatus(l) === 'Due Soon').length;
  const overdue     = luminaires.filter(l => !latestFailed(l) && getStatus(l) === 'Overdue').length;

  const nextAnnual = luminaires
    .filter(l => l.nextAnnualDue && new Date(l.nextAnnualDue).getTime() > Date.now())
    .sort((a, b) => new Date(a.nextAnnualDue!).getTime() - new Date(b.nextAnnualDue!).getTime())[0];
  const nextMonthly = luminaires
    .filter(l => l.nextMonthlyDue && new Date(l.nextMonthlyDue).getTime() > Date.now())
    .sort((a, b) => new Date(a.nextMonthlyDue!).getTime() - new Date(b.nextMonthlyDue!).getTime())[0];

  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <CheckCircle size={14} className="text-amber-600" /> Emergency Lighting Compliance
          </h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="text-gray-500">Total fittings: <span className="font-semibold text-gray-800">{total}</span></div>
            <div className="flex items-center gap-1.5 text-green-700"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Compliant: <span className="font-semibold">{compliant}</span></div>
            {dueSoon > 0 && <div className="flex items-center gap-1.5 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />Due Soon: <span className="font-semibold">{dueSoon}</span></div>}
            {overdue > 0 && <div className="flex items-center gap-1.5 text-red-700"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Overdue: <span className="font-semibold">{overdue}</span></div>}
            {failed > 0 && <div className="flex items-center gap-1.5 text-orange-800"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />Failed: <span className="font-semibold">{failed}</span></div>}
          </div>
        </div>
        <div className="flex gap-3">
          {nextMonthly && (
            <div className="text-sm text-gray-500 bg-gray-50 border rounded-lg px-3 py-2 min-w-[150px]">
              <div className="text-xs text-gray-400 mb-0.5">Next Monthly Test</div>
              <div className="font-semibold text-gray-800">{fmt(nextMonthly.nextMonthlyDue)}</div>
              <div className="text-xs text-gray-400 truncate max-w-[140px]">{nextMonthly.luminaireRef}</div>
            </div>
          )}
          {nextAnnual && (
            <div className="text-sm text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 min-w-[150px]">
              <div className="text-xs text-amber-600 mb-0.5">Next Annual Discharge</div>
              <div className="font-semibold text-gray-800">{fmt(nextAnnual.nextAnnualDue)}</div>
              <div className="text-xs text-gray-400 truncate max-w-[140px]">{nextAnnual.luminaireRef}</div>
            </div>
          )}
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
            <Lightbulb size={18} className="text-amber-500" /> Add Luminaire
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
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
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
            <ClipboardList size={18} className="text-amber-600" /> Log Test
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-5 py-3 bg-amber-50 border-b text-sm text-amber-800">
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
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
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

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Compliance summary */}
      {!loading && luminaires.length > 0 && <ELComplianceCard luminaires={luminaires} />}

      <div className="flex flex-1 overflow-hidden">
      {/* Left panel */}
      <div className="w-72 shrink-0 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-500" /> Emergency Lighting
            </h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-xs bg-amber-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-amber-700"
              title="Add Luminaire"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <a href="/el-import-template.csv" download className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50">
              <Download size={12} /> Template
            </a>
            <button onClick={() => elImportRef.current?.click()} disabled={elImporting} className="flex-1 flex items-center justify-center gap-1 text-xs bg-amber-100 text-amber-700 border border-amber-300 px-2 py-1.5 rounded-lg hover:bg-amber-200 disabled:opacity-50">
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
            className="w-full border rounded-lg px-2 py-1.5 text-sm text-gray-700"
          >
            <option value="all">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-gray-400 text-center">Loading…</div>
          ) : luminaires.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">
              <Lightbulb size={32} className="mx-auto mb-2 text-gray-300" />
              No luminaires registered
            </div>
          ) : (
            luminaires.map(lum => {
              const isSelected = selectedLuminaire?.id === lum.id;
              const monthly = testTypeStatus(lum.nextMonthlyDue);
              const annual  = testTypeStatus(lum.nextAnnualDue);
              const hasFail = lum.tests?.[0]?.outcome === 'fail';
              return (
                <button
                  key={lum.id}
                  onClick={() => selectLuminaire(lum)}
                  className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition-colors ${isSelected ? 'bg-amber-50 border-l-2 border-l-amber-500' : ''}`}
                >
                  <div className="font-medium text-sm text-gray-900 truncate mb-0.5">{lum.luminaireRef}</div>
                  <div className="text-xs text-gray-500 truncate mb-1.5">{lum.description} · {lum.location}</div>
                  {hasFail ? (
                    <div className="flex items-center gap-1 text-xs text-orange-700 font-medium">
                      <AlertTriangle size={10} /> Non Compliant — test failed
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className={`flex items-center justify-between text-xs ${monthly.cls}`}>
                        <span className="text-gray-500">Monthly</span>
                        <span className="flex items-center gap-1">{monthly.tick} {monthly.label}</span>
                      </div>
                      <div className={`flex items-center justify-between text-xs ${annual.cls}`}>
                        <span className="text-gray-500">Annual</span>
                        <span className="flex items-center gap-1">{annual.tick} {annual.label}</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedLuminaire ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Lightbulb size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Select a luminaire to view details</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedLuminaire.luminaireRef}</h2>
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="text-gray-600 text-sm">{selectedLuminaire.description}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>{selectedLuminaire.location}</span>
                  {selectedLuminaire.luminaireType && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                      {LUMINAIRE_TYPE_LABELS[selectedLuminaire.luminaireType] ?? selectedLuminaire.luminaireType}
                    </span>
                  )}
                  {selectedLuminaire.site && <span>{selectedLuminaire.site.name}</span>}
                  {selectedLuminaire.zone && <span>Zone: {selectedLuminaire.zone}</span>}
                </div>
                <div className="mt-1.5 flex gap-3 text-xs text-gray-400">
                  <span>Last tested: {fmt(selectedLuminaire.lastTestedAt)}</span>
                  <span>Monthly due: {fmt(selectedLuminaire.nextMonthlyDue)}</span>
                  <span>Annual due: {fmt(selectedLuminaire.nextAnnualDue)}</span>
                </div>
              </div>
              <button
                onClick={handleDeleteLuminaire}
                className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete luminaire"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b px-6 flex gap-1">
              {(['history', 'details'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab ? 'border-amber-500 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'history' ? <><ClipboardList size={14} className="inline mr-1.5" />Test History</> : <><Settings size={14} className="inline mr-1.5" />Luminaire Details</>}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'history' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Test History</h3>
                    <button
                      onClick={() => setShowLogModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
                    >
                      <Plus size={14} /> Log Test
                    </button>
                  </div>

                  {loadingTests ? (
                    <div className="text-sm text-gray-400">Loading…</div>
                  ) : tests.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <ClipboardList size={32} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No tests recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tests.map(test => {
                        const isPassed = test.outcome === 'pass';
                        const dur = test.testType === 'monthly' && test.durationSecs != null
                          ? `${test.durationSecs}s`
                          : test.durationMins != null
                          ? `${test.durationMins} min`
                          : null;
                        return (
                          <div key={test.id} className="bg-white border rounded-lg p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3 min-w-0">
                                <span className={`shrink-0 mt-0.5 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                                  isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {isPassed ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
                                  {isPassed ? 'PASS' : 'FAIL'}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-gray-900">
                                      {TEST_TYPE_LABELS[test.testType] ?? test.testType}
                                    </span>
                                    <span className="text-xs text-gray-400">{fmt(test.testedAt)}</span>
                                    <span className="text-xs text-gray-500">by {test.testedBy}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                                    {dur && <span>Duration: {dur}</span>}
                                    {test.luxReading != null && <span>Lux: {test.luxReading} lx</span>}
                                    {test.nextTestDate && <span>Next due: {fmt(test.nextTestDate)}</span>}
                                  </div>
                                  {test.defectsFound && (
                                    <div className="mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                      Defects: {test.defectsFound}
                                    </div>
                                  )}
                                  {test.comments && <p className="mt-1 text-xs text-gray-400">{test.comments}</p>}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteTest(test.id)}
                                className="shrink-0 p-1.5 text-red-300 hover:text-red-500 rounded"
                                title="Delete test"
                              >
                                <Trash2 size={13} />
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
                  <h3 className="font-medium text-gray-900 mb-4">Luminaire Details</h3>
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
                  <button type="submit" disabled={savingDetail} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
                    {savingDetail ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <AddLuminaireModal sites={sites} onClose={() => setShowAddModal(false)} onSave={handleAddLuminaire} />
      )}
      {showLogModal && selectedLuminaire && (
        <LogTestModal luminaire={selectedLuminaire} onClose={() => setShowLogModal(false)} onSave={handleLogTest} />
      )}
      </div>
    </div>
  );
};

export default EmergencyLightingPage;
