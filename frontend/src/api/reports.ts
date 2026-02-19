import { API_BASE, getAuthHeaders } from '../lib/api';

export type GenerateReportPayload = {
  tenantId: string;
  visitDate: string;
  technician?: string;
  jobIds: string[];
  photoIds?: string[];
};

const API_URL = API_BASE;

export async function generateReport(payload: GenerateReportPayload) {
  const res = await fetch(`${API_URL}/reports/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Report generation failed: ${res.status} ${text}`);
  }
  return (await res.json()) as { report: any; pdfUrl: string };
}

// Generate comprehensive extinguisher history PDF
export async function generateExtinguisherHistoryPDF(extinguisherId: string) {
  const res = await fetch(`${API_URL}/reports/extinguisher/${extinguisherId}/history-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`History report generation failed: ${res.status} ${text}`);
  }
  const blob = await res.blob();
  return { pdfUrl: URL.createObjectURL(blob) };
}

// Generate compliance certificate PDF
export async function generateComplianceCertificate(extinguisherId: string, inspectionId?: string) {
  const res = await fetch(`${API_URL}/reports/extinguisher/${extinguisherId}/certificate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ inspectionId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Certificate generation failed: ${res.status} ${text}`);
  }
  const blob = await res.blob();
  return { pdfUrl: URL.createObjectURL(blob) };
}

// Download Excel export
export async function downloadExtinguisherExcel(extinguisherId: string) {
  const url = `${API_URL}/reports/extinguisher/${extinguisherId}/export-excel`;

  // Use fetch to download with proper authentication headers
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Excel export failed: ${res.status} ${text}`);
  }

  // Convert response to blob and trigger download
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `extinguisher-${extinguisherId}-history.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
