// frontend/src/pages/PublicVerificationPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, XCircle, Calendar, MapPin, Building2, Flame, Package } from 'lucide-react';

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
        // Use the same host as the frontend, but port 3000 for backend
        const backendUrl = window.location.hostname === 'localhost'
          ? 'http://localhost:3000'
          : `http://${window.location.hostname}:3000`;
        const response = await fetch(`${backendUrl}/api/v1/public/extinguishers/${id}/verify`);

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
        <div className="bg-white rounded-b-lg shadow-xl p-6">
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
