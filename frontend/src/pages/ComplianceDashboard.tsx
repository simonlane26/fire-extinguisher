import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Calendar, Flame, Building2 } from 'lucide-react';
import { fetchExtinguishers } from '../lib/api';
import type { Extinguisher } from '../types';

type Props = {
  primaryColor?: string;
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

const ComplianceDashboard: React.FC<Props> = ({ primaryColor = '#7c3aed' }) => {
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [loading, setLoading] = useState(true);
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
          <h2 className="text-lg font-semibold text-gray-900">Overall Compliance Rate</h2>
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

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Calendar className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Next Steps</h3>
            {stats.overdue > 0 && (
              <p className="text-sm text-blue-800 mb-2">
                • <strong>{stats.overdue}</strong> extinguisher{stats.overdue !== 1 ? 's are' : ' is'} overdue for inspection - schedule immediately
              </p>
            )}
            {stats.dueWithin30Days > 0 && (
              <p className="text-sm text-blue-800 mb-2">
                • <strong>{stats.dueWithin30Days}</strong> extinguisher{stats.dueWithin30Days !== 1 ? 's need' : ' needs'} inspection within 30 days - plan ahead
              </p>
            )}
            {stats.overdue === 0 && stats.dueWithin30Days === 0 && (
              <p className="text-sm text-blue-800">
                ✓ All extinguishers are up to date - great work!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
