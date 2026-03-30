import React, { useEffect, useState } from 'react';
import { Building2, Users, Flame, RefreshCw, AlertTriangle } from 'lucide-react';
import { platformGetTenants, platformUpdateFeatures } from '../lib/api';
import type { PlatformTenant } from '../types';

const FeatureToggle: React.FC<{
  enabled: boolean;
  onChange: (v: boolean) => void;
  loading: boolean;
  label: string;
}> = ({ enabled, onChange, loading, label }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-500 w-28">{label}</span>
    <button
      type="button"
      disabled={loading}
      onClick={() => onChange(!enabled)}
      aria-label={`Toggle ${label}`}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
        enabled ? 'bg-indigo-600' : 'bg-gray-300'
      }`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
        enabled ? 'translate-x-4' : 'translate-x-0.5'
      }`} />
    </button>
  </div>
);

const PlatformAdminPage: React.FC = () => {
  const [tenants, setTenants] = useState<PlatformTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await platformGetTenants();
      setTenants(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleFeature(tenantId: string, feature: 'stockManagementEnabled' | 'fireAlarmEnabled' | 'patTestingEnabled' | 'emergencyLightingEnabled', value: boolean) {
    setUpdating(u => ({ ...u, [tenantId + feature]: true }));
    try {
      const updated = await platformUpdateFeatures(tenantId, { [feature]: value });
      setTenants(ts => ts.map(t => t.id === tenantId ? { ...t, ...updated } : t));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setUpdating(u => ({ ...u, [tenantId + feature]: false }));
    }
  }

  const planBadge = (plan: string) => {
    const colours: Record<string, string> = {
      trial: 'bg-gray-100 text-gray-700',
      starter: 'bg-blue-100 text-blue-700',
      professional: 'bg-indigo-100 text-indigo-700',
      enterprise: 'bg-purple-100 text-purple-700',
    };
    return colours[plan] ?? 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              <AlertTriangle size={11} /> Platform Admin
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Activate or deactivate features per customer account</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold">{tenants.length}</div>
          <div className="text-sm text-gray-500">Total Tenants</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold">{tenants.filter(t => t.fireAlarmEnabled).length}</div>
          <div className="text-sm text-gray-500">Fire Alarm Enabled</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold">{tenants.reduce((s, t) => s + t._count.extinguishers, 0)}</div>
          <div className="text-sm text-gray-500">Total Extinguishers</div>
        </div>
      </div>

      {/* Tenant table */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400">Loading tenants…</div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">
                  <div className="flex items-center justify-center gap-1"><Users size={13} /> Users</div>
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">
                  <div className="flex items-center justify-center gap-1"><Flame size={13} /> Extinguishers</div>
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">
                  <div className="flex items-center justify-center gap-1"><Building2 size={13} /> Sites</div>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Features</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tenants.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{t.companyName}</div>
                    <div className="text-xs text-gray-400">{t.subdomain}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${planBadge(t.subscriptionPlan)}`}>
                      {t.subscriptionPlan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{t._count.users}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{t._count.extinguishers}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{t._count.sites}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1.5">
                      <FeatureToggle
                        label="Stock Mgmt"
                        enabled={t.stockManagementEnabled}
                        loading={!!updating[t.id + 'stockManagementEnabled']}
                        onChange={v => toggleFeature(t.id, 'stockManagementEnabled', v)}
                      />
                      <FeatureToggle
                        label="Fire Alarm"
                        enabled={t.fireAlarmEnabled}
                        loading={!!updating[t.id + 'fireAlarmEnabled']}
                        onChange={v => toggleFeature(t.id, 'fireAlarmEnabled', v)}
                      />
                      <FeatureToggle
                        label="PAT Testing"
                        enabled={t.patTestingEnabled}
                        loading={!!updating[t.id + 'patTestingEnabled']}
                        onChange={v => toggleFeature(t.id, 'patTestingEnabled', v)}
                      />
                      <FeatureToggle
                        label="Emergency Lighting"
                        enabled={t.emergencyLightingEnabled}
                        loading={!!updating[t.id + 'emergencyLightingEnabled']}
                        onChange={v => toggleFeature(t.id, 'emergencyLightingEnabled', v)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlatformAdminPage;
