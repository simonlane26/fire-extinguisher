import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, Bell, ChevronRight, Download, FileText, MapPin,
  Plus, RefreshCw, Settings, Trash2, Upload, X, CheckCircle, Clock, Wrench,
} from 'lucide-react';
import {
  faGetSystems, faCreateSystem, faUpdateSystem, faDeleteSystem,
  faGetCallPoints, faGetNextDueCallPoint, faAddCallPoint, faImportCallPoints, faDeleteCallPoint,
  faGetLogEntries, faCreateLogEntry, faDeleteLogEntry, faDownloadCertificate,
  importFireAlarmCsv,
} from '../lib/api';
import { fetchSites } from '../lib/api';
import type { FireAlarmSystem, FireAlarmCallPoint, FireAlarmLogEntry, Site } from '../types';
import ComplianceRing from '../components/ComplianceRing';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type EntryType = FireAlarmLogEntry['entryType'];

const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  weekly:         'Weekly Test',
  monthly:        'Monthly Inspection',
  quarterly:      'Quarterly Inspection',
  six_monthly:    '6-Monthly Inspection',
  annual:         'Annual Inspection',
  non_routine:    'Non-Routine',
  fault:          'Fault',
  engineer_visit: 'Engineer Visit',
};

const CERT_TYPES: EntryType[] = ['quarterly', 'six_monthly', 'annual'];
const INSPECTION_ENTRY_TYPES: EntryType[] = ['weekly', 'monthly', 'quarterly', 'six_monthly', 'annual', 'non_routine'];

