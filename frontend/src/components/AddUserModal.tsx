import React, { useState } from 'react';
import type { User, RoleKey } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (u: User) => void;
  primaryColor: string;
  availableRoles: RoleKey[];
};

export default function AddUserModal({
  open, onClose, onCreate, primaryColor, availableRoles,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleKey>('viewer');
  const [status, setStatus] = useState<User['status']>('active');
  const [invite, setInvite] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSave = async () => {
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSaving(true);

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      phone: '',
    };

    // (Optional) send invite email here
    // await fetch('/api/invite', { method:'POST', body: JSON.stringify({email}) });

    onCreate(newUser);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-lg overflow-hidden bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Add User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {error && <div className="p-2 text-sm text-red-700 border border-red-200 rounded bg-red-50">{error}</div>}

          <div>
            <label className="block mb-1 text-sm text-gray-600">Name</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                   value={name} onChange={e=>setName(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                   value={email} onChange={e=>setEmail(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Role</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={role} onChange={e=>setRole(e.target.value as RoleKey)}>
                {availableRoles.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={status} onChange={e=>setStatus(e.target.value as any)}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={invite} onChange={(e)=>setInvite(e.target.checked)} />
            Send invite email
          </label>
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" disabled={saving}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {saving ? 'Saving…' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
}
