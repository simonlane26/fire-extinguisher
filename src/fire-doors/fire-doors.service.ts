import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const COMMUNAL_DOOR_TYPES = ['communal_stairway', 'communal_corridor', 'communal_lobby'];

function frequencyForDoorType(doorType: string): number {
  return COMMUNAL_DOOR_TYPES.includes(doorType) ? 3 : 12;
}

@Injectable()
export class FireDoorsService {
  constructor(private readonly prisma: PrismaService) {}

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

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async assertDoorOwner(tenantId: string, doorId: string) {
    const door = await (this.prisma.fireDoor as any).findUnique({ where: { id: doorId } });
    if (!door || door.tenantId !== tenantId) throw new NotFoundException('Door not found');
    return door;
  }
}
