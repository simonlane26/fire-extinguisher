import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, MapPin, X, Plug, Lightbulb } from 'lucide-react';
import { fetchExtinguishers, fetchSites, faGetSystems, patGetAppliances, elGetLuminaires } from '../lib/api';
import type { Extinguisher, FireAlarmSystem, PATAppliance, EmergencyLuminaire, Site } from '../types';

type EventType = 'inspection' | 'maintenance' | 'expiry' | 'fire_alarm' | 'pat_test' | 'el_test';

type CalEvent =
  | { date: string; type: Exclude<EventType, 'fire_alarm' | 'pat_test' | 'el_test'>; ext: Extinguisher }
  | { date: string; type: 'fire_alarm'; label: string; system: FireAlarmSystem }
  | { date: string; type: 'pat_test'; label: string; appliance: PATAppliance }
  | { date: string; type: 'el_test'; label: string; luminaire: EmergencyLuminaire };

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateStr(val: string | undefined): string | null {
  if (!val) return null;
  return val.slice(0, 10);
}

function eventLabel(ev: CalEvent): string {
  if (ev.type === 'fire_alarm') return ev.label;
  if (ev.type === 'pat_test') return ev.label;
  if (ev.type === 'el_test') return ev.label;
  if (ev.type === 'inspection') return 'Inspection';
  if (ev.type === 'maintenance') return 'Maintenance';
  return 'Expiry';
}

function chipStyle(type: EventType, dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);

  if (diff < 0)  return 'bg-red-100 text-red-700 hover:bg-red-200';
  if (diff <= 7) return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
  if (diff <= 30) return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
  if (type === 'fire_alarm')  return 'bg-rose-100 text-rose-700 hover:bg-rose-200';
  if (type === 'pat_test')    return 'bg-violet-100 text-violet-700 hover:bg-violet-200';
  if (type === 'el_test')     return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
  if (type === 'inspection')  return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
  if (type === 'maintenance') return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
  return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
}

function badgeStyle(type: EventType, dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);

  if (diff < 0)  return 'bg-red-100 text-red-700';
  if (diff <= 7) return 'bg-orange-100 text-orange-700';
  if (diff <= 30) return 'bg-amber-100 text-amber-700';
  if (type === 'fire_alarm')  return 'bg-rose-100 text-rose-700';
  if (type === 'pat_test')    return 'bg-violet-100 text-violet-700';
  if (type === 'el_test')     return 'bg-amber-100 text-amber-700';
  if (type === 'inspection')  return 'bg-blue-100 text-blue-700';
  if (type === 'maintenance') return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-600';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