function outcomeChip(outcome: string) {
  if (outcome === 'pass') return 'bg-green-100 text-green-700';
  if (outcome === 'advisory') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function complianceStatus(nextDue: string | null | undefined, warnDays: number, toleranceDays: number = 0) {
  if (!nextDue) return { label: 'Not recorded', cls: 'bg-gray-100 text-gray-500' };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(nextDue); due.setHours(0, 0, 0, 0);
  const diff = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  // Past due, but still inside the BS 5839-1-informed tolerance window — not a real breach yet
  if (diff < 0 && diff >= -toleranceDays) return { label: 'Within Tolerance', cls: 'bg-amber-100 text-amber-700' };
  if (diff < -toleranceDays)              return { label: 'Overdue', cls: 'bg-red-100 text-red-700' };
  if (diff <= warnDays)                   return { label: 'Due Soon', cls: 'bg-amber-100 text-amber-700' };
  return { label: 'Compliant', cls: 'bg-green-100 text-green-700' };
}

function toleranceWindow(nextDue: string | null | undefined, toleranceDays: number) {
  if (!nextDue) return null;
  const due = new Date(nextDue);
  const start = new Date(due.getTime() - toleranceDays * 86400000);
  const end = new Date(due.getTime() + toleranceDays * 86400000);
  return { start, end };
}

// Most recent log entry of a given tier's type (e.g. 'weekly'), so the
// Compliance Status tile can reflect a bad test result, not just the
// schedule date — a tier whose latest test failed is not "Compliant" just
// because the next one isn't due yet.
function latestEntryForType(entries: FireAlarmLogEntry[], entryType: EntryType): FireAlarmLogEntry | null {
  const matches = entries.filter(e => e.entryType === entryType);
  if (matches.length === 0) return null;
  return matches.reduce((latest, e) => new Date(e.conductedAt) > new Date(latest.conductedAt) ? e : latest);
}

// Date-based status, overridden when the most recent test for this tier
// logged a fail or advisory outcome (mirrors the fail-overrides-status
// pattern already used by Fire Doors/Emergency Lighting/PAT Testing).
function tierStatus(nextDue: string | null | undefined, warnDays: number, toleranceDays: number, latestEntry: { outcome: string } | null | undefined) {
  const dateStatus = complianceStatus(nextDue, warnDays, toleranceDays);
  if (latestEntry?.outcome === 'fail') {
    return { label: 'Fault Reported', cls: 'bg-red-100 text-red-700' };
  }
  if (latestEntry?.outcome === 'advisory' && dateStatus.label === 'Compliant') {
    return { label: 'Advisory', cls: 'bg-amber-100 text-amber-700' };
  }
  return dateStatus;
}

// Worst-case status across all 5 schedule tiers, for the list row's status
// stripe/badge and the fleet ring — a system is only as compliant as its
// least-compliant tier, and a tier whose latest test failed or was flagged
// advisory counts as not-compliant even if the next test isn't due yet.
function systemStatusKey(system: FireAlarmSystem): 'compliant' | 'attention' | 'overdue' {
  const tiers: { field: string | null | undefined; warnDays: number; toleranceDays: number; entryType: EntryType }[] = [
    { field: system.nextWeeklyDue,     warnDays: 3,  toleranceDays: system.weeklyToleranceDays ?? 2,      entryType: 'weekly' },
    { field: system.nextMonthlyDue,    warnDays: 7,  toleranceDays: system.monthlyToleranceDays ?? 5,     entryType: 'monthly' },
    { field: system.nextQuarterlyDue,  warnDays: 14, toleranceDays: system.quarterlyToleranceDays ?? 15,  entryType: 'quarterly' },
    { field: system.nextSixMonthlyDue, warnDays: 21, toleranceDays: system.sixMonthlyToleranceDays ?? 30, entryType: 'six_monthly' },
    { field: system.nextAnnualDue,     warnDays: 30, toleranceDays: system.annualToleranceDays ?? 60,     entryType: 'annual' },
  ];
  const labels = tiers.map(t => {
    const latest = system.latestEntriesByType?.find(e => e.entryType === t.entryType);
    return tierStatus(t.field, t.warnDays, t.toleranceDays, latest).label;
  });
  if (labels.includes('Overdue') || labels.includes('Fault Reported')) return 'overdue';
  if (labels.includes('Within Tolerance') || labels.includes('Due Soon') || labels.includes('Advisory')) return 'attention';
  return 'compliant';
}

const SYS_STRIPE_CLS: Record<string, string> = {
  compliant: 'bg-green-500',
  attention: 'bg-amber-500',
  overdue: 'bg-red-500',
};

function nearestDueDate(system: FireAlarmSystem): string | null {
  const dates = [system.nextWeeklyDue, system.nextMonthlyDue, system.nextQuarterlyDue, system.nextSixMonthlyDue, system.nextAnnualDue]
    .filter((d): d is string => !!d)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  return dates[0] ?? null;
}

// ─── Modal base ───────────────────────────────────────────────────────────────

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

// ─── Compliance Card ──────────────────────────────────────────────────────────

const ComplianceCard: React.FC<{ system: FireAlarmSystem; entries: FireAlarmLogEntry[] }> = ({ system, entries }) => {
  const items: { label: string; field: string | null | undefined; warnDays: number; toleranceDays: number; entryType: EntryType }[] = [
    { label: 'Weekly',      field: system.nextWeeklyDue,      warnDays: 3,  toleranceDays: system.weeklyToleranceDays ?? 2,      entryType: 'weekly' },
    { label: 'Monthly',     field: system.nextMonthlyDue,     warnDays: 7,  toleranceDays: system.monthlyToleranceDays ?? 5,     entryType: 'monthly' },
    { label: 'Quarterly',   field: system.nextQuarterlyDue,   warnDays: 14, toleranceDays: system.quarterlyToleranceDays ?? 15,  entryType: 'quarterly' },
    { label: 'Six-Monthly', field: system.nextSixMonthlyDue,  warnDays: 21, toleranceDays: system.sixMonthlyToleranceDays ?? 30, entryType: 'six_monthly' },
    { label: 'Annual',      field: system.nextAnnualDue,      warnDays: 30, toleranceDays: system.annualToleranceDays ?? 60,     entryType: 'annual' },
  ];
  return (
    <div className="bg-white rounded-xl border border-brand-line px-5 py-4 mb-5">
      <h3 className="font-semibold text-brand-ink text-sm mb-3 flex items-center gap-1.5">
        <CheckCircle size={14} className="text-brand-red" /> Compliance Status
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {items.map(item => {
          const latestEntry = latestEntryForType(entries, item.entryType);
          const status = tierStatus(item.field, item.warnDays, item.toleranceDays, latestEntry);
          const window = item.field ? toleranceWindow(item.field, item.toleranceDays) : null;
          const flaggedByEntry = latestEntry && (latestEntry.outcome === 'fail' || latestEntry.outcome === 'advisory') && status.label !== 'Overdue';
          const title = flaggedByEntry
            ? `${ENTRY_TYPE_LABELS[item.entryType]} on ${fmtDate(latestEntry!.conductedAt)}: ${latestEntry!.outcome}${latestEntry!.notes ? ` — ${latestEntry!.notes}` : ''}`
            : window
              ? `Acceptable window: ${fmtDate(window.start.toISOString())} – ${fmtDate(window.end.toISOString())}`
              : undefined;
          return (
            <div key={item.label} className="text-center p-2 bg-brand-bg rounded-lg" title={title}>
              <div className="text-xs font-semibold text-brand-ink-muted mb-1.5">{item.label}</div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                {status.label}
              </span>
              {flaggedByEntry ? (
                <div className="text-xs text-red-600 mt-1 leading-tight tabular-nums">
                  {fmtDate(latestEntry!.conductedAt)}
                </div>
              ) : item.field ? (
                <div className="text-xs text-brand-ink-faint mt-1 leading-tight tabular-nums">
                  Next<br />{fmtDate(item.field)}
                  {status.label === 'Within Tolerance' && window && (
                    <><br /><span className="text-amber-600">until {fmtDate(window.end.toISOString())}</span></>
                  )}
                </div>
              ) : (
                <div className="text-xs text-brand-ink-faint mt-1">—</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Fleet-wide summary, matching the compliance ring on the other three module
// pages — "how compliant is my whole set of systems", not just the one
// selected below. A system's overall status is the worst of its 5 tiers
// (systemStatusKey), since "compliant" has to mean every tier is in order.
const FleetComplianceCard: React.FC<{ systems: FireAlarmSystem[] }> = ({ systems }) => {
  const total     = systems.length;
  const compliant = systems.filter(s => systemStatusKey(s) === 'compliant').length;
  const attention = systems.filter(s => systemStatusKey(s) === 'attention').length;
  const overdue   = systems.filter(s => systemStatusKey(s) === 'overdue').length;
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
          <div className="text-[11px] text-brand-ink-muted mt-1">Total systems</div>
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

// ─── Add System Modal ─────────────────────────────────────────────────────────

const AddSystemModal: React.FC<{
  sites: Site[];
  onSave: (data: Record<string, string>) => Promise<void>;
  onClose: () => void;
}> = ({ sites, onSave, onClose }) => {
  const [form, setForm] = useState({ siteId: sites[0]?.id ?? '', systemRef: '', name: '', panelMake: '', panelModel: '', panelSerial: '', arcCompany: '', arcNumber: '', installDate: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.siteId || !form.systemRef.trim()) { setErr('Site and System ID are required'); return; }
    setSaving(true); setErr('');
    try { await onSave(form); onClose(); }
    catch (ex) { setErr(ex instanceof Error ? ex.message : 'Failed to save'); }
    finally { setSaving(false); }
  }

  return (
    <Modal title="Add Fire Alarm System" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {err && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{err}</p>}
        <div>
          <label className="text-xs font-medium text-gray-600">Site *</label>
          <select value={form.siteId} onChange={e => set('siteId', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">System ID / Ref *</label>
            <input value={form.systemRef} onChange={e => set('systemRef', e.target.value)} placeholder="e.g. FAP-01" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Name (optional)</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Main Panel" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Panel Make</label>
            <input value={form.panelMake} onChange={e => set('panelMake', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Panel Model</label>
            <input value={form.panelModel} onChange={e => set('panelModel', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Panel Serial</label>
            <input value={form.panelSerial} onChange={e => set('panelSerial', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">ARC Company</label>
            <input value={form.arcCompany} onChange={e => set('arcCompany', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">ARC Number</label>
            <input value={form.arcNumber} onChange={e => set('arcNumber', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Install Date</label>
          <input type="date" value={form.installDate} onChange={e => set('installDate', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark disabled:opacity-50">
            {saving ? 'Saving…' : 'Add System'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Fault Log Modal ──────────────────────────────────────────────────────────

const FaultLogModal: React.FC<{
  onSave: (dto: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}> = ({ onSave, onClose }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [reportedBy, setReportedBy] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('minor');
  const [remedialAction, setRemedialAction] = useState('');
  const [resolved, setResolved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reportedBy.trim()) { setErr('Reported by is required'); return; }
    if (!description.trim()) { setErr('Description is required'); return; }
    setSaving(true); setErr('');
    try {
      await onSave({
        entryType: 'fault',
        conductedBy: reportedBy,
        conductedAt: date,
        outcome: severity === 'critical' ? 'fail' : 'advisory',
        notes: description,
        data: { severity, remedialAction, resolved },
      });
      onClose();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Log Fault" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {err && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{err}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Reported By *</label>
            <input value={reportedBy} onChange={e => setReportedBy(e.target.value)} placeholder="Name" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Severity</label>
          <div className="flex gap-2 mt-1">
            {(['minor', 'major', 'critical'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSeverity(s)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
                  severity === s
                    ? s === 'minor' ? 'bg-amber-500 text-white border-amber-500'
                      : s === 'major' ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-brand-red text-white border-brand-red'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Description *</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none" required />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Remedial Action Taken</label>
          <textarea value={remedialAction} onChange={e => setRemedialAction(e.target.value)} rows={2} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="resolved" checked={resolved} onChange={e => setResolved(e.target.checked)} className="rounded" />
          <label htmlFor="resolved" className="text-sm text-gray-700">Mark as resolved</label>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark disabled:opacity-50">
            {saving ? 'Saving…' : 'Log Fault'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Engineer Visit Modal ─────────────────────────────────────────────────────

const EngineerVisitModal: React.FC<{
  onSave: (dto: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}> = ({ onSave, onClose }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [engineerName, setEngineerName] = useState('');
  const [company, setCompany] = useState('');
  const [workCarriedOut, setWorkCarriedOut] = useState('');
  const [outcome, setOutcome] = useState<'pass' | 'fail' | 'advisory'>('pass');
  const [nextAction, setNextAction] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!engineerName.trim()) { setErr('Engineer name is required'); return; }
    setSaving(true); setErr('');
    try {
      await onSave({
        entryType: 'engineer_visit',
        conductedBy: engineerName,
        conductedAt: date,
        outcome,
        notes: workCarriedOut,
        data: { company, nextAction },
      });
      onClose();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Log Engineer Visit" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {err && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{err}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Engineer Name *</label>
            <input value={engineerName} onChange={e => setEngineerName(e.target.value)} placeholder="Engineer name" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Company</label>
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Engineering company" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Work Carried Out</label>
          <textarea value={workCarriedOut} onChange={e => setWorkCarriedOut(e.target.value)} rows={3} placeholder="Describe the work performed" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Outcome</label>
          <div className="flex gap-2 mt-1">
            {(['pass', 'advisory', 'fail'] as const).map(o => (
              <button
                key={o}
                type="button"
                onClick={() => setOutcome(o)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  outcome === o
                    ? o === 'pass' ? 'bg-green-600 text-white border-green-600'
                      : o === 'advisory' ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-brand-red text-white border-brand-red'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Next Recommended Action</label>
          <textarea value={nextAction} onChange={e => setNextAction(e.target.value)} rows={2} placeholder="e.g. Replace battery in 6 months" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark disabled:opacity-50">
            {saving ? 'Saving…' : 'Log Visit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Add Log Entry Modal ──────────────────────────────────────────────────────

const WEEKLY_FIELDS = [
  { key: 'alarmActivated', label: 'Alarm activated correctly', type: 'bool' },
  { key: 'zoneCorrect', label: 'Correct zone indicated on panel', type: 'bool' },
  { key: 'resetOk', label: 'System reset successfully', type: 'bool' },
  { key: 'faultsFound', label: 'Any faults found', type: 'bool' },
];
const MONTHLY_FIELDS = [
  { key: 'panelVisualOk', label: 'Panel visual inspection OK', type: 'bool' },
  { key: 'batteryChargeOk', label: 'Battery charge indicator OK', type: 'bool' },
  { key: 'controlFunctionsTested', label: 'Control functions tested', type: 'bool' },
  { key: 'logbookUpToDate', label: 'Logbook up to date', type: 'bool' },
  { key: 'faultsFound', label: 'Any faults found', type: 'bool' },
];
const QUARTERLY_FIELDS = [
  { key: 'certificateNumber', label: 'Certificate Number', type: 'text' },
  { key: 'allZonesTested', label: 'All zones tested', type: 'bool' },
  { key: 'batteryLoadTested', label: 'Battery load tested', type: 'bool' },
  { key: 'chargerOutputTested', label: 'Charger output tested', type: 'bool' },
  { key: 'controlEquipmentChecked', label: 'Control equipment checked', type: 'bool' },
  { key: 'faultCircuitsChecked', label: 'Fault warning circuits checked', type: 'bool' },
  { key: 'labellingOk', label: 'Labelling/signage adequate', type: 'bool' },
  { key: 'causeAndEffectOk', label: 'Cause and effect tested', type: 'bool' },
  { key: 'faultsFound', label: 'Any defects found', type: 'bool' },
];
const SIX_MONTHLY_FIELDS = [
  ...QUARTERLY_FIELDS,
  { key: 'callPointsSampled', label: 'Call points sampled (%)', type: 'text' },
  { key: 'detectorsSampled', label: 'Detectors sampled (%)', type: 'text' },
  { key: 'arcNotified', label: 'ARC notified before/after', type: 'bool' },
];
const ANNUAL_FIELDS = [
  ...SIX_MONTHLY_FIELDS,
  { key: 'allCallPointsTested', label: 'All call points tested', type: 'bool' },
  { key: 'allDetectorsTested', label: 'All detectors tested', type: 'bool' },
  { key: 'cableIntegrityChecked', label: 'Cable integrity checked', type: 'bool' },
  { key: 'earthFaultChecked', label: 'Earth fault loop impedance tested', type: 'bool' },
  { key: 'maintenanceContractInPlace', label: 'Maintenance contract in place', type: 'bool' },
];

const ENTRY_EXTRA_FIELDS: Partial<Record<EntryType, typeof WEEKLY_FIELDS>> = {
  weekly:      WEEKLY_FIELDS,
  monthly:     MONTHLY_FIELDS,
  quarterly:   QUARTERLY_FIELDS,
  six_monthly: SIX_MONTHLY_FIELDS,
  annual:      ANNUAL_FIELDS,
  non_routine: [],
};

const AddLogEntryModal: React.FC<{
  callPoints: FireAlarmCallPoint[];
  nextDueId: string | null;
  onSave: (dto: Record<string, unknown>) => Promise<FireAlarmLogEntry>;
  onClose: () => void;
  onDownloadCert: (id: string) => void;
}> = ({ callPoints, nextDueId, onSave, onClose, onDownloadCert }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [entryType, setEntryType] = useState<EntryType>('weekly');
  const [conductedBy, setConductedBy] = useState('');
  const [conductedAt, setConductedAt] = useState(today);
  const [outcome, setOutcome] = useState<'pass' | 'fail' | 'advisory'>('pass');
  const [notes, setNotes] = useState('');
  const [callPointId, setCallPointId] = useState(nextDueId ?? '');
  const [extra, setExtra] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [savedEntry, setSavedEntry] = useState<FireAlarmLogEntry | null>(null);

  const fields = ENTRY_EXTRA_FIELDS[entryType] ?? [];

  function setExtraField(key: string, val: unknown) {
    setExtra(e => ({ ...e, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!conductedBy.trim()) { setErr('Conducted by is required'); return; }
    setSaving(true); setErr('');
    try {
      const dto: Record<string, unknown> = {
        entryType, conductedBy, conductedAt, outcome, notes,
        data: extra,
        ...(entryType === 'weekly' && callPointId ? { callPointId } : {}),
      };
      const entry = await onSave(dto);
      if (CERT_TYPES.includes(entryType)) {
        setSavedEntry(entry);
      } else {
        onClose();
      }
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (savedEntry) {
    return (
      <Modal title="Entry Saved" onClose={onClose}>
        <div className="text-center py-4 space-y-4">
          <CheckCircle size={40} className="text-green-500 mx-auto" />
          <p className="text-gray-700 font-medium">{ENTRY_TYPE_LABELS[entryType]} logged successfully.</p>
          <p className="text-sm text-gray-500">A certificate is available for this inspection.</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => onDownloadCert(savedEntry.id)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            >
              <Download size={14} /> Download Certificate
            </button>
            <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Close</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Add Log Entry" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {err && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{err}</p>}

        <div>
          <label className="text-xs font-medium text-gray-600">Inspection Type</label>
          <select value={entryType} onChange={e => { setEntryType(e.target.value as EntryType); setExtra({}); }} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
            {INSPECTION_ENTRY_TYPES.map(k => (
              <option key={k} value={k}>{ENTRY_TYPE_LABELS[k]}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
            <input type="date" value={conductedAt} onChange={e => setConductedAt(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Conducted By</label>
            <input value={conductedBy} onChange={e => setConductedBy(e.target.value)} placeholder="Engineer name" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
        </div>

        {entryType === 'weekly' && callPoints.length > 0 && (
          <div>
            <label className="text-xs font-medium text-gray-600">Call Point Tested</label>
            <select value={callPointId} onChange={e => setCallPointId(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">— none / not recorded —</option>
              {callPoints.map(cp => (
                <option key={cp.id} value={cp.id}>
                  {cp.pointRef}{cp.location ? ` — ${cp.location}` : ''}{cp.zone ? ` (Zone ${cp.zone})` : ''}
                  {cp.id === nextDueId ? ' ★ Next due' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {fields.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Checklist</p>
            {fields.map(f => (
              <div key={f.key} className="flex items-center justify-between">
                <label className="text-sm text-gray-700">{f.label}</label>
                {f.type === 'bool' ? (
                  <select
                    value={extra[f.key] === undefined ? '' : extra[f.key] ? 'yes' : 'no'}
                    onChange={e => setExtraField(f.key, e.target.value === 'yes')}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    <option value="">—</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <input
                    value={(extra[f.key] as string) ?? ''}
                    onChange={e => setExtraField(f.key, e.target.value)}
                    className="border rounded px-2 py-1 text-xs w-32"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600">Outcome</label>
          <div className="flex gap-2 mt-1">
            {(['pass', 'advisory', 'fail'] as const).map(o => (
              <button
                key={o}
                type="button"
                onClick={() => setOutcome(o)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  outcome === o
                    ? o === 'pass' ? 'bg-green-600 text-white border-green-600'
                      : o === 'advisory' ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-brand-red text-white border-brand-red'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Notes{entryType === 'non_routine' ? ' / Description' : ''}</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none" />
        </div>

        {CERT_TYPES.includes(entryType) && (
          <p className="text-xs text-indigo-600 bg-indigo-50 p-2 rounded-lg">
            A PDF certificate will be available to download after saving.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Add Call Point Modal ─────────────────────────────────────────────────────

const AddCallPointModal: React.FC<{
  onSave: (dto: { pointRef: string; location?: string; floor?: string; zone?: string }) => Promise<void>;
  onClose: () => void;
}> = ({ onSave, onClose }) => {
  const [form, setForm] = useState({ pointRef: '', location: '', floor: '', zone: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.pointRef.trim()) { setErr('Point reference is required'); return; }
    setSaving(true); setErr('');
    try { await onSave(form); onClose(); }
    catch (ex) { setErr(ex instanceof Error ? ex.message : 'Failed to save'); }
    finally { setSaving(false); }
  }

  return (
    <Modal title="Add Call Point" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        {err && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{err}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Point Ref *</label>
            <input value={form.pointRef} onChange={e => set('pointRef', e.target.value)} placeholder="e.g. CP-001" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Zone</label>
            <input value={form.zone} onChange={e => set('zone', e.target.value)} placeholder="e.g. Zone 1" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Location</label>
            <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Reception" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Floor</label>
            <input value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="e.g. Ground" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark disabled:opacity-50">
            {saving ? 'Saving…' : 'Add Call Point'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'log' | 'callpoints' | 'faults' | 'engineer' | 'details';

const FireAlarmLogbookPage: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [systems, setSystems] = useState<FireAlarmSystem[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('log');
  const [allLogEntries, setAllLogEntries] = useState<FireAlarmLogEntry[]>([]);
  const [callPoints, setCallPoints] = useState<FireAlarmCallPoint[]>([]);
  const [nextDueId, setNextDueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);
  const [cpLoading, setCpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showAddCp, setShowAddCp] = useState(false);
  const [showFaultModal, setShowFaultModal] = useState(false);
  const [showEngineerModal, setShowEngineerModal] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState<string | null>(null);
  const [deletingCp, setDeletingCp] = useState<string | null>(null);
  const [certDownloading, setCertDownloading] = useState<string | null>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const [csvImporting, setCsvImporting] = useState(false);
  const faSystemImportRef = useRef<HTMLInputElement>(null);
  const [faSystemImporting, setFaSystemImporting] = useState(false);
  const [faSystemImportResult, setFaSystemImportResult] = useState<{ imported: number; errors: number } | null>(null);

  const selectedSystem = systems.find(s => s.id === selectedSystemId) ?? null;
  const inspectionEntries = allLogEntries.filter(e => INSPECTION_ENTRY_TYPES.includes(e.entryType));
  const faultEntries = allLogEntries.filter(e => e.entryType === 'fault');
  const engineerEntries = allLogEntries.filter(e => e.entryType === 'engineer_visit');
  const nextDueCp = callPoints.find(c => c.id === nextDueId) ?? null;

  // Load sites + systems on mount
  useEffect(() => {
    async function load() {
      setLoading(true); setError(null);
      try {
        const [siteList, sysList] = await Promise.all([fetchSites(), faGetSystems()]);
        setSites(siteList);
        setSystems(sysList);
        if (sysList.length > 0 && !selectedSystemId) {
          setSelectedSystemId(sysList[0].id);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Load all log entries when system changes
  useEffect(() => {
    if (!selectedSystemId) return;
    setLogLoading(true);
    faGetLogEntries(selectedSystemId)
      .then(setAllLogEntries)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load log'))
      .finally(() => setLogLoading(false));
  }, [selectedSystemId]);

  // Load call points when system changes
  useEffect(() => {
    if (!selectedSystemId) return;
    setCpLoading(true);
    Promise.all([faGetCallPoints(selectedSystemId), faGetNextDueCallPoint(selectedSystemId)])
      .then(([cps, nextDue]) => {
        setCallPoints(cps);
        setNextDueId(nextDue?.id ?? null);
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load call points'))
      .finally(() => setCpLoading(false));
  }, [selectedSystemId]);

  async function refreshSystems() {
    try {
      const sysList = await faGetSystems();
      setSystems(sysList);
    } catch { /* non-critical */ }
  }

  async function handleCreateSystem(data: Record<string, string>) {
    const sys = await faCreateSystem(data as any);
    setSystems(prev => [...prev, sys]);
    setSelectedSystemId(sys.id);
  }

  async function handleCreateEntry(dto: Record<string, unknown>) {
    const entry = await faCreateLogEntry(selectedSystemId!, dto as any);
    setAllLogEntries(prev => [entry, ...prev]);
    // Refresh system to pick up updated nextXxxDue
    refreshSystems();
    return entry;
  }

  async function handleDeleteEntry(id: string) {
    if (!confirm('Delete this log entry?')) return;
    setDeletingEntry(id);
    try {
      await faDeleteLogEntry(id);
      setAllLogEntries(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setDeletingEntry(null);
    }
  }

  async function handleAddCallPoint(dto: { pointRef: string; location?: string; floor?: string; zone?: string }) {
    const cp = await faAddCallPoint(selectedSystemId!, dto);
    setCallPoints(prev => [...prev, cp]);
  }

  async function handleDeleteCp(id: string) {
    if (!confirm('Delete this call point?')) return;
    setDeletingCp(id);
    try {
      await faDeleteCallPoint(id);
      setCallPoints(prev => prev.filter(c => c.id !== id));
      if (nextDueId === id) {
        const nd = await faGetNextDueCallPoint(selectedSystemId!);
        setNextDueId(nd?.id ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setDeletingCp(null);
    }
  }

  async function handleDownloadCert(entryId: string) {
    setCertDownloading(entryId);
    try {
      await faDownloadCertificate(entryId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to download certificate');
    } finally {
      setCertDownloading(null);
    }
  }

  async function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedSystemId) return;
    setCsvImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => {
        const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
        const row: Record<string, string> = {};
        header.forEach((h, i) => { row[h] = cols[i] ?? ''; });
        return {
          pointRef: row['pointref'] || row['point ref'] || row['point_ref'] || row['ref'] || '',
          location: row['location'] || undefined,
          floor: row['floor'] || undefined,
          zone: row['zone'] || undefined,
        };
      }).filter(r => r.pointRef);

      if (rows.length === 0) throw new Error('No valid rows found in CSV. Expected columns: pointRef, location, floor, zone');

      const result = await faImportCallPoints(selectedSystemId, rows);
      const cps = await faGetCallPoints(selectedSystemId);
      setCallPoints(cps);
      alert(`Imported ${result.count} call points.`);
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'CSV import failed');
    } finally {
      setCsvImporting(false);
      if (csvRef.current) csvRef.current.value = '';
    }
  }

  async function handleSystemCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setFaSystemImporting(true);
      setFaSystemImportResult(null);
      const result = await importFireAlarmCsv(file);
      setFaSystemImportResult({ imported: result.imported, errors: result.errors });
      if (result.imported > 0) {
        const sysList = await faGetSystems();
        setSystems(sysList);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'System CSV import failed');
    } finally {
      setFaSystemImporting(false);
      if (faSystemImportRef.current) faSystemImportRef.current.value = '';
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-brand-ink-muted">Loading…</div>;
  }

  const filteredSystems = systems.filter(sys => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const site = sites.find(s => s.id === sys.siteId);
    return sys.systemRef.toLowerCase().includes(q) || (sys.name ?? '').toLowerCase().includes(q) || (site?.name ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="flex h-full min-h-screen bg-brand-bg">
      {error && (
        <div className="fixed top-4 right-4 z-50 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 shadow-lg">
          <AlertTriangle size={14} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      {systems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl border border-brand-line p-12 text-center">
            <Bell size={40} className="mx-auto text-brand-ink-faint mb-3" />
            <h2 className="font-semibold text-brand-ink mb-1">No fire alarm systems yet</h2>
            <p className="text-sm text-brand-ink-muted mb-4">Add your first fire alarm system to start the logbook.</p>
            <button
              onClick={() => setShowAddSystem(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg text-sm hover:bg-brand-red-dark"
            >
              <Plus size={14} /> Add System
            </button>
          </div>
        </div>
      ) : (
        <>
        {/* List panel */}
        <aside className="w-80 shrink-0 border-r border-brand-line bg-white flex flex-col">
          <div className="p-4 border-b border-brand-line">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[13px] font-semibold text-brand-ink">Fire Alarm Systems</span>
                <span className="text-xs text-brand-ink-muted"> · {systems.length} system{systems.length === 1 ? '' : 's'}</span>
              </div>
              <button
                onClick={() => setShowAddSystem(true)}
                className="flex items-center gap-1 text-xs font-medium bg-brand-red text-white px-2.5 py-1.5 rounded-lg hover:bg-brand-red-dark"
              >
                <Plus size={13} /> Add
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <a href="/fire-alarm-import-template.csv" download className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-brand-ink-muted border border-brand-line rounded-lg hover:border-brand-ink-faint">
                <Download size={12} /> Template
              </a>
              <button onClick={() => faSystemImportRef.current?.click()} disabled={faSystemImporting} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-brand-ink-muted border border-brand-line rounded-lg px-2 py-1.5 hover:border-brand-ink-faint disabled:opacity-50">
                <Upload size={12} /> {faSystemImporting ? 'Importing…' : 'Import CSV'}
              </button>
            </div>
            <input ref={faSystemImportRef} type="file" accept=".csv" onChange={handleSystemCsvImport} className="hidden" />
            {faSystemImportResult && (
              <div className={`text-xs px-3 py-1.5 rounded-lg mb-2 ${faSystemImportResult.errors > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                {faSystemImportResult.imported} imported{faSystemImportResult.errors > 0 ? `, ${faSystemImportResult.errors} skipped` : ' successfully'}
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search systems…"
                className="w-full border border-brand-line rounded-lg pl-8 pr-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-red"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredSystems.length === 0 && (
              <div className="p-6 text-center text-sm text-brand-ink-muted">No systems match your search</div>
            )}
            {filteredSystems.map(sys => {
              const site = sites.find(s => s.id === sys.siteId);
              const isSelected = selectedSystemId === sys.id;
              const stripe = SYS_STRIPE_CLS[systemStatusKey(sys)];
              return (
                <button
                  key={sys.id}
                  onClick={() => { setSelectedSystemId(sys.id); setTab('log'); }}
                  className={`w-full flex text-left px-4 py-2.5 border-l-[3px] transition-colors ${isSelected ? 'bg-brand-red-tint border-l-brand-red' : 'border-l-transparent hover:bg-brand-bg'}`}
                >
                  <span className={`w-1 rounded mr-3 shrink-0 ${stripe}`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[13px] font-semibold text-brand-ink truncate">{sys.systemRef}</div>
                    <div className="text-xs text-brand-ink-muted truncate mt-0.5">{sys.name ?? site?.name ?? sys.siteId}</div>
                    <div className="text-[11px] text-brand-ink-faint tabular-nums mt-1">Next due: {nearestDueDate(sys) ? fmtDate(nearestDueDate(sys)!) : '—'}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6 min-w-0">
            {selectedSystem && (
              <>
                {systems.length > 0 && <FleetComplianceCard systems={systems} />}

                {/* System header */}
                <div className="bg-white rounded-xl border border-brand-line px-5 py-4 mb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-xl font-bold text-brand-ink">
                        {selectedSystem.systemRef}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-brand-ink-muted mt-0.5">
                        {[sites.find(s => s.id === selectedSystem.siteId)?.name, selectedSystem.name].filter(Boolean).map((part, i, arr) => (
                          <React.Fragment key={i}>
                            <span>{part}</span>
                            {i < arr.length - 1 && <span className="text-brand-ink-faint">›</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-brand-ink-muted">Next due (any tier)</div>
                      <div className="text-base font-bold tabular-nums text-brand-ink">
                        {nearestDueDate(selectedSystem) ? fmtDate(nearestDueDate(selectedSystem)!) : '—'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3.5 mb-3.5">
                    {selectedSystem.panelMake && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-teal-50 text-teal-700">{selectedSystem.panelMake} {selectedSystem.panelModel}</span>}
                    {selectedSystem.arcCompany && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">ARC: {selectedSystem.arcCompany}</span>}
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div>
                      <div className="text-[11px] text-brand-ink-faint">Call points</div>
                      <div className="text-[13px] font-medium text-brand-ink tabular-nums">{selectedSystem._count?.callPoints ?? 0}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-brand-ink-faint">Log entries</div>
                      <div className="text-[13px] font-medium text-brand-ink tabular-nums">{selectedSystem._count?.logEntries ?? 0}</div>
                    </div>
                  </div>
                </div>

                {/* Compliance Card */}
                <ComplianceCard system={selectedSystem} entries={allLogEntries} />

                {/* Tabs */}
                <div className="flex bg-white border border-brand-line rounded-xl overflow-hidden mb-5 flex-wrap">
                  {([
                    { key: 'log',        label: 'Log Entries',     icon: <FileText size={13} /> },
                    { key: 'callpoints', label: 'Call Points',     icon: <MapPin size={13} /> },
                    { key: 'faults',     label: 'Fault Log',       icon: <AlertTriangle size={13} /> },
                    { key: 'engineer',   label: 'Engineer Visits',  icon: <Wrench size={13} /> },
                    { key: 'details',    label: 'System Details',   icon: <Settings size={13} /> },
                  ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(t => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`flex items-center gap-1.5 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        tab === t.key ? 'border-brand-red text-brand-red' : 'border-transparent text-brand-ink-muted hover:text-brand-ink'
                      }`}
                    >
                      {t.icon} {t.label}
                      {t.key === 'faults' && faultEntries.length > 0 && (
                        <span className="ml-0.5 bg-red-100 text-red-700 text-xs font-bold px-1.5 rounded-full">{faultEntries.length}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Log Entries Tab */}
                {tab === 'log' && (
                  <div className="bg-white rounded-xl border border-brand-line overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Inspection Log</h3>
                        <button
                          onClick={() => setShowAddEntry(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark"
                        >
                          <Plus size={13} /> Add Entry
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {selectedSystem.nextWeeklyDue && (() => {
                          const weeklyStatus = complianceStatus(selectedSystem.nextWeeklyDue, 3, selectedSystem.weeklyToleranceDays ?? 2);
                          if (weeklyStatus.label === 'Overdue') {
                            return (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                <AlertTriangle size={11} /> Weekly test overdue
                              </span>
                            );
                          }
                          if (weeklyStatus.label === 'Within Tolerance') {
                            return (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                <AlertTriangle size={11} /> Weekly test due — within tolerance
                              </span>
                            );
                          }
                          return null;
                        })()}
                        {selectedSystem.nextWeeklyDue && (
                          <span className="text-xs text-brand-ink-faint">
                            Next test due: <span className="font-medium text-brand-ink-muted">{fmtDate(selectedSystem.nextWeeklyDue)}</span>
                          </span>
                        )}
                        {faultEntries.length > 0 && (
                          <button
                            onClick={() => setTab('faults')}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-50 border border-red-200 text-red-700 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors"
                          >
                            <AlertTriangle size={11} />
                            Open Faults
                            <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{faultEntries.length}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {logLoading ? (
                      <div className="flex items-center justify-center h-32 text-brand-ink-faint text-sm">Loading…</div>
                    ) : inspectionEntries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-brand-ink-faint text-sm gap-2">
                        <Clock size={24} />
                        No log entries yet
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-brand-bg border-b">
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Date</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Type</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Conducted By</th>
                            <th className="text-center px-4 py-2.5 font-medium text-brand-ink-muted">Outcome</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Notes</th>
                            <th className="px-4 py-2.5" />
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {inspectionEntries.map(entry => (
                            <tr key={entry.id} className="hover:bg-brand-bg">
                              <td className="px-4 py-2.5 text-brand-ink-muted whitespace-nowrap">{fmtDate(entry.conductedAt)}</td>
                              <td className="px-4 py-2.5 text-brand-ink-muted whitespace-nowrap">{ENTRY_TYPE_LABELS[entry.entryType] ?? entry.entryType}</td>
                              <td className="px-4 py-2.5 text-brand-ink-muted">{entry.conductedBy}</td>
                              <td className="px-4 py-2.5 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${outcomeChip(entry.outcome)}`}>
                                  {entry.outcome}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-brand-ink-faint max-w-[200px] truncate">{entry.notes}</td>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-1 justify-end">
                                  {CERT_TYPES.includes(entry.entryType) && (
                                    <button
                                      onClick={() => handleDownloadCert(entry.id)}
                                      disabled={certDownloading === entry.id}
                                      title="Download certificate"
                                      className="p-1 text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-50"
                                    >
                                      {certDownloading === entry.id ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    disabled={deletingEntry === entry.id}
                                    title="Delete entry"
                                    className="p-1 text-brand-ink-faint hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                  >
                                    {deletingEntry === entry.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Call Points Tab */}
                {tab === 'callpoints' && (
                  <div className="bg-white rounded-xl border border-brand-line overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <h3 className="font-semibold text-brand-ink">Call Points</h3>
                      <div className="flex gap-2">
                        <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={handleCsvImport} />
                        <button
                          onClick={() => csvRef.current?.click()}
                          disabled={csvImporting}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-brand-bg disabled:opacity-50"
                        >
                          {csvImporting ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
                          Import CSV
                        </button>
                        <button
                          onClick={() => setShowAddCp(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark"
                        >
                          <Plus size={13} /> Add
                        </button>
                      </div>
                    </div>

                    {/* Suggested Next Call Point Banner */}
                    {nextDueCp && (
                      <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-sm">
                            <Bell size={14} className="text-amber-600" />
                            Suggested Next: <span className="font-bold">{nextDueCp.pointRef}</span>
                            {nextDueCp.location && <span className="font-normal text-amber-700"> — {nextDueCp.location}</span>}
                            {nextDueCp.zone && <span className="font-normal text-amber-600 text-xs"> (Zone {nextDueCp.zone})</span>}
                          </div>
                          <div className="text-xs text-amber-600 mt-0.5">
                            Last tested: {nextDueCp.lastTestedAt ? fmtDate(nextDueCp.lastTestedAt) : 'Never tested'}
                          </div>
                        </div>
                        <button
                          onClick={() => setShowAddEntry(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 whitespace-nowrap shrink-0"
                        >
                          <CheckCircle size={13} /> Mark as Tested
                        </button>
                      </div>
                    )}

                    {cpLoading ? (
                      <div className="flex items-center justify-center h-32 text-brand-ink-faint text-sm">Loading…</div>
                    ) : callPoints.length === 0 ? (
                      <div className="p-8 text-center text-brand-ink-faint text-sm space-y-2">
                        <Bell size={24} className="mx-auto" />
                        <p>No call points yet.</p>
                        <p className="text-xs">Add individually or import a CSV with columns: pointRef, location, floor, zone</p>
                      </div>
                    ) : (
                      <table className="w-full text-sm mt-3">
                        <thead>
                          <tr className="bg-brand-bg border-b">
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Point Ref</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Location</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Floor</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Zone</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Last Tested</th>
                            <th className="px-4 py-2.5" />
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {callPoints.map(cp => (
                            <tr key={cp.id} className={`hover:bg-brand-bg ${cp.id === nextDueId ? 'bg-amber-50/60' : ''}`}>
                              <td className="px-4 py-2.5 font-medium text-brand-ink">
                                {cp.pointRef}
                                {cp.id === nextDueId && (
                                  <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Next due</span>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-brand-ink-muted">{cp.location ?? '—'}</td>
                              <td className="px-4 py-2.5 text-brand-ink-muted">{cp.floor ?? '—'}</td>
                              <td className="px-4 py-2.5 text-brand-ink-muted">{cp.zone ?? '—'}</td>
                              <td className="px-4 py-2.5 text-brand-ink-faint">
                                {cp.lastTestedAt ? fmtDate(cp.lastTestedAt) : <span className="text-red-500 text-xs">Never tested</span>}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  onClick={() => handleDeleteCp(cp.id)}
                                  disabled={deletingCp === cp.id}
                                  className="p-1 text-brand-ink-faint hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                  {deletingCp === cp.id ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Fault Log Tab */}
                {tab === 'faults' && (
                  <div className="bg-white rounded-xl border border-brand-line overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <h3 className="font-semibold text-brand-ink">Fault Log</h3>
                      <button
                        onClick={() => setShowFaultModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark"
                      >
                        <Plus size={13} /> Log Fault
                      </button>
                    </div>

                    {logLoading ? (
                      <div className="flex items-center justify-center h-32 text-brand-ink-faint text-sm">Loading…</div>
                    ) : faultEntries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-brand-ink-faint text-sm gap-2">
                        <AlertTriangle size={24} />
                        No faults recorded
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-brand-bg border-b">
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Date</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Reported By</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Severity</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Description</th>
                            <th className="text-center px-4 py-2.5 font-medium text-brand-ink-muted">Resolved</th>
                            <th className="px-4 py-2.5" />
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {faultEntries.map(entry => {
                            const d = (entry.data ?? {}) as Record<string, unknown>;
                            const sev = String(d.severity ?? '');
                            const resolved = Boolean(d.resolved);
                            return (
                              <tr key={entry.id} className="hover:bg-brand-bg">
                                <td className="px-4 py-2.5 text-brand-ink-muted whitespace-nowrap">{fmtDate(entry.conductedAt)}</td>
                                <td className="px-4 py-2.5 text-brand-ink-muted">{entry.conductedBy}</td>
                                <td className="px-4 py-2.5">
                                  {sev && (
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                      sev === 'critical' ? 'bg-red-100 text-red-700'
                                      : sev === 'major' ? 'bg-orange-100 text-orange-700'
                                      : 'bg-amber-100 text-amber-700'
                                    }`}>{sev}</span>
                                  )}
                                </td>
                                <td className="px-4 py-2.5 text-brand-ink-muted max-w-[240px] truncate">{entry.notes}</td>
                                <td className="px-4 py-2.5 text-center">
                                  {resolved
                                    ? <CheckCircle size={15} className="text-green-500 mx-auto" />
                                    : <Clock size={15} className="text-amber-500 mx-auto" />}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    disabled={deletingEntry === entry.id}
                                    className="p-1 text-brand-ink-faint hover:text-red-600 hover:bg-red-50 rounded"
                                  >
                                    {deletingEntry === entry.id ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Engineer Visits Tab */}
                {tab === 'engineer' && (
                  <div className="bg-white rounded-xl border border-brand-line overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <h3 className="font-semibold text-brand-ink">Engineer Visits</h3>
                      <button
                        onClick={() => setShowEngineerModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark"
                      >
                        <Plus size={13} /> Log Visit
                      </button>
                    </div>

                    {logLoading ? (
                      <div className="flex items-center justify-center h-32 text-brand-ink-faint text-sm">Loading…</div>
                    ) : engineerEntries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-brand-ink-faint text-sm gap-2">
                        <Wrench size={24} />
                        No engineer visits recorded
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-brand-bg border-b">
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Date</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Engineer</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Company</th>
                            <th className="text-center px-4 py-2.5 font-medium text-brand-ink-muted">Outcome</th>
                            <th className="text-left px-4 py-2.5 font-medium text-brand-ink-muted">Work / Next Action</th>
                            <th className="px-4 py-2.5" />
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {engineerEntries.map(entry => {
                            const d = (entry.data ?? {}) as Record<string, unknown>;
                            return (
                              <tr key={entry.id} className="hover:bg-brand-bg">
                                <td className="px-4 py-2.5 text-brand-ink-muted whitespace-nowrap">{fmtDate(entry.conductedAt)}</td>
                                <td className="px-4 py-2.5 text-brand-ink-muted">{entry.conductedBy}</td>
                                <td className="px-4 py-2.5 text-brand-ink-muted">{String(d.company ?? '—')}</td>
                                <td className="px-4 py-2.5 text-center">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${outcomeChip(entry.outcome)}`}>
                                    {entry.outcome}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-brand-ink-muted max-w-[200px]">
                                  <div className="truncate">{entry.notes || '—'}</div>
                                  {d.nextAction && (
                                    <div className="text-xs text-indigo-600 truncate">Next: {String(d.nextAction)}</div>
                                  )}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    disabled={deletingEntry === entry.id}
                                    className="p-1 text-brand-ink-faint hover:text-red-600 hover:bg-red-50 rounded"
                                  >
                                    {deletingEntry === entry.id ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* System Details Tab */}
                {tab === 'details' && (
                  <SystemDetailsPanel
                    system={selectedSystem}
                    sites={sites}
                    onUpdate={async (updates) => {
                      const updated = await faUpdateSystem(selectedSystem.id, updates);
                      setSystems(prev => prev.map(s => s.id === selectedSystem.id ? { ...s, ...updated } : s));
                    }}
                  />
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* Modals */}
      {showAddSystem && (
        <AddSystemModal
          sites={sites}
          onSave={handleCreateSystem}
          onClose={() => setShowAddSystem(false)}
        />
      )}
      {showAddEntry && selectedSystemId && (
        <AddLogEntryModal
          callPoints={callPoints}
          nextDueId={nextDueId}
          onSave={handleCreateEntry}
          onClose={() => setShowAddEntry(false)}
          onDownloadCert={handleDownloadCert}
        />
      )}
      {showAddCp && selectedSystemId && (
        <AddCallPointModal
          onSave={handleAddCallPoint}
          onClose={() => setShowAddCp(false)}
        />
      )}
      {showFaultModal && selectedSystemId && (
        <FaultLogModal
          onSave={handleCreateEntry}
          onClose={() => setShowFaultModal(false)}
        />
      )}
      {showEngineerModal && selectedSystemId && (
        <EngineerVisitModal
          onSave={handleCreateEntry}
          onClose={() => setShowEngineerModal(false)}
        />
      )}
    </div>
  );
};

// ─── System Details Panel ─────────────────────────────────────────────────────

const SystemDetailsPanel: React.FC<{
  system: FireAlarmSystem;
  sites: Site[];
  onUpdate: (updates: Record<string, string>) => Promise<void>;
}> = ({ system, sites, onUpdate }) => {
  const [form, setForm] = useState({
    systemRef: system.systemRef,
    name: system.name ?? '',
    panelMake: system.panelMake ?? '',
    panelModel: system.panelModel ?? '',
    panelSerial: system.panelSerial ?? '',
    arcCompany: system.arcCompany ?? '',
    arcNumber: system.arcNumber ?? '',
    installDate: system.installDate ? system.installDate.slice(0, 10) : '',
    notes: system.notes ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const site = sites.find(s => s.id === system.siteId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(''); setSaved(false);
    try {
      await onUpdate(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-brand-line p-5">
      <h3 className="font-semibold text-brand-ink mb-4">System Details</h3>
      {site && (
        <p className="text-sm text-brand-ink-faint mb-4">Site: <span className="font-medium text-brand-ink-muted">{site.name}</span></p>
      )}
      {err && <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3">{err}</p>}
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-brand-ink-muted">System ID / Ref</label>
            <input value={form.systemRef} onChange={e => set('systemRef', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-ink-muted">Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-brand-ink-muted">Panel Make</label>
            <input value={form.panelMake} onChange={e => set('panelMake', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-ink-muted">Panel Model</label>
            <input value={form.panelModel} onChange={e => set('panelModel', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-ink-muted">Panel Serial</label>
            <input value={form.panelSerial} onChange={e => set('panelSerial', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-brand-ink-muted">ARC Company</label>
            <input value={form.arcCompany} onChange={e => set('arcCompany', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-ink-muted">ARC Number</label>
            <input value={form.arcNumber} onChange={e => set('arcNumber', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-brand-ink-muted">Install Date</label>
          <input type="date" value={form.installDate} onChange={e => set('installDate', e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-ink-muted">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none" />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-brand-red text-white rounded-lg hover:bg-brand-red-dark disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle size={14} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default FireAlarmLogbookPage;
