import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Plus, Trash2, ClipboardList, Settings, AlertTriangle, CheckCircle,
  Clock, DoorClosed, X, ChevronRight, Upload, Download, Camera,
} from 'lucide-react';
import {
  fdGetDoors, fdCreateDoor, fdUpdateDoor, fdDeleteDoor,
  fdGetInspections, fdCreateInspection, fdDeleteInspection,
  fdGetPhotos, fdUploadPhoto, fetchSites, importFireDoorsCsv,
} from '../lib/api';
import type { FireDoor, FireDoorInspection, FireDoorPhoto, FireDoorType, Site } from '../types';

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

// ─── Compliance Card ──────────────────────────────────────────────────────────

const FDComplianceCard: React.FC<{ doors: FireDoor[] }> = ({ doors }) => {
  const getStatus = (d: FireDoor) => fdStatus(d).label;
  const total      = doors.length;
  const nonCompliant = doors.filter(d => getStatus(d) === 'Non Compliant' || getStatus(d) === 'Requires Attention').length;
  const compliant  = doors.filter(d => getStatus(d) === 'Compliant').length;
  const dueSoon    = doors.filter(d => getStatus(d) === 'Due Soon').length;
  const overdue    = doors.filter(d => getStatus(d) === 'Overdue').length;

  const nextDue = doors
    .filter(d => d.nextInspectionDue && new Date(d.nextInspectionDue).getTime() > Date.now())
    .sort((a, b) => new Date(a.nextInspectionDue!).getTime() - new Date(b.nextInspectionDue!).getTime())[0];

  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <CheckCircle size={14} className="text-amber-600" /> Fire Door Compliance
          </h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="text-gray-500">Total doors: <span className="font-semibold text-gray-800">{total}</span></div>
            <div className="flex items-center gap-1.5 text-green-700"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Compliant: <span className="font-semibold">{compliant}</span></div>
            {dueSoon > 0 && <div className="flex items-center gap-1.5 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />Due Soon: <span className="font-semibold">{dueSoon}</span></div>}
            {overdue > 0 && <div className="flex items-center gap-1.5 text-red-700"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Overdue: <span className="font-semibold">{overdue}</span></div>}
            {nonCompliant > 0 && <div className="flex items-center gap-1.5 text-orange-800"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />Needs Action: <span className="font-semibold">{nonCompliant}</span></div>}
          </div>
        </div>
        {nextDue && (
          <div className="text-sm text-gray-500 bg-gray-50 border rounded-lg px-3 py-2 min-w-[150px]">
            <div className="text-xs text-gray-400 mb-0.5">Next Inspection Due</div>
            <div className="font-semibold text-gray-800">{fmt(nextDue.nextInspectionDue)}</div>
            <div className="text-xs text-gray-400 truncate max-w-[140px]">{nextDue.doorRef}</div>
          </div>
        )}
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
            <DoorClosed size={18} className="text-amber-500" /> Add Fire Door
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
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
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
            <ClipboardList size={18} className="text-amber-600" /> Log Inspection
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-5 py-3 bg-amber-50 border-b text-sm text-amber-800">
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
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50"
              >
                <Camera size={14} /> Take Photo
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
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

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {!loading && doors.length > 0 && <FDComplianceCard doors={doors} />}

      <div className="flex flex-1 overflow-hidden">
      {/* Left panel */}
      <div className="w-72 shrink-0 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <DoorClosed size={16} className="text-amber-500" /> Fire Doors
            </h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-xs bg-amber-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-amber-700"
              title="Add Door"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <a href="/fire-door-import-template.csv" download className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50">
              <Download size={12} /> Template
            </a>
            <button onClick={() => fdImportRef.current?.click()} disabled={fdImporting} className="flex-1 flex items-center justify-center gap-1 text-xs bg-amber-100 text-amber-700 border border-amber-300 px-2 py-1.5 rounded-lg hover:bg-amber-200 disabled:opacity-50">
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
            className="w-full border rounded-lg px-2 py-1.5 text-sm text-gray-700"
          >
            <option value="all">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-gray-400 text-center">Loading…</div>
          ) : doors.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">
              <DoorClosed size={32} className="mx-auto mb-2 text-gray-300" />
              No fire doors registered
            </div>
          ) : (
            doors.map(door => {
              const isSelected = selectedDoor?.id === door.id;
              const status = fdStatus(door);
              return (
                <button
                  key={door.id}
                  onClick={() => selectDoor(door)}
                  className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition-colors ${isSelected ? 'bg-amber-50 border-l-2 border-l-amber-500' : ''}`}
                >
                  <div className="font-medium text-sm text-gray-900 truncate mb-0.5">{door.doorRef}</div>
                  <div className="text-xs text-gray-500 truncate mb-1.5">{door.location}</div>
                  <div className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium ${status.cls}`}>
                    {status.icon} {status.label}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedDoor ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <DoorClosed size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Select a fire door to view details</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedDoor.doorRef}</h2>
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="text-gray-600 text-sm">{selectedDoor.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                    {DOOR_TYPE_LABELS[selectedDoor.doorType] ?? selectedDoor.doorType}
                  </span>
                  {selectedDoor.fireRating && <span>{selectedDoor.fireRating}</span>}
                  {selectedDoor.site && <span>{selectedDoor.site.name}</span>}
                  <span>{selectedDoor.inspectionFrequencyMonths}-month cycle</span>
                </div>
                <div className="mt-1.5 flex gap-3 text-xs text-gray-400">
                  <span>Last inspected: {fmt(selectedDoor.lastInspectedAt)}</span>
                  <span>Next due: {fmt(selectedDoor.nextInspectionDue)}</span>
                </div>
              </div>
              <button
                onClick={handleDeleteDoor}
                className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete door"
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
                  {tab === 'history' ? <><ClipboardList size={14} className="inline mr-1.5" />Inspection History</> : <><Settings size={14} className="inline mr-1.5" />Door Details</>}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'history' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Inspection History</h3>
                    <button
                      onClick={() => setShowLogModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
                    >
                      <Plus size={14} /> Log Inspection
                    </button>
                  </div>

                  {loadingInspections ? (
                    <div className="text-sm text-gray-400">Loading…</div>
                  ) : inspections.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <ClipboardList size={32} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No inspections recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {inspections.map(insp => {
                        const outcomeCls = insp.outcome === 'pass' ? 'bg-green-100 text-green-700'
                          : insp.outcome === 'fail' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700';
                        return (
                          <div key={insp.id} className="bg-white border rounded-lg p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3 min-w-0">
                                <span className={`shrink-0 mt-0.5 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${outcomeCls}`}>
                                  {insp.outcome === 'pass' ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
                                  {insp.outcome === 'requires_attention' ? 'ATTENTION' : insp.outcome.toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-gray-400">{fmt(insp.inspectedAt)}</span>
                                    <span className="text-xs text-gray-500">by {insp.inspectedBy}</span>
                                  </div>
                                  {insp.accessDenied ? (
                                    <div className="mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                      Access denied: {insp.accessDeniedReason}
                                    </div>
                                  ) : (
                                    <>
                                      {insp.nextInspectionDate && (
                                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                                          <span>Next due: {fmt(insp.nextInspectionDate)}</span>
                                        </div>
                                      )}
                                      {insp.defectsFound && (
                                        <div className="mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                          Defects: {insp.defectsFound}
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {insp.comments && <p className="mt-1 text-xs text-gray-400">{insp.comments}</p>}
                                  {photos.filter(p => p.inspectionId === insp.id).length > 0 && (
                                    <div className="flex gap-1.5 mt-2">
                                      {photos.filter(p => p.inspectionId === insp.id).map(p => (
                                        <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                                          <img src={p.url} alt="Inspection photo" className="w-12 h-12 object-cover rounded border hover:opacity-80" />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteInspection(insp.id)}
                                className="shrink-0 p-1.5 text-red-300 hover:text-red-500 rounded"
                                title="Delete inspection"
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
                  <h3 className="font-medium text-gray-900 mb-4">Door Details</h3>
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
        <AddDoorModal sites={sites} onClose={() => setShowAddModal(false)} onSave={handleAddDoor} />
      )}
      {showLogModal && selectedDoor && (
        <LogInspectionModal door={selectedDoor} onClose={closeLogModal} onSave={handleLogInspection} />
      )}
      </div>
    </div>
  );
};

export default FireDoorsPage;
