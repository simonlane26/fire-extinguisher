import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, X, Building2, Flame, QrCode, ClipboardList } from 'lucide-react';

const STORAGE_KEY = 'getting_started_dismissed';
const DAYS_NEW_ACCOUNT = 30;

function daysSince(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 864e5);
}

interface Props {
  extinguisherCount: number;
  siteCount: number;
  tenantCreatedAt: string;
  monthlyInspections: number;
  primaryColor: string;
  onNavigate: (tab: 'sites' | 'qr-codes') => void;
  onAddExtinguisher: () => void;
}

const GettingStartedPanel: React.FC<Props> = ({
  extinguisherCount,
  siteCount,
  tenantCreatedAt,
  monthlyInspections,
  primaryColor,
  onNavigate,
  onAddExtinguisher,
}) => {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1',
  );

  const isNewAccount = daysSince(tenantCreatedAt) <= DAYS_NEW_ACCOUNT;
  const shouldShow = !dismissed && (extinguisherCount === 0 || isNewAccount);

  if (!shouldShow) return null;

  const steps = [
    {
      label: 'Add your first site',
      description: 'Sites represent locations where extinguishers are installed.',
      icon: <Building2 size={16} />,
      done: siteCount > 0,
      onClick: () => onNavigate('sites'),
    },
    {
      label: 'Add extinguishers',
      description: 'Register each unit with its type, location, and service date.',
      icon: <Flame size={16} />,
      done: extinguisherCount > 0,
      onClick: onAddExtinguisher,
    },
    {
      label: 'Generate QR codes',
      description: 'Attach QR codes to units so inspectors can log visits instantly.',
      icon: <QrCode size={16} />,
      done: extinguisherCount > 0,
      onClick: () => onNavigate('qr-codes'),
    },
    {
      label: 'Record inspections',
      description: 'Scan a QR code or open a unit to log a new inspection.',
      icon: <ClipboardList size={16} />,
      done: monthlyInspections > 0,
      onClick: () => onNavigate('qr-codes'),
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const pct = Math.round((completedCount / steps.length) * 100);
  const allDone = completedCount === steps.length;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2 text-white">
          <CheckCircle size={18} className="shrink-0" />
          <span className="font-semibold text-sm">Get Started with FireCheck</span>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="text-white/70 hover:text-white transition-colors focus:outline-none"
          aria-label="Dismiss getting started panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar + body */}
      <div className="px-4 pt-3 pb-4 space-y-3">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-emerald-700 font-medium">
              {allDone
                ? 'All set! You\'re ready to go.'
                : `${completedCount} of ${steps.length} steps completed`}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">{pct}%</span>
          </div>
          <div className="h-1.5 bg-emerald-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: primaryColor }}
            />
          </div>
        </div>

        {/* Steps */}
        <ul className="space-y-1">
          {steps.map((step) => (
            <li key={step.label}>
              <button
                type="button"
                onClick={step.onClick}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors group
                  ${step.done
                    ? 'bg-white/60 hover:bg-white/80'
                    : 'bg-white hover:bg-emerald-50 border border-emerald-100'
                  }`}
              >
                {/* Completion indicator */}
                <span className="shrink-0">
                  {step.done ? (
                    <CheckCircle size={18} className="text-emerald-500" />
                  ) : (
                    <Circle size={18} className="text-gray-300" />
                  )}
                </span>

                {/* Icon */}
                <span
                  className={`shrink-0 ${step.done ? 'text-emerald-400' : 'text-gray-500'}`}
                >
                  {step.icon}
                </span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium leading-tight ${
                      step.done ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {step.label}
                  </p>
                  {!step.done && (
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={15}
                  className={`shrink-0 transition-transform group-hover:translate-x-0.5
                    ${step.done ? 'text-gray-300' : 'text-emerald-500'}`}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Dismiss link */}
        <p className="text-center">
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          >
            Dismiss and don't show again
          </button>
        </p>
      </div>
    </div>
  );
};

export default GettingStartedPanel;
