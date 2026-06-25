import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmergencyLightingService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Luminaires ──────────────────────────────────────────────────────────────

  async getLuminaires(tenantId: string, siteId?: string) {
    return (this.prisma.emergencyLuminaire as any).findMany({
      where: { tenantId, ...(siteId ? { siteId } : {}) },
      include: {
        site: { select: { id: true, name: true } },
        _count: { select: { tests: true } },
        tests: { orderBy: { testedAt: 'desc' }, take: 1, select: { id: true, testType: true, outcome: true, testedAt: true } },
      },
      orderBy: [{ siteId: 'asc' }, { luminaireRef: 'asc' }],
    });
  }

  async createLuminaire(
    tenantId: string,
    dto: {
      siteId: string;
      luminaireRef: string;
      description: string;
      location: string;
      luminaireType: string;
      fittingType?: string;
      zone?: string;
      notes?: string;
    },
  ) {
    return (this.prisma.emergencyLuminaire as any).create({
      data: { tenantId, ...dto },
      include: { site: { select: { id: true, name: true } } },
    });
  }

  async updateLuminaire(
    tenantId: string,
    id: string,
    dto: Partial<{
      luminaireRef: string;
      description: string;
      location: string;
      luminaireType: string;
      fittingType: string;
      zone: string;
      notes: string;
    }>,
  ) {
    await this.assertLuminaireOwner(tenantId, id);
    return (this.prisma.emergencyLuminaire as any).update({ where: { id }, data: dto });
  }

  async deleteLuminaire(tenantId: string, id: string) {
    await this.assertLuminaireOwner(tenantId, id);
    return (this.prisma.emergencyLuminaire as any).delete({ where: { id } });
  }

  // ─── Tests ───────────────────────────────────────────────────────────────────

  async getTests(tenantId: string, luminaireId: string) {
    await this.assertLuminaireOwner(tenantId, luminaireId);
    return (this.prisma.emergencyLightTest as any).findMany({
      where: { luminaireId },
      orderBy: { testedAt: 'desc' },
      take: 200,
    });
  }

  async createTest(
    tenantId: string,
    luminaireId: string,
    dto: {
      testType: string;
      testedBy: string;
      testedAt: string;
      durationSecs?: number;
      durationMins?: number;
      luxReading?: number;
      outcome: string;
      defectsFound?: string;
      remedialAction?: string;
      nextTestDate?: string;
      comments?: string;
      reportRef?: string;
    },
  ) {
    await this.assertLuminaireOwner(tenantId, luminaireId);

    const testedAt = new Date(dto.testedAt);

    // Calculate next due date based on test type (use provided nextTestDate if available)
    // On a fail, set next due to the test date itself so it shows as immediately overdue
    let nextTestDate: Date | null = dto.nextTestDate ? new Date(dto.nextTestDate) : null;
    if (!nextTestDate) {
      if (dto.outcome === 'fail') {
        nextTestDate = new Date(testedAt);
      } else {
        const d = new Date(testedAt);
        switch (dto.testType) {
          case 'daily':        d.setDate(d.getDate() + 1);    break;
          case 'monthly':      d.setDate(d.getDate() + 30);   break;
          case 'annual':       d.setFullYear(d.getFullYear() + 1); break;
          case 'three_yearly': d.setDate(d.getDate() + 1095); break;
        }
        nextTestDate = d;
      }
    }

    const test = await (this.prisma.emergencyLightTest as any).create({
      data: {
        tenantId,
        luminaireId,
        testType: dto.testType,
        testedBy: dto.testedBy,
        testedAt,
        durationSecs: dto.durationSecs ?? null,
        durationMins: dto.durationMins ?? null,
        luxReading: dto.luxReading ?? null,
        outcome: dto.outcome,
        defectsFound: dto.defectsFound ?? null,
        remedialAction: dto.remedialAction ?? null,
        nextTestDate,
        comments: dto.comments ?? null,
        reportRef: dto.reportRef ?? null,
      },
    });

    // Update luminaire — set lastTestedAt and the corresponding next*Due field
    const nextDueField: Record<string, string> = {
      daily: 'nextDailyDue',
      monthly: 'nextMonthlyDue',
      annual: 'nextAnnualDue',
      three_yearly: 'nextThreeYearlyDue',
    };
    const field = nextDueField[dto.testType];
    if (field) {
      await (this.prisma.emergencyLuminaire as any).update({
        where: { id: luminaireId },
        data: { lastTestedAt: testedAt, [field]: nextTestDate },
      });
    }

    return test;
  }

  async deleteTest(tenantId: string, id: string) {
    const test = await (this.prisma.emergencyLightTest as any).findUnique({ where: { id } });
    if (!test || test.tenantId !== tenantId) throw new NotFoundException('Test record not found');
    return (this.prisma.emergencyLightTest as any).delete({ where: { id } });
  }

  // ─── CSV Import ───────────────────────────────────────────────────────────

  async importFromCsv(tenantId: string, csvContent: string): Promise<{ success: boolean; imported: number; errors: number; details?: any[] }> {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV file is empty or has no data rows');

    const sites = await this.prisma.site.findMany({ where: { tenantId } });
    const dataLines = lines.slice(1);
    const imported = [];
    const errors = [];

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i].trim();
        if (!line) continue;

        const fields = this.parseCSVLine(line);
        const [luminaireRef, description, location, luminaireType, fittingType, zone, notes, nextMonthlyDue, nextAnnualDue, nextThreeYearlyDue, siteName] = fields;

        if (!luminaireRef || !description || !location || !luminaireType) {
          errors.push({ line: i + 2, error: 'Missing required fields: luminaireRef, description, location, luminaireType' });
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

        const validTypes = ['escape_route', 'open_area', 'high_risk', 'stairwell'];
        const typeNorm = luminaireType.trim().toLowerCase().replace(' ', '_');
        if (!validTypes.includes(typeNorm)) {
          errors.push({ line: i + 2, error: `Invalid luminaireType "${luminaireType}". Must be: escape_route, open_area, high_risk, stairwell` }); continue;
        }

        const luminaire = await (this.prisma.emergencyLuminaire as any).create({
          data: {
            tenantId,
            siteId,
            luminaireRef: luminaireRef.trim(),
            description: description.trim(),
            location: location.trim(),
            luminaireType: typeNorm,
            fittingType: fittingType?.trim() || 'self_contained',
            zone: zone?.trim() || null,
            notes: notes?.trim() || null,
            nextMonthlyDue: nextMonthlyDue?.trim() ? new Date(nextMonthlyDue.trim()) : null,
            nextAnnualDue: nextAnnualDue?.trim() ? new Date(nextAnnualDue.trim()) : null,
            nextThreeYearlyDue: nextThreeYearlyDue?.trim() ? new Date(nextThreeYearlyDue.trim()) : null,
          },
        });
        imported.push(luminaire);
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

  private async assertLuminaireOwner(tenantId: string, luminaireId: string) {
    const luminaire = await (this.prisma.emergencyLuminaire as any).findUnique({ where: { id: luminaireId } });
    if (!luminaire || luminaire.tenantId !== tenantId) throw new NotFoundException('Luminaire not found');
  }
}
