export type GenerateReportPayload = {
  tenantId: string;
  visitDate: string;
  technician?: string;
  jobIds: string[];
  photoIds?: string[];
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function generateReport(payload: GenerateReportPayload) {
  const res = await fetch(`${API_URL}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Report generation failed: ${res.status} ${text}`);
  }
  return (await res.json()) as { report: any; pdfUrl: string };
}
