import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Crown, Zap, Building2, AlertCircle, BellRing, Lightbulb, Plug, Plus, Loader2 } from 'lucide-react';
import { createAddonCheckoutSession } from '../lib/api';
import type { Tenant } from '../types';

interface BillingPageProps {
  tenant: Tenant;
  primaryColor: string;
}

interface PlanInfo {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  limits: {
    extinguishers: number | string;
    users: number | string;
  };
  features: string[];
  priceIds?: {
    monthly: string;
    annual: string;
  };
}

// Default plan info shown even if API hasn't loaded
const DEFAULT_PLANS: Record<string, PlanInfo> = {
  starter: {
    name: 'Starter',
    monthlyPrice: '£29',
    annualPrice: '£279',
    limits: { extinguishers: 50, users: 3 },
    features: [
      'Up to 50 inspections per month',
      'Unlimited stored extinguishers',
      'Unlimited history & certificates',
      'Up to 3 users',
      'QR code scanning',
      'Email support',
    ],
  },
  professional: {
    name: 'Professional',
    monthlyPrice: '£59',
    annualPrice: '£569',
    limits: { extinguishers: 250, users: 10 },
    features: [
      'Up to 250 inspections per month',
      'Unlimited stored extinguishers',
      'Unlimited history & certificates',
      'Up to 10 users',
      'Multi-site management',
      'Compliance dashboard',
      'CSV import/export',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: '£99',
    annualPrice: '£949',
    limits: { extinguishers: 1000, users: 'Unlimited' },
    features: [
      'Up to 1,000 inspections per month',
      'Unlimited stored extinguishers',
      'Unlimited history & certificates',
      'Unlimited users',
      'All Professional features',
      'Advanced reporting',
      'API access',
      'Dedicated support',
    ],
  },
};

const BillingPage: React.FC<BillingPageProps> = ({ tenant, primaryColor }) => {
  const [plans, setPlans] = useState<Record<string, PlanInfo>>(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Get API base URL - same logic as api.ts
  const getApiBase = () => {
    if ((import.meta as any).env?.VITE_API_URL) {
      return (import.meta as any).env.VITE_API_URL;
    }

    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    if (isLocalhost) {
      const protocol = window.location.protocol;
      return `${protocol}//${hostname}:3000/api/v1`;
    } else {
      // In production (Railway), use relative path (same domain, different path)
      return '/api/v1';
    }
  };

  const API_URL = getApiBase();

  const loadPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/billing/get-prices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.json();
      if (data.plans && typeof data.plans === 'object') {
        // Merge API data with defaults (API data takes priority for prices/priceIds)
        setPlans({ ...DEFAULT_PLANS, ...data.plans });
      }
      // If API fails, DEFAULT_PLANS are already set as initial state
    } catch (error) {
      console.error('Failed to load plans:', error);
      // Keep DEFAULT_PLANS
    }
  };

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscribe = async (planKey: string) => {
    setLoadingPlan(planKey);
    setLoading(true);

    try {
      const plan = plans[planKey];
      if (!plan?.priceIds) {
        alert('This plan is not available for online subscription. Please contact sales.');
        return;
      }

      const priceId = billingCycle === 'monthly' ? plan.priceIds.monthly : plan.priceIds.annual;

      const response = await fetch(`${API_URL}/billing/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          priceId,
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
      setLoadingPlan(null);
    }
  };

  const [addonLoading, setAddonLoading] = useState<string | null>(null);

  const ADDON_PRICE_IDS: Record<string, string> = {
    'fire-alarm':          'price_1TTkDZGRZTmazyiYbtWgLBXq',
    'emergency-lighting':  'price_1TTkEUGRZTmazyiYKgNAdH2R',
    'pat-testing':         'price_1TTkFEGRZTmazyiYFj04zTP9',
  };

  const handleAddOn = async (module: string) => {
    const priceId = ADDON_PRICE_IDS[module];
    if (!priceId) return;
    setAddonLoading(module);
    try {
      const { url } = await createAddonCheckoutSession(priceId);
      window.location.href = url;
    } catch (err: any) {
      alert(err.message || 'Failed to start checkout. Please try again.');
    } finally {
      setAddonLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/billing/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to create portal session:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = () => {
    if (tenant.subscriptionPlan === 'trial') return 'Free Trial';
    if (tenant.subscriptionPlan === 'starter') return 'Starter';
    if (tenant.subscriptionPlan === 'professional') return 'Professional';
    if (tenant.subscriptionPlan === 'enterprise') return 'Business';
    return 'Unknown';
  };

  const getStatusColor = () => {
    if (tenant.subscriptionStatus === 'active') return 'bg-green-100 text-green-800';
    if (tenant.subscriptionStatus === 'trialing' || tenant.subscriptionStatus === 'trial') return 'bg-blue-100 text-blue-800';
    if (tenant.subscriptionStatus === 'past_due') return 'bg-yellow-100 text-yellow-800';
    if (tenant.subscriptionStatus === 'canceled') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const safeColor = primaryColor && primaryColor !== '#ffffff' && primaryColor !== '#fff' && primaryColor !== 'white' ? primaryColor : '#7c3aed';

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      <div className="p-6 bg-white shadow rounded-2xl">
        <h2 className="mb-4 text-2xl font-bold">Current Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6" style={{ color: safeColor }} />
              <div>
                <div className="text-xl font-semibold">{getCurrentPlan()}</div>
                <div className={`inline-flex items-center px-2.5 py-1 mt-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
                  {tenant.subscriptionStatus}
                </div>
              </div>
            </div>
          </div>

          {tenant.subscriptionPlan !== 'trial' && (
            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: safeColor }}
            >
              <CreditCard size={18} />
              Manage Billing
            </button>
          )}
        </div>

        {tenant.subscriptionStatus === 'past_due' && (
          <div className="flex items-start gap-2 p-4 mt-4 rounded-lg bg-yellow-50">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div className="text-sm text-yellow-800">
              <div className="font-semibold">Payment overdue</div>
              <div>Please update your payment method to continue using the service.</div>
            </div>
          </div>
        )}
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-500'}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className="relative inline-flex items-center h-6 rounded-full w-11"
          style={{ backgroundColor: billingCycle === 'annual' ? safeColor : '#d1d5db' }}
          aria-label={`Switch to ${billingCycle === 'monthly' ? 'annual' : 'monthly'} billing`}
          role="switch"
          aria-checked={billingCycle === 'annual'}
        >
          <span
            className={`inline-block w-4 h-4 transition transform bg-white rounded-full ${
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={billingCycle === 'annual' ? 'font-semibold' : 'text-gray-500'}>
          Annual <span className="text-sm text-green-600">(Save ~20%)</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Starter Plan */}
        {plans.starter && (
          <div className="relative p-6 bg-white border-2 border-gray-200 shadow rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6" style={{ color: safeColor }} />
              <h3 className="text-xl font-bold">Starter</h3>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold">
                {billingCycle === 'monthly' ? plans.starter.monthlyPrice : plans.starter.annualPrice}
              </div>
              <div className="text-sm text-gray-500">
                {billingCycle === 'monthly' ? 'per month' : 'per year'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Prices exclude VAT
              </div>
            </div>
            <ul className="mb-6 space-y-2">
              {plans.starter.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe('starter')}
              disabled={loading || tenant.subscriptionPlan === 'starter'}
              className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: safeColor }}
            >
              {loadingPlan === 'starter' ? 'Loading...' : tenant.subscriptionPlan === 'starter' ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
        )}

        {/* Professional Plan */}
        {plans.professional && (
          <div className="relative p-6 bg-white border-2 shadow rounded-2xl" style={{ borderColor: safeColor }}>
            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white rounded-tr-lg rounded-bl-lg" style={{ backgroundColor: safeColor }}>
              POPULAR
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6" style={{ color: safeColor }} />
              <h3 className="text-xl font-bold">Professional</h3>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold">
                {billingCycle === 'monthly' ? plans.professional.monthlyPrice : plans.professional.annualPrice}
              </div>
              <div className="text-sm text-gray-500">
                {billingCycle === 'monthly' ? 'per month' : 'per year'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Prices exclude VAT
              </div>
            </div>
            <ul className="mb-6 space-y-2">
              {plans.professional.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe('professional')}
              disabled={loading || tenant.subscriptionPlan === 'professional'}
              className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: safeColor }}
            >
              {loadingPlan === 'professional' ? 'Loading...' : tenant.subscriptionPlan === 'professional' ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
        )}

        {/* Enterprise Plan */}
        {plans.enterprise && (
          <div className="relative p-6 bg-white border-2 border-gray-200 shadow rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6" style={{ color: safeColor }} />
              <h3 className="text-xl font-bold">Enterprise</h3>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold">
                {billingCycle === 'monthly' ? plans.enterprise.monthlyPrice : plans.enterprise.annualPrice}
              </div>
              <div className="text-sm text-gray-500">
                {billingCycle === 'monthly' ? 'per month' : 'per year'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Prices exclude VAT
              </div>
            </div>
            <ul className="mb-6 space-y-2">
              {plans.enterprise.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe('enterprise')}
              disabled={loading || tenant.subscriptionPlan === 'enterprise'}
              className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: safeColor }}
            >
              {loadingPlan === 'enterprise' ? 'Loading...' : tenant.subscriptionPlan === 'enterprise' ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
        )}

        {/* Custom Enterprise Plan */}
        <div className="relative p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl rounded-2xl border-2 border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold">Custom</h3>
          </div>
          <div className="mb-4">
            <div className="text-3xl font-bold">Contact Us</div>
            <div className="text-sm text-gray-300">For 1,000+ inspections/month</div>
          </div>
          <ul className="mb-6 space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
              <span>Unlimited inspections</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
              <span>Unlimited stored extinguishers</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
              <span>Unlimited history & certificates</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
              <span>Unlimited users</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
              <span>Dedicated account manager</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
              <span>Custom SLA, integrations & support</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
              <span>Volume-based pricing</span>
            </li>
          </ul>
          <a
            href="mailto:notification.firexcheck@gmail.com?subject=Custom Enterprise Plan Inquiry"
            className="w-full block text-center px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            Contact Sales
          </a>
        </div>
      </div>

      {/* Add-on Modules */}
      <div className="p-6 bg-white shadow rounded-2xl">
        <div className="flex items-center gap-3 mb-1">
          <Plus className="w-5 h-5 text-gray-500" />
          <h3 className="text-xl font-bold text-gray-900">Add-on Modules</h3>
        </div>
        <p className="mb-5 text-sm text-gray-500 ml-8">
          Extend your plan with additional compliance modules. Added to your monthly subscription.
        </p>
        <div className="space-y-3">

          {/* Fire Alarm Logbook */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <BellRing className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Fire Alarm Logbook</div>
                <div className="text-sm text-gray-500">BS 5839-1 digital logbook — inspections, faults, engineer visits & reports</div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">+£12<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="text-xs text-gray-400">excl. VAT</div>
              </div>
              <button
                onClick={() => handleAddOn('fire-alarm')}
                disabled={tenant.fireAlarmEnabled || addonLoading === 'fire-alarm'}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={tenant.fireAlarmEnabled
                  ? { borderColor: '#d1d5db', color: '#6b7280', background: '#f9fafb' }
                  : { borderColor: safeColor, color: safeColor, background: 'white' }}
              >
                {addonLoading === 'fire-alarm' && <Loader2 size={13} className="animate-spin" />}
                {tenant.fireAlarmEnabled ? 'Active' : addonLoading === 'fire-alarm' ? 'Redirecting…' : 'Add to Plan'}
              </button>
            </div>
          </div>

          {/* Emergency Lighting */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-amber-200 hover:bg-amber-50/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Emergency Lighting</div>
                <div className="text-sm text-gray-500">BS 5266-1 luminaire register — daily, monthly, annual & 3-yearly test logs</div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">+£12<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="text-xs text-gray-400">excl. VAT</div>
              </div>
              <button
                onClick={() => handleAddOn('emergency-lighting')}
                disabled={tenant.emergencyLightingEnabled || addonLoading === 'emergency-lighting'}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={tenant.emergencyLightingEnabled
                  ? { borderColor: '#d1d5db', color: '#6b7280', background: '#f9fafb' }
                  : { borderColor: safeColor, color: safeColor, background: 'white' }}
              >
                {addonLoading === 'emergency-lighting' && <Loader2 size={13} className="animate-spin" />}
                {tenant.emergencyLightingEnabled ? 'Active' : addonLoading === 'emergency-lighting' ? 'Redirecting…' : 'Add to Plan'}
              </button>
            </div>
          </div>

          {/* PAT Testing */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plug className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">PAT Testing</div>
                <div className="text-sm text-gray-500">Portable appliance register — test logs, compliance tracking & PDF reports</div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">+£15<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="text-xs text-gray-400">excl. VAT</div>
              </div>
              <button
                onClick={() => handleAddOn('pat-testing')}
                disabled={tenant.patTestingEnabled || addonLoading === 'pat-testing'}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={tenant.patTestingEnabled
                  ? { borderColor: '#d1d5db', color: '#6b7280', background: '#f9fafb' }
                  : { borderColor: safeColor, color: safeColor, background: 'white' }}
              >
                {addonLoading === 'pat-testing' && <Loader2 size={13} className="animate-spin" />}
                {tenant.patTestingEnabled ? 'Active' : addonLoading === 'pat-testing' ? 'Redirecting…' : 'Add to Plan'}
              </button>
            </div>
          </div>

        </div>
        <p className="mt-4 text-xs text-gray-400">
          Add-ons are billed monthly alongside your subscription. Contact <a href="mailto:support@firexcheck.com" className="underline">support@firexcheck.com</a> to add a module to your account.
        </p>
      </div>

      {/* Real-world explainer box */}
      <div className="p-6 bg-blue-50 border border-blue-200 shadow rounded-2xl">
        <h3 className="mb-3 text-lg font-bold text-blue-900">Which plan is right for you?</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p>
            Plans are based on the number of <strong>inspections completed per month</strong>, not the number of extinguishers stored. You can store unlimited extinguisher records on any plan.
          </p>
          <div className="p-4 bg-white/70 border border-blue-100 rounded-xl">
            <p className="font-semibold text-blue-900 mb-1">Example:</p>
            <p>
              A servicing company with <strong>3,000 extinguishers</strong> carrying out annual servicing typically completes <strong>~250 inspections per month</strong>.
            </p>
            <p className="mt-2 font-medium" style={{ color: safeColor }}>
              This would comfortably fit within the <strong>Enterprise plan at £99/month</strong>.
            </p>
          </div>
          <div className="p-4 bg-white/70 border border-blue-100 rounded-xl">
            <p className="font-semibold text-blue-900 mb-1">Another example:</p>
            <p>
              A facilities manager responsible for <strong>200 extinguishers</strong> across 5 sites, doing <strong>monthly checks</strong>, would use ~200 inspections per month.
            </p>
            <p className="mt-2 font-medium" style={{ color: safeColor }}>
              The <strong>Professional plan at £59/month</strong> would be ideal.
            </p>
          </div>
        </div>
      </div>

      {/* Need Help Contact Box */}
      <div className="p-6 text-center bg-white shadow rounded-2xl">
        <h3 className="mb-2 text-xl font-bold">Need Help Choosing?</h3>
        <p className="mb-4 text-sm text-gray-600">Not sure which plan fits your business? Get in touch and we'll help you find the right one.</p>
        <a
          href="mailto:notification.firexcheck@gmail.com"
          className="inline-block px-6 py-2 text-white rounded-lg hover:opacity-90"
          style={{ backgroundColor: safeColor }}
        >
          Contact Sales
        </a>
      </div>
    </div>
  );
};

export default BillingPage;
