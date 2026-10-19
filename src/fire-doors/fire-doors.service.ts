import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../storage/s3.service';
import sharp from 'sharp';

const COMMUNAL_DOOR_TYPES = ['communal_stairway', 'communal_corridor', 'communal_lobby'];

function frequencyForDoorType(doorType: string): number {
  return COMMUNAL_DOOR_TYPES.includes(doorType) ? 3 : 12;
}

@Injectable()
export class FireDoorsService {
  private readonly logger = new Logger(FireDoorsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  // ─── Doors ───────────────────────────────────────────────────────────────────

  async getDoors(tenantId: string, siteId?: string) {
    return (this.prisma.fireDoor as any).findMany({
      where: { tenantId, ...(siteId ? { siteId } : {}) },
      include: {
        site: { select: { id: true, name: true } },
        _count: { select: { inspections: true } },
        inspections: { orderBy: { inspectedAt: 'desc' }, take: 1, select: { id: true, outcome: true, inspectedAt: true } },
      },
      orderBy: [{ siteId: 'asc' }, { doorRef: 'asc' }],
    });
  }

  async createDoor(
    tenantId: string,
    dto: {
      siteId: string;
      doorRef: string;
      location: string;
      doorType: string;
      fireRating?: string;
      manufacturer?: string;
      installationDate?: string;
      hasIntumescentStrips?: boolean;
      hasSmokeSeal?: boolean;
      hasLetterbox?: boolean;
      hasAirTransferGrille?: boolean;
      hasGlazing?: boolean;
      notes?: string;
    },
  ) {
    return (this.prisma.fireDoor as any).create({
      data: {
        tenantId,
        siteId: dto.siteId,
        doorRef: dto.doorRef,
        location: dto.location,
        doorType: dto.doorType,
        fireRating: dto.fireRating ?? null,
        manufacturer: dto.manufacturer ?? null,
        installationDate: dto.installationDate ? new Date(dto.installationDate) : null,
        hasIntumescentStrips: dto.hasIntumescentStrips ?? false,
        hasSmokeSeal: dto.hasSmokeSeal ?? false,
        hasLetterbox: dto.hasLetterbox ?? false,
        hasAirTransferGrille: dto.hasAirTransferGrille ?? false,
        hasGlazing: dto.hasGlazing ?? false,
        inspectionFrequencyMonths: frequencyForDoorType(dto.doorType),
        notes: dto.notes ?? null,
      },
      include: { site: { select: { id: true, name: true } } },
    });
  }

  async updateDoor(
    tenantId: string,
    id: string,
    dto: Partial<{
      doorRef: string;
      location: string;
      doorType: string;
      fireRating: string;
      manufacturer: string;
      installationDate: string;
      hasIntumescentStrips: boolean;
      hasSmokeSeal: boolean;
      hasLetterbox: boolean;
      hasAirTransferGrille: boolean;
      hasGlazing: boolean;
      notes: string;
    }>,
  ) {
    await this.assertDoorOwner(tenantId, id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.installationDate !== undefined) {
      data.installationDate = dto.installationDate ? new Date(dto.installationDate) : null;
    }
    if (dto.doorType) {
      data.inspectionFrequencyMonths = frequencyForDoorType(dto.doorType);
    }
    return (this.prisma.fireDoor as any).update({ where: { id, tenantId }, data });
  }

  async deleteDoor(tenantId: string, id: string) {
    await this.assertDoorOwner(tenantId, id);
    return (this.prisma.fireDoor as any).delete({ where: { id, tenantId } });
  }

  // ─── Inspections ─────────────────────────────────────────────────────────────

  async getInspections(tenantId: string, doorId: string) {
    await this.assertDoorOwner(tenantId, doorId);
    return (this.prisma.fireDoorInspection as any).findMany({
      where: { doorId },
      orderBy: { inspectedAt: 'desc' },
      take: 200,
    });
  }

  async createInspection(
    tenantId: string,
    doorId: string,
    dto: {
      inspectedBy: string;
      inspectedAt: string;
      accessDenied?: boolean;
      accessDeniedReason?: string;
      visualDamage?: boolean;
      closesCompletely?: boolean;
      closesFromAnyAngle?: boolean;
      opensInTravelDirection?: boolean;
      frameGapOk?: boolean;
      maxGapSizeMm?: number;
      hingesSecure?: boolean;
      hingeCount?: number;
      selfCloserWorks?: boolean;
      intumescentStripIntact?: boolean;
      smokeSealIntact?: boolean;
      letterboxCloses?: boolean;
      airTransferGrilleOk?: boolean;
      glazingIntact?: boolean;
      signageCorrect?: boolean;
      outcome: string;
      defectsFound?: string;
      remedialAction?: string;
      actionPriority?: string;
      comments?: string;
      nextInspectionDate?: string;
    },
  ) {
    const door = await this.assertDoorOwner(tenantId, doorId);

    const inspectedAt = new Date(dto.inspectedAt);

    // Use a provided override date if given; otherwise schedule from the door's
    // own inspection cycle (3 months for communal doors, 12 for flat entrance).
    // On a fail, set next due to the inspection date itself so it shows as
    // immediately overdue — matches the equivalent fail-handling in emergency-lighting.
    let nextInspectionDate: Date | null = dto.nextInspectionDate ? new Date(dto.nextInspectionDate) : null;
    if (!nextInspectionDate) {
      if (dto.outcome === 'fail') {
        nextInspectionDate = new Date(inspectedAt);
      } else {
        const d = new Date(inspectedAt);
        d.setMonth(d.getMonth() + door.inspectionFrequencyMonths);
        nextInspectionDate = d;
      }
    }

    const inspection = await (this.prisma.fireDoorInspection as any).create({
      data: {
        tenantId,
        doorId,
        inspectedBy: dto.inspectedBy,
        inspectedAt,
        accessDenied: dto.accessDenied ?? false,
        accessDeniedReason: dto.accessDeniedReason ?? null,
        visualDamage: dto.visualDamage ?? null,
        closesCompletely: dto.closesCompletely ?? null,
        closesFromAnyAngle: dto.closesFromAnyAngle ?? null,
        opensInTravelDirection: dto.opensInTravelDirection ?? null,
        frameGapOk: dto.frameGapOk ?? null,
        maxGapSizeMm: dto.maxGapSizeMm ?? null,
        hingesSecure: dto.hingesSecure ?? null,
        hingeCount: dto.hingeCount ?? null,
        selfCloserWorks: dto.selfCloserWorks ?? null,
        intumescentStripIntact: dto.intumescentStripIntact ?? null,
        smokeSealIntact: dto.smokeSealIntact ?? null,
        letterboxCloses: dto.letterboxCloses ?? null,
        airTransferGrilleOk: dto.airTransferGrilleOk ?? null,
        glazingIntact: dto.glazingIntact ?? null,
        signageCorrect: dto.signageCorrect ?? null,
        outcome: dto.outcome,
        defectsFound: dto.defectsFound ?? null,
        remedialAction: dto.remedialAction ?? null,
        actionPriority: dto.actionPriority ?? null,
        comments: dto.comments ?? null,
        nextInspectionDate,
      },
    });

    await (this.prisma.fireDoor as any).update({
      where: { id: doorId, tenantId },
      data: { lastInspectedAt: inspectedAt, nextInspectionDue: nextInspectionDate },
    });

    return inspection;
  }

  async deleteInspection(tenantId: string, id: string) {
    const inspection = await (this.prisma.fireDoorInspection as any).findUnique({ where: { id } });
    if (!inspection || inspection.tenantId !== tenantId) throw new NotFoundException('Inspection record not found');
    return (this.prisma.fireDoorInspection as any).delete({ where: { id } });
  }

  // ─── CSV Import ───────────────────────────────────────────────────────────

  async importFromCsv(tenantId: string, csvContent: string): Promise<{ success: boolean; imported: number; errors: number; details?: any[] }> {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV file is empty or has no data rows');

    const sites = await this.prisma.site.findMany({ where: { tenantId } });
    const dataLines = lines.slice(1);
    const imported = [];
    const errors = [];

    const validTypes = [
      'flat_entrance', 'communal_stairway', 'communal_corridor', 'communal_lobby',
      'plant_room', 'service_riser', 'riser_cupboard', 'kitchen', 'hallway',
      'dining_area', 'office', 'other',
    ];

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i].trim();
        if (!line) continue;

        const fields = this.parseCSVLine(line);
        const [doorRef, location, doorType, fireRating, manufacturer, siteName] = fields;

        if (!doorRef || !location || !doorType) {
          errors.push({ line: i + 2, error: 'Missing required fields: doorRef, location, doorType' });
          continue;
        }

        let siteId: string | null = null;
        if (siteName?.trim()) {
          const matched = sites.find(s => s.name.toLowerCase() === siteName.trim().toLowerCase());
          if (!matched) { errors.push({ line: i + 2, error: `Site "${siteName.trim()}" not found` }); continue; }
          siteId = matched.id;
        } else if (sites.length === 1) {
          siteId = sites[0].id;
        } else if (sites.length > 1) {
          errors.push({ line: i + 2, error: 'Site name required when multiple sites exist' }); continue;
        }

        if (!siteId) { errors.push({ line: i + 2, error: 'No site found — create a site first' }); continue; }

        const typeNorm = doorType.trim().toLowerCase().replace(/ /g, '_');
        if (!validTypes.includes(typeNorm)) {
          errors.push({ line: i + 2, error: `Invalid doorType "${doorType}". Must be one of: ${validTypes.join(', ')}` }); continue;
        }

        const door = await (this.prisma.fireDoor as any).create({
          data: {
            tenantId,
            siteId,
            doorRef: doorRef.trim(),
            location: location.trim(),
            doorType: typeNorm,
            fireRating: fireRating?.trim() || null,
            manufacturer: manufacturer?.trim() || null,
            inspectionFrequencyMonths: frequencyForDoorType(typeNorm),
          },
        });
        imported.push(door);
      } catch (error) {
        errors.push({ line: i + 2, error: error.message });
      }
    }

    return { success: true, imported: imported.length, errors: errors.length, details: errors.length > 0 ? errors : undefined };
  }

  private parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (char === ',' && !inQuotes) { fields.push(current); current = ''; }
      else { current += char; }
    }
    fields.push(current);
    return fields;
  }

  // ─── Photos ──────────────────────────────────────────────────────────────────

  async uploadPhoto(
    tenantId: string,
    userId: string,
    doorId: string,
    file: Express.Multer.File,
    inspectionId?: string,
    caption?: string,
  ) {
    await this.assertDoorOwner(tenantId, doorId);

    const compressedBuffer = await this.compressImage(file.buffer, file.mimetype);

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
    const key = `fire-door-photos/${tenantId}/${doorId}/${timestamp}-${randomString}.${ext}`;

    let imageUrl: string;
    if (this.s3Service.configured) {
      imageUrl = await this.s3Service.upload(key, compressedBuffer, `image/${ext}`);
      this.logger.log('Fire door photo uploaded to S3');
    } else {
      imageUrl = `data:image/${ext};base64,${compressedBuffer.toString('base64')}`;
      this.logger.log('S3 not configured — storing fire door photo as inline data URL');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const photo = await (this.prisma.fireDoorPhoto as any).create({
      data: {
        tenantId,
        doorId,
        inspectionId: inspectionId || null,
        url: imageUrl,
        caption: caption || null,
        uploadedBy: user?.name || user?.email || 'Unknown',
      },
    });

    if (this.s3Service.configured && !photo.url.startsWith('data:')) {
      const s3Key = this.s3Service.extractKey(photo.url);
      if (s3Key) {
        try {
          const signedUrl = await this.s3Service.presign(s3Key);
          return { ...photo, url: signedUrl };
        } catch {
          // fall through to return plain URL
        }
      }
    }
    return photo;
  }

  async getPhotos(tenantId: string, doorId: string) {
    await this.assertDoorOwner(tenantId, doorId);

    const photos = await (this.prisma.fireDoorPhoto as any).findMany({
      where: { tenantId, doorId },
      orderBy: { createdAt: 'desc' },
    });

    if (this.s3Service.configured) {
      return Promise.all(
        photos.map(async (photo: any) => {
          if (photo.url.startsWith('data:')) return photo;
          const s3Key = this.s3Service.extractKey(photo.url);
          if (!s3Key) return photo;
          try {
            const signedUrl = await this.s3Service.presign(s3Key);
            return { ...photo, url: signedUrl };
          } catch {
            return photo;
          }
        }),
      );
    }

    return photos;
  }

  async deletePhoto(tenantId: string, photoId: string) {
    const photo = await (this.prisma.fireDoorPhoto as any).findFirst({ where: { id: photoId, tenantId } });
    if (!photo) throw new NotFoundException('Photo not found');
    await (this.prisma.fireDoorPhoto as any).delete({ where: { id: photoId, tenantId } });
    return { success: true, message: 'Photo deleted successfully' };
  }

  private async compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      let image = sharp(buffer);
      const metadata = await image.metadata();

      if (metadata.width && metadata.width > 1920) {
        image = image.resize(1920, null, { fit: 'inside', withoutEnlargement: true });
      }

      if (mimeType === 'image/png') {
        return image.png({ quality: 80, compressionLevel: 9 }).toBuffer();
      }
      return image.jpeg({ quality: 85, progressive: true }).toBuffer();
    } catch (error) {
      this.logger.error(`Image compression failed: ${error.message}`);
      return buffer;
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async assertDoorOwner(tenantId: string, doorId: string) {
    const door = await (this.prisma.fireDoor as any).findUnique({ where: { id: doorId } });
    if (!door || door.tenantId !== tenantId) throw new NotFoundException('Door not found');
    return door;
  }
}
