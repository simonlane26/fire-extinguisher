import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Crown, Zap, Building2, AlertCircle } from 'lucide-react';
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

const BillingPage: React.FC<BillingPageProps> = ({ tenant, primaryColor }) => {
  const [plans, setPlans] = useState<Record<string, PlanInfo>>({});
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

  const loadPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/billing/get-prices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.json();
      console.log('Loaded plans data:', data);
      console.log('Plans object:', data.plans);
      setPlans(data.plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
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
          aria-checked={billingCycle === 'annual' ? 'true' : 'false'}
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

        {/* Business Plan */}
        {plans.enterprise && (
          <div className="relative p-6 bg-white border-2 border-gray-200 shadow rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6" style={{ color: safeColor }} />
              <h3 className="text-xl font-bold">Business</h3>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold">
                {billingCycle === 'monthly' ? plans.enterprise.monthlyPrice : plans.enterprise.annualPrice}
              </div>
              <div className="text-sm text-gray-500">
                {billingCycle === 'monthly' ? 'per month' : 'per year'}
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
      </div>

      {/* Enterprise Custom Plan */}
      <div className="p-6 text-center bg-white shadow rounded-2xl">
        <h3 className="mb-2 text-xl font-bold">Need more?</h3>
        <p className="mb-4 text-gray-600">
          Enterprise plan available with unlimited extinguishers, SSO, audit logs, and dedicated support.
        </p>
        <a
          href="mailto:sales@firexcheck.com"
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
