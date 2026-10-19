import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Plus, Trash2, ClipboardList, Settings, AlertTriangle, CheckCircle,
  Clock, DoorClosed, X, ChevronRight, Upload, Download, Camera, Search,
} from 'lucide-react';
import {
  fdGetDoors, fdCreateDoor, fdUpdateDoor, fdDeleteDoor,
  fdGetInspections, fdCreateInspection, fdDeleteInspection,
  fdGetPhotos, fdUploadPhoto, fetchSites, importFireDoorsCsv,
} from '../lib/api';
import type { FireDoor, FireDoorInspection, FireDoorPhoto, FireDoorType, Site } from '../types';
import ComplianceRing from '../components/ComplianceRing';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('en-GB') : '—';

const DOOR_TYPE_LABELS: Record<FireDoorType, string> = {
  flat_entrance: 'Flat Entrance',
  communal_stairway: 'Communal Stairway',
  communal_corridor: 'Communal Corridor',
  communal_lobby: 'Communal Lobby',
  plant_room: 'Plant Room',
  service_riser: 'Service Riser',
  riser_cupboard: 'Riser / Meter Cupboard',
  kitchen: 'Kitchen',
  hallway: 'Hallway',
  dining_area: 'Dining Area',
  office: 'Office',
  other: 'Other',
};

const DOOR_TYPE_GROUPS: { label: string; types: FireDoorType[] }[] = [
  { label: 'Flat Entrance', types: ['flat_entrance'] },
  { label: 'Communal (3-month cycle)', types: ['communal_stairway', 'communal_corridor', 'communal_lobby'] },
  { label: 'Other', types: ['plant_room', 'service_riser', 'riser_cupboard', 'kitchen', 'hallway', 'dining_area', 'office', 'other'] },
];

function fdStatus(door: FireDoor): { label: string; cls: string; icon: React.ReactNode } {
  const latest = door.inspections?.[0];
  if (latest?.outcome === 'fail') {
    return { label: 'Non Compliant', cls: 'bg-orange-100 text-orange-800', icon: <AlertTriangle size={12} /> };
  }
  if (latest?.outcome === 'requires_attention') {
    return { label: 'Requires Attention', cls: 'bg-amber-100 text-amber-800', icon: <AlertTriangle size={12} /> };
  }
  if (!door.nextInspectionDue) return { label: 'Never Inspected', cls: 'bg-gray-100 text-gray-600', icon: <Clock size={12} /> };

  const days = (new Date(door.nextInspectionDue).getTime() - Date.now()) / 86_400_000;
  if (days < 0)   return { label: 'Overdue',  cls: 'bg-red-100 text-red-700',    icon: <AlertTriangle size={12} /> };
  if (days <= 30) return { label: 'Due Soon', cls: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> };
  return { label: 'Compliant', cls: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> };
}

// Simplified 3-way bucket for the list row's left status stripe and the
// compliance ring segments — collapses the two "needs action" labels
// (Non Compliant / Requires Attention) into "attention" for that purpose.
function fdStatusKey(door: FireDoor): 'compliant' | 'attention' | 'overdue' {
  const label = fdStatus(door).label;
  if (label === 'Overdue') return 'overdue';
  if (label === 'Compliant') return 'compliant';
  return 'attention';
}

const STRIPE_CLS: Record<string, string> = {
  compliant: 'bg-green-500',
  attention: 'bg-amber-500',
  overdue: 'bg-red-500',
};

// ─── Compliance strip ─────────────────────────────────────────────────────────

