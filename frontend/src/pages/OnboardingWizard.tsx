// frontend/src/pages/OnboardingWizard.tsx
// ─── Fully self-contained onboarding wizard ─────────────────────────────────
// All step components are kept inline to minimise file count.
// Adapts the firexcheck-onboarding design to this Vite/React/NestJS stack.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import {
  Flame, Building2, Shield, QrCode, ArrowRight, Sparkles, Clock,
  MapPin, AlertCircle, Plus, Upload, Trash2, Download, CheckCircle2,
  AlertTriangle, X, FileSpreadsheet, ChevronLeft, ChevronRight,
  SkipForward, Check, Activity, PartyPopper, Image as ImageIcon, Printer,
} from 'lucide-react';
import { createSite, addExtinguisher } from '../lib/api';
import type { AuthedUser, Tenant } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type ExtType = 'CO2' | 'Water' | 'Foam' | 'Powder' | 'Wet Chemical';
type ExtCondition = 'Excellent' | 'Good' | 'Needs Attention' | 'Out of Service';
type FloorLevel = 'Basement' | 'Ground' | 'First' | 'Second' | 'Third' | 'Fourth' | 'Fifth';

interface ExtEntry {
  id: string;
  location: string;
  floor: FloorLevel;
  type: ExtType;
  size: string;
  condition: ExtCondition;
}

interface CompanyForm { name: string; email: string; phone: string; }
interface SiteForm    { name: string; address: string; postcode: string; phone: string; }

// ─── Constants ───────────────────────────────────────────────────────────────

const EXT_TYPES: ExtType[] = ['CO2', 'Water', 'Foam', 'Powder', 'Wet Chemical'];

const EXT_SIZES: Record<ExtType, string[]> = {
  CO2:            ['2kg', '5kg'],
  Water:          ['6L',  '9L'],
  Foam:           ['6L',  '9L'],
  Powder:         ['1kg', '2kg', '4kg', '6kg', '9kg'],
  'Wet Chemical': ['3L',  '6L'],
};

const FLOORS: FloorLevel[] = ['Basement', 'Ground', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];
const CONDITIONS: ExtCondition[] = ['Excellent', 'Good', 'Needs Attention', 'Out of Service'];

const STEPS = [
  { id: 'welcome',       label: 'Welcome'      },
  { id: 'company',       label: 'Company'      },
  { id: 'site',          label: 'First Site'   },
  { id: 'extinguishers', label: 'Extinguishers'},
  { id: 'qrcodes',       label: 'QR Codes'     },
  { id: 'dashboard',     label: 'Dashboard'    },
];

