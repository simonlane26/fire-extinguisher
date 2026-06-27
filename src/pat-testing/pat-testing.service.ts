import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PATTestingService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Appliances ───────────────────────────────────────────────────────────

  async getAppliances(tenantId: string, siteId?: string) {
    return this.prisma.pATAppliance.findMany({
      where: { tenantId, ...(siteId ? { siteId } : {}) },
      include: {
        site: { select: { id: true, name: true } },
        _count: { select: { tests: true } },
        tests: { orderBy: { testedAt: 'desc' }, take: 1, select: { id: true, outcome: true, testedAt: true } },
      },
      orderBy: [{ siteId: 'asc' }, { applianceRef: 'asc' }],
    });
  }

  async createAppliance(tenantId: string, dto: {
    siteId: string; applianceRef: string; description: string;
    location: string; applianceClass?: string; notes?: string;
  }) {
    return this.prisma.pATAppliance.create({
      data: { tenantId, ...dto },
      include: { site: { select: { id: true, name: true } } },
    });
  }

  async updateAppliance(tenantId: string, id: string, dto: Partial<{
    applianceRef: string; description: string; location: string;
    applianceClass: string; notes: string;
  }>) {
    await this.assertApplianceOwner(tenantId, id);
    return this.prisma.pATAppliance.update({ where: { id, tenantId }, data: dto });
  }

  async deleteAppliance(tenantId: string, id: string) {
    await this.assertApplianceOwner(tenantId, id);
    return this.prisma.pATAppliance.delete({ where: { id, tenantId } });
  }

  // ─── Tests ─────────────────────────────────────────────────────────────────

  async getTests(tenantId: string, applianceId: string) {
    await this.assertApplianceOwner(tenantId, applianceId);
    return this.prisma.pATTest.findMany({
      where: { applianceId, tenantId },
      orderBy: { testedAt: 'desc' },
      take: 100,
    });
  }

  async createTest(tenantId: string, applianceId: string, dto: {
    testedBy: string; testedAt: string; visualInspect: string;
    earthOhms?: number; insulationMohms?: number; functionalCheck: string;
    outcome: string; nextTestDate?: string; comments?: string; reportRef?: string;
  }) {
    await this.assertApplianceOwner(tenantId, applianceId);

    const test = await this.prisma.pATTest.create({
      data: {
        tenantId,
        applianceId,
        testedBy: dto.testedBy,
        testedAt: new Date(dto.testedAt),
        visualInspect: dto.visualInspect,
        earthOhms: dto.earthOhms ?? null,
        insulationMohms: dto.insulationMohms ?? null,
        functionalCheck: dto.functionalCheck,
        outcome: dto.outcome,
        nextTestDate: dto.nextTestDate ? new Date(dto.nextTestDate) : null,
        comments: dto.comments,
        reportRef: dto.reportRef,
      },
    });

    // Update the appliance's lastTestedAt and nextTestDue
    // On fail with no explicit nextTestDate, set nextTestDue to testedAt so it shows as immediately overdue
    let nextTestDue: Date | null = dto.nextTestDate ? new Date(dto.nextTestDate) : null;
    if (!nextTestDue && dto.outcome === 'fail') nextTestDue = new Date(dto.testedAt);
    await this.prisma.pATAppliance.update({
      where: { id: applianceId, tenantId },
      data: { lastTestedAt: new Date(dto.testedAt), nextTestDue },
    });

    return test;
  }

  async deleteTest(tenantId: string, id: string) {
    const test = await this.prisma.pATTest.findUnique({ where: { id } });
    if (!test || test.tenantId !== tenantId) throw new NotFoundException('Test record not found');
    return this.prisma.pATTest.delete({ where: { id, tenantId } });
  }

  // ─── CSV Import ───────────────────────────────────────────────────────────

  async importFromCsv(tenantId: string, csvContent: string): Promise<{ success: boolean; imported: number; errors: number; details?: any[] }> {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV file is empty or has no data rows');

    // Get tenant sites for matching
    const sites = await this.prisma.site.findMany({ where: { tenantId } });

    const dataLines = lines.slice(1);
    const imported = [];
    const errors = [];

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i].trim();
        if (!line) continue;

        const fields = this.parseCSVLine(line);
        const [applianceRef, description, location, applianceClass, notes, nextTestDue, siteName] = fields;

        if (!applianceRef || !description || !location) {
          errors.push({ line: i + 2, error: 'Missing required fields: applianceRef, description, location' });
          continue;
        }

        // Match site by name (case-insensitive) or use only site if one exists
        let siteId: string | null = null;
        if (siteName?.trim()) {
          const matched = sites.find(s => s.name.toLowerCase() === siteName.trim().toLowerCase());
          if (!matched) {
            errors.push({ line: i + 2, error: `Site "${siteName.trim()}" not found` });
            continue;
          }
          siteId = matched.id;
        } else if (sites.length === 1) {
          siteId = sites[0].id;
        } else if (sites.length > 1) {
          errors.push({ line: i + 2, error: 'Site name required when multiple sites exist' });
          continue;
        }

        if (!siteId) {
          errors.push({ line: i + 2, error: 'No site found — create a site first' });
          continue;
        }

        const appliance = await this.prisma.pATAppliance.create({
          data: {
            tenantId,
            siteId,
            applianceRef: applianceRef.trim(),
            description: description.trim(),
            location: location.trim(),
            applianceClass: applianceClass?.trim() || 'I',
            notes: notes?.trim() || null,
            nextTestDue: nextTestDue?.trim() ? new Date(nextTestDue.trim()) : null,
          },
        });
        imported.push(appliance);
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
      } else if (char === ',' && !inQuotes) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current);
    return fields;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async assertApplianceOwner(tenantId: string, applianceId: string) {
    const appliance = await this.prisma.pATAppliance.findUnique({ where: { id: applianceId } });
    if (!appliance || appliance.tenantId !== tenantId) throw new NotFoundException('Appliance not found');
  }
}
