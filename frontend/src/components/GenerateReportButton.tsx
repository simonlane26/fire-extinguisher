import React, { useState } from 'react';
import { generateReport } from '../api/reports';

type Props = {
  tenantId: string;
  primaryColor?: string;
  // Optional: pass selected job/photo ids if/when you have them
  jobIds?: string[];
  photoIds?: string[];
  technicianName?: string;
};

const GenerateReportButton: React.FC<Props> = ({
  tenantId,
  primaryColor = '#7c3aed',
  jobIds = [],
  photoIds = [],
  technicianName,
}) => {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    try {
      setBusy(true);
      const today = new Date().toISOString().split('T')[0];

      const { pdfUrl } = await generateReport({
        tenantId,
        visitDate: today,
        technician: technicianName || 'Technician',
        jobIds,
        photoIds,
      });

      // Construct full URL - pdfUrl is like "/uploads/reports/123-report.pdf"
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const baseUrl = API_URL.replace('/api/v1', ''); // Get http://localhost:3000
      const fullPdfUrl = `${baseUrl}${pdfUrl}`;

      // open the generated PDF in a new tab
      window.open(fullPdfUrl, '_blank', 'noopener,noreferrer');
    } catch (e: any) {
      alert(e?.message || 'Failed to generate report');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-60"
      style={{ backgroundColor: primaryColor }}
      title="Compile a photo-backed PDF service report"
    >
      {busy ? 'Generating…' : 'Generate Service Report'}
    </button>
  );
};

export default GenerateReportButton;
