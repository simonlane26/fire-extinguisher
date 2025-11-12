import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  primaryColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, primaryColor }) => {
  // Fallback to purple if primaryColor is white or invalid
  const safeColor = primaryColor && primaryColor !== '#ffffff' && primaryColor !== '#fff' && primaryColor !== 'white'
    ? primaryColor
    : '#7c3aed';

  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontWeight: '500',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        backgroundColor: active ? safeColor : '#ffffff',
        color: active ? '#ffffff' : '#374151',
        border: active ? 'none' : '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = '#ffffff';
        }
      }}
    >
      {children}
    </button>
  );
};

export default TabButton;
