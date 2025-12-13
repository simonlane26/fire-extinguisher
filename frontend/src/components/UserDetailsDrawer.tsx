import React, { useState, useEffect } from 'react';
import type { User, RoleKey, Site } from '../types';
import { fetchUserSites, setUserSiteAccess, fetchSites } from '../lib/api';

type Props = {
  open: boolean;
  user: User | null;
  canEdit: boolean;
  onClose: () => void;
  onChangeRole: (role: RoleKey) => void;
  availableRoles?: RoleKey[];
};

const ALL_ROLES: RoleKey[] = ['super_admin','admin','manager','inspector','viewer'];

export default function UserDetailsDrawer({
  open, user, canEdit, onClose, onChangeRole, availableRoles = ALL_ROLES,
}: Props) {
  const [userSites, setUserSites] = useState<Site[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [savingSites, setSavingSites] = useState(false);
  const [selectedSiteIds, setSelectedSiteIds] = useState<Set<string>>(new Set());

  // Load user's sites and all available sites when drawer opens
  useEffect(() => {
    if (open && user) {
      loadUserSites();
      loadAllSites();
    }
  }, [open, user?.id]);

  const loadUserSites = async () => {
    if (!user) return;
    setLoadingSites(true);
    try {
      const sites = await fetchUserSites(user.id);
      setUserSites(sites);
      setSelectedSiteIds(new Set(sites.map(s => s.id)));
    } catch (error) {
      console.error('Failed to load user sites:', error);
    } finally {
      setLoadingSites(false);
    }
  };

  const loadAllSites = async () => {
    try {
      const sites = await fetchSites();
      setAllSites(sites);
    } catch (error) {
      console.error('Failed to load all sites:', error);
    }
  };

  const handleSiteToggle = (siteId: string) => {
    const newSelected = new Set(selectedSiteIds);
    if (newSelected.has(siteId)) {
      newSelected.delete(siteId);
    } else {
      newSelected.add(siteId);
    }
    setSelectedSiteIds(newSelected);
  };

  const handleSaveSiteAccess = async () => {
    if (!user) return;
    setSavingSites(true);
    try {
      await setUserSiteAccess(user.id, Array.from(selectedSiteIds));
      await loadUserSites(); // Reload to confirm
      alert('Site access updated successfully');
    } catch (error) {
      console.error('Failed to update site access:', error);
      alert('Failed to update site access');
    } finally {
      setSavingSites(false);
    }
  };

  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'owner' || user?.role === 'super_admin';

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
                  {availableRoles.map((r: RoleKey) => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
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

          {/* Site Access Management */}
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">Site Access</div>

            {isAdminOrOwner ? (
              <div className="p-2 text-sm bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-700 font-medium">
                  {user.role.replace('_', ' ')} users have access to all sites automatically
                </p>
              </div>
            ) : (
              <div>
                {loadingSites ? (
                  <p className="text-sm text-gray-500">Loading sites...</p>
                ) : allSites.length === 0 ? (
                  <p className="text-sm text-gray-500">No sites available</p>
                ) : (
                  <div className="space-y-2">
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {allSites.map((site) => (
                        <label key={site.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSiteIds.has(site.id)}
                            onChange={() => handleSiteToggle(site.id)}
                            disabled={!canEdit || savingSites}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{site.name}</span>
                        </label>
                      ))}
                    </div>
                    {canEdit && (
                      <button
                        onClick={handleSaveSiteAccess}
                        disabled={savingSites}
                        className="w-full mt-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingSites ? 'Saving...' : 'Save Site Access'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Activity trail */}
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">Activity</div>
            <ul className="pl-5 space-y-1 text-gray-700 list-disc">
              <li>Profile created</li>
              <li>Role set to {user.role}</li>
              {!isAdminOrOwner && (
                <li>Access to {userSites.length} site{userSites.length !== 1 ? 's' : ''}</li>
              )}
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
