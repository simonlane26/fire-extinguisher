import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const FEEDBACK_EMAIL = 'simon@firexcheck.com';

const PAGE_LABELS: Record<string, string> = {
  overview: 'Overview',
  sites: 'Sites',
  stock: 'Stock Management',
  users: 'Users',
  settings: 'Settings',
  'qr-codes': 'QR Codes',
  billing: 'Billing',
  compliance: 'Compliance',
  reports: 'Reports',
  help: 'Help',
  quotes: 'Quotes',
};

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone/i.test(ua)) return 'Mobile';
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

interface Props {
  currentTab: string;
}

const FeedbackButton: React.FC<Props> = ({ currentTab }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'bug' | 'suggestion' | 'other'>('suggestion');
  const [sent, setSent] = useState(false);

  const pageName = PAGE_LABELS[currentTab] ?? currentTab;
  const device = getDeviceType();
  const screen = `${window.innerWidth}×${window.innerHeight}`;

  const submit = () => {
    if (!message.trim()) return;

    const typeLabel = type === 'bug' ? 'Bug Report' : type === 'suggestion' ? 'Suggestion' : 'Feedback';
    const subject = `[FireXcheck] ${typeLabel} — ${pageName}`;
    const body = [
      message.trim(),
      '',
      '— Auto-attached —',
      `Page: ${pageName}`,
      `Device: ${device}`,
      `Screen: ${screen}`,
      `User agent: ${navigator.userAgent}`,
    ].join('\n');

    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setType('suggestion');
      setOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {/* Popover */}
      {open && (
        <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-800">Send Feedback</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {sent ? (
            <div className="px-4 py-10 text-center">
              <p className="font-medium text-green-600">Opening your email client…</p>
              <p className="text-sm text-gray-400 mt-1">Thanks for taking the time!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Type pills */}
              <div className="flex gap-2">
                {(['bug', 'suggestion', 'other'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      type === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t === 'bug' ? '🐛 Bug' : t === 'suggestion' ? '💡 Idea' : '💬 Other'}
                  </button>
                ))}
              </div>

              {/* Message */}
              <textarea
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
                }}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Auto-attached chips */}
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                  📄 {pageName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                  💻 {device}
                </span>
              </div>
              <p className="text-xs text-gray-400 -mt-1">
                Page, device and browser info attached automatically.
              </p>

              <button
                type="button"
                onClick={submit}
                disabled={!message.trim()}
                className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
                Send Feedback
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-full shadow-lg transition-colors"
      >
        {open ? <X size={15} /> : <MessageSquare size={15} />}
        <span>{open ? 'Close' : 'Feedback'}</span>
      </button>
    </div>
  );
};

export default FeedbackButton;
