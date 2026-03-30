import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Calendar, Flame, Building2, Wrench, ArrowRight, BellRing, Plug, Lightbulb } from 'lucide-react';
import HintTooltip from '../components/HintTooltip';
import { fetchExtinguishers, faGetSystems, faGetLogEntries, patGetAppliances, elGetLuminaires } from '../lib/api';
import type { Extinguisher, FireAlarmSystem, FireAlarmLogEntry, PATAppliance, EmergencyLuminaire } from '../types';

type FireAlarmSystemStatus = {
  system: FireAlarmSystem;
  lastWeekly: FireAlarmLogEntry | null;
  lastMonthly: FireAlarmLogEntry | null;
  weeklyOverdue: boolean;
  monthlyOverdue: boolean;
};

type Props = {
  primaryColor?: string;
  onNavigate?: () => void;
  fireAlarmEnabled?: boolean;
  onNavigateFireAlarm?: () => void;
  patTestingEnabled?: boolean;
  onNavigatePATTesting?: () => void;
  emergencyLightingEnabled?: boolean;
  onNavigateEmergencyLighting?: () => void;
};

type ComplianceStats = {
  total: number;
  compliant: number;
  dueWithin30Days: number;
  overdue: number;
  complianceRate: number;
};

type TypeBreakdown = {
  [key: string]: {
    total: number;
    compliant: number;
    overdue: number;
  };
};

type BuildingBreakdown = {
  [key: string]: {
    total: number;
    compliant: number;
    dueWithin30Days: number;
    overdue: number;
    complianceRate: number;
    types: {
      [type: string]: number;
    };
  };
};

