import React, { useState, useRef } from 'react';
import { Info, X } from 'lucide-react';

interface HintTooltipProps {
  /** Unique key — persists dismissal in localStorage */
  storageKey: string;
  content: string;
}

const HintTooltip: React.FC<HintTooltipProps> = ({ storageKey, content }) => {
  const key = `hint_${storageKey}`;
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(key) === '1');
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (dismissed) return null;

  const show = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setCoords({ top: r.bottom + 6, left: r.left + r.width / 2 });
  };

  const hide = () => setCoords(null);

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(key, '1');
    setDismissed(true);
    setCoords(null);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center opacity-50 hover:opacity-90 transition-opacity cursor-help ml-1 focus:outline-none"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-label="More information"
      >
        <Info size={11} />
      </button>

      {coords && (
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
          className="w-56 rounded-lg bg-gray-900 px-3 py-2 text-xs leading-relaxed text-white shadow-xl pointer-events-auto"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* Arrow */}
          <span
            style={{
              position: 'absolute',
              top: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '5px solid #111827',
            }}
          />
          <button
            type="button"
            onClick={dismiss}
            className="float-right ml-2 -mt-0.5 opacity-50 hover:opacity-100 focus:outline-none"
            aria-label="Dismiss hint forever"
          >
            <X size={11} />
          </button>
          {content}
        </div>
      )}
    </>
  );
};

export default HintTooltip;