const CalendarPage: React.FC<{
  fireAlarmEnabled?: boolean;
  patTestingEnabled?: boolean;
  emergencyLightingEnabled?: boolean;
  onNavigateToFireAlarm?: () => void;
  onNavigateToPAT?: (id: string) => void;
  onNavigateToEL?: (id: string) => void;
  onNavigateToExtinguisher?: (id: string) => void;
}> = ({
  fireAlarmEnabled = false,
  patTestingEnabled = false,
  emergencyLightingEnabled = false,
  onNavigateToFireAlarm,
  onNavigateToPAT,
  onNavigateToEL,
  onNavigateToExtinguisher,
}) => {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [fireAlarmSystems, setFireAlarmSystems] = useState<FireAlarmSystem[]>([]);
  const [patAppliances, setPatAppliances] = useState<PATAppliance[]>([]);
  const [elLuminaires, setElLuminaires] = useState<EmergencyLuminaire[]>([]);
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetches: Promise<unknown>[] = [fetchExtinguishers(), fetchSites()];
    if (fireAlarmEnabled) fetches.push(faGetSystems());
    if (patTestingEnabled) fetches.push(patGetAppliances());
    if (emergencyLightingEnabled) fetches.push(elGetLuminaires());
    Promise.all(fetches)
      .then((results) => {
        const [exts, siteList, ...rest] = results;
        setExtinguishers(exts as Extinguisher[]);
        setSites(siteList as Site[]);
        let idx = 0;
        if (fireAlarmEnabled) setFireAlarmSystems(rest[idx++] as FireAlarmSystem[]);
        if (patTestingEnabled) setPatAppliances(rest[idx++] as PATAppliance[]);
        if (emergencyLightingEnabled) setElLuminaires(rest[idx] as EmergencyLuminaire[]);
      })
      .finally(() => setLoading(false));
  }, [fireAlarmEnabled, patTestingEnabled, emergencyLightingEnabled]);

  // Close popover on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSelected(null);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const filtered = siteFilter === 'all'
    ? extinguishers
    : extinguishers.filter(e => e.siteId === siteFilter);

  // Build events indexed by 'YYYY-MM-DD'
  const eventsByDay: Record<string, CalEvent[]> = {};
  for (const ext of filtered) {
    const pairs: [string | undefined, Exclude<EventType, 'fire_alarm' | 'pat_test' | 'el_test'>][] = [
      [ext.nextInspection,  'inspection'],
      [ext.nextMaintenance, 'maintenance'],
      [ext.expiryDate,      'expiry'],
    ];
    for (const [val, type] of pairs) {
      const ds = toDateStr(val);
      if (!ds) continue;
      if (!eventsByDay[ds]) eventsByDay[ds] = [];
      eventsByDay[ds].push({ date: ds, type, ext });
    }
  }

  // Fire alarm next-due events
  const filteredSystems = siteFilter === 'all'
    ? fireAlarmSystems
    : fireAlarmSystems.filter(s => s.siteId === siteFilter);
  for (const sys of filteredSystems) {
    const pairs: [string | null | undefined, string][] = [
      [sys.nextWeeklyDue,      'Weekly Test Due'],
      [sys.nextMonthlyDue,     'Monthly Inspection Due'],
      [sys.nextQuarterlyDue,   'Quarterly Inspection Due'],
      [sys.nextSixMonthlyDue,  '6-Monthly Inspection Due'],
      [sys.nextAnnualDue,      'Annual Inspection Due'],
    ];
    const sysLabel = sys.name ? `${sys.systemRef} — ${sys.name}` : sys.systemRef;
    for (const [val, prefix] of pairs) {
      const ds = toDateStr(val ?? undefined);
      if (!ds) continue;
      if (!eventsByDay[ds]) eventsByDay[ds] = [];
      eventsByDay[ds].push({ date: ds, type: 'fire_alarm', label: `${prefix}: ${sysLabel}`, system: sys });
    }
  }

  // PAT test next-due events
  const filteredPATAppliances = siteFilter === 'all'
    ? patAppliances
    : patAppliances.filter(a => a.siteId === siteFilter);
  for (const appliance of filteredPATAppliances) {
    const ds = toDateStr(appliance.nextTestDue ?? undefined);
    if (!ds) continue;
    if (!eventsByDay[ds]) eventsByDay[ds] = [];
    eventsByDay[ds].push({
      date: ds,
      type: 'pat_test',
      label: `PAT Due: ${appliance.applianceRef} — ${appliance.description}`,
      appliance,
    });
  }

  // Emergency lighting next-due events
  const filteredELLuminaires = siteFilter === 'all'
    ? elLuminaires
    : elLuminaires.filter(l => l.siteId === siteFilter);
  const elDueFields: { field: keyof EmergencyLuminaire; prefix: string }[] = [
    { field: 'nextMonthlyDue',     prefix: 'EL Monthly' },
    { field: 'nextAnnualDue',      prefix: 'EL Annual' },
    { field: 'nextThreeYearlyDue', prefix: 'EL 3-Yearly' },
  ];
  for (const luminaire of filteredELLuminaires) {
    for (const { field, prefix } of elDueFields) {
      const val = luminaire[field] as string | null | undefined;
      const ds = toDateStr(val ?? undefined);
      if (!ds) continue;
      if (!eventsByDay[ds]) eventsByDay[ds] = [];
      eventsByDay[ds].push({
        date: ds,
        type: 'el_test',
        label: `${prefix}: ${luminaire.luminaireRef} — ${luminaire.description}`,
        luminaire,
      });
    }
  }

  // Calendar grid
  const startDow   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = today.toISOString().slice(0, 10);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function handleChipClick(e: React.MouseEvent, ev: CalEvent) {
    e.stopPropagation();
    const getKey = (e: CalEvent) => e.type === 'fire_alarm' ? e.system.id + e.label : e.type === 'pat_test' ? e.appliance.id : e.type === 'el_test' ? e.luminaire.id + e.label : e.ext.id;
    const selKey = selected ? getKey(selected) : null;
    const evKey = getKey(ev);
    if (selKey && selected?.type === ev.type && selected?.date === ev.date && selKey === evKey) {
      setSelected(null);
      return;
    }

    // getBoundingClientRect() returns viewport coords — correct for position:fixed
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const popoverWidth = 288;   // w-72
    const popoverHeight = 320;  // generous estimate; post-render clamp handles the rest
    const gap = 6;
    const pad = 8;

    // Horizontal: clamp so card never overflows left or right edge
    let left = rect.left;
    const maxLeft = window.innerWidth - popoverWidth - pad;
    if (left > maxLeft) left = maxLeft;
    if (left < pad) left = pad;

    // Vertical: prefer below chip; flip above when not enough room
    const spaceBelow = window.innerHeight - rect.bottom;
    let top: number;
    if (spaceBelow >= popoverHeight + gap + pad) {
      top = rect.bottom + gap;
    } else {
      top = rect.top - popoverHeight - gap;
      // If it would clip the top, push it down to stay within viewport
      if (top < pad) top = pad;
    }

    setPopoverPos({ top, left });
    setSelected(ev);
  }

  // After the popover renders, nudge it back into the viewport if the estimated
  // height was too short (i.e. the card is actually taller than popoverHeight).
  useEffect(() => {
    if (!popoverRef.current || !popoverPos) return;
    const r = popoverRef.current.getBoundingClientRect();
    const pad = 8;
    let { top, left } = popoverPos;
    let changed = false;
    if (r.bottom > window.innerHeight - pad) {
      top -= r.bottom - (window.innerHeight - pad);
      changed = true;
    }
    if (top < pad) { top = pad; changed = true; }
    if (r.right > window.innerWidth - pad) {
      left -= r.right - (window.innerWidth - pad);
      changed = true;
    }
    if (left < pad) { left = pad; changed = true; }
    if (changed) setPopoverPos({ top, left });
  }, [selected]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading calendar…
      </div>
    );
  }

  return (
    <div ref={containerRef} className="p-4 md:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Calendar</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Upcoming inspection, maintenance and expiry dates
          </p>
        </div>
        <select
          value={siteFilter}
          onChange={e => setSiteFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="all">All Sites</option>
          {sites.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-semibold text-gray-900 text-lg">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 divide-x divide-y border-t">
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`e-${idx}`} className="min-h-[90px] bg-gray-50/60" />;
            }

            const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = ds === todayStr;
            const events = eventsByDay[ds] ?? [];
            const shown = events.slice(0, 3);
            const overflow = events.length - shown.length;

            return (
              <div
                key={ds}
                className={`min-h-[90px] p-1.5 ${isToday ? 'bg-indigo-50' : ''}`}
              >
                {/* Day number */}
                <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700'
                }`}>
                  {day}
                </div>

                {/* Event chips */}
                <div className="space-y-0.5">
                  {shown.map((ev, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={e => handleChipClick(e, ev)}
                      className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate transition-colors ${chipStyle(ev.type, ev.date)}`}
                    >
                      {ev.type === 'fire_alarm' ? (
                        <span className="flex items-center gap-0.5"><Bell size={9} className="shrink-0" /><span className="truncate">{ev.label}</span></span>
                      ) : ev.type === 'pat_test' ? (
                        <span className="flex items-center gap-0.5"><Plug size={9} className="shrink-0" /><span className="truncate">{ev.label}</span></span>
                      ) : ev.type === 'el_test' ? (
                        <span className="flex items-center gap-0.5"><Lightbulb size={9} className="shrink-0" /><span className="truncate">{ev.label}</span></span>
                      ) : (
                        <><span className="font-medium">{eventLabel(ev)}</span><span className="opacity-75"> · {ev.ext.location}</span></>
                      )}
                    </button>
                  ))}
                  {overflow > 0 && (
                    <div className="text-xs text-gray-400 pl-1.5">+{overflow} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-600">
        {[
          { label: 'Overdue',           cls: 'bg-red-100 border-red-300' },
          { label: 'Due ≤ 7 days',      cls: 'bg-orange-100 border-orange-300' },
          { label: 'Due ≤ 30 days',     cls: 'bg-amber-100 border-amber-300' },
          { label: 'Inspection',        cls: 'bg-blue-100 border-blue-300' },
          { label: 'Maintenance',       cls: 'bg-purple-100 border-purple-300' },
          ...(fireAlarmEnabled ? [{ label: 'Fire Alarm Test', cls: 'bg-rose-100 border-rose-300' }] : []),
          ...(patTestingEnabled ? [{ label: 'PAT Test Due', cls: 'bg-violet-100 border-violet-300' }] : []),
          ...(emergencyLightingEnabled ? [{ label: 'EL Test Due', cls: 'bg-amber-100 border-amber-300' }] : []),
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm border ${cls}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Event detail popover */}
      {selected && popoverPos && (
        <div
          ref={popoverRef}
          className="fixed z-50 bg-white rounded-xl shadow-xl border p-4 w-72"
          style={{ top: popoverPos.top, left: popoverPos.left }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0">
              <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full mb-1.5 font-medium ${badgeStyle(selected.type, selected.date)}`}>
                {selected.type === 'fire_alarm' ? <Bell size={10} className="mr-1" /> : selected.type === 'pat_test' ? <Plug size={10} className="mr-1" /> : selected.type === 'el_test' ? <Lightbulb size={10} className="mr-1" /> : null}
                {eventLabel(selected)} Due
              </span>
              {selected.type === 'fire_alarm' ? (
                <div className="font-semibold text-gray-900 truncate">{selected.system.systemRef}{selected.system.name ? ` — ${selected.system.name}` : ''}</div>
              ) : selected.type === 'pat_test' ? (
                <div className="font-semibold text-gray-900 truncate">{selected.appliance.applianceRef} — {selected.appliance.description}</div>
              ) : selected.type === 'el_test' ? (
                <div className="font-semibold text-gray-900 truncate">{selected.luminaire.luminaireRef} — {selected.luminaire.description}</div>
              ) : (
                <>
                  <div className="font-semibold text-gray-900 truncate">{selected.ext.type}</div>
                  {selected.ext.capacity && <div className="text-xs text-gray-500">{selected.ext.capacity}</div>}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            {selected.type === 'fire_alarm' ? (
              <>
                {selected.system.site && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={13} className="shrink-0 mt-0.5" />
                    <div>{selected.system.site.name}</div>
                  </div>
                )}
                {selected.system.panelMake && (
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Panel</span>
                    <span>{selected.system.panelMake} {selected.system.panelModel}</span>
                  </div>
                )}
              </>
            ) : selected.type === 'pat_test' ? (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={13} className="shrink-0 mt-0.5" />
                <div>
                  <div>{selected.appliance.location}</div>
                  {selected.appliance.applianceClass && <div className="text-xs text-gray-500">Class {selected.appliance.applianceClass}</div>}
                  {selected.appliance.site && <div className="text-xs text-gray-400">{selected.appliance.site.name}</div>}
                </div>
              </div>
            ) : selected.type === 'el_test' ? (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={13} className="shrink-0 mt-0.5" />
                <div>
                  <div>{selected.luminaire.location}</div>
                  {selected.luminaire.luminaireType && <div className="text-xs text-gray-500">{selected.luminaire.luminaireType.replace(/_/g, ' ')}</div>}
                  {selected.luminaire.site && <div className="text-xs text-gray-400">{selected.luminaire.site.name}</div>}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={13} className="shrink-0 mt-0.5" />
                <div>
                  <div>{selected.ext.location}</div>
                  {selected.ext.building && <div className="text-xs text-gray-500">{selected.ext.building}</div>}
                  {selected.ext.site && <div className="text-xs text-gray-400">{selected.ext.site.name}</div>}
                </div>
              </div>
            )}

            <div className="flex justify-between text-gray-600 border-t pt-2 mt-2">
              <span className="font-medium">Due date</span>
              <span>{formatDate(selected.date)}</span>
            </div>

            {selected.type !== 'fire_alarm' && selected.type !== 'pat_test' && selected.type !== 'el_test' && (
              <>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Status</span>
                  <span className={selected.ext.status === 'Active' ? 'text-green-600' : 'text-red-600'}>
                    {selected.ext.status}
                  </span>
                </div>
                {selected.ext.serialNumber && (
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Serial</span>
                    <span className="font-mono text-xs">{selected.ext.serialNumber}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Navigate to asset */}
          {(
            (selected.type === 'pat_test' && onNavigateToPAT) ||
            (selected.type === 'el_test' && onNavigateToEL) ||
            (selected.type === 'fire_alarm' && onNavigateToFireAlarm) ||
            (selected.type !== 'fire_alarm' && selected.type !== 'pat_test' && selected.type !== 'el_test' && onNavigateToExtinguisher)
          ) && (
            <button
              type="button"
              onClick={() => {
                const ev = selected;
                setSelected(null);
                if (ev.type === 'pat_test' && onNavigateToPAT) onNavigateToPAT(ev.appliance.id);
                else if (ev.type === 'el_test' && onNavigateToEL) onNavigateToEL(ev.luminaire.id);
                else if (ev.type === 'fire_alarm' && onNavigateToFireAlarm) onNavigateToFireAlarm();
                else if (ev.type !== 'fire_alarm' && ev.type !== 'pat_test' && ev.type !== 'el_test' && onNavigateToExtinguisher) onNavigateToExtinguisher(ev.ext.id);
              }}
              className="mt-3 w-full text-sm font-medium py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Open →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
