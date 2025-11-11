import React, { useMemo, useState } from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import type { User, RoleKey } from '../types';
import AddUserModal from '../components/AddUserModal';
import UserDetailsDrawer from '../components/UserDetailsDrawer';

type Props = {
  users: User[];
  primaryColor: string;
  currentRole: RoleKey;
  canAdd: boolean;                     // from hasPermission('ADD_USERS')
  canEdit: boolean;                    // from hasPermission('EDIT_USERS')
  onAddUser: (u: User) => void;
  onUpdateUser: (id: string, patch: Partial<User>) => void;
};

const ROLES: RoleKey[] = ['super_admin','admin','manager','inspector','viewer'];

function StatusPill({ status }: { status: User['status'] }) {
  const isActive = status === 'active';
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-600' : 'bg-red-600'}`} />
      {isActive ? 'active' : 'inactive'}
    </span>
  );
}

export default function UsersPage({
  users, primaryColor, currentRole, canAdd, canEdit, onAddUser, onUpdateUser,
}: Props) {
  // search + filters
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | RoleKey>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return users.filter(u => {
      const textHit =
        !qq ||
        u.name.toLowerCase().includes(qq) ||
        u.email.toLowerCase().includes(qq) ||
        u.role.toLowerCase().includes(qq);
      const roleHit = roleFilter === 'all' || u.role === roleFilter;
      const statusHit = statusFilter === 'all' || u.status === statusFilter;
      return textHit && roleHit && statusHit;
    });
  }, [users, q, roleFilter, statusFilter]);

  const selected = selectedId ? users.find(u => u.id === selectedId) ?? null : null;

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64 outline-none"
            placeholder="Search name, email, or role…"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg"
            title="Filter by status"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg"
            title="Filter by role"
          >
            <option value="all">All roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
          </select>

          {canAdd ? (
            <button
              onClick={() => setOpenAdd(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          ) : (
            <button
              className="px-4 py-2 text-gray-500 bg-gray-200 rounded-lg cursor-not-allowed"
              title="You don’t have permission to add users"
              disabled
            >
              Add User
            </button>
          )}
        </div>
      </div>

      {/* table */}
      <div className="overflow-hidden bg-white shadow rounded-2xl">
        <table className="min-w-full">
          <thead className="text-xs font-medium text-left text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last login</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-200">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div className="text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4 capitalize">{u.role.replace('_', ' ')}</td>
                <td className="px-6 py-4"><StatusPill status={u.status} /></td>
                <td className="px-6 py-4">{u.lastLogin || '—'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedId(u.id)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    title="View details"
                  >
                    View <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* modals */}
      <AddUserModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreate={(u) => { onAddUser(u); setOpenAdd(false); }}
        primaryColor={primaryColor}
        availableRoles={ROLES}
      />
      <UserDetailsDrawer
        open={!!selected}
        user={selected}
        canEdit={canEdit}
        onClose={() => setSelectedId(null)}
        onChangeRole={(role: any) => selected && onUpdateUser(selected.id, { role })}
      />
    </div>
  );
}
