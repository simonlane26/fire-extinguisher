// frontend/src/pages/PublicVerificationPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, XCircle, Calendar, MapPin, Building2, Flame, Package, AlertTriangle } from 'lucide-react';

// Get API base URL - same logic as api.ts
const getApiBase = () => {
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }

  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalhost) {
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:3000/api/v1`;
  } else {
    // In production (Railway), use relative path (same domain, different path)
    return '/api/v1';
  }
};

interface VerificationData {
  id: string;
  location: string;
  building: string;
  floor: string;
  type: string;
  capacity: string;
  status: string;
  condition: string;
  lastInspection: {
    date: string;
    daysAgo: number;
    formattedDate: string;
  } | null;
  nextInspection: {
    date: string;
    daysUntil: number;
    formattedDate: string;
  } | null;
  complianceStatus: {
    status: 'compliant' | 'warning' | 'overdue';
    message: string;
    isCompliant: boolean;
  };
  tenant: {
    companyName: string;
    logoUrl: string | null;
    contactEmail: string | null;
  };
  certificateNumber: string;
  verifiedAt: string;
}

const PublicVerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const apiBase = getApiBase();
        const response = await fetch(`${apiBase}/public/extinguishers/${id}/verify`);

        if (!response.ok) {
          throw new Error('Extinguisher not found');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify extinguisher');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVerification();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying extinguisher...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'Extinguisher not found'}</p>
          <p className="text-sm text-gray-500">Please check the QR code and try again.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-12 w-12 text-orange-600" />;
      case 'overdue':
        return <XCircle className="h-12 w-12 text-red-600" />;
      default:
        return <Shield className="h-12 w-12 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Company Branding */}
        <div className="bg-white rounded-t-lg shadow-xl p-6 border-b-4 border-red-600">
          <div className="flex items-center justify-between mb-4">
            {data.tenant.logoUrl ? (
              <img src={data.tenant.logoUrl} alt={data.tenant.companyName} className="h-12 object-contain" />
            ) : (
              <h2 className="text-xl font-bold text-gray-900">{data.tenant.companyName}</h2>
            )}
            <Shield className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fire Extinguisher Verification</h1>
          <p className="text-gray-600">Certificate: {data.certificateNumber}</p>
        </div>

        {/* Compliance Status Badge */}
        <div className={`p-6 border-2 ${getStatusColor(data.complianceStatus.status)}`}>
          <div className="flex items-center justify-center space-x-4">
            {getStatusIcon(data.complianceStatus.status)}
            <div className="text-center">
              <h2 className="text-2xl font-bold">{data.complianceStatus.message}</h2>
              {data.nextInspection && (
                <p className="text-sm mt-1">
                  {data.complianceStatus.status === 'overdue'
                    ? `Overdue by ${Math.abs(data.nextInspection.daysUntil)} days`
                    : `Next inspection: ${data.nextInspection.formattedDate}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Equipment Details */}
        <div className="bg-white shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Flame className="h-5 w-5 text-red-600 mr-2" />
            Equipment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{data.location}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Building & Floor</p>
                <p className="font-medium text-gray-900">{data.building} - {data.floor}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Flame className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium text-gray-900">{data.type}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium text-gray-900">{data.capacity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection History */}
        <div className="bg-white shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-red-600 mr-2" />
            Inspection History
          </h3>
          <div className="space-y-4">
            {data.lastInspection && (
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="text-sm text-gray-500">Last Inspection</p>
                <p className="font-medium text-gray-900">{data.lastInspection.formattedDate}</p>
                <p className="text-sm text-gray-600">{data.lastInspection.daysAgo} days ago</p>
              </div>
            )}
            {data.nextInspection && (
              <div className={`border-l-4 pl-4 py-2 ${
                data.complianceStatus.status === 'overdue' ? 'border-red-500' :
                data.complianceStatus.status === 'warning' ? 'border-orange-500' :
                'border-blue-500'
              }`}>
                <p className="text-sm text-gray-500">Next Inspection Due</p>
                <p className="font-medium text-gray-900">{data.nextInspection.formattedDate}</p>
                <p className="text-sm text-gray-600">
                  {data.nextInspection.daysUntil > 0
                    ? `In ${data.nextInspection.daysUntil} days`
                    : `Overdue by ${Math.abs(data.nextInspection.daysUntil)} days`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Status */}
        <div className="bg-white shadow-xl p-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border-r">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className={`font-semibold ${data.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                {data.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Condition</p>
              <p className={`font-semibold ${
                data.condition === 'Good' ? 'text-green-600' :
                data.condition === 'Fair' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {data.condition}
              </p>
            </div>
          </div>
        </div>

        {/* Report a Problem */}
        <div className="bg-white rounded-b-lg shadow-xl p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Spotted an Issue?</h3>
                <p className="text-sm text-red-800 mb-3">
                  If you notice any problems with this fire extinguisher (damage, missing parts, accessibility issues, etc.), please report it immediately.
                </p>
                <a
                  href={`mailto:${data.tenant.contactEmail || 'info@firexcheck.com'}?subject=Problem Report - Fire Extinguisher ${data.certificateNumber}&body=Company: ${data.tenant.companyName}%0D%0ALocation: ${data.building} - ${data.location}%0D%0AFloor: ${data.floor}%0D%0AType: ${data.type}%0D%0ACapacity: ${data.capacity}%0D%0A%0D%0AProblem Description:%0D%0A`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  <AlertTriangle size={18} />
                  Report a Problem
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white p-4 text-center rounded-b-lg mt-0">
          <p className="text-sm">
            Verified at: {new Date(data.verifiedAt).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This certificate is generated automatically and is valid at the time of verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicVerificationPage;
