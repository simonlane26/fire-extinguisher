import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

export interface QrCodeOptions {
  text?: string;
  extinguisherData?: {
    id?: string;
    location?: string;
    building?: string;
    floor?: string;
    type?: string;
    capacity?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    installDate?: string;
    expiryDate?: string;
    status?: string;
    condition?: string;
    serviceType?: string;
    inspector?: string;
    notes?: string;
    lastInspection?: string;
    nextInspection?: string;
    lastMaintenance?: string;
    nextMaintenance?: string;
  };
  size?: number;
  scale?: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  foregroundColor?: string;
  backgroundColor?: string;
}

export interface BulkQrCodeOptions {
  extinguisherIds?: string[];
  prefix?: string;
  startNumber?: number;
  endNumber?: number;
  suffix?: string;
  padding?: number;
  size?: number;
  scale?: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  foregroundColor?: string;
  backgroundColor?: string;
}

/**
 * Generate a single QR code
 */
export async function generateQrCode(options: QrCodeOptions): Promise<{ qrDataUrl: string }> {
  const token = localStorage.getItem('auth_token');
  const response = await axios.post(
    `${API_BASE}/qr-codes/generate`,
    options,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

/**
 * Generate bulk QR codes and download as ZIP
 */
export async function generateBulkQrCodes(options: BulkQrCodeOptions): Promise<Blob> {
  const token = localStorage.getItem('auth_token');
  const response = await axios.post(
    `${API_BASE}/qr-codes/generate-bulk`,
    options,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    }
  );
  return response.data;
}

/**
 * Get QR code for a specific extinguisher
 */
export async function getExtinguisherQr(extinguisherId: string): Promise<Blob> {
  const token = localStorage.getItem('auth_token');
  const response = await axios.get(
    `${API_BASE}/qr-codes/extinguisher/${extinguisherId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    }
  );
  return response.data;
}
