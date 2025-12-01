import React, { useState } from 'react';
import type { Extinguisher } from '../types';
import { Pencil, FileText, Award, Download } from 'lucide-react';
import { generateExtinguisherHistoryPDF, generateComplianceCertificate, downloadExtinguisherExcel } from '../api/reports';

type Props = {
  open: boolean;
  onClose: () => void;
  data: Extinguisher | null;
  primaryColor?: string; // brand color for status badge
  onEdit?: (extinguisher: Extinguisher) => void; // callback to open edit modal
};

// --- helpers ---
const safe = (v?: React.ReactNode) => (v === undefined || v === null || v === '' ? '—' : v);

const formatDate = (d?: string) => {
  if (!d) return '—';
  // Keep ISO if it already looks like YYYY-MM-DD, otherwise try a readable format
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? safe(d) : dt.toISOString().slice(0, 10);
};

const conditionTone = (condition?: string) => {
  switch ((condition || '').toLowerCase()) {
    case 'excellent':
    case 'good':
      return 'text-green-700';
    case 'fair':
      return 'text-amber-700';
    case 'needs attention':
      return 'text-orange-700';
    case 'out of service':
      return 'text-red-700';
    default:
      return 'text-gray-700';
  }
};

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex gap-2 text-sm">
    <div className="w-40 text-gray-600 shrink-0">{label}</div>
    <div className="font-medium text-gray-900">{safe(value)}</div>
  </div>
);

const Section: React.FC<{ title: string; className?: string; children?: React.ReactNode }> = ({
  title,
  className,
  children,
}) => (
  <section className={`rounded-xl p-4 ${className ?? ''}`}>
    <h4 className="mb-3 text-sm font-semibold text-gray-700">{title}</h4>
    <div className="space-y-2">{children}</div>
  </section>
);

const ExtinguisherDetails: React.FC<Props> = ({ open, onClose, data, primaryColor = '#7c3aed', onEdit }) => {
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  if (!open || !data) return null;

  // Determine if primary color is effectively white
  const isWhitePrimary =
    !primaryColor ||
    primaryColor === '#ffffff' ||
    primaryColor === '#fff' ||
    primaryColor === 'white' ||
    primaryColor === '#FFFFFF' ||
    primaryColor === '#FFF' ||
    primaryColor.match(/^rgba?\(255,\s*255,\s*255/);

  const effectiveColor = isWhitePrimary ? '#7c3aed' : primaryColor;

  const handleGenerateHistory = async () => {
    try {
      setLoadingReport('history');
      const { pdfUrl } = await generateExtinguisherHistoryPDF(data.id);
      window.open(pdfUrl, '_blank');
    } catch (error: any) {
      alert(error.message || 'Failed to generate history report');
    } finally {
      setLoadingReport(null);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      setLoadingReport('certificate');
      const { pdfUrl } = await generateComplianceCertificate(data.id);
      window.open(pdfUrl, '_blank');
    } catch (error: any) {
      alert(error.message || 'Failed to generate certificate');
    } finally {
      setLoadingReport(null);
    }
  };

  const handleDownloadExcel = () => {
    try {
      setLoadingReport('excel');
      downloadExtinguisherExcel(data.id);
    } catch (error: any) {
      alert(error.message || 'Failed to download Excel file');
    } finally {
      setTimeout(() => setLoadingReport(null), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-3xl overflow-hidden bg-white shadow-xl rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">Extinguisher Details — {safe(data.id)}</h3>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic */}
          <Section title="Basic Information">
            <Row label="Type" value={data.type} />
            <Row label="Capacity" value={data.capacity} />
            <Row label="Weight" value={data.weight} />
            <Row label="Manufacturer" value={data.manufacturer} />
            <Row label="Model" value={data.model} />
            <Row label="Serial Number" value={data.serialNumber} />
          </Section>

          {/* Location */}
          <Section title="Location" className="bg-blue-50">
            <Row label="Location" value={data.location} />
            <Row label="Building" value={data.building} />
            <Row label="Floor" value={data.floor} />
          </Section>

          {/* Service / Inspection */}
          <Section title="Service & Inspection" className="bg-green-50">
            <Row label="Last Service Date" value={formatDate(data.lastMaintenance)} />
            <Row label="Next Service Date" value={formatDate(data.nextMaintenance)} />
            <Row label="Last Extended Inspection" value={formatDate(data.lastInspection)} />
            <Row label="Next Extended Inspection" value={formatDate(data.nextInspection)} />
            <Row label="Commission Date" value={formatDate(data.installDate)} />
            <Row label="Expiry Date" value={formatDate(data.expiryDate)} />
            {/* Optional service type if you store it */}
            {'serviceType' in data && <Row label="Service Type" value={(data as any).serviceType} />}
          </Section>

          {/* Status */}
          <Section title="Status & Condition" className="bg-amber-50">
            <Row
              label="Status"
              value={
                <span
                  className="px-2 py-1 text-xs text-white rounded-full"
                  style={{ backgroundColor: effectiveColor }}
                >
                  {safe(data.status)}
                </span>
              }
            />
            <Row
              label="Condition"
              value={<span className={`font-semibold ${conditionTone(data.condition)}`}>{safe(data.condition)}</span>}
            />
            <Row label="Inspector" value={data.inspector} />
          </Section>

          {/* Notes */}
          <Section title="Notes">
            <div className="p-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg">
              {safe(data.notes)}
            </div>
          </Section>

          {/* Reports */}
          <Section title="Generate Reports" className="bg-purple-50">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={handleGenerateHistory}
                disabled={loadingReport !== null}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: effectiveColor }}
              >
                <FileText size={18} />
                {loadingReport === 'history' ? 'Generating...' : 'Full History PDF'}
              </button>

              <button
                onClick={handleGenerateCertificate}
                disabled={loadingReport !== null}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Award size={18} />
                {loadingReport === 'certificate' ? 'Generating...' : 'Certificate'}
              </button>

              <button
                onClick={handleDownloadExcel}
                disabled={loadingReport !== null}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Download size={18} />
                {loadingReport === 'excel' ? 'Downloading...' : 'Excel Export'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Generate comprehensive lifecycle reports, compliance certificates, or export complete history to Excel.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-2 px-5 py-3 border-t">
          {onEdit && (
            <button
              onClick={() => {
                onEdit(data);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: effectiveColor }}
            >
              <Pencil size={16} />
              Edit After Service
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ml-auto">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtinguisherDetails;
