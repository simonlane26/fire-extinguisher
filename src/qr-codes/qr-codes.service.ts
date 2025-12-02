import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';
import JSZip from 'jszip';
import { createCanvas, loadImage } from 'canvas';
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
        let buffer = await QRCode.toBuffer(qrData, {
          errorCorrectionLevel: dto.errorCorrection || 'M',
          width: dto.size || 500,
          margin: dto.margin || 4,
          color: {
            dark: dto.foregroundColor || '#000000',
            light: dto.backgroundColor || '#FFFFFF',
          },
        });

        // Add label if provided (use location/building as default label for extinguishers)
        if (dto.label) {
          const label = dto.label
            .replace('{location}', ext.location || '')
            .replace('{building}', ext.building || '')
            .replace('{type}', ext.type || '')
            .replace('{id}', ext.id || '');
          buffer = await this.addLabelToQr(buffer, label, dto.size || 500);
        }

        zip.file(`${this.sanitizeFilename(ext.id)}.png`, buffer);
      }
    } else if (dto.prefix !== undefined && dto.startNumber !== undefined && dto.endNumber !== undefined) {
      // Generate sequential QR codes
      const padding = dto.padding || 3;
      for (let i = dto.startNumber; i <= dto.endNumber; i++) {
        const num = String(i).padStart(padding, '0');
        const text = `${dto.prefix}${num}${dto.suffix || ''}`;

        let buffer = await QRCode.toBuffer(text, {
          errorCorrectionLevel: dto.errorCorrection || 'M',
          width: dto.size || 500,
          margin: dto.margin || 4,
          color: {
            dark: dto.foregroundColor || '#000000',
            light: dto.backgroundColor || '#FFFFFF',
          },
        });

        // Add label if provided
        if (dto.label) {
          const label = dto.label.replace('{code}', text);
          buffer = await this.addLabelToQr(buffer, label, dto.size || 500);
        }

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
   * Returns a URL to the public verification page
   */
  private buildExtinguisherQrData(ext: any): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${frontendUrl}/verify/${ext.id}`;
  }

  /**
   * Add a label to a QR code image
   */
  private async addLabelToQr(qrBuffer: Buffer, label: string, size: number = 500): Promise<Buffer> {
    // Load the QR code image
    const qrImage = await loadImage(qrBuffer);

    // Calculate canvas size (QR + label space)
    const labelHeight = 60;
    const canvas = createCanvas(size, size + labelHeight);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size + labelHeight);

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0, size, size);

    // Draw label text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, size / 2, size + labelHeight / 2);

    // Convert to buffer
    return canvas.toBuffer('image/png');
  }

  /**
   * Sanitize filename for safe file system usage
   */
  private sanitizeFilename(filename: string): string {
    return filename.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 120) || 'qr-code';
  }
}
