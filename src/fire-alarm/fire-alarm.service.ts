import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class FireAlarmService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Systems ──────────────────────────────────────────────────────────────

  async getSystems(tenantId: string, siteId?: string) {
    return this.prisma.fireAlarmSystem.findMany({
      where: { tenantId, ...(siteId ? { siteId } : {}) },
      include: {
        site: { select: { id: true, name: true } },
        _count: { select: { callPoints: true, logEntries: true } },
      },
      orderBy: [{ siteId: 'asc' }, { systemRef: 'asc' }],
    });
  }

  async createSystem(tenantId: string, dto: {
    siteId: string; systemRef: string; name?: string;
    panelMake?: string; panelModel?: string; panelSerial?: string;
    arcCompany?: string; arcNumber?: string; installDate?: string; notes?: string;
  }) {
    return this.prisma.fireAlarmSystem.create({
      data: {
        tenantId,
        siteId: dto.siteId,
        systemRef: dto.systemRef,
        name: dto.name,
        panelMake: dto.panelMake,
        panelModel: dto.panelModel,
        panelSerial: dto.panelSerial,
        arcCompany: dto.arcCompany,
        arcNumber: dto.arcNumber,
        installDate: dto.installDate ? new Date(dto.installDate) : undefined,
        notes: dto.notes,
      },
      include: { site: { select: { id: true, name: true } } },
    });
  }

  async updateSystem(tenantId: string, id: string, dto: Partial<{
    systemRef: string; name: string; panelMake: string; panelModel: string;
    panelSerial: string; arcCompany: string; arcNumber: string;
    installDate: string; notes: string;
  }>) {
    await this.assertSystemOwner(tenantId, id);
    return this.prisma.fireAlarmSystem.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.installDate ? { installDate: new Date(dto.installDate) } : {}),
      },
    });
  }

  async deleteSystem(tenantId: string, id: string) {
    await this.assertSystemOwner(tenantId, id);
    return this.prisma.fireAlarmSystem.delete({ where: { id } });
  }

  // ─── Call Points ──────────────────────────────────────────────────────────

  async getCallPoints(tenantId: string, systemId: string) {
    await this.assertSystemOwner(tenantId, systemId);
    return this.prisma.fireAlarmCallPoint.findMany({
      where: { systemId },
      orderBy: [{ zone: 'asc' }, { pointRef: 'asc' }],
    });
  }

  async addCallPoint(tenantId: string, systemId: string, dto: {
    pointRef: string; location?: string; floor?: string; zone?: string;
  }) {
    await this.assertSystemOwner(tenantId, systemId);
    return this.prisma.fireAlarmCallPoint.create({
      data: { tenantId, systemId, ...dto },
    });
  }

  async importCallPoints(tenantId: string, systemId: string, rows: {
    pointRef: string; location?: string; floor?: string; zone?: string;
  }[]) {
    await this.assertSystemOwner(tenantId, systemId);
    const data = rows.map(r => ({ tenantId, systemId, ...r }));
    return this.prisma.fireAlarmCallPoint.createMany({ data, skipDuplicates: true });
  }

  async deleteCallPoint(tenantId: string, id: string) {
    const cp = await this.prisma.fireAlarmCallPoint.findUnique({ where: { id } });
    if (!cp || cp.tenantId !== tenantId) throw new NotFoundException('Call point not found');
    return this.prisma.fireAlarmCallPoint.delete({ where: { id } });
  }

  /** Returns call points sorted by lastTestedAt ASC (never tested first) */
  async getNextDueCallPoint(tenantId: string, systemId: string) {
    await this.assertSystemOwner(tenantId, systemId);
    return this.prisma.fireAlarmCallPoint.findFirst({
      where: { systemId },
      orderBy: [{ lastTestedAt: { sort: 'asc', nulls: 'first' } }, { pointRef: 'asc' }],
    });
  }

  // ─── Log Entries ──────────────────────────────────────────────────────────

  async getLogEntries(tenantId: string, systemId: string, entryType?: string) {
    await this.assertSystemOwner(tenantId, systemId);
    return this.prisma.fireAlarmLogEntry.findMany({
      where: { systemId, ...(entryType ? { entryType } : {}) },
      orderBy: { conductedAt: 'desc' },
      take: 200,
    });
  }

  async createLogEntry(tenantId: string, systemId: string, dto: {
    entryType: string; conductedBy: string; conductedAt: string;
    outcome: string; notes?: string; data?: Record<string, unknown>;
    callPointId?: string; // For weekly tests — updates lastTestedAt
  }) {
    await this.assertSystemOwner(tenantId, systemId);

    const entry = await this.prisma.fireAlarmLogEntry.create({
      data: {
        tenantId,
        systemId,
        entryType: dto.entryType,
        conductedBy: dto.conductedBy,
        conductedAt: new Date(dto.conductedAt),
        outcome: dto.outcome,
        notes: dto.notes,
        data: dto.data as any,
      },
    });

    // For weekly tests, update the call point's lastTestedAt
    if (dto.entryType === 'weekly' && dto.callPointId) {
      await this.prisma.fireAlarmCallPoint.update({
        where: { id: dto.callPointId },
        data: { lastTestedAt: new Date(dto.conductedAt) },
      });
    }

    // Update the system's nextXxxDue field based on entry type
    const conducted = new Date(dto.conductedAt);
    const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86_400_000);
    const nextDueUpdate: Record<string, Date | undefined> = {
      weekly:       addDays(conducted, 7),
      monthly:      addDays(conducted, 30),
      quarterly:    addDays(conducted, 91),
      six_monthly:  addDays(conducted, 182),
      annual:       addDays(conducted, 365),
    };
    const nextDueField: Record<string, string> = {
      weekly:      'nextWeeklyDue',
      monthly:     'nextMonthlyDue',
      quarterly:   'nextQuarterlyDue',
      six_monthly: 'nextSixMonthlyDue',
      annual:      'nextAnnualDue',
    };
    if (nextDueField[dto.entryType]) {
      await this.prisma.fireAlarmSystem.update({
        where: { id: systemId },
        data: { [nextDueField[dto.entryType]]: nextDueUpdate[dto.entryType] },
      });
    }

    return entry;
  }

  async deleteLogEntry(tenantId: string, id: string) {
    const entry = await this.prisma.fireAlarmLogEntry.findUnique({ where: { id } });
    if (!entry || entry.tenantId !== tenantId) throw new NotFoundException('Log entry not found');
    return this.prisma.fireAlarmLogEntry.delete({ where: { id } });
  }

  // ─── PDF Certificate ──────────────────────────────────────────────────────

  async generateCertificate(tenantId: string, entryId: string): Promise<Buffer> {
    const entry = await this.prisma.fireAlarmLogEntry.findUnique({
      where: { id: entryId },
      include: {
        system: { include: { site: true } },
        tenant: true,
      },
    });

    if (!entry || entry.tenantId !== tenantId) {
      throw new NotFoundException('Log entry not found');
    }

    const validCertTypes = ['six_monthly', 'annual', 'quarterly'];
    if (!validCertTypes.includes(entry.entryType)) {
      throw new ForbiddenException('Certificates only available for quarterly, six-monthly and annual inspections');
    }

    const html = this.buildCertificateHtml(entry);
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  private buildCertificateHtml(entry: any): string {
    const data = (entry.data as Record<string, unknown>) || {};
    const typeLabels: Record<string, string> = {
      quarterly: 'Quarterly Inspection & Servicing Certificate',
      six_monthly: 'Periodic Inspection & Servicing Certificate (6-Monthly)',
      annual: 'Annual Inspection & Servicing Certificate',
    };
    const title = typeLabels[entry.entryType] || 'Fire Alarm Inspection Certificate';
    const certNo = (data.certificateNumber as string) || `FA-${entry.id.slice(-6).toUpperCase()}`;
    const outcome = entry.outcome === 'pass' ? '#16a34a' : entry.outcome === 'advisory' ? '#d97706' : '#dc2626';
    const outcomeLabel = entry.outcome.toUpperCase();

    const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const dataRows = Object.entries(data)
      .filter(([k]) => k !== 'certificateNumber')
      .map(([k, v]) => {
        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).replace(/_/g, ' ');
        const val = typeof v === 'boolean' ? (v ? '✓ Yes' : '✗ No') : esc(v);
        return `<tr><td style="padding:4px 8px;border:1px solid #e5e7eb;font-weight:500;">${esc(label)}</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${val}</td></tr>`;
      }).join('');

    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:Arial,sans-serif;font-size:12px;color:#111;}
h1{font-size:18px;}h2{font-size:14px;border-bottom:2px solid #111;padding-bottom:4px;}
table{border-collapse:collapse;width:100%;}
.header{background:#1e3a5f;color:#fff;padding:16px 20px;margin-bottom:20px;}
.badge{display:inline-block;padding:4px 12px;border-radius:4px;font-weight:bold;font-size:13px;color:#fff;background:${outcome};}
</style></head><body>
<div class="header">
  <div style="font-size:20px;font-weight:bold;">${esc(entry.tenant?.companyName || 'Fire Safety')}</div>
  <div>${title}</div>
</div>
<table style="margin-bottom:16px;">
  <tr><td style="padding:4px 8px;width:50%;font-weight:bold;">Certificate Number</td><td style="padding:4px 8px;">${esc(certNo)}</td></tr>
  <tr><td style="padding:4px 8px;font-weight:bold;">Site</td><td style="padding:4px 8px;">${esc(entry.system?.site?.name)}</td></tr>
  <tr><td style="padding:4px 8px;font-weight:bold;">Fire Alarm System</td><td style="padding:4px 8px;">${esc(entry.system?.systemRef)}${entry.system?.name ? ' – ' + esc(entry.system.name) : ''}</td></tr>
  <tr><td style="padding:4px 8px;font-weight:bold;">Panel Make / Model</td><td style="padding:4px 8px;">${esc(entry.system?.panelMake)} ${esc(entry.system?.panelModel)}</td></tr>
  <tr><td style="padding:4px 8px;font-weight:bold;">Date of Inspection</td><td style="padding:4px 8px;">${new Date(entry.conductedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
  <tr><td style="padding:4px 8px;font-weight:bold;">Conducted By</td><td style="padding:4px 8px;">${esc(entry.conductedBy)}</td></tr>
  <tr><td style="padding:4px 8px;font-weight:bold;">Outcome</td><td style="padding:4px 8px;"><span class="badge">${outcomeLabel}</span></td></tr>
</table>
${dataRows ? `<h2>Inspection Details</h2><table>${dataRows}</table>` : ''}
${entry.notes ? `<h2>Notes</h2><p style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb;">${esc(entry.notes)}</p>` : ''}
<div style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:12px;font-size:10px;color:#6b7280;">
  This certificate has been issued in accordance with BS 5839-1:2025. Generated ${new Date().toLocaleDateString('en-GB')}.
</div>
</body></html>`;
  }

  // ─── CSV Import ───────────────────────────────────────────────────────────

  async importSystemsFromCsv(tenantId: string, csvContent: string): Promise<{ success: boolean; imported: number; errors: number; details?: any[] }> {
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
        const [systemRef, name, panelMake, panelModel, panelSerial, arcCompany, arcNumber, installDate, notes, siteName] = fields;

        if (!systemRef) {
          errors.push({ line: i + 2, error: 'Missing required field: systemRef' }); continue;
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

        const system = await this.prisma.fireAlarmSystem.create({
          data: {
            tenantId,
            siteId,
            systemRef: systemRef.trim(),
            name: name?.trim() || null,
            panelMake: panelMake?.trim() || null,
            panelModel: panelModel?.trim() || null,
            panelSerial: panelSerial?.trim() || null,
            arcCompany: arcCompany?.trim() || null,
            arcNumber: arcNumber?.trim() || null,
            installDate: installDate?.trim() ? new Date(installDate.trim()) : null,
            notes: notes?.trim() || null,
          },
        });
        imported.push(system);
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

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async assertSystemOwner(tenantId: string, systemId: string) {
    const system = await this.prisma.fireAlarmSystem.findUnique({ where: { id: systemId } });
    if (!system || system.tenantId !== tenantId) throw new NotFoundException('Fire alarm system not found');
  }
}