const DEMO_EXTINGUISHERS: ExtEntry[] = [
  { id: 'FE-001', location: 'Reception',    floor: 'Ground', type: 'CO2',          size: '2kg', condition: 'Good'            },
  { id: 'FE-002', location: 'Server Room',  floor: 'First',  type: 'CO2',          size: '5kg', condition: 'Excellent'        },
  { id: 'FE-003', location: 'Kitchen',      floor: 'Ground', type: 'Wet Chemical', size: '6L',  condition: 'Good'            },
  { id: 'FE-004', location: 'Workshop',     floor: 'Ground', type: 'Powder',       size: '9kg', condition: 'Needs Attention' },
  { id: 'FE-005', location: 'Stairwell A',  floor: 'Ground', type: 'Water',        size: '9L',  condition: 'Excellent'       },
  { id: 'FE-006', location: 'Lobby',        floor: 'Ground', type: 'Foam',         size: '6L',  condition: 'Good'            },
  { id: 'FE-007', location: 'Car Park',     floor: 'Ground', type: 'Powder',       size: '6kg', condition: 'Out of Service'  },
  { id: 'FE-008', location: 'Board Room',   floor: 'First',  type: 'CO2',          size: '2kg', condition: 'Good'            },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

const isValidEmail   = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPostcode = (v: string) => /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(v.trim());

function conditionBg(c: ExtCondition): string {
  const m: Record<ExtCondition, string> = {
    Excellent:         'bg-green-100 text-green-800 border-green-200',
    Good:              'bg-blue-100 text-blue-800 border-blue-200',
    'Needs Attention': 'bg-amber-100 text-amber-800 border-amber-200',
    'Out of Service':  'bg-red-100 text-red-800 border-red-200',
  };
  return m[c] || 'bg-gray-100 text-gray-600';
}

function typeBg(t: ExtType): string {
  const m: Record<ExtType, string> = {
    CO2:            'bg-gray-100 text-gray-700',
    Water:          'bg-blue-100 text-blue-700',
    Foam:           'bg-teal-100 text-teal-700',
    Powder:         'bg-yellow-100 text-yellow-700',
    'Wet Chemical': 'bg-purple-100 text-purple-700',
  };
  return m[t] || 'bg-gray-100 text-gray-600';
}

function parseCSV(text: string, startId: number): { entries: ExtEntry[]; errors: string[] } {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { entries: [], errors: ['CSV must have a header row and at least one data row'] };

  const headers = lines[0].toLowerCase().split(',').map(h => h.replace(/"/g, '').trim());
  const entries: ExtEntry[] = [];
  const errors:  string[]   = [];

  const colIdx = (...keys: string[]) => {
    for (const k of keys) {
      const i = headers.findIndex(h => h.includes(k));
      if (i >= 0) return i;
    }
    return -1;
  };

  const locCol  = colIdx('location', 'loc');
  const typeCol = colIdx('type');
  const sizeCol = colIdx('size', 'capacity', 'weight');
  const floorCol = colIdx('floor');
  const condCol = colIdx('condition', 'cond');

  for (let i = 1; i < lines.length; i++) {
    const cells    = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
    const location = locCol >= 0 ? cells[locCol] : cells[0];
    if (!location) { errors.push(`Row ${i + 1}: missing location`); continue; }

    const rawType = typeCol >= 0 ? cells[typeCol] : '';
    const type: ExtType = EXT_TYPES.find(t => t.toLowerCase() === rawType.toLowerCase()) ?? 'CO2';

    const rawCond = condCol >= 0 ? cells[condCol] : '';
    const condition: ExtCondition = CONDITIONS.find(c => c.toLowerCase() === rawCond.toLowerCase()) ?? 'Good';

    const rawFloor = floorCol >= 0 ? cells[floorCol] : '';
    const floor: FloorLevel = FLOORS.find(f => f.toLowerCase() === rawFloor.toLowerCase()) ?? 'Ground';

    const size = (sizeCol >= 0 ? cells[sizeCol] : '') || EXT_SIZES[type][0];

    entries.push({ id: `FE-${String(startId + entries.length + 1).padStart(3, '0')}`, location, type, condition, floor, size });
  }

  return { entries, errors };
}

function generateCSVTemplate() {
  return [
    'location,floor,type,size,condition',
    'Reception,Ground,CO2,2kg,Good',
    'Kitchen,Ground,Wet Chemical,6L,Excellent',
    'Server Room,First,CO2,5kg,Good',
  ].join('\n');
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const OnboardingProgress: React.FC<{ currentStep: number; onStepClick: (i: number) => void }> = ({ currentStep, onStepClick }) => (
  <div className="w-full max-w-3xl mx-auto px-4 py-5">
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={step.id} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
          <button
            onClick={() => i <= currentStep && onStepClick(i)}
            disabled={i > currentStep}
            className={`
              w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold
              transition-all duration-300 shrink-0
              ${i < currentStep  ? 'bg-green-500 text-white shadow-md shadow-green-500/20 cursor-pointer hover:bg-green-600'
              : i === currentStep ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/20'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </button>
          {i < STEPS.length - 1 && (
            <div className="flex-1 mx-2 h-0.5 rounded-full">
              <div className={`h-full rounded-full transition-all duration-500 ${i < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
            </div>
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-2">
      {STEPS.map((step, i) => (
        <span
          key={step.id}
          style={{ width: i === 0 || i === STEPS.length - 1 ? 60 : 'auto', textAlign: 'center' }}
          className={`text-[10px] font-medium transition-colors duration-300 ${
            i === currentStep ? 'text-orange-600' : i < currentStep ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          {step.label}
        </span>
      ))}
    </div>
  </div>
);

// ─── Step 0: Welcome ──────────────────────────────────────────────────────────

const WelcomeStep: React.FC<{ onStart: () => void; onDemo: () => void }> = ({ onStart, onDemo }) => (
  <div className="text-center py-8">
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/25">
      <Flame className="w-10 h-10 text-white" />
    </div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome to FireXCheck</h1>
    <p className="text-gray-500 text-base mb-2 max-w-md mx-auto leading-relaxed">
      Let's get your fire safety management system set up. This takes about 5 minutes.
    </p>
    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-400 mb-10">
      <Clock className="w-3.5 h-3.5" />
      <span>~5 minute setup</span>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
      <button
        onClick={onStart}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
      >
        Start Setup <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={onDemo}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-600 border border-gray-200 rounded-xl font-medium text-base hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
      >
        <Sparkles className="w-4 h-4 text-orange-500" /> Try Demo Mode
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
      {[
        { icon: Building2, title: 'Add Sites',      desc: 'Set up your locations',        color: 'text-blue-600 bg-blue-50'   },
        { icon: Shield,    title: 'Track Assets',   desc: 'Manage all extinguishers',     color: 'text-green-600 bg-green-50' },
        { icon: QrCode,    title: 'Generate QR',    desc: 'Print & scan codes',           color: 'text-violet-600 bg-violet-50'},
      ].map(f => (
        <div key={f.title} className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center mx-auto mb-3`}>
            <f.icon className="w-5 h-5" />
          </div>
          <div className="font-semibold text-sm text-gray-900 mb-1">{f.title}</div>
          <div className="text-xs text-gray-500">{f.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Step 1: Company ──────────────────────────────────────────────────────────

const CompanyStep: React.FC<{ company: CompanyForm; onChange: (u: Partial<CompanyForm>) => void }> = ({ company, onChange }) => {
  const fields: { key: keyof CompanyForm; label: string; placeholder: string; type?: string; required?: boolean; validate?: (v: string) => boolean; hint?: string }[] = [
    { key: 'name',  label: 'Company Name',   placeholder: 'e.g. ABC Fire Services Ltd',  required: true },
    { key: 'email', label: 'Contact Email',  placeholder: 'you@company.co.uk', type: 'email', required: true, validate: isValidEmail,         hint: 'Receives alerts from QR code scans' },
    { key: 'phone', label: 'Phone Number',   placeholder: 'e.g. 01234 567890',  type: 'tel',   validate: v => !v || v.length >= 10, hint: 'Optional — shown on client reports' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Company Details</h2>
          <p className="text-sm text-gray-500">Tell us about your fire safety business</p>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {fields.map(f => {
          const value = company[f.key] || '';
          const invalid = value.length > 0 && f.validate && !f.validate(value);
          return (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
              </label>
              <input
                type={f.type || 'text'}
                value={value}
                onChange={e => onChange({ [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none placeholder:text-gray-300 ${
                  invalid
                    ? 'border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-400'
                    : 'border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white'
                }`}
              />
              {invalid && (
                <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                  <AlertCircle className="w-3 h-3" /> Please enter a valid {f.label.toLowerCase()}
                </p>
              )}
              {f.hint && !invalid && <p className="mt-1.5 text-xs text-gray-400">{f.hint}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Step 2: Site ─────────────────────────────────────────────────────────────

const SiteStep: React.FC<{ site: SiteForm; companyName: string; onChange: (u: Partial<SiteForm>) => void }> = ({ site, companyName, onChange }) => {
  const fields: { key: keyof SiteForm; label: string; placeholder: string; required?: boolean; validate?: (v: string) => boolean; half?: boolean }[] = [
    { key: 'name',     label: 'Site Name', placeholder: 'e.g. Chester Office, Building 153', required: true },
    { key: 'address',  label: 'Address',   placeholder: 'Street address',                    required: true },
    { key: 'postcode', label: 'Postcode',  placeholder: 'e.g. CW5 7NZ', required: true, validate: isValidPostcode, half: true },
    { key: 'phone',    label: 'Site Contact Number', placeholder: 'Optional', half: true },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Add Your First Site</h2>
          <p className="text-sm text-gray-500">
            {companyName ? `Where does ${companyName} manage extinguishers?` : 'Where are the extinguishers you manage?'}
          </p>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map(f => {
            const value = site[f.key] || '';
            const invalid = value.length > 0 && f.validate && !f.validate(value);
            return (
              <div key={f.key} className={f.half ? '' : 'sm:col-span-2'}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={e => onChange({ [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none placeholder:text-gray-300 ${
                    invalid
                      ? 'border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-500/20'
                      : 'border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white'
                  }`}
                />
                {invalid && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" /> Please enter a valid {f.label.toLowerCase()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
          <p className="text-xs text-blue-700 leading-relaxed">
            <span className="font-semibold">Tip:</span> You can add more sites later from the Sites tab. Each site can have its own buildings, floors, and extinguisher inventory.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Step 3: Extinguishers ────────────────────────────────────────────────────

const ExtinguishersStep: React.FC<{
  extinguishers: ExtEntry[];
  siteName: string;
  onAdd: (e: Omit<ExtEntry, 'id'>) => void;
  onRemove: (i: number) => void;
  onImport: (entries: ExtEntry[]) => void;
  onLoadSample: () => void;
}> = ({ extinguishers, siteName, onAdd, onRemove, onImport, onLoadSample }) => {
  const [showForm, setShowForm] = useState(false);
  const [newExt, setNewExt] = useState({ location: '', floor: 'Ground' as FloorLevel, type: 'CO2' as ExtType, size: '2kg', condition: 'Good' as ExtCondition });
  const [csvResult, setCsvResult] = useState<{ count: number; errors: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!newExt.location.trim()) return;
    onAdd(newExt);
    setNewExt({ location: '', floor: 'Ground', type: 'CO2', size: '2kg', condition: 'Good' });
    setShowForm(false);
  };

  const handleTypeChange = (type: ExtType) => {
    setNewExt(n => ({ ...n, type, size: EXT_SIZES[type][0] }));
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = parseCSV(ev.target?.result as string, extinguishers.length);
      if (result.entries.length > 0) onImport(result.entries);
      setCsvResult({ count: result.entries.length, errors: result.errors });
      setTimeout(() => setCsvResult(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const csv  = generateCSVTemplate();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'firexcheck-extinguisher-template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Add Extinguishers</h2>
          <p className="text-sm text-gray-500">
            {siteName ? `Adding to ${siteName}` : 'Add your fire extinguishers'} — {extinguishers.length} added
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowForm(v => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Manual
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleCSV} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-green-200 text-green-700 hover:bg-green-50 rounded-xl text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4 text-orange-500" /> Sample Data
          </button>
        </div>
      </div>

      {/* CSV feedback */}
      {csvResult && (
        <div className={`mb-4 p-4 rounded-xl border flex items-start gap-3 ${csvResult.count > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {csvResult.count > 0
            ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            : <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
          <div className="flex-1 text-sm">
            {csvResult.count > 0 && (
              <p className="text-green-800 font-medium">Imported {csvResult.count} extinguisher{csvResult.count !== 1 ? 's' : ''} successfully</p>
            )}
            {csvResult.errors.map((err, i) => <p key={i} className="text-red-700">{err}</p>)}
          </div>
          <button onClick={() => setCsvResult(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-5 rounded-2xl border border-orange-200 bg-orange-50/30">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Location *</label>
              <input
                value={newExt.location}
                onChange={e => setNewExt(n => ({ ...n, location: e.target.value }))}
                placeholder="e.g. Reception"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Floor</label>
              <select value={newExt.floor} onChange={e => setNewExt(n => ({ ...n, floor: e.target.value as FloorLevel }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-500/20">
                {FLOORS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
              <select value={newExt.type} onChange={e => handleTypeChange(e.target.value as ExtType)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-500/20">
                {EXT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Size</label>
              <select value={newExt.size} onChange={e => setNewExt(n => ({ ...n, size: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-500/20">
                {EXT_SIZES[newExt.type].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Condition</label>
              <select value={newExt.condition} onChange={e => setNewExt(n => ({ ...n, condition: e.target.value as ExtCondition }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-500/20">
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                disabled={!newExt.location.trim()}
                className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table or empty state */}
      {extinguishers.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_100px_80px_80px_130px_40px] gap-2 px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b bg-gray-50/50">
            <div>Location</div><div>Type</div><div>Size</div><div>Floor</div><div>Condition</div><div />
          </div>
          {extinguishers.map((ext, i) => (
            <div key={ext.id} className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_100px_80px_80px_130px_40px] gap-1 sm:gap-2 px-5 py-3 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
              <div>
                <span className="font-medium text-sm text-gray-900">{ext.location}</span>
                <span className="sm:hidden text-xs text-gray-400 ml-2">{ext.type} · {ext.size}</span>
              </div>
              <div className="hidden sm:block">
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${typeBg(ext.type)}`}>{ext.type}</span>
              </div>
              <div className="hidden sm:block text-xs text-gray-500">{ext.size}</div>
              <div className="hidden sm:block text-xs text-gray-500">{ext.floor}</div>
              <div>
                <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${conditionBg(ext.condition)}`}>{ext.condition}</span>
              </div>
              <div className="hidden sm:flex justify-end">
                <button onClick={() => onRemove(i)} className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-4xl mb-3">🧯</div>
          <p className="font-medium text-gray-700 mb-1">No extinguishers yet</p>
          <p className="text-sm text-gray-400 mb-4">Add manually, import a CSV, or load sample data</p>
          <button onClick={downloadTemplate} className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-medium">
            <Download className="w-3.5 h-3.5" /> Download CSV template
          </button>
        </div>
      )}

      {extinguishers.length > 0 && (
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
          <button onClick={downloadTemplate} className="inline-flex items-center gap-1 hover:text-orange-600 transition-colors">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Download CSV template
          </button>
          <span>·</span>
          <span>{extinguishers.length} extinguisher{extinguishers.length !== 1 ? 's' : ''} ready</span>
        </div>
      )}
    </div>
  );
};

// ─── Step 4: QR Codes ─────────────────────────────────────────────────────────

const QRCodesStep: React.FC<{ count: number; generated: boolean; onGenerate: () => void }> = ({ count, generated, onGenerate }) => {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); onGenerate(); }, 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
          <QrCode className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Generate QR Codes</h2>
          <p className="text-sm text-gray-500">Create scannable labels for {count} extinguisher{count !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        {!generated && !generating && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
              {[
                { icon: ImageIcon, label: 'Include Logo',      desc: 'Company branding on labels', color: 'text-orange-600 bg-orange-50' },
                { icon: QrCode,    label: 'Location Labels',   desc: 'Print location below QR',    color: 'text-blue-600 bg-blue-50'    },
                { icon: Printer,   label: 'High Resolution',   desc: '2× scale for printing',      color: 'text-green-600 bg-green-50'  },
              ].map(opt => (
                <div key={opt.label} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30">
                  <div className={`w-8 h-8 rounded-lg ${opt.color} flex items-center justify-center mx-auto mb-2`}>
                    <opt.icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-gray-700">{opt.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</div>
                </div>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={count === 0}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-xl hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
            >
              <QrCode className="w-5 h-5" /> Generate {count} QR Code{count !== 1 ? 's' : ''}
            </button>
            {count === 0 && <p className="mt-3 text-xs text-gray-400">Go back and add extinguishers first</p>}
            <p className="mt-4 text-xs text-gray-400">You can also skip this and generate QR codes later from the QR Codes tab</p>
          </>
        )}
        {generating && (
          <div className="py-10">
            <div className="w-12 h-12 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-medium text-gray-700">Generating QR codes…</p>
            <p className="text-sm text-gray-400 mt-1">Creating branded labels for {count} extinguisher{count !== 1 ? 's' : ''}</p>
          </div>
        )}
        {generated && !generating && (
          <div>
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{count} QR Codes Ready!</h3>
            <p className="text-sm text-gray-500 mb-6">Find them in the QR Codes tab after completing setup</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-100 text-violet-700 rounded-xl text-sm font-semibold">
                <QrCode className="w-4 h-4" /> Available in QR Codes tab
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Step 5: Dashboard Preview ────────────────────────────────────────────────

const DashboardStep: React.FC<{
  company: CompanyForm;
  site: SiteForm;
  extinguishers: ExtEntry[];
  demoMode: boolean;
  saving: boolean;
  error: string | null;
  onComplete: () => void;
}> = ({ company, site, extinguishers, demoMode, saving, error, onComplete }) => {
  const activeCount     = extinguishers.filter(e => e.condition !== 'Out of Service').length;
  const attentionCount  = extinguishers.filter(e => e.condition === 'Needs Attention' || e.condition === 'Out of Service').length;
  const complianceRate  = extinguishers.length > 0
    ? Math.round((extinguishers.filter(e => e.condition === 'Excellent' || e.condition === 'Good').length / extinguishers.length) * 100)
    : 0;

  return (
    <div>
      {/* Celebration header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-4">
          <PartyPopper className="w-4 h-4" />
          {demoMode ? 'Demo Dashboard' : 'Setup Complete!'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
          {demoMode ? "Here's what your dashboard looks like" : "You're all set!"}
        </h2>
        <p className="text-sm text-gray-500">
          {demoMode ? 'This is a preview with sample data' : `${company.name || 'Your company'} is ready to manage fire safety`}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-80">Total Extinguishers</span>
            <Flame className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold">{extinguishers.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-80">Active Units</span>
            <Shield className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold">{activeCount}</div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-80">Needs Attention</span>
            <AlertTriangle className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold">{attentionCount}</div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-80">Compliance Rate</span>
            <Activity className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold">{complianceRate}%</div>
        </div>
      </div>

      {/* Table preview */}
      {extinguishers.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm text-gray-900">{site.name || 'Your Site'}</span>
              <span className="text-xs text-gray-400 ml-2">{extinguishers.length} extinguishers</span>
            </div>
          </div>
          {extinguishers.slice(0, 5).map((ext, i) => (
            <div key={`${ext.id}-${i}`} className="grid grid-cols-[minmax(0,1fr)_90px_70px_110px] gap-2 px-5 py-3 items-center text-sm border-b border-gray-50 last:border-0">
              <div className="font-medium text-gray-800 truncate">{ext.location}</div>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${typeBg(ext.type)}`}>{ext.type}</span>
              <span className="text-xs text-gray-500">{ext.size}</span>
              <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${conditionBg(ext.condition)}`}>{ext.condition}</span>
            </div>
          ))}
          {extinguishers.length > 5 && (
            <div className="px-5 py-2.5 text-center text-xs text-gray-400 bg-gray-50/50">
              + {extinguishers.length - 5} more extinguishers
            </div>
          )}
        </div>
      )}

      {/* Compliance bar */}
      {extinguishers.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-gray-900">Compliance Rate</span>
            <span className="text-xl font-bold" style={{ color: complianceRate >= 80 ? '#16a34a' : complianceRate >= 50 ? '#f59e0b' : '#dc2626' }}>
              {complianceRate}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${complianceRate}%`,
                background: complianceRate >= 80 ? 'linear-gradient(90deg,#16a34a,#4ade80)' : complianceRate >= 50 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#dc2626,#f87171)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{extinguishers.filter(e => e.condition === 'Excellent' || e.condition === 'Good').length} compliant</span>
            <span>{attentionCount} need action</span>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* CTA */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {demoMode ? 'Ready to set up your real account?' : 'Your dashboard is live!'}
        </h3>
        <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
          {demoMode
            ? 'Close the demo and start your setup, or skip onboarding to go straight to the dashboard'
            : 'Start recording inspections and generating compliance reports'}
        </p>
        <button
          onClick={onComplete}
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-xl hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all duration-200"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
          ) : (
            <>{demoMode ? 'Go to Dashboard' : 'Go to Dashboard'} <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Main Wizard ──────────────────────────────────────────────────────────────

interface OnboardingWizardProps {
  currentUser: AuthedUser & { tenant: Tenant };
  onComplete: () => void;
}

const STORAGE_KEY = (tenantId: string) => `firexcheck_onboarded_${tenantId}`;

export function markOnboardingComplete(tenantId: string) {
  localStorage.setItem(STORAGE_KEY(tenantId), 'true');
}

export function needsOnboarding(role: string, tenantId: string): boolean {
  if (!['admin', 'super_admin'].includes(role)) return false;
  return !localStorage.getItem(STORAGE_KEY(tenantId));
}

export default function OnboardingWizard({ currentUser, onComplete }: OnboardingWizardProps) {
  const [step, setStep]       = useState(0);
  const [demoMode, setDemoMode] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [company, setCompany] = useState<CompanyForm>({
    name:  currentUser.tenant.companyName || '',
    email: currentUser.tenant.contactEmail || currentUser.email || '',
    phone: '',
  });

  const [site, setSite] = useState<SiteForm>({
    name: '', address: '', postcode: '', phone: '',
  });

  const [extinguishers, setExtinguishers] = useState<ExtEntry[]>([]);

  const totalSteps = STEPS.length;

  // ── Validation per step ──────────────────────────────────────────────────
  const canProceed = (s: number): boolean => {
    if (s === 1) return !!company.name && !!company.email && isValidEmail(company.email);
    if (s === 2) return !!site.name && !!site.address && !!site.postcode;
    return true;
  };

  // ── Actions ──────────────────────────────────────────────────────────────
  const goNext = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const goBack = () => setStep(s => Math.max(s - 1, 0));

  const activateDemo = () => {
    setDemoMode(true);
    setCompany({ name: 'Acme Fire Services', email: 'info@acmefire.co.uk', phone: '0161 234 5678' });
    setSite({ name: 'Main Office', address: '14 High Street', postcode: 'M1 4BT', phone: '0161 234 5678' });
    setExtinguishers(DEMO_EXTINGUISHERS);
    setStep(totalSteps - 1); // Jump to dashboard
  };

  const addExt = (e: Omit<ExtEntry, 'id'>) => {
    setExtinguishers(prev => [...prev, { ...e, id: `FE-${String(prev.length + 1).padStart(3, '0')}` }]);
  };

  const removeExt = (i: number) => {
    setExtinguishers(prev => prev.filter((_, idx) => idx !== i));
  };

  const importExts = (entries: ExtEntry[]) => {
    setExtinguishers(prev => [...prev, ...entries]);
  };

  const loadSample = () => {
    setExtinguishers(DEMO_EXTINGUISHERS);
  };

  // ── Skip onboarding entirely ─────────────────────────────────────────────
  const skipOnboarding = () => {
    markOnboardingComplete(currentUser.tenantId);
    onComplete();
  };

  // ── Complete wizard — save data then redirect ─────────────────────────────
  const handleComplete = async () => {
    markOnboardingComplete(currentUser.tenantId);

    // Demo mode — just dismiss without API calls
    if (demoMode || (extinguishers.length === 0 && !site.name)) {
      onComplete();
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      // Create site if name provided
      let siteId: string | undefined;
      if (site.name) {
        const createdSite = await createSite({
          name:         site.name,
          address:      site.address || undefined,
          postcode:     site.postcode || undefined,
          contactPhone: site.phone   || undefined,
        });
        siteId = createdSite.id;
      }

      // Create extinguishers
      for (const ext of extinguishers) {
        await addExtinguisher({
          location:  ext.location,
          building:  site.name || 'Main Building',
          floor:     ext.floor,
          type:      ext.type,
          weight:    ext.size,
          condition: ext.condition,
          status:    ext.condition === 'Out of Service' ? 'Out of Service' : 'Active',
          siteId:    siteId,
        });
      }

      onComplete();
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save. Please try again.');
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 tracking-tight">FireXCheck</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Setup Wizard</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Step {step + 1} of {totalSteps}</span>
            <button
              onClick={skipOnboarding}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
            >
              Skip setup
            </button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <OnboardingProgress currentStep={step} onStepClick={i => i <= step && setStep(i)} />

      {/* Step content */}
      <main className="max-w-3xl mx-auto px-4 pb-32">
        {step === 0 && <WelcomeStep onStart={goNext} onDemo={activateDemo} />}
        {step === 1 && <CompanyStep company={company} onChange={u => setCompany(c => ({ ...c, ...u }))} />}
        {step === 2 && <SiteStep site={site} companyName={company.name} onChange={u => setSite(s => ({ ...s, ...u }))} />}
        {step === 3 && (
          <ExtinguishersStep
            extinguishers={extinguishers}
            siteName={site.name}
            onAdd={addExt}
            onRemove={removeExt}
            onImport={importExts}
            onLoadSample={loadSample}
          />
        )}
        {step === 4 && <QRCodesStep count={extinguishers.length} generated={qrGenerated} onGenerate={() => setQrGenerated(true)} />}
        {step === 5 && (
          <DashboardStep
            company={company}
            site={site}
            extinguishers={extinguishers}
            demoMode={demoMode}
            saving={saving}
            error={saveError}
            onComplete={handleComplete}
          />
        )}
      </main>

      {/* Bottom nav — hidden on Welcome (0) and Dashboard (5) */}
      {step > 0 && step < totalSteps - 1 && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-3">
              {/* Skip optional QR step */}
              {step === 4 && (
                <button onClick={goNext} className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                  <SkipForward className="w-4 h-4" /> Skip
                </button>
              )}
              <button
                onClick={goNext}
                disabled={!canProceed(step)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20"
              >
                {step === 4 ? 'View Dashboard' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
