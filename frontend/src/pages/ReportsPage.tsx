import React, { useState, useEffect } from 'react';
import { FileText, Users, Filter } from 'lucide-react';
import { getAuthHeaders, fetchExtinguishers } from '../lib/api';

// Determine API base URL based on environment
const getApiBase = () => {
  // In production, always use the environment variable
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }

  // Check if we're on localhost (development)
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalhost) {
    // In development, use current hostname with port 3000
    const protocol = window.location.protocol; // http: or https:
    return `${protocol}//${hostname}:3000/api/v1`;
  } else {
    // In production (Railway), use relative path (same domain, different path)
    return '/api/v1';
  }
};

const API_BASE = getApiBase();

type Props = {
  primaryColor?: string;
};

const ReportsPage: React.FC<Props> = ({ primaryColor = '#7c3aed' }) => {
  const [generatingUsers, setGeneratingUsers] = useState(false);
  const [generatingByType, setGeneratingByType] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [extinguisherTypes, setExtinguisherTypes] = useState<string[]>([]);

  useEffect(() => {
    // Fetch available extinguisher types
    fetchExtinguisherTypes();
  }, []);

  const fetchExtinguisherTypes = async () => {
    try {
      const extinguishers = await fetchExtinguishers();

      // Extract unique types
      const types = [...new Set(extinguishers.map((e: any) => e.type))].sort();
      setExtinguisherTypes(types as string[]);
    } catch (error) {
      console.error('Failed to fetch extinguisher types:', error);
    }
  };

  const generateUserReport = async () => {
    try {
      setGeneratingUsers(true);
      const res = await fetch(`${API_BASE}/reports/users/report`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to generate user report');

      const { pdfUrl } = await res.json();

      // Open the PDF in a new tab
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      const fullPdfUrl = isLocalhost
        ? `${window.location.protocol}//${hostname}:3000${pdfUrl}`
        : pdfUrl;

      window.open(fullPdfUrl, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      alert(error?.message || 'Failed to generate user report');
    } finally {
      setGeneratingUsers(false);
    }
  };

  const generateExtinguishersByTypeReport = async () => {
    try {
      setGeneratingByType(true);
      const res = await fetch(`${API_BASE}/reports/extinguishers/by-type?type=${selectedType}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to generate extinguishers report');

      const { pdfUrl } = await res.json();

      // Open the PDF in a new tab
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      const fullPdfUrl = isLocalhost
        ? `${window.location.protocol}//${hostname}:3000${pdfUrl}`
        : pdfUrl;

      window.open(fullPdfUrl, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      alert(error?.message || 'Failed to generate extinguishers report');
    } finally {
      setGeneratingByType(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
        Reports
      </h1>

      <p className="text-gray-600 mb-8">
        Generate comprehensive PDF reports for your fire safety management system.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management Report */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Users size={24} style={{ color: primaryColor }} />
            </div>
            <h2 className="text-xl font-semibold">User Management Report</h2>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            Generate a detailed report of all users in your organization, including their roles, status, and activity.
          </p>

          <button
            onClick={generateUserReport}
            disabled={generatingUsers}
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <FileText size={16} />
            {generatingUsers ? 'Generating...' : 'Generate User Report'}
          </button>
        </div>

        {/* Extinguishers by Type Report */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Filter size={24} style={{ color: primaryColor }} />
            </div>
            <h2 className="text-xl font-semibold">Extinguishers by Type</h2>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            Generate a report grouped by extinguisher type, with detailed inventory and service information.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRing: primaryColor }}
            >
              <option value="all">All Types</option>
              {extinguisherTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button
            onClick={generateExtinguishersByTypeReport}
            disabled={generatingByType}
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <FileText size={16} />
            {generatingByType ? 'Generating...' : 'Generate Type Report'}
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Additional Reports</h3>
        <p className="text-sm text-blue-800">
          For individual extinguisher history reports and certificates, visit the Inventory page and use the report options in each extinguisher's detail view.
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
