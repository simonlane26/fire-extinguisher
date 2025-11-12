import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';
import JSZip from 'jszip';
import { GenerateQrDto, GenerateBulkQrDto } from './dto/generate-qr.dto';

@Injectable()
export class QrCodesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a single QR code based on provided data
   */
  async generateQrCode(dto: GenerateQrDto): Promise<{ qrDataUrl: string }> {
    const qrData = this.buildQrData(dto);

    const qrDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: dto.errorCorrection || 'M',
      width: dto.size || 300,
      margin: dto.margin || 4,
      color: {
        dark: dto.foregroundColor || '#000000',
        light: dto.backgroundColor || '#FFFFFF',
      },
    });

    return { qrDataUrl };
  }

  /**
   * Generate QR code for a specific extinguisher
   */
  async generateExtinguisherQr(tenantId: string, extinguisherId: string): Promise<Buffer> {
    const extinguisher = await this.prisma.extinguisher.findFirst({
      where: {
        id: extinguisherId,
        tenantId,
      },
    });

    if (!extinguisher) {
      throw new NotFoundException(`Extinguisher ${extinguisherId} not found`);
    }

    const qrData = this.buildExtinguisherQrData(extinguisher);

    return await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'M',
      width: 500,
      margin: 4,
    });
  }

  /**
   * Generate multiple QR codes and package them into a ZIP file
   */
  async generateBulkQrCodes(tenantId: string, dto: GenerateBulkQrDto): Promise<Buffer> {
    const zip = new JSZip();

    if (dto.extinguisherIds && dto.extinguisherIds.length > 0) {
      // Generate QR codes for specific extinguishers
      const extinguishers = await this.prisma.extinguisher.findMany({
        where: {
          id: { in: dto.extinguisherIds },
          tenantId,
        },
      });

      for (const ext of extinguishers) {
        const qrData = this.buildExtinguisherQrData(ext);
        const buffer = await QRCode.toBuffer(qrData, {
          errorCorrectionLevel: dto.errorCorrection || 'M',
          width: dto.size || 500,
          margin: dto.margin || 4,
          color: {
            dark: dto.foregroundColor || '#000000',
            light: dto.backgroundColor || '#FFFFFF',
          },
        });

        zip.file(`${this.sanitizeFilename(ext.id)}.png`, buffer);
      }
    } else if (dto.prefix !== undefined && dto.startNumber !== undefined && dto.endNumber !== undefined) {
      // Generate sequential QR codes
      const padding = dto.padding || 3;
      for (let i = dto.startNumber; i <= dto.endNumber; i++) {
        const num = String(i).padStart(padding, '0');
        const text = `${dto.prefix}${num}${dto.suffix || ''}`;

        const buffer = await QRCode.toBuffer(text, {
          errorCorrectionLevel: dto.errorCorrection || 'M',
          width: dto.size || 500,
          margin: dto.margin || 4,
          color: {
            dark: dto.foregroundColor || '#000000',
            light: dto.backgroundColor || '#FFFFFF',
          },
        });

        zip.file(`${this.sanitizeFilename(text)}.png`, buffer);
      }
    }

    return await zip.generateAsync({ type: 'nodebuffer' });
  }

  /**
   * Build QR data string from DTO
   */
  private buildQrData(dto: GenerateQrDto): string {
    if (dto.text) {
      return dto.text;
    }

    if (dto.extinguisherData) {
      return JSON.stringify(dto.extinguisherData);
    }

    return '';
  }

  /**
   * Build QR data for an extinguisher
   */
  private buildExtinguisherQrData(ext: any): string {
    const formatDate = (d?: string | Date) => {
      if (!d) return '—';
      const dateStr = d instanceof Date ? d.toISOString() : d;
      if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
      return '—';
    };

    const safe = (v?: string | null) => (v === undefined || v === null || v === '' ? '—' : v);

    return `🔥 FIRE EXTINGUISHER

━━━━━━━━━━━━━━━━━━━━
📋 BASIC INFORMATION
━━━━━━━━━━━━━━━━━━━━
ID: ${safe(ext.id)}
Type: ${safe(ext.type)}
Capacity: ${safe(ext.capacity)}
Manufacturer: ${safe(ext.manufacturer)}
Model: ${safe(ext.model)}
Serial Number: ${safe(ext.serialNumber)}

━━━━━━━━━━━━━━━━━━━━
📍 LOCATION
━━━━━━━━━━━━━━━━━━━━
Location: ${safe(ext.location)}
Building: ${safe(ext.building)}
Floor: ${safe(ext.floor)}

━━━━━━━━━━━━━━━━━━━━
🔧 SERVICE & INSPECTION
━━━━━━━━━━━━━━━━━━━━
Last Service: ${formatDate(ext.lastMaintenance)}
Next Service: ${formatDate(ext.nextMaintenance)}
Last Inspection: ${formatDate(ext.lastInspection)}
Next Inspection: ${formatDate(ext.nextInspection)}
Commission Date: ${formatDate(ext.installDate)}
Expiry Date: ${formatDate(ext.expiryDate)}
Service Type: ${safe(ext.serviceType)}

━━━━━━━━━━━━━━━━━━━━
✓ STATUS & CONDITION
━━━━━━━━━━━━━━━━━━━━
Status: ${safe(ext.status)}
Condition: ${safe(ext.condition)}
Inspector: ${safe(ext.inspector)}

━━━━━━━━━━━━━━━━━━━━
📝 NOTES
━━━━━━━━━━━━━━━━━━━━
${safe(ext.notes)}`;
  }

  /**
   * Sanitize filename for safe file system usage
   */
  private sanitizeFilename(filename: string): string {
    return filename.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 120) || 'qr-code';
  }
}
