import React from 'react';

type Segment = { value: number; color: string };

// Hand-rolled SVG donut — no charting library in this project. Shared by
// ComplianceDashboard (count + label in the center) and the module pages'
// compliance strip (percentage in the center).
const ComplianceRing: React.FC<{
  segments: Segment[];
  total: number;
  size?: number;
  strokeWidth?: number;
  centerLabel?: React.ReactNode;
}> = ({ segments, total, size = 136, strokeWidth = 16, centerLabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offsetSoFar = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E3DDD1" strokeWidth={strokeWidth} />
        {total > 0 && segments.map((seg, i) => {
          if (seg.value === 0) return null;
          const fraction = seg.value / total;
          const segLength = fraction * circumference;
          const circle = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segLength} ${circumference - segLength}`}
              strokeDashoffset={-offsetSoFar}
              strokeLinecap="round"
            />
          );
          offsetSoFar += segLength;
          return circle;
        })}
      </svg>
      {centerLabel != null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-ink tabular-nums">
          {centerLabel}
        </div>
      )}
    </div>
  );
};

export default ComplianceRing;
