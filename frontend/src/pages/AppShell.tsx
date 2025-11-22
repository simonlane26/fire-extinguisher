import React, { useState } from 'react';
import OverviewPage from './OverviewPage';
import UsersPage from './UsersPage';
import SettingsPage from './SettingsPage';
import SitesPage from './SitesPage';
import { Tenant } from '../types';

const AppShell: React.FC = () => {
  const [tab, setTab] = useState<'overview'|'sites'|'users'|'settings'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-4 text-white bg-indigo-600">
        <div className="flex justify-between max-w-6xl mx-auto">
          <div className="font-semibold">Fire Safety Management</div>
          <nav className="space-x-2">
            <button onClick={() => setTab('overview')} className="px-3 py-1 rounded hover:bg-white/10">Overview</button>
            <button onClick={() => setTab('sites')} className="px-3 py-1 rounded hover:bg-white/10">Sites</button>
            <button onClick={() => setTab('users')} className="px-3 py-1 rounded hover:bg-white/10">Users</button>
            <button onClick={() => setTab('settings')} className="px-3 py-1 rounded hover:bg-white/10">Settings</button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl p-6 mx-auto">
        {tab === 'overview' && <OverviewPage />}
        {tab === 'sites' && <SitesPage />}
        {tab === 'users' && <UsersPage />}
        {tab === 'settings' && <SettingsPage tenant={{
          id: '',
          companyName: '',
          subdomain: '',
          logoUrl: undefined,
          primaryColor: '',
          secondaryColor: '',
          subscriptionPlan: 'trial',
          subscriptionStatus: '',
          createdAt: ''
        }} updateTenant={function (u: Partial<Tenant>): void {
          throw new Error('Function not implemented.');
        } } />}
      </main>
    </div>
  );
};

export default AppShell;
