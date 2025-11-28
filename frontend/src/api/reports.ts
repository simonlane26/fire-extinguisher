export type GenerateReportPayload = {
  tenantId: string;
  visitDate: string;
  technician?: string;
  jobIds: string[];
  photoIds?: string[];
};

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

const API_URL = getApiBase();

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

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
