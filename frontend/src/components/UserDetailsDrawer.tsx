import React from 'react';
import type { User, RoleKey } from '../types';

type Props = {
  open: boolean;
  user: User | null;
  canEdit: boolean;
  onClose: () => void;
  onChangeRole: (role: RoleKey) => void;
};

const ROLES: RoleKey[] = ['super_admin','admin','manager','inspector','viewer'];

export default function UserDetailsDrawer({
  open, user, canEdit, onClose, onChangeRole,
}: Props) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="w-full h-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          <div>
            <div className="text-gray-500">Email</div>
            <div className="font-medium text-gray-900">{user.email}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500">Role</div>
              {canEdit ? (
                <select
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
                  value={user.role}
                  onChange={(e)=>onChangeRole(e.target.value as RoleKey)}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
                </select>
              ) : (
                <div className="font-medium">{user.role.replace('_',' ')}</div>
              )}
            </div>
            <div>
              <div className="text-gray-500">Status</div>
              <div className="font-medium">{user.status}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500">Last login</div>
              <div className="font-medium">{user.lastLogin || 'Never'}</div>
            </div>
            <div>
              <div className="text-gray-500">Created</div>
              <div className="font-medium">{user.createdAt}</div>
            </div>
          </div>

          {/* Placeholder: audit trail */}
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">Activity</div>
            <ul className="pl-5 space-y-1 text-gray-700 list-disc">
              <li>Profile created</li>
              <li>Role set to {user.role}</li>
            </ul>
          </div>
        </div>

        <div className="px-5 py-4 text-right border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
        </div>
      </div>
    </div>
  );
}
