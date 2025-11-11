// src/components/RoleSwitcher.tsx
import React from 'react';

export type RoleKey = 'super_admin' | 'admin' | 'manager' | 'inspector' | 'viewer';

type RoleMeta = { name: string; description?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  currentRole: RoleKey;
  roles: Record<RoleKey, RoleMeta>;
  onSelect: (role: RoleKey) => void;
};

const ROLE_KEYS: RoleKey[] = ['super_admin', 'admin', 'manager', 'inspector', 'viewer'];

const RoleSwitcher: React.FC<Props> = ({ open, onClose, currentRole, roles, onSelect }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Switch User Role (Demo)</h3>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="mb-2 text-sm text-gray-600">Test different permission levels by switching roles</p>

          {ROLE_KEYS.map((roleKey) => {
            const role = roles[roleKey];
            const isCurrent = roleKey === currentRole;
            return (
              <button
                key={roleKey}
                onClick={() => onSelect(roleKey)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  isCurrent ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{role?.name ?? roleKey}</div>
                    <div className="text-sm text-gray-500">{role?.description ?? '—'}</div>
                  </div>
                  {isCurrent && <span className="text-sm font-medium text-violet-600">Current</span>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t">
          <button onClick={onClose} className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;
