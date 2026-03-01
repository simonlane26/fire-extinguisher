import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { fetchExtinguishers, fetchSites } from '../lib/api';
import type { Extinguisher, Site } from '../types';

type EventType = 'inspection' | 'maintenance' | 'expiry';

type CalEvent = {
  date: string; // 'YYYY-MM-DD'
  type: EventType;
  ext: Extinguisher;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateStr(val: string | undefined): string | null {
  if (!val) return null;
  return val.slice(0, 10);
}

function eventLabel(type: EventType): string {
  if (type === 'inspection') return 'Inspection';
  if (type === 'maintenance') return 'Maintenance';
  return 'Expiry';
}

function chipStyle(type: EventType, dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);

  if (diff < 0)  return 'bg-red-100 text-red-700 hover:bg-red-200';
  if (diff <= 7) return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
  if (diff <= 30) return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
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
  if (type === 'inspection')  return 'bg-blue-100 text-blue-700';
  if (type === 'maintenance') return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-600';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

const CalendarPage: React.FC = () => {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([fetchExtinguishers(), fetchSites()])
      .then(([exts, siteList]) => {
        setExtinguishers(exts);
        setSites(siteList);
      })
      .finally(() => setLoading(false));
  }, []);

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
    const pairs: [string | undefined, EventType][] = [
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
    if (selected?.ext.id === ev.ext.id && selected?.type === ev.type && selected?.date === ev.date) {
      setSelected(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;

    // Position below the chip, clamped to right edge
    let left = rect.left + scrollLeft;
    const popoverWidth = 288;
    const maxLeft = (containerRect ? containerRect.right + scrollLeft : window.innerWidth) - popoverWidth - 8;
    if (left > maxLeft) left = maxLeft;

    setPopoverPos({ top: rect.bottom + scrollTop + 4, left });
    setSelected(ev);
  }

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
                      onClick={e => handleChipClick(e, ev)}
                      className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate transition-colors ${chipStyle(ev.type, ev.date)}`}
                    >
                      <span className="font-medium">{eventLabel(ev.type)}</span>
                      <span className="opacity-75"> · {ev.ext.location}</span>
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
          { label: 'Overdue',          cls: 'bg-red-100 border-red-300' },
          { label: 'Due ≤ 7 days',     cls: 'bg-orange-100 border-orange-300' },
          { label: 'Due ≤ 30 days',    cls: 'bg-amber-100 border-amber-300' },
          { label: 'Inspection',       cls: 'bg-blue-100 border-blue-300' },
          { label: 'Maintenance',      cls: 'bg-purple-100 border-purple-300' },
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
                {eventLabel(selected.type)} Due
              </span>
              <div className="font-semibold text-gray-900 truncate">{selected.ext.type}</div>
              {selected.ext.capacity && (
                <div className="text-xs text-gray-500">{selected.ext.capacity}</div>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={13} className="shrink-0 mt-0.5" />
              <div>
                <div>{selected.ext.location}</div>
                {selected.ext.building && (
                  <div className="text-xs text-gray-500">{selected.ext.building}</div>
                )}
                {selected.ext.site && (
                  <div className="text-xs text-gray-400">{selected.ext.site.name}</div>
                )}
              </div>
            </div>

            <div className="flex justify-between text-gray-600 border-t pt-2 mt-2">
              <span className="font-medium">Due date</span>
              <span>{formatDate(selected.date)}</span>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