const ComplianceDashboard: React.FC<Props> = ({ primaryColor = '#7c3aed', onNavigate, fireAlarmEnabled = false, onNavigateFireAlarm, patTestingEnabled = false, onNavigatePATTesting, emergencyLightingEnabled = false, onNavigateEmergencyLighting }) => {
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [faSystemStatuses, setFaSystemStatuses] = useState<FireAlarmSystemStatus[]>([]);
  const [faLoading, setFaLoading] = useState(false);
  const [patAppliances, setPATAppliances] = useState<PATAppliance[]>([]);
  const [patLoading, setPATLoading] = useState(false);
  const [elLuminaires, setELLuminaires] = useState<EmergencyLuminaire[]>([]);
  const [elLoading, setELLoading] = useState(false);
  const [stats, setStats] = useState<ComplianceStats>({
    total: 0,
    compliant: 0,
    dueWithin30Days: 0,
    overdue: 0,
    complianceRate: 0,
  });
  const [typeBreakdown, setTypeBreakdown] = useState<TypeBreakdown>({});
  const [buildingBreakdown, setBuildingBreakdown] = useState<BuildingBreakdown>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (fireAlarmEnabled) loadFireAlarmData();
  }, [fireAlarmEnabled]);

  useEffect(() => {
    if (patTestingEnabled) {
      setPATLoading(true);
      patGetAppliances().then(setPATAppliances).catch(() => {}).finally(() => setPATLoading(false));
    }
  }, [patTestingEnabled]);

  useEffect(() => {
    if (emergencyLightingEnabled) {
      setELLoading(true);
      elGetLuminaires().then(setELLuminaires).catch(() => {}).finally(() => setELLoading(false));
    }
  }, [emergencyLightingEnabled]);

  const loadFireAlarmData = async () => {
    try {
      setFaLoading(true);
      const systems: FireAlarmSystem[] = await faGetSystems();
      const now = new Date();
      const statuses: FireAlarmSystemStatus[] = await Promise.all(
        systems.map(async (system) => {
          const entries: FireAlarmLogEntry[] = await faGetLogEntries(system.id);
          const sorted = [...entries].sort(
            (a, b) => new Date(b.conductedAt).getTime() - new Date(a.conductedAt).getTime()
          );
          const lastWeekly = sorted.find((e) => e.entryType === 'weekly') ?? null;
          const lastMonthly = sorted.find((e) => e.entryType === 'monthly') ?? null;
          const weeklyOverdue = !lastWeekly ||
            (now.getTime() - new Date(lastWeekly.conductedAt).getTime()) > 7 * 24 * 60 * 60 * 1000;
          const monthlyOverdue = !lastMonthly ||
            (now.getTime() - new Date(lastMonthly.conductedAt).getTime()) > 35 * 24 * 60 * 60 * 1000;
          return { system, lastWeekly, lastMonthly, weeklyOverdue, monthlyOverdue };
        })
      );
      setFaSystemStatuses(statuses);
    } catch (err) {
      console.error('Failed to load fire alarm compliance data:', err);
    } finally {
      setFaLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchExtinguishers();
      setExtinguishers(data);
      calculateStats(data);
    } catch (err) {
      console.error('Failed to load extinguishers:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Extinguisher[]) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    let compliant = 0;
    let dueWithin30Days = 0;
    let overdue = 0;
    const typeStats: TypeBreakdown = {};
    const buildingStats: BuildingBreakdown = {};

    data.forEach((ext) => {
      const nextInspection = ext.nextInspection ? new Date(ext.nextInspection) : null;
      const isOverdue = nextInspection && nextInspection < today;
      const isDueSoon = nextInspection && nextInspection >= today && nextInspection <= thirtyDaysFromNow;
      const isCompliant = nextInspection && nextInspection > thirtyDaysFromNow;

      if (isOverdue) overdue++;
      else if (isDueSoon) dueWithin30Days++;
      else if (isCompliant) compliant++;

      // Type breakdown
      const type = ext.type || 'Unknown';
      if (!typeStats[type]) {
        typeStats[type] = { total: 0, compliant: 0, overdue: 0 };
      }
      typeStats[type].total++;
      if (isCompliant) typeStats[type].compliant++;
      if (isOverdue) typeStats[type].overdue++;

      // Building breakdown
      const building = ext.building || 'Unknown';
      if (!buildingStats[building]) {
        buildingStats[building] = {
          total: 0,
          compliant: 0,
          dueWithin30Days: 0,
          overdue: 0,
          complianceRate: 0,
          types: {},
        };
      }
      buildingStats[building].total++;
      if (isCompliant) buildingStats[building].compliant++;
      if (isDueSoon) buildingStats[building].dueWithin30Days++;
      if (isOverdue) buildingStats[building].overdue++;

      // Track types within this building
      if (!buildingStats[building].types[type]) {
        buildingStats[building].types[type] = 0;
      }
      buildingStats[building].types[type]++;
    });

    // Calculate compliance rate for each building
    Object.keys(buildingStats).forEach((building) => {
      const bStats = buildingStats[building];
      bStats.complianceRate = bStats.total > 0 ? (bStats.compliant / bStats.total) * 100 : 0;
    });

    const complianceRate = data.length > 0 ? (compliant / data.length) * 100 : 0;

    setStats({
      total: data.length,
      compliant,
      dueWithin30Days,
      overdue,
      complianceRate,
    });

    setTypeBreakdown(typeStats);
    setBuildingBreakdown(buildingStats);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading compliance data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
        <p className="text-sm text-gray-600">Real-time fire safety compliance monitoring</p>
      </div>

      {/* Overall Compliance Score */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 inline-flex items-center gap-1">
            Overall Compliance Rate
            <HintTooltip
              storageKey="compliance_rate"
              content="Based on inspection status across all active extinguishers."
            />
          </h2>
          <TrendingUp className="text-green-600" size={24} />
        </div>
        <div className="flex items-end gap-2">
          <div className="text-5xl font-bold" style={{ color: primaryColor }}>
            {stats.complianceRate.toFixed(1)}%
          </div>
          <div className="pb-2 text-sm text-gray-600">
            {stats.compliant} of {stats.total} compliant
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${stats.complianceRate}%`,
              backgroundColor: primaryColor
            }}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-900">Compliant</h3>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-green-700">{stats.compliant}</div>
          <p className="text-xs text-green-600 mt-1">
            Next inspection &gt; 30 days away
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-orange-900">Due Soon</h3>
            <AlertTriangle className="text-orange-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-orange-700">{stats.dueWithin30Days}</div>
          <p className="text-xs text-orange-600 mt-1">
            Inspection due within 30 days
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-red-900">Overdue</h3>
            <XCircle className="text-red-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-red-700">{stats.overdue}</div>
          <p className="text-xs text-red-600 mt-1">
            Inspection overdue - action required
          </p>
        </div>
      </div>

      {/* Compliance by Type */}
      <div className="bg-white rounded-2xl shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Flame size={20} />
            Compliance by Extinguisher Type
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(typeBreakdown)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([type, data]) => {
                const compliancePercent = data.total > 0
                  ? ((data.compliant / data.total) * 100).toFixed(1)
                  : 0;

                return (
                  <div key={type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Flame className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{type}</h3>
                          <p className="text-sm text-gray-600">
                            {data.total} total extinguisher{data.total !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                          {compliancePercent}%
                        </div>
                        <p className="text-xs text-gray-600">compliance</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${compliancePercent}%`,
                          backgroundColor: primaryColor
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-green-600">
                        ✓ {data.compliant} compliant
                      </span>
                      {data.overdue > 0 && (
                        <span className="text-red-600">
                          ✗ {data.overdue} overdue
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {Object.keys(typeBreakdown).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No extinguishers found. Add some to see compliance data.
            </div>
          )}
        </div>
      </div>

      {/* Compliance by Building */}
      <div className="bg-white rounded-2xl shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Building2 size={20} />
            Compliance by Building
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(buildingBreakdown)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([building, data]) => {
                const compliancePercent = data.complianceRate.toFixed(1);

                return (
                  <div key={building} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building2 className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{building}</h3>
                          <p className="text-sm text-gray-600">
                            {data.total} total extinguisher{data.total !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                          {compliancePercent}%
                        </div>
                        <p className="text-xs text-gray-600">compliance</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${compliancePercent}%`,
                          backgroundColor: primaryColor
                        }}
                      />
                    </div>

                    {/* Stats row */}
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="flex gap-4">
                        <span className="text-green-600">
                          ✓ {data.compliant} compliant
                        </span>
                        {data.dueWithin30Days > 0 && (
                          <span className="text-orange-600">
                            ⚠ {data.dueWithin30Days} due soon
                          </span>
                        )}
                        {data.overdue > 0 && (
                          <span className="text-red-600">
                            ✗ {data.overdue} overdue
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Extinguisher types in this building */}
                    <div className="mt-4 pt-3 border-t">
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                        Extinguisher Types
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(data.types)
                          .sort((a, b) => b[1] - a[1])
                          .map(([type, count]) => (
                            <span
                              key={type}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                            >
                              {type}: {count}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {Object.keys(buildingBreakdown).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No buildings found. Add extinguishers to see building data.
            </div>
          )}
        </div>
      </div>

      {/* Fire Alarm Compliance */}
      {fireAlarmEnabled && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BellRing size={20} style={{ color: primaryColor }} />
              Fire Alarm Compliance
            </h2>
            {onNavigateFireAlarm && (
              <button
                onClick={onNavigateFireAlarm}
                className="text-sm flex items-center gap-1 hover:underline"
                style={{ color: primaryColor }}
              >
                Open Logbook <ArrowRight size={14} />
              </button>
            )}
          </div>

          {faLoading ? (
            <div className="text-sm text-gray-500 py-4">Loading fire alarm data...</div>
          ) : faSystemStatuses.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500 text-sm">
              No fire alarm systems configured. Add systems in the Fire Alarm Logbook.
            </div>
          ) : (
            <>
              {/* Summary score */}
              {(() => {
                const compliantCount = faSystemStatuses.filter(
                  (s) => !s.weeklyOverdue && !s.monthlyOverdue
                ).length;
                const score = faSystemStatuses.length > 0
                  ? (compliantCount / faSystemStatuses.length) * 100
                  : 0;
                return (
                  <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-4xl font-bold" style={{ color: primaryColor }}>
                          {score.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {compliantCount} of {faSystemStatuses.length} system{faSystemStatuses.length !== 1 ? 's' : ''} fully up to date
                        </div>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <span className="text-green-600 font-medium">{compliantCount} compliant</span>
                        <span className="text-red-600 font-medium">
                          {faSystemStatuses.filter((s) => s.weeklyOverdue).length} weekly overdue
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${score}%`, backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Per-system cards */}
              <div className="space-y-3">
                {faSystemStatuses.map(({ system, lastWeekly, lastMonthly, weeklyOverdue, monthlyOverdue }) => (
                  <div key={system.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {system.name || system.systemRef}
                        </div>
                        <div className="text-xs text-gray-500">
                          {system.site?.name} · Ref: {system.systemRef}
                        </div>
                      </div>
                      {!weeklyOverdue && !monthlyOverdue ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> Compliant
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                          <XCircle size={12} /> Action needed
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className={`rounded-lg p-3 ${weeklyOverdue ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                        <div className={`text-xs font-medium mb-1 ${weeklyOverdue ? 'text-red-700' : 'text-green-700'}`}>
                          Weekly Test
                        </div>
                        {lastWeekly ? (
                          <div className={`text-xs ${weeklyOverdue ? 'text-red-600' : 'text-green-600'}`}>
                            {weeklyOverdue ? '⚠ Overdue · ' : '✓ '}
                            {new Date(lastWeekly.conductedAt).toLocaleDateString('en-GB')}
                          </div>
                        ) : (
                          <div className="text-xs text-red-600">⚠ Never tested</div>
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${monthlyOverdue ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                        <div className={`text-xs font-medium mb-1 ${monthlyOverdue ? 'text-orange-700' : 'text-green-700'}`}>
                          Monthly Test
                        </div>
                        {lastMonthly ? (
                          <div className={`text-xs ${monthlyOverdue ? 'text-orange-600' : 'text-green-600'}`}>
                            {monthlyOverdue ? '⚠ Overdue · ' : '✓ '}
                            {new Date(lastMonthly.conductedAt).toLocaleDateString('en-GB')}
                          </div>
                        ) : (
                          <div className="text-xs text-orange-600">⚠ None recorded</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Next Actions */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <Wrench size={16} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Next Actions</h3>
        </div>

        {stats.overdue === 0 && stats.dueWithin30Days === 0 ? (
          <div className="flex items-center gap-2 px-5 py-4 text-sm text-green-700">
            <CheckCircle size={16} className="text-green-500 shrink-0" />
            All extinguishers are up to date — great work!
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {stats.overdue > 0 && (
              <li>
                <button
                  type="button"
                  onClick={onNavigate}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-red-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <XCircle size={16} className="text-red-500 shrink-0" />
                    <span className="text-sm text-gray-800">
                      <span className="font-semibold text-red-600">{stats.overdue}</span>
                      {' '}overdue inspection{stats.overdue !== 1 ? 's' : ''} — action required
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </li>
            )}
            {stats.dueWithin30Days > 0 && (
              <li>
                <button
                  type="button"
                  onClick={onNavigate}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={16} className="text-orange-500 shrink-0" />
                    <span className="text-sm text-gray-800">
                      <span className="font-semibold text-orange-600">{stats.dueWithin30Days}</span>
                      {' '}inspection{stats.dueWithin30Days !== 1 ? 's' : ''} due within 30 days
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* PAT Testing Compliance */}
      {patTestingEnabled && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Plug size={20} style={{ color: primaryColor }} />
              PAT Testing Compliance
            </h2>
            {onNavigatePATTesting && (
              <button onClick={onNavigatePATTesting} className="text-sm flex items-center gap-1 hover:underline" style={{ color: primaryColor }}>
                Open PAT Testing <ArrowRight size={14} />
              </button>
            )}
          </div>
          {patLoading ? (
            <p className="text-sm text-gray-400">Loading PAT data…</p>
          ) : (() => {
            const today = Date.now();
            const latestFailed = (a: PATAppliance) => a.tests && a.tests.length > 0 && a.tests[0].outcome === 'fail';
            const nonCompliant  = patAppliances.filter(a => latestFailed(a));
            const compliant     = patAppliances.filter(a => !latestFailed(a) && !!a.nextTestDue && new Date(a.nextTestDue).getTime() - today > 30 * 86_400_000);
            const dueSoon       = patAppliances.filter(a => !latestFailed(a) && !!a.nextTestDue && new Date(a.nextTestDue).getTime() - today <= 30 * 86_400_000 && new Date(a.nextTestDue).getTime() > today);
            const overdue       = patAppliances.filter(a => !latestFailed(a) && !!a.nextTestDue && new Date(a.nextTestDue).getTime() <= today);
            const neverTested   = patAppliances.filter(a => !latestFailed(a) && !a.nextTestDue);
            const attention     = [...nonCompliant, ...overdue].sort((a, b) => new Date(a.nextTestDue ?? a.lastTestedAt ?? 0).getTime() - new Date(b.nextTestDue ?? b.lastTestedAt ?? 0).getTime()).slice(0, 5);
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'Compliant',     count: compliant.length,    cls: 'text-green-700 bg-green-50 border-green-200' },
                    { label: 'Due Soon',      count: dueSoon.length,      cls: 'text-amber-700 bg-amber-50 border-amber-200' },
                    { label: 'Overdue',       count: overdue.length,      cls: 'text-red-700 bg-red-50 border-red-200' },
                    { label: 'Non Compliant', count: nonCompliant.length, cls: 'text-orange-800 bg-orange-50 border-orange-200' },
                    { label: 'Never Tested',  count: neverTested.length,  cls: 'text-gray-600 bg-gray-50 border-gray-200' },
                  ].map(({ label, count, cls }) => (
                    <div key={label} className={`border rounded-xl p-3 text-center ${cls}`}>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                {attention.length > 0 && (
                  <div className="bg-white border border-red-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-xs font-semibold text-red-700 uppercase tracking-wide">
                      Requires Attention
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 border-b">
                          <th className="px-4 py-2 text-left font-medium">ID</th>
                          <th className="px-4 py-2 text-left font-medium">Description</th>
                          <th className="px-4 py-2 text-left font-medium">Location</th>
                          <th className="px-4 py-2 text-left font-medium">Site</th>
                          <th className="px-4 py-2 text-right font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attention.map(a => (
                          <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-2 font-mono text-xs text-violet-700 font-semibold">{a.applianceRef}</td>
                            <td className="px-4 py-2">{a.description}</td>
                            <td className="px-4 py-2 text-gray-500">{a.location}</td>
                            <td className="px-4 py-2 text-gray-500">{a.site?.name ?? '—'}</td>
                            <td className="px-4 py-2 text-right font-semibold">
                              {latestFailed(a)
                                ? <span className="text-orange-700">Non Compliant</span>
                                : <span className="text-red-600">{Math.ceil((today - new Date(a.nextTestDue!).getTime()) / 86_400_000)}d overdue</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
      {/* Emergency Lighting Compliance */}
      {emergencyLightingEnabled && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-500" />
              Emergency Lighting Compliance
            </h2>
            {onNavigateEmergencyLighting && (
              <button onClick={onNavigateEmergencyLighting} className="text-sm flex items-center gap-1 hover:underline" style={{ color: primaryColor }}>
                Open Emergency Lighting <ArrowRight size={14} />
              </button>
            )}
          </div>
          {elLoading ? (
            <p className="text-sm text-gray-400">Loading emergency lighting data…</p>
          ) : (() => {
            const today = Date.now();
            const latestTestFailed = (lum: EmergencyLuminaire) =>
              lum.tests && lum.tests.length > 0 && lum.tests[0].outcome === 'fail';
            const getScheduleDays = (lum: EmergencyLuminaire) => {
              const dates = [lum.nextMonthlyDue, lum.nextAnnualDue, lum.nextThreeYearlyDue].filter(Boolean) as string[];
              if (dates.length === 0) return null;
              return Math.min(...dates.map(d => new Date(d).getTime() - today)) / 86_400_000;
            };
            const nonCompliant = elLuminaires.filter(l => latestTestFailed(l));
            const compliant    = elLuminaires.filter(l => !latestTestFailed(l) && (getScheduleDays(l) ?? -1) > 30);
            const dueSoon      = elLuminaires.filter(l => !latestTestFailed(l) && (getScheduleDays(l) ?? -1) <= 30 && (getScheduleDays(l) ?? -1) > 0);
            const overdue      = elLuminaires.filter(l => !latestTestFailed(l) && getScheduleDays(l) !== null && (getScheduleDays(l) as number) <= 0);
            const neverTested  = elLuminaires.filter(l => !latestTestFailed(l) && getScheduleDays(l) === null);
            const attention    = [...nonCompliant, ...overdue].slice(0, 5);
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'Compliant',     count: compliant.length,    cls: 'text-green-700 bg-green-50 border-green-200' },
                    { label: 'Due Soon',      count: dueSoon.length,      cls: 'text-amber-700 bg-amber-50 border-amber-200' },
                    { label: 'Overdue',       count: overdue.length,      cls: 'text-red-700 bg-red-50 border-red-200' },
                    { label: 'Non Compliant', count: nonCompliant.length, cls: 'text-orange-800 bg-orange-50 border-orange-200' },
                    { label: 'Never Tested',  count: neverTested.length,  cls: 'text-gray-600 bg-gray-50 border-gray-200' },
                  ].map(({ label, count, cls }) => (
                    <div key={label} className={`border rounded-xl p-3 text-center ${cls}`}>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                {attention.length > 0 && (
                  <div className="bg-white border border-red-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-xs font-semibold text-red-700 uppercase tracking-wide">
                      Requires Attention
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 border-b">
                          <th className="px-4 py-2 text-left font-medium">Ref</th>
                          <th className="px-4 py-2 text-left font-medium">Description</th>
                          <th className="px-4 py-2 text-left font-medium">Location</th>
                          <th className="px-4 py-2 text-left font-medium">Site</th>
                          <th className="px-4 py-2 text-right font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attention.map(l => (
                          <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-2 font-mono text-xs text-amber-700 font-semibold">{l.luminaireRef}</td>
                            <td className="px-4 py-2">{l.description}</td>
                            <td className="px-4 py-2 text-gray-500">{l.location}</td>
                            <td className="px-4 py-2 text-gray-500">{l.site?.name ?? '—'}</td>
                            <td className="px-4 py-2 text-right font-semibold">
                              {latestTestFailed(l)
                                ? <span className="text-orange-700">Non Compliant</span>
                                : <span className="text-red-600">{Math.ceil(-(getScheduleDays(l) ?? 0))}d overdue</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ComplianceDashboard;