const FDComplianceCard: React.FC<{ doors: FireDoor[] }> = ({ doors }) => {
  const total     = doors.length;
  const compliant = doors.filter(d => fdStatusKey(d) === 'compliant').length;
  const attention = doors.filter(d => fdStatusKey(d) === 'attention').length;
  const overdue   = doors.filter(d => fdStatusKey(d) === 'overdue').length;
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
          <div className="text-[11px] text-brand-ink-muted mt-1">Total doors</div>
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

// ─── Add Door Modal ───────────────────────────────────────────────────────────

interface AddDoorModalProps {
  sites: Site[];
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

const AddDoorModal: React.FC<AddDoorModalProps> = ({ sites, onClose, onSave }) => {
  const [form, setForm] = useState({
    siteId: sites[0]?.id ?? '',
    doorRef: '',
    location: '',
    doorType: 'flat_entrance' as FireDoorType,
    fireRating: '',
    manufacturer: '',
    installationDate: '',
    hasIntumescentStrips: true,
    hasSmokeSeal: true,
    hasLetterbox: false,
    hasAirTransferGrille: false,
    hasGlazing: false,
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
            <DoorClosed size={18} className="text-brand-red" /> Add Fire Door
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Door Ref *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="e.g. FD-001"
                value={form.doorRef} onChange={e => setForm(f => ({ ...f, doorRef: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Door Type *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" required
                value={form.doorType} onChange={e => setForm(f => ({ ...f, doorType: e.target.value as FireDoorType }))}>
                {DOOR_TYPE_GROUPS.map(g => (
                  <optgroup key={g.label} label={g.label}>
                    {g.types.map(t => <option key={t} value={t}>{DOOR_TYPE_LABELS[t]}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="e.g. 2nd Floor Corridor"
              value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fire Rating</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. FD30"
                value={form.fireRating} onChange={e => setForm(f => ({ ...f, fireRating: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Installation Date</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.installationDate} onChange={e => setForm(f => ({ ...f, installationDate: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Door Features</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                ['hasIntumescentStrips', 'Intumescent strips'],
                ['hasSmokeSeal', 'Smoke seal'],
                ['hasLetterbox', 'Letterbox'],
                ['hasAirTransferGrille', 'Air transfer grille'],
                ['hasGlazing', 'Glazing'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                  {label}
                </label>
              ))}
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
              {saving ? 'Saving…' : 'Add Door'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Log Inspection Modal ─────────────────────────────────────────────────────

interface LogInspectionModalProps {
  door: FireDoor;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<{ id: string }>;
}

const CORE_CHECKS: { key: keyof typeof CORE_DEFAULTS; label: string; defaultGood: boolean }[] = [
  ['closesCompletely', 'Closes completely', true],
  ['closesFromAnyAngle', 'Closes from any angle', true],
  ['opensInTravelDirection', 'Opens in direction of travel', true],
  ['frameGapOk', 'Frame gaps within tolerance (≤4mm)', true],
  ['hingesSecure', 'Hinges secure', true],
  ['selfCloserWorks', 'Self-closing device works', true],
].map(([key, label, defaultGood]) => ({ key: key as keyof typeof CORE_DEFAULTS, label: label as string, defaultGood: defaultGood as boolean }));

const CORE_DEFAULTS = {
  closesCompletely: true, closesFromAnyAngle: true, opensInTravelDirection: true,
  frameGapOk: true, hingesSecure: true, selfCloserWorks: true,
};

const CONDITIONAL_CHECKS: { flag: keyof FireDoor; key: string; label: string }[] = [
  { flag: 'hasIntumescentStrips', key: 'intumescentStripIntact', label: 'Intumescent strip intact' },
  { flag: 'hasSmokeSeal', key: 'smokeSealIntact', label: 'Smoke seal intact' },
  { flag: 'hasLetterbox', key: 'letterboxCloses', label: 'Letterbox closes properly' },
  { flag: 'hasAirTransferGrille', key: 'airTransferGrilleOk', label: 'Air transfer grille intact' },
  { flag: 'hasGlazing', key: 'glazingIntact', label: 'Glazing intact' },
];

const LogInspectionModal: React.FC<LogInspectionModalProps> = ({ door, onClose, onSave }) => {
  const [form, setForm] = useState<Record<string, unknown>>({
    inspectedBy: '',
    inspectedAt: new Date().toISOString().slice(0, 10),
    accessDenied: false,
    accessDeniedReason: '',
    visualDamage: false,
    ...CORE_DEFAULTS,
    maxGapSizeMm: '',
    hingeCount: '',
    intumescentStripIntact: true,
    smokeSealIntact: true,
    letterboxCloses: true,
    airTransferGrilleOk: true,
    glazingIntact: true,
    signageCorrect: true,
    outcome: 'pass',
    defectsFound: '',
    remedialAction: '',
    actionPriority: 'low',
    comments: '',
    nextInspectionDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const accessDenied = form.accessDenied as boolean;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        inspectedBy: form.inspectedBy,
        inspectedAt: form.inspectedAt,
        accessDenied,
        outcome: accessDenied ? 'requires_attention' : form.outcome,
        ...(form.comments ? { comments: form.comments as string } : {}),
        ...(form.nextInspectionDate ? { nextInspectionDate: form.nextInspectionDate as string } : {}),
      };
      if (accessDenied) {
        payload.accessDeniedReason = form.accessDeniedReason;
      } else {
        payload.visualDamage = form.visualDamage;
        for (const c of CORE_CHECKS) payload[c.key] = form[c.key];
        if (form.maxGapSizeMm) payload.maxGapSizeMm = Number(form.maxGapSizeMm);
        if (form.hingeCount) payload.hingeCount = Number(form.hingeCount);
        for (const c of CONDITIONAL_CHECKS) {
          if (door[c.flag]) payload[c.key] = form[c.key];
        }
        payload.signageCorrect = form.signageCorrect;
        if (form.defectsFound) payload.defectsFound = form.defectsFound;
        if (form.remedialAction) payload.remedialAction = form.remedialAction;
        if (form.outcome !== 'pass') payload.actionPriority = form.actionPriority;
      }
      const inspection = await onSave(payload);
      if (photoFile) {
        setUploadingPhoto(true);
        try {
          await fdUploadPhoto({ file: photoFile, doorId: door.id, inspectionId: inspection.id });
        } catch (err) {
          alert(`Inspection saved, but the photo failed to upload: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
          setUploadingPhoto(false);
        }
      }
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClipboardList size={18} className="text-brand-red" /> Log Inspection
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-5 py-3 bg-brand-red-tint border-b border-brand-line text-sm text-brand-red-dark">
          <span className="font-medium">{door.doorRef}</span> — {door.location}
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" required
                value={form.inspectedAt as string} onChange={e => setForm(f => ({ ...f, inspectedAt: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspected By *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder="Inspector name"
                value={form.inspectedBy as string} onChange={e => setForm(f => ({ ...f, inspectedBy: e.target.value }))} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border rounded-lg px-3 py-2">
            <input type="checkbox" checked={accessDenied} onChange={e => setForm(f => ({ ...f, accessDenied: e.target.checked }))} />
            Access denied — unable to inspect
          </label>

          {accessDenied ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} required
                value={form.accessDeniedReason as string} onChange={e => setForm(f => ({ ...f, accessDeniedReason: e.target.value }))} />
            </div>
          ) : (
            <>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.visualDamage as boolean} onChange={e => setForm(f => ({ ...f, visualDamage: e.target.checked }))} />
                Visual damage or defects observed
              </label>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Core Checks</div>
                <div className="space-y-1.5">
                  {CORE_CHECKS.map(c => (
                    <label key={c.key} className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={form[c.key] as boolean} onChange={e => setForm(f => ({ ...f, [c.key]: e.target.checked }))} />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Frame Gap (mm)</label>
                  <input type="number" min="0" step="0.5" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 3"
                    value={form.maxGapSizeMm as string} onChange={e => setForm(f => ({ ...f, maxGapSizeMm: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hinge Count</label>
                  <input type="number" min="0" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 3"
                    value={form.hingeCount as string} onChange={e => setForm(f => ({ ...f, hingeCount: e.target.value }))} />
                </div>
              </div>

              {CONDITIONAL_CHECKS.some(c => door[c.flag]) && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Additional Checks</div>
                  <div className="space-y-1.5">
                    {CONDITIONAL_CHECKS.filter(c => door[c.flag]).map(c => (
                      <label key={c.key} className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={form[c.key] as boolean} onChange={e => setForm(f => ({ ...f, [c.key]: e.target.checked }))} />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.signageCorrect as boolean} onChange={e => setForm(f => ({ ...f, signageCorrect: e.target.checked }))} />
                Fire door signage correct
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcome *</label>
                <div className="flex gap-2">
                  {(['pass', 'fail', 'requires_attention'] as const).map(v => (
                    <label key={v} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-colors ${
                      form.outcome === v
                        ? v === 'pass' ? 'bg-green-100 border-green-400 text-green-700'
                        : v === 'fail' ? 'bg-red-100 border-red-400 text-red-700'
                        : 'bg-amber-100 border-amber-400 text-amber-700'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}>
                      <input type="radio" name="outcome" value={v} checked={form.outcome === v}
                        onChange={() => setForm(f => ({ ...f, outcome: v }))} className="sr-only" />
                      {v === 'pass' ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
                      {v === 'requires_attention' ? 'ATTENTION' : v.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>

              {form.outcome !== 'pass' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Defects Found</label>
                    <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
                      value={form.defectsFound as string} onChange={e => setForm(f => ({ ...f, defectsFound: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remedial Action</label>
                    <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
                      value={form.remedialAction as string} onChange={e => setForm(f => ({ ...f, remedialAction: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={form.actionPriority as string} onChange={e => setForm(f => ({ ...f, actionPriority: e.target.value }))}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Inspection Date</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.nextInspectionDate as string} onChange={e => setForm(f => ({ ...f, nextInspectionDate: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
              value={form.comments as string} onChange={e => setForm(f => ({ ...f, comments: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            {photoPreview ? (
              <div className="relative inline-block">
                <img src={photoPreview} alt="Door photo preview" className="w-28 h-28 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-white border rounded-full p-0.5 text-gray-500 hover:text-red-600 shadow"
                  title="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-brand-red border border-brand-line rounded-lg hover:bg-brand-red-tint"
              >
                <Camera size={14} /> Take Photo
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-brand-red-dark disabled:opacity-50">
              {uploadingPhoto ? 'Uploading photo…' : saving ? 'Saving…' : 'Log Inspection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const FireDoorsPage: React.FC<{ initialSelectId?: string }> = ({ initialSelectId }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [doors, setDoors] = useState<FireDoor[]>([]);
  const [inspections, setInspections] = useState<FireDoorInspection[]>([]);
  const [photos, setPhotos] = useState<FireDoorPhoto[]>([]);
  const [selectedDoor, setSelectedDoor] = useState<FireDoor | null>(null);
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'history' | 'details'>('history');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingInspections, setLoadingInspections] = useState(false);
  const [detailForm, setDetailForm] = useState<Partial<FireDoor>>({});
  const [savingDetail, setSavingDetail] = useState(false);
  const [fdImporting, setFdImporting] = useState(false);
  const [fdImportResult, setFdImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const fdImportRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSites().then(setSites).catch(() => {});
  }, []);

  const loadDoors = useCallback(() => {
    setLoading(true);
    fdGetDoors(siteFilter === 'all' ? undefined : siteFilter)
      .then((data: FireDoor[]) => {
        setDoors(data);
        if (initialSelectId && !selectedDoor) {
          const match = data.find((d: FireDoor) => d.id === initialSelectId);
          if (match) {
            setSelectedDoor(match);
            setDetailForm(match);
            setLoadingInspections(true);
            fdGetInspections(match.id).then(setInspections).catch(() => setInspections([])).finally(() => setLoadingInspections(false));
            fdGetPhotos(match.id).then(setPhotos).catch(() => setPhotos([]));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [siteFilter, initialSelectId]);

  useEffect(() => { loadDoors(); }, [loadDoors]);

  const selectDoor = (door: FireDoor) => {
    setSelectedDoor(door);
    setDetailForm(door);
    setActiveTab('history');
    setLoadingInspections(true);
    fdGetInspections(door.id).then(setInspections).catch(() => setInspections([])).finally(() => setLoadingInspections(false));
    fdGetPhotos(door.id).then(setPhotos).catch(() => setPhotos([]));
  };

  const handleAddDoor = async (data: Record<string, unknown>) => {
    await fdCreateDoor(data);
    setShowAddModal(false);
    loadDoors();
  };

  const handleLogInspection = async (data: Record<string, unknown>) => {
    if (!selectedDoor) throw new Error('No door selected');
    const inspection = await fdCreateInspection(selectedDoor.id, data);
    setLoadingInspections(true);
    fdGetInspections(selectedDoor.id).then(setInspections).finally(() => setLoadingInspections(false));
    loadDoors();
    return inspection;
  };

  const closeLogModal = () => {
    setShowLogModal(false);
    // Re-fetch in case a photo finished uploading after the inspection was saved
    if (selectedDoor) fdGetPhotos(selectedDoor.id).then(setPhotos).catch(() => {});
  };

  const handleDeleteInspection = async (id: string) => {
    if (!confirm('Delete this inspection record?')) return;
    await fdDeleteInspection(id);
    if (selectedDoor) {
      fdGetInspections(selectedDoor.id).then(setInspections);
    }
  };

  const handleDeleteDoor = async () => {
    if (!selectedDoor || !confirm(`Delete ${selectedDoor.doorRef}? All inspection history will be lost.`)) return;
    await fdDeleteDoor(selectedDoor.id);
    setSelectedDoor(null);
    loadDoors();
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoor) return;
    setSavingDetail(true);
    try {
      await fdUpdateDoor(selectedDoor.id, detailForm as Record<string, unknown>);
      loadDoors();
    } finally { setSavingDetail(false); }
  };

  const handleFDImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setFdImporting(true);
      setFdImportResult(null);
      const result = await importFireDoorsCsv(file);
      setFdImportResult({ imported: result.imported, errors: result.errors });
      if (result.imported > 0) loadDoors();
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setFdImporting(false);
      if (fdImportRef.current) fdImportRef.current.value = '';
    }
  };

  const filteredDoors = doors.filter(d => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return d.doorRef.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || (d.site?.name ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="flex h-full min-h-screen bg-brand-bg">
      {/* List panel */}
      <aside className="w-80 shrink-0 border-r border-brand-line bg-white flex flex-col">
        <div className="p-4 border-b border-brand-line">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[13px] font-semibold text-brand-ink">Fire Doors</span>
              <span className="text-xs text-brand-ink-muted"> · {doors.length} door{doors.length === 1 ? '' : 's'}</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-xs font-medium bg-brand-red text-white px-2.5 py-1.5 rounded-lg hover:bg-brand-red-dark"
              title="Add Door"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <a href="/fire-door-import-template.csv" download className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-brand-ink-muted border border-brand-line rounded-lg hover:border-brand-ink-faint">
              <Download size={12} /> Template
            </a>
            <button onClick={() => fdImportRef.current?.click()} disabled={fdImporting} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-brand-ink-muted border border-brand-line rounded-lg px-2 py-1.5 hover:border-brand-ink-faint disabled:opacity-50">
              <Upload size={12} /> {fdImporting ? 'Importing…' : 'Import CSV'}
            </button>
          </div>
          <input ref={fdImportRef} type="file" accept=".csv" onChange={handleFDImport} className="hidden" />
          {fdImportResult && (
            <div className={`text-xs px-3 py-1.5 rounded-lg mb-2 ${fdImportResult.errors > 0 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
              {fdImportResult.imported} imported{fdImportResult.errors > 0 ? `, ${fdImportResult.errors} skipped` : ' successfully'}
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
              placeholder="Search doors…"
              className="w-full border border-brand-line rounded-lg pl-8 pr-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-red"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-brand-ink-muted text-center">Loading…</div>
          ) : filteredDoors.length === 0 ? (
            <div className="p-6 text-center text-sm text-brand-ink-muted">
              <DoorClosed size={32} className="mx-auto mb-2 text-brand-ink-faint" />
              {doors.length === 0 ? 'No fire doors registered' : 'No doors match your search'}
            </div>
          ) : (
            filteredDoors.map(door => {
              const isSelected = selectedDoor?.id === door.id;
              const status = fdStatus(door);
              const stripe = STRIPE_CLS[fdStatusKey(door)];
              return (
                <button
                  key={door.id}
                  onClick={() => selectDoor(door)}
                  className={`w-full flex text-left px-4 py-2.5 border-l-[3px] transition-colors ${isSelected ? 'bg-brand-red-tint border-l-brand-red' : 'border-l-transparent hover:bg-brand-bg'}`}
                >
                  <span className={`w-1 rounded mr-3 shrink-0 ${stripe}`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[13px] font-semibold text-brand-ink truncate">{door.doorRef}</div>
                    <div className="text-xs text-brand-ink-muted truncate mt-0.5">{door.location}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${status.cls}`}>{status.label}</span>
                      <span className="text-[11px] text-brand-ink-faint tabular-nums">Due: {fmt(door.nextInspectionDue)}</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Detail panel */}
      <main className="flex-1 overflow-y-auto p-6 min-w-0">
        {!selectedDoor ? (
          <div className="h-full flex items-center justify-center text-brand-ink-muted">
            <div className="text-center">
              <DoorClosed size={48} className="mx-auto mb-3 text-brand-ink-faint" />
              <p className="text-sm">Select a fire door to view details</p>
            </div>
          </div>
        ) : (
          <>
            {!loading && doors.length > 0 && <FDComplianceCard doors={doors} />}

            {/* Detail header */}
            <div className="bg-white border border-brand-line rounded-xl p-5 mb-5">
              <div className="flex items-start justify-between gap-4 mb-3.5">
                <div className="min-w-0">
                  <div className="font-mono text-xl font-bold text-brand-ink">{selectedDoor.doorRef}</div>
                  <div className="flex items-center gap-1.5 text-sm text-brand-ink-muted mt-0.5">
                    {[selectedDoor.site?.name, selectedDoor.location].filter(Boolean).map((part, i, arr) => (
                      <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < arr.length - 1 && <span className="text-brand-ink-faint">›</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] text-brand-ink-muted">Next inspection</div>
                  <div className={`text-base font-bold tabular-nums ${fdStatusKey(selectedDoor) === 'overdue' ? 'text-red-600' : fdStatusKey(selectedDoor) === 'attention' ? 'text-amber-600' : 'text-green-700'}`}>
                    {fmt(selectedDoor.nextInspectionDue)}
                  </div>
                  <button onClick={handleDeleteDoor} className="text-[11px] text-red-400 hover:text-red-600 mt-1 inline-flex items-center gap-1" title="Delete door">
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3.5">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-teal-50 text-teal-700">{DOOR_TYPE_LABELS[selectedDoor.doorType] ?? selectedDoor.doorType}</span>
                {selectedDoor.fireRating && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{selectedDoor.fireRating}</span>}
                {selectedDoor.site && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">{selectedDoor.site.name}</span>}
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-brand-bg text-brand-ink-muted">{selectedDoor.inspectionFrequencyMonths}-month cycle</span>
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-[11px] text-brand-ink-faint">Last inspected</div>
                  <div className="text-[13px] font-medium text-brand-ink tabular-nums">{fmt(selectedDoor.lastInspectedAt)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-brand-ink-faint">Installed</div>
                  <div className="text-[13px] font-medium text-brand-ink tabular-nums">{fmt(selectedDoor.installationDate)}</div>
                </div>
                {selectedDoor.manufacturer && (
                  <div>
                    <div className="text-[11px] text-brand-ink-faint">Manufacturer</div>
                    <div className="text-[13px] font-medium text-brand-ink">{selectedDoor.manufacturer}</div>
                  </div>
                )}
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
                  {tab === 'history' ? <><ClipboardList size={14} className="inline mr-1.5 -mt-0.5" />Inspection History</> : <><Settings size={14} className="inline mr-1.5 -mt-0.5" />Door Details</>}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-white border border-brand-line rounded-b-xl p-5">
              {activeTab === 'history' && (
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-sm font-semibold text-brand-ink">{inspections.length} inspection{inspections.length === 1 ? '' : 's'}</h3>
                    <button
                      onClick={() => setShowLogModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-red text-white rounded-lg text-xs font-semibold hover:bg-brand-red-dark"
                    >
                      <Plus size={14} /> Log Inspection
                    </button>
                  </div>

                  {loadingInspections ? (
                    <div className="text-sm text-brand-ink-muted">Loading…</div>
                  ) : inspections.length === 0 ? (
                    <div className="text-center py-10 text-brand-ink-muted">
                      <ClipboardList size={32} className="mx-auto mb-2 text-brand-ink-faint" />
                      <p className="text-sm">No inspections recorded yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {inspections.map((insp, i) => {
                        const isPass = insp.outcome === 'pass';
                        return (
                          <div key={insp.id} className={`flex items-start gap-3 py-2.5 ${i < inspections.length - 1 ? 'border-b border-brand-line/60' : ''}`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isPass ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {isPass ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[13px] font-semibold ${isPass ? 'text-green-700' : insp.outcome === 'fail' ? 'text-red-700' : 'text-amber-700'}`}>
                                {insp.outcome === 'requires_attention' ? 'Attention' : insp.outcome === 'pass' ? 'Pass' : 'Fail'}
                              </div>
                              <div className="text-xs text-brand-ink-muted mt-0.5">
                                Inspected by {insp.inspectedBy}
                                {insp.accessDenied && ` · Access denied: ${insp.accessDeniedReason}`}
                                {insp.defectsFound && ` · ${insp.defectsFound}`}
                              </div>
                              {insp.comments && <p className="text-xs text-brand-ink-faint mt-0.5">{insp.comments}</p>}
                              {photos.filter(p => p.inspectionId === insp.id).length > 0 && (
                                <div className="flex gap-1.5 mt-2">
                                  {photos.filter(p => p.inspectionId === insp.id).map(p => (
                                    <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                                      <img src={p.url} alt="Inspection photo" className="w-12 h-12 object-cover rounded border border-brand-line hover:opacity-80" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-[11px] text-brand-ink-faint text-right shrink-0 tabular-nums leading-snug">
                              {fmt(insp.inspectedAt)}
                              {insp.nextInspectionDate && <><br />Next due: {fmt(insp.nextInspectionDate)}</>}
                              <button
                                onClick={() => handleDeleteInspection(insp.id)}
                                className="block ml-auto mt-1 text-red-300 hover:text-red-500"
                                title="Delete inspection"
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
                  <h3 className="font-medium text-brand-ink mb-4">Door Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Door Ref</label>
                      <input className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={detailForm.doorRef ?? ''} onChange={e => setDetailForm(f => ({ ...f, doorRef: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Door Type</label>
                      <select className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={detailForm.doorType ?? 'flat_entrance'} onChange={e => setDetailForm(f => ({ ...f, doorType: e.target.value as FireDoorType }))}>
                        {DOOR_TYPE_GROUPS.map(g => (
                          <optgroup key={g.label} label={g.label}>
                            {g.types.map(t => <option key={t} value={t}>{DOOR_TYPE_LABELS[t]}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={detailForm.location ?? ''} onChange={e => setDetailForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fire Rating</label>
                      <input className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={detailForm.fireRating ?? ''} onChange={e => setDetailForm(f => ({ ...f, fireRating: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                      <input className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={detailForm.manufacturer ?? ''} onChange={e => setDetailForm(f => ({ ...f, manufacturer: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Door Features</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        ['hasIntumescentStrips', 'Intumescent strips'],
                        ['hasSmokeSeal', 'Smoke seal'],
                        ['hasLetterbox', 'Letterbox'],
                        ['hasAirTransferGrille', 'Air transfer grille'],
                        ['hasGlazing', 'Glazing'],
                      ] as const).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" checked={!!detailForm[key]} onChange={e => setDetailForm(f => ({ ...f, [key]: e.target.checked }))} />
                          {label}
                        </label>
                      ))}
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
        <AddDoorModal sites={sites} onClose={() => setShowAddModal(false)} onSave={handleAddDoor} />
      )}
      {showLogModal && selectedDoor && (
        <LogInspectionModal door={selectedDoor} onClose={closeLogModal} onSave={handleLogInspection} />
      )}
    </div>
  );
};

export default FireDoorsPage;
