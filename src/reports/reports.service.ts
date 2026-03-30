// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { S3Service } from '../storage/s3.service';

/** Escape user-controlled strings before inserting into HTML to prevent XSS */
function escapeHtml(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

@Injectable()
export class ReportsService {
  private readonly reportsDir = path.join(process.cwd(), 'uploads', 'reports');

  constructor(private readonly s3: S3Service) {
    // Ensure reports directory exists (used as fallback when S3 is not configured)
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /** Upload PDF to S3; falls back to local filesystem if S3 is not configured */
  private async saveReport(pdfBuffer: Buffer, s3Key: string): Promise<string> {
    try {
      return await this.s3.uploadBuffer(s3Key, pdfBuffer, 'application/pdf');
    } catch {
      // Fall back to local filesystem (development or if S3 not configured)
      const filename = path.basename(s3Key);
      const filepath = path.join(this.reportsDir, filename);
      fs.writeFileSync(filepath, pdfBuffer);
      return `/uploads/reports/${filename}`;
    }
  }

  async buildReport(params: {
    tenant: { name: string, logoUrl?: string | null };
    visitDate: string;
    technician?: string;
    jobs: Array<{ id: string; structured: any }>;
    photos: Array<{ url: string; findings?: any }>;
  }) {
    console.log('Building report with params:', {
      tenant: params.tenant,
      visitDate: params.visitDate,
      technician: params.technician,
      jobsCount: params.jobs.length,
      jobs: params.jobs,
      photosCount: params.photos.length,
    });

    const html = this.template(params);
    console.log('Generated HTML length:', html.length);

    let browser: Browser | undefined;
    try {
      // Determine which Chrome executable to use
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
      console.log('Attempting to launch browser with executable:', executablePath);
      console.log('PUPPETEER_EXECUTABLE_PATH env var:', process.env.PUPPETEER_EXECUTABLE_PATH);

      // Production-ready Puppeteer configuration
      browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Wait for all images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
              setTimeout(resolve, 5000);
            }))
        );
      });

      const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4', printBackground: true }));
      return await this.saveReport(pdfBuffer, `reports/service-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error(`Failed to generate PDF report: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private template({ tenant, visitDate, technician, jobs, photos }: any) {
    // keep it simple; style with inline CSS or Tailwind via CDN if you prefer
    const jobRows = jobs.map((j, index) => {
      console.log(`Job ${index}:`, JSON.stringify(j, null, 2));
      const structured = j.structured || {};
      const defects = Array.isArray(structured.defects) ? structured.defects : [];
      const actions = Array.isArray(structured.actions) ? structured.actions : [];

      // Handle date formatting
      const formatDate = (date: any) => {
        if (!date) return 'N/A';
        if (date instanceof Date) return date.toISOString().split('T')[0];
        if (typeof date === 'string') return date.split('T')[0];
        return 'N/A';
      };

      // Calculate service dates from last inspection
      const calculateServiceDates = (lastInspectionDate: any, extinguisherType: string) => {
        if (!lastInspectionDate) {
          return { annual: 'N/A', extended: 'N/A' };
        }

        let lastDate: Date;
        if (lastInspectionDate instanceof Date) {
          lastDate = new Date(lastInspectionDate);
        } else if (typeof lastInspectionDate === 'string') {
          lastDate = new Date(lastInspectionDate);
        } else {
          return { annual: 'N/A', extended: 'N/A' };
        }

        // Annual service: 1 year from last inspection
        const annualDate = new Date(lastDate);
        annualDate.setFullYear(annualDate.getFullYear() + 1);

        // Extended service: 5 years (or 10 for CO2)
        const isCO2 = extinguisherType?.toLowerCase().includes('co2') ||
                      extinguisherType?.toLowerCase().includes('carbon dioxide');
        const extendedYears = isCO2 ? 10 : 5;
        const extendedDate = new Date(lastDate);
        extendedDate.setFullYear(extendedDate.getFullYear() + extendedYears);

        return {
          annual: formatDate(annualDate),
          extended: formatDate(extendedDate)
        };
      };

      const location = j.location || 'Unknown';
      const building = j.building || '';
      const serviceType = j.type || structured.type || j.serviceType || 'Inspection';
      const findings = defects.join(', ') || structured.findings || j.notes || 'Good condition';
      const recommendations = actions.join(', ') || structured.recommendations || 'N/A';

      // Get last inspection date from job data
      const lastInspection = j.lastInspection || structured.lastInspection || j.completedDate;
      const serviceDates = calculateServiceDates(lastInspection, serviceType);

      return `
      <tr>
        <td>${escapeHtml(location)} ${building ? '(' + escapeHtml(building) + ')' : ''}</td>
        <td>${escapeHtml(serviceType)}</td>
        <td>${escapeHtml(findings)}</td>
        <td>${escapeHtml(recommendations)}</td>
        <td>${serviceDates.annual}</td>
        <td>${serviceDates.extended}</td>
      </tr>`;
    }).join('');

    const photoCards = photos.map(p => `
      <div style="margin:8px; display:inline-block">
        <img src="${escapeHtml(p.url)}" style="width:180px; height:auto; border:1px solid #ddd"/>
        <div style="font-size:12px">${p.findings ? escapeHtml(JSON.stringify(p.findings)) : ''}</div>
      </div>
    `).join('');

    return `
      <html>
      <body style="font-family: Arial, sans-serif; padding:24px">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
          <div>
            <h1 style="margin:0">${escapeHtml(tenant.name)} – Service Report</h1>
            <p style="margin:4px 0 0 0; font-size:12px; color:#7c3aed">Powered by Firexcheck.com</p>
          </div>
          ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height:48px"/>` : ''}
        </div>
        <p><strong>Date:</strong> ${escapeHtml(visitDate)} &nbsp; <strong>Technician:</strong> ${escapeHtml(technician ?? '')}</p>

        <h2>Summary</h2>
        <table border="1" cellspacing="0" cellpadding="6" width="100%" style="border-collapse:collapse">
          <thead><tr><th>Location</th><th>Service Type</th><th>Findings</th><th>Actions/Recommendations</th><th>Next Annual Service</th><th>Next Extended Service</th></tr></thead>
          <tbody>${jobRows}</tbody>
        </table>

        <h2 style="margin-top:24px">Photos</h2>
        ${photoCards}

        <p style="margin-top:32px; font-size:12px; color:#777">
          Generated automatically – includes AI assistance for findings & recommendations.
        </p>
      </body>
      </html>
    `;
  }

  // Generate comprehensive extinguisher history PDF - returns raw buffer for direct streaming
  async buildExtinguisherHistoryReport(params: {
    tenant: { name: string; logoUrl?: string };
    extinguisher: any;
    inspections: any[];
    photos: any[];
    partsUsage: any[];
  }): Promise<Buffer> {
    const { tenant, extinguisher, inspections, photos, partsUsage } = params;

    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid #7c3aed; padding-bottom: 16px; }
          .section { margin: 24px 0; }
          .info-grid { display: grid; grid-template-columns: 200px 1fr; gap: 8px; margin: 16px 0; }
          .info-label { font-weight: bold; color: #555; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th { background: #7c3aed; color: white; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0; }
          .photo { text-align: center; }
          .photo img { width: 100%; border: 1px solid #ddd; border-radius: 4px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .badge-active { background: #10b981; color: white; }
          .badge-inactive { background: #ef4444; color: white; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin: 0;">${escapeHtml(tenant.name)}</h1>
            <h2 style="margin: 8px 0; color: #7c3aed;">Fire Extinguisher Lifecycle Report</h2>
            <p style="margin: 0; color: #666; font-size: 12px;">Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height: 60px;"/>` : ''}
        </div>

        <div class="section">
          <h3>Extinguisher Details</h3>
          <div class="info-grid">
            <div class="info-label">Serial Number:</div>
            <div>${extinguisher.serialNumber || 'N/A'}</div>
            <div class="info-label">Type:</div>
            <div>${extinguisher.type}</div>
            <div class="info-label">Capacity:</div>
            <div>${extinguisher.capacity || 'N/A'}</div>
            <div class="info-label">Manufacturer:</div>
            <div>${extinguisher.manufacturer || 'N/A'}</div>
            <div class="info-label">Model:</div>
            <div>${extinguisher.model || 'N/A'}</div>
            <div class="info-label">Location:</div>
            <div>${extinguisher.building} - ${extinguisher.location}${extinguisher.floor ? ', Floor ' + extinguisher.floor : ''}</div>
            <div class="info-label">Install Date:</div>
            <div>${extinguisher.installDate ? new Date(extinguisher.installDate).toLocaleDateString() : 'N/A'}</div>
            <div class="info-label">Expiry Date:</div>
            <div>${extinguisher.expiryDate ? new Date(extinguisher.expiryDate).toLocaleDateString() : 'N/A'}</div>
            <div class="info-label">Status:</div>
            <div><span class="badge ${extinguisher.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${extinguisher.status}</span></div>
            <div class="info-label">Condition:</div>
            <div>${extinguisher.condition}</div>
          </div>
        </div>

        <div class="section">
          <h3>Inspection History (${inspections.length} records)</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Service Type</th>
                <th>Technician</th>
                <th>Condition</th>
                <th>Parts Replaced</th>
                <th>Next Service</th>
              </tr>
            </thead>
            <tbody>
              ${inspections.map(i => `
                <tr>
                  <td>${new Date(i.serviceDate).toLocaleDateString()}</td>
                  <td>${i.serviceType}</td>
                  <td>${i.technician || 'N/A'}</td>
                  <td>${i.condition}</td>
                  <td>${i.partsReplaced || 'None'}</td>
                  <td>${i.nextServiceDate ? new Date(i.nextServiceDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${partsUsage.length > 0 ? `
          <div class="section">
            <h3>Parts Replacement History (${partsUsage.length} records)</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Part Number</th>
                  <th>Part Name</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                ${partsUsage.map(p => `
                  <tr>
                    <td>${new Date(p.usedAt).toLocaleDateString()}</td>
                    <td>${escapeHtml(p.inventoryItem.partNumber)}</td>
                    <td>${escapeHtml(p.inventoryItem.partName)}</td>
                    <td>${p.quantity}</td>
                    <td>${escapeHtml(p.reason || 'Routine maintenance')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${photos.length > 0 ? `
          <div class="section">
            <h3>Photo History (${photos.length} photos)</h3>
            <div class="photo-grid">
              ${photos.slice(0, 9).map(p => `
                <div class="photo">
                  <img src="${escapeHtml(p.url)}" />
                  <p style="font-size: 12px; margin: 4px 0;">${new Date(p.createdAt).toLocaleDateString()}</p>
                  ${p.caption ? `<p style="font-size: 11px; color: #666;">${escapeHtml(p.caption)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
          <p>Generated with Firexcheck.com - Professional Fire Safety Management</p>
          <p>Report ID: ${extinguisher.id} | Generated: ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;

    let browser: Browser | undefined;
    try {
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Wait for all images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
              setTimeout(resolve, 5000);
            }))
        );
      });

      return Buffer.from(await page.pdf({ format: 'A4', printBackground: true }));
    } finally {
      if (browser) await browser.close();
    }
  }

  // Generate compliance certificate PDF - returns raw buffer for direct streaming
  async buildComplianceCertificate(params: {
    tenant: { name: string; logoUrl?: string };
    extinguisher: any;
    inspection: any;
    photoUrl?: string;
  }): Promise<Buffer> {
    const { tenant, extinguisher, inspection, photoUrl } = params;

    console.log('Building certificate with tenant:', tenant);
    console.log('Logo URL:', tenant.logoUrl);
    console.log('Photo URL:', photoUrl);

    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 48px; }
          .certificate { border: 4px solid #7c3aed; padding: 40px; text-align: center; }
          .header { margin-bottom: 32px; }
          .title { font-size: 32px; font-weight: bold; color: #7c3aed; margin: 16px 0; }
          .subtitle { font-size: 18px; color: #555; margin: 8px 0; }
          .content { text-align: left; margin: 32px auto; max-width: 600px; }
          .info-row { display: flex; margin: 12px 0; }
          .info-label { font-weight: bold; width: 200px; color: #555; }
          .signature { margin-top: 64px; border-top: 2px solid #333; padding-top: 8px; width: 300px; display: inline-block; }
          .stamp { margin-top: 32px; padding: 16px; border: 2px solid #7c3aed; display: inline-block; border-radius: 50%; }
          .extinguisher-photo { max-width: 400px; max-height: 300px; border-radius: 8px; margin: 16px 0; object-fit: cover; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height: 80px; margin-bottom: 16px;"/>` : ''}
            <div class="title">INSPECTION CERTIFICATE</div>
            <div class="subtitle">${escapeHtml(tenant.name)}</div>
          </div>

          <p style="font-size: 16px; margin: 24px 0;">This certifies that the fire extinguisher described below has been inspected and tested in accordance with applicable regulations.</p>

          <div class="content">
            <div class="info-row">
              <div class="info-label">Serial Number:</div>
              <div>${escapeHtml(extinguisher.serialNumber || 'N/A')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Type:</div>
              <div>${escapeHtml(extinguisher.type)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Capacity:</div>
              <div>${escapeHtml(extinguisher.capacity || 'N/A')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Location:</div>
              <div>${escapeHtml(extinguisher.building)} - ${escapeHtml(extinguisher.location)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Inspection Date:</div>
              <div>${new Date(inspection.serviceDate).toLocaleDateString()}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Service Type:</div>
              <div>${escapeHtml(inspection.serviceType)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Technician:</div>
              <div>${escapeHtml(inspection.technician || 'Certified Technician')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Condition:</div>
              <div style="font-weight: bold; color: ${inspection.condition === 'Good' ? '#10b981' : '#ef4444'};">${escapeHtml(inspection.condition)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Next Service Due:</div>
              <div>${inspection.nextServiceDate ? new Date(inspection.nextServiceDate).toLocaleDateString() : 'N/A'}</div>
            </div>
            ${inspection.notes ? `
              <div class="info-row">
                <div class="info-label">Notes:</div>
                <div>${escapeHtml(inspection.notes)}</div>
              </div>
            ` : ''}
          </div>

          <div style="margin-top: 48px;">
            <div class="signature">
              <div style="font-weight: bold;">${escapeHtml(inspection.technician || 'Certified Technician')}</div>
              <div style="font-size: 12px; color: #666;">Authorized Inspector</div>
            </div>
          </div>

          <div class="stamp">
            <div style="font-size: 14px; font-weight: bold; color: #7c3aed;">INSPECTED</div>
            <div style="font-size: 12px;">${new Date(inspection.serviceDate).toLocaleDateString()}</div>
          </div>

          <div style="margin-top: 32px; font-size: 11px; color: #999;">
            Certificate ID: ${inspection.id} | Issued: ${new Date().toLocaleDateString()}
          </div>
        </div>
      </body>
      </html>
    `;

    let browser: Browser | undefined;
    try {
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

      const page = await browser.newPage();

      // Enable console logging from the page
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));
      page.on('pageerror', error => console.log('PAGE ERROR:', error));

      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Wait for all images (logo and photo) to load and log their status
      const imageLoadResults = await page.evaluate(() => {
        const images = Array.from(document.images);
        console.log('Total images found:', images.length);
        images.forEach((img, i) => {
          console.log(`Image ${i}: src=${img.src}, complete=${img.complete}, naturalWidth=${img.naturalWidth}`);
        });

        return Promise.all(
          images
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.addEventListener('load', () => {
                console.log('Image loaded:', img.src);
                resolve({ src: img.src, status: 'loaded' });
              });
              img.addEventListener('error', (e) => {
                console.log('Image failed:', img.src, e);
                resolve({ src: img.src, status: 'error' });
              });
              // Set timeout to avoid hanging forever
              setTimeout(() => {
                console.log('Image timeout:', img.src);
                resolve({ src: img.src, status: 'timeout' });
              }, 5000);
            }))
        );
      });

      console.log('Image load results:', imageLoadResults);

      return Buffer.from(await page.pdf({ format: 'A4', printBackground: true }));
    } finally {
      if (browser) await browser.close();
    }
  }

  // Generate Excel export of extinguisher history
  async buildExtinguisherHistoryExcel(params: {
    extinguisher: any;
    inspections: any[];
    partsUsage: any[];
  }): Promise<Buffer> {
    const { extinguisher, inspections, partsUsage } = params;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Firexcheck.com';
    workbook.created = new Date();

    // Sheet 1: Extinguisher Details
    const detailsSheet = workbook.addWorksheet('Extinguisher Details');
    detailsSheet.columns = [
      { header: 'Field', key: 'field', width: 25 },
      { header: 'Value', key: 'value', width: 40 },
    ];

    detailsSheet.addRows([
      { field: 'Serial Number', value: extinguisher.serialNumber || 'N/A' },
      { field: 'Type', value: extinguisher.type },
      { field: 'Capacity', value: extinguisher.capacity || 'N/A' },
      { field: 'Weight', value: extinguisher.weight || 'N/A' },
      { field: 'Manufacturer', value: extinguisher.manufacturer || 'N/A' },
      { field: 'Model', value: extinguisher.model || 'N/A' },
      { field: 'Location', value: `${extinguisher.building} - ${extinguisher.location}` },
      { field: 'Floor', value: extinguisher.floor || 'N/A' },
      { field: 'Install Date', value: extinguisher.installDate ? new Date(extinguisher.installDate).toLocaleDateString() : 'N/A' },
      { field: 'Expiry Date', value: extinguisher.expiryDate ? new Date(extinguisher.expiryDate).toLocaleDateString() : 'N/A' },
      { field: 'Status', value: extinguisher.status },
      { field: 'Condition', value: extinguisher.condition },
      { field: 'Last Inspection', value: extinguisher.lastInspection ? new Date(extinguisher.lastInspection).toLocaleDateString() : 'N/A' },
      { field: 'Next Inspection', value: extinguisher.nextInspection ? new Date(extinguisher.nextInspection).toLocaleDateString() : 'N/A' },
    ]);

    // Style header row
    detailsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    detailsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7c3aed' } };

    // Sheet 2: Inspection History
    const inspectionsSheet = workbook.addWorksheet('Inspection History');
    inspectionsSheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Service Type', key: 'serviceType', width: 20 },
      { header: 'Technician', key: 'technician', width: 20 },
      { header: 'Condition', key: 'condition', width: 15 },
      { header: 'Parts Replaced', key: 'partsReplaced', width: 30 },
      { header: 'Notes', key: 'notes', width: 40 },
      { header: 'Next Service', key: 'nextService', width: 15 },
    ];

    inspections.forEach(i => {
      inspectionsSheet.addRow({
        date: new Date(i.serviceDate).toLocaleDateString(),
        serviceType: i.serviceType,
        technician: i.technician || 'N/A',
        condition: i.condition,
        partsReplaced: i.partsReplaced || 'None',
        notes: i.notes || '',
        nextService: i.nextServiceDate ? new Date(i.nextServiceDate).toLocaleDateString() : 'N/A',
      });
    });

    inspectionsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    inspectionsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7c3aed' } };

    // Sheet 3: Parts Replacement History
    if (partsUsage.length > 0) {
      const partsSheet = workbook.addWorksheet('Parts Replaced');
      partsSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Part Number', key: 'partNumber', width: 15 },
        { header: 'Part Name', key: 'partName', width: 25 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Reason', key: 'reason', width: 30 },
      ];

      partsUsage.forEach(p => {
        partsSheet.addRow({
          date: new Date(p.usedAt).toLocaleDateString(),
          partNumber: p.inventoryItem.partNumber,
          partName: p.inventoryItem.partName,
          quantity: p.quantity,
          reason: p.reason || 'Routine maintenance',
        });
      });

      partsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      partsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7c3aed' } };
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // Generate User Management Report PDF
  async buildUserReport(params: {
    tenant: { name: string; logoUrl?: string };
    users: any[];
  }): Promise<Buffer> {
    const { tenant, users } = params;

    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid #7c3aed; padding-bottom: 16px; }
          h1 { margin: 0; color: #7c3aed; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
          .summary-card { background: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; }
          .summary-card .number { font-size: 32px; font-weight: bold; color: #7c3aed; }
          .summary-card .label { font-size: 14px; color: #666; margin-top: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 24px 0; }
          th { background: #7c3aed; color: white; padding: 12px; text-align: left; font-size: 14px; }
          td { border: 1px solid #ddd; padding: 10px; font-size: 13px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .badge-active { background: #10b981; color: white; }
          .badge-inactive { background: #ef4444; color: white; }
          .badge-admin { background: #7c3aed; color: white; }
          .badge-manager { background: #3b82f6; color: white; }
          .badge-technician { background: #f59e0b; color: white; }
          .badge-viewer { background: #6b7280; color: white; }
          .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>User Management Report</h1>
            <p style="margin: 8px 0 0 0; color: #666;">${escapeHtml(tenant.name)}</p>
            <p style="margin: 4px 0 0 0; color: #999; font-size: 12px;">Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height: 60px;"/>` : ''}
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="number">${users.length}</div>
            <div class="label">Total Users</div>
          </div>
          <div class="summary-card">
            <div class="number">${users.filter(u => u.status === 'active').length}</div>
            <div class="label">Active</div>
          </div>
          <div class="summary-card">
            <div class="number">${users.reduce((sum, u) => sum + (u.activity?.totalInspections || 0), 0)}</div>
            <div class="label">Total Inspections</div>
          </div>
          <div class="summary-card">
            <div class="number">${users.reduce((sum, u) => sum + (u.activity?.totalRepairs || 0), 0)}</div>
            <div class="label">Total Repairs</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Inspections</th>
              <th>Repairs</th>
              <th>Last 30 Days</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>
                  <strong>${escapeHtml(u.name)}</strong><br/>
                  <span style="font-size: 11px; color: #666;">${escapeHtml(u.email)}</span>
                </td>
                <td><span class="badge badge-${escapeHtml(u.role.toLowerCase())}">${escapeHtml(u.role)}</span></td>
                <td><span class="badge ${u.status === 'active' ? 'badge-active' : 'badge-inactive'}">${escapeHtml(u.status)}</span></td>
                <td style="text-align: center;">${u.activity?.totalInspections || 0}</td>
                <td style="text-align: center;">${u.activity?.totalRepairs || 0}</td>
                <td style="text-align: center;">${u.activity?.recentInspections || 0}</td>
                <td>${u.activity?.lastActivity ? new Date(u.activity.lastActivity).toLocaleDateString() : 'Never'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2 style="color: #7c3aed; margin-top: 40px;">Activity Details</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Inspections</th>
              <th>Service Jobs</th>
              <th>Repairs</th>
              <th>Photos</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${escapeHtml(u.name)}</td>
                <td style="text-align: center;">${u.activity?.totalInspections || 0}</td>
                <td style="text-align: center;">${u.activity?.totalServiceJobs || 0}</td>
                <td style="text-align: center;">${u.activity?.totalRepairs || 0}</td>
                <td style="text-align: center;">${u.activity?.totalPhotos || 0}</td>
                <td>${new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Generated with Firexcheck.com - Professional Fire Safety Management</p>
          <p>Report ID: ${Date.now()} | Generated: ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;

    let browser: Browser | undefined;
    try {
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Wait for all images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
              setTimeout(resolve, 5000);
            }))
        );
      });

      const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4', printBackground: true }));
      return pdfBuffer;
    } finally {
      if (browser) await browser.close();
    }
  }

  // Generate Extinguishers by Type Report PDF
  async buildExtinguishersByTypeReport(params: {
    tenant: { name: string; logoUrl?: string };
    extinguishers: any[];
    groupedByType: Record<string, any[]>;
    filterType: string;
    filterBuilding?: string;
    filterStatus?: string;
  }): Promise<Buffer> {
    const { tenant, extinguishers, groupedByType, filterType, filterBuilding = 'all', filterStatus = 'all' } = params;

    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid #7c3aed; padding-bottom: 16px; }
          h1 { margin: 0; color: #7c3aed; }
          .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin: 24px 0; }
          .summary-card { background: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; }
          .summary-card .number { font-size: 28px; font-weight: bold; color: #7c3aed; }
          .summary-card .label { font-size: 12px; color: #666; margin-top: 4px; }
          .type-section { margin: 32px 0; page-break-inside: avoid; }
          .type-section h2 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th { background: #7c3aed; color: white; padding: 10px; text-align: left; font-size: 13px; }
          td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
          .badge-active { background: #10b981; color: white; }
          .badge-inactive { background: #ef4444; color: white; }
          .badge-good { background: #10b981; color: white; }
          .badge-fair { background: #f59e0b; color: white; }
          .badge-poor { background: #ef4444; color: white; }
          .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Extinguishers by Type Report</h1>
            <p style="margin: 8px 0 0 0; color: #666;">${escapeHtml(tenant.name)}</p>
            <p style="margin: 4px 0 0 0; color: #999; font-size: 12px;">
              ${[
                filterType !== 'all' ? `Type: ${escapeHtml(filterType)}` : null,
                filterBuilding !== 'all' ? `Building: ${escapeHtml(filterBuilding)}` : null,
                filterStatus !== 'all' ? `Status: ${escapeHtml(filterStatus)}` : null,
              ].filter(Boolean).join(' | ') || 'All Extinguishers'} | Generated: ${new Date().toLocaleDateString()}
            </p>
          </div>
          ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height: 60px;"/>` : ''}
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="number">${extinguishers.length}</div>
            <div class="label">Total Units</div>
          </div>
          ${Object.keys(groupedByType).map(type => `
            <div class="summary-card">
              <div class="number">${groupedByType[type].length}</div>
              <div class="label">${type}</div>
            </div>
          `).join('')}
        </div>

        ${Object.keys(groupedByType).sort().map(type => `
          <div class="type-section">
            <h2>${type} (${groupedByType[type].length} units)</h2>
            <table>
              <thead>
                <tr>
                  <th>Serial #</th>
                  <th>Location</th>
                  <th>Building</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Condition</th>
                  <th>Last Service</th>
                  <th>Next Due</th>
                </tr>
              </thead>
              <tbody>
                ${groupedByType[type].map(ext => `
                  <tr>
                    <td>${escapeHtml(ext.serialNumber || 'N/A')}</td>
                    <td>${escapeHtml(ext.location)}</td>
                    <td>${escapeHtml(ext.building)}</td>
                    <td>${escapeHtml(ext.capacity || 'N/A')}</td>
                    <td><span class="badge ${ext.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${escapeHtml(ext.status)}</span></td>
                    <td><span class="badge badge-${escapeHtml(ext.condition?.toLowerCase() || 'good')}">${escapeHtml(ext.condition || 'Good')}</span></td>
                    <td>${ext.lastMaintenance ? new Date(ext.lastMaintenance).toLocaleDateString() : ext.lastInspection ? new Date(ext.lastInspection).toLocaleDateString() : 'N/A'}</td>
                    <td>${ext.nextMaintenance ? new Date(ext.nextMaintenance).toLocaleDateString() : ext.nextInspection ? new Date(ext.nextInspection).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <div class="footer">
          <p>Generated with Firexcheck.com - Professional Fire Safety Management</p>
          <p>Report ID: ${Date.now()} | Generated: ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;

    let browser: Browser | undefined;
    try {
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Wait for all images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
              setTimeout(resolve, 5000);
            }))
        );
      });

      const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4', printBackground: true, landscape: true }));
      return pdfBuffer;
    } finally {
      if (browser) await browser.close();
    }
  }

  async buildExtinguishersBySiteReport(params: {
    tenant: { name: string; logoUrl?: string };
    extinguishers: any[];
    groupedBySite: Record<string, any[]>;
    filterSiteId?: string;
    filterStatus?: string;
  }): Promise<Buffer> {
    const { tenant, extinguishers, groupedBySite, filterStatus = 'all' } = params;

    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid #dc2626; padding-bottom: 16px; }
          h1 { margin: 0; color: #dc2626; }
          .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin: 24px 0; }
          .summary-card { background: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; }
          .summary-card .number { font-size: 28px; font-weight: bold; color: #dc2626; }
          .summary-card .label { font-size: 12px; color: #666; margin-top: 4px; }
          .site-section { margin: 32px 0; page-break-inside: avoid; }
          .site-section h2 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th { background: #dc2626; color: white; padding: 10px; text-align: left; font-size: 13px; }
          td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
          .badge-active { background: #10b981; color: white; }
          .badge-inactive { background: #ef4444; color: white; }
          .badge-good { background: #10b981; color: white; }
          .badge-fair { background: #f59e0b; color: white; }
          .badge-poor { background: #ef4444; color: white; }
          .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Extinguishers by Site Report</h1>
            <p style="margin: 8px 0 0 0; color: #666;">${escapeHtml(tenant.name)}</p>
            <p style="margin: 4px 0 0 0; color: #999; font-size: 12px;">
              ${filterStatus !== 'all' ? `Status: ${escapeHtml(filterStatus)} | ` : ''}Generated: ${new Date().toLocaleDateString()}
            </p>
          </div>
          ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height: 60px;"/>` : ''}
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="number">${extinguishers.length}</div>
            <div class="label">Total Units</div>
          </div>
          <div class="summary-card">
            <div class="number">${Object.keys(groupedBySite).length}</div>
            <div class="label">Sites</div>
          </div>
          <div class="summary-card">
            <div class="number">${extinguishers.filter((e: any) => e.status === 'Active').length}</div>
            <div class="label">Active</div>
          </div>
        </div>

        ${Object.keys(groupedBySite).sort().map(siteName => `
          <div class="site-section">
            <h2>${escapeHtml(siteName)} (${groupedBySite[siteName].length} unit${groupedBySite[siteName].length !== 1 ? 's' : ''})</h2>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Building</th>
                  <th>Capacity</th>
                  <th>Serial #</th>
                  <th>Status</th>
                  <th>Condition</th>
                  <th>Last Service</th>
                  <th>Next Due</th>
                </tr>
              </thead>
              <tbody>
                ${groupedBySite[siteName].map((ext: any) => `
                  <tr>
                    <td>${escapeHtml(ext.type)}</td>
                    <td>${escapeHtml(ext.location)}</td>
                    <td>${escapeHtml(ext.building)}</td>
                    <td>${escapeHtml(ext.capacity || 'N/A')}</td>
                    <td>${escapeHtml(ext.serialNumber || 'N/A')}</td>
                    <td><span class="badge ${ext.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${escapeHtml(ext.status)}</span></td>
                    <td><span class="badge badge-${escapeHtml(ext.condition?.toLowerCase() || 'good')}">${escapeHtml(ext.condition || 'Good')}</span></td>
                    <td>${ext.lastMaintenance ? new Date(ext.lastMaintenance).toLocaleDateString() : ext.lastInspection ? new Date(ext.lastInspection).toLocaleDateString() : 'N/A'}</td>
                    <td>${ext.nextMaintenance ? new Date(ext.nextMaintenance).toLocaleDateString() : ext.nextInspection ? new Date(ext.nextInspection).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <div class="footer">
          <p>Generated with Firexcheck.com - Professional Fire Safety Management</p>
          <p>Report ID: ${Date.now()} | Generated: ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;

    let browser: Browser | undefined;
    try {
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
              setTimeout(resolve, 5000);
            }))
        );
      });

      const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4', printBackground: true, landscape: true }));
      return pdfBuffer;
    } finally {
      if (browser) await browser.close();
    }
  }

  // Generate Fire Alarm Logbook Report PDF
  async buildFireAlarmLogbookReport(params: {
    tenant: { name: string; logoUrl?: string };
    systems: Array<{
      id: string;
      systemRef: string;
      name?: string | null;
      panelMake?: string | null;
      panelModel?: string | null;
      site?: { name: string } | null;
      logEntries: Array<{
        id: string;
        entryType: string;
        conductedBy: string;
        conductedAt: Date | string;
        outcome: string;
        notes?: string | null;
      }>;
    }>;
    dateLabel: string;
  }): Promise<Buffer> {
    const { tenant, systems, dateLabel } = params;

    const totalEntries = systems.reduce((s, sys) => s + sys.logEntries.length, 0);
    const passEntries = systems.reduce(
      (s, sys) => s + sys.logEntries.filter((e) => e.outcome === 'pass').length, 0
    );
    const passRate = totalEntries > 0 ? Math.round((passEntries / totalEntries) * 100) : 0;

    const outcomeColour = (outcome: string) => {
      if (outcome === 'pass') return '#10b981';
      if (outcome === 'fail') return '#ef4444';
      return '#f59e0b';
    };

    const entryTypeLabel = (t: string) =>
      t.replace('_', '-').replace(/^\w/, (c) => c.toUpperCase());

    const html = `
      <html>
      <head>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; font-size: 13px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 2px solid #ef4444; padding-bottom: 16px; }
          h1 { margin: 0; color: #ef4444; font-size: 22px; }
          .meta { color: #666; font-size: 12px; margin-top: 4px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .summary-card { background: #f3f4f6; padding: 14px; border-radius: 8px; text-align: center; }
          .summary-card .number { font-size: 28px; font-weight: bold; color: #ef4444; }
          .summary-card .label { font-size: 11px; color: #666; margin-top: 4px; }
          .system-block { margin: 28px 0; page-break-inside: avoid; }
          .system-heading { background: #1f2937; color: white; padding: 10px 14px; border-radius: 6px 6px 0 0; }
          .system-heading h2 { margin: 0; font-size: 14px; }
          .system-heading .sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #ef4444; color: white; padding: 9px 10px; text-align: left; font-size: 12px; }
          td { border-bottom: 1px solid #e5e7eb; padding: 8px 10px; font-size: 12px; vertical-align: top; }
          tr:nth-child(even) td { background: #fafafa; }
          .badge { display: inline-block; padding: 2px 9px; border-radius: 10px; font-size: 11px; font-weight: bold; color: white; }
          .type-badge { background: #6366f1; color: white; display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
          .no-entries { padding: 16px; text-align: center; color: #9ca3af; font-style: italic; background: #f9fafb; }
          .footer { margin-top: 48px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 11px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Fire Alarm Logbook Report</h1>
            <div class="meta">${escapeHtml(tenant.name)} &nbsp;·&nbsp; ${escapeHtml(dateLabel)} &nbsp;·&nbsp; Generated: ${new Date().toLocaleDateString('en-GB')}</div>
          </div>
          ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height:55px;"/>` : ''}
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="number">${systems.length}</div>
            <div class="label">Fire Alarm Systems</div>
          </div>
          <div class="summary-card">
            <div class="number">${totalEntries}</div>
            <div class="label">Log Entries</div>
          </div>
          <div class="summary-card">
            <div class="number" style="color:#10b981">${passRate}%</div>
            <div class="label">Pass Rate</div>
          </div>
          <div class="summary-card">
            <div class="number" style="color:#ef4444">${systems.reduce((s, sys) => s + sys.logEntries.filter((e) => e.outcome === 'fail').length, 0)}</div>
            <div class="label">Failures Recorded</div>
          </div>
        </div>

        ${systems.map((sys) => `
          <div class="system-block">
            <div class="system-heading">
              <h2>${escapeHtml(sys.name || sys.systemRef)}</h2>
              <div class="sub">
                Ref: ${escapeHtml(sys.systemRef)}
                ${sys.site ? ` &nbsp;·&nbsp; Site: ${escapeHtml(sys.site.name)}` : ''}
                ${sys.panelMake ? ` &nbsp;·&nbsp; Panel: ${escapeHtml(sys.panelMake)}${sys.panelModel ? ' ' + escapeHtml(sys.panelModel) : ''}` : ''}
              </div>
            </div>
            ${sys.logEntries.length === 0
              ? `<div class="no-entries">No log entries for this period</div>`
              : `<table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Conducted By</th>
                      <th>Outcome</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sys.logEntries
                      .sort((a, b) => new Date(b.conductedAt).getTime() - new Date(a.conductedAt).getTime())
                      .map((e) => `
                        <tr>
                          <td>${new Date(e.conductedAt).toLocaleDateString('en-GB')}</td>
                          <td><span class="type-badge">${escapeHtml(entryTypeLabel(e.entryType))}</span></td>
                          <td>${escapeHtml(e.conductedBy)}</td>
                          <td><span class="badge" style="background:${outcomeColour(e.outcome)}">${escapeHtml(e.outcome.toUpperCase())}</span></td>
                          <td style="color:#555">${escapeHtml(e.notes || '—')}</td>
                        </tr>
                      `).join('')}
                  </tbody>
                </table>`
            }
          </div>
        `).join('')}

        <div class="footer">
          <p>Generated with Firexcheck.com — Professional Fire Safety Management</p>
          <p>Report ID: ${Date.now()} | ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;

    let browser: Browser | undefined;
    try {
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4', printBackground: true }));
      return pdfBuffer;
    } finally {
      if (browser) await browser.close();
    }
  }

  // ─── Fire Alarm Weekly Test Log ───────────────────────────────────────────

  async buildFireAlarmWeeklyTestReport(params: {
    tenant: { name: string; logoUrl?: string };
    systems: Array<{
      systemRef: string;
      name?: string | null;
      panelMake?: string | null;
      panelModel?: string | null;
      site?: { name: string } | null;
      logEntries: Array<{
        entryType: string;
        conductedBy: string;
        conductedAt: Date | string;
        outcome: string;
        notes?: string | null;
        data?: Record<string, unknown> | null;
      }>;
    }>;
    dateLabel: string;
  }): Promise<Buffer> {
    const { tenant, systems, dateLabel } = params;

    const allEntries = systems.flatMap((s) => s.logEntries);
    const passCount = allEntries.filter((e) => e.outcome === 'pass').length;
    const failCount = allEntries.filter((e) => e.outcome === 'fail').length;
    const passRate = allEntries.length > 0 ? Math.round((passCount / allEntries.length) * 100) : 0;

    const outcomeColour = (o: string) => o === 'pass' ? '#10b981' : o === 'fail' ? '#ef4444' : '#f59e0b';
    const bool = (v: unknown) => v === true ? '✓ Yes' : v === false ? '✗ No' : '—';

    const html = `<html><head><style>
      * { box-sizing: border-box; }
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; font-size: 12px; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #ef4444; padding-bottom: 14px; }
      h1 { margin: 0; color: #ef4444; font-size: 20px; }
      .meta { color: #666; font-size: 11px; margin-top: 4px; }
      .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0 24px; }
      .sc { background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center; }
      .sc .n { font-size: 26px; font-weight: bold; color: #ef4444; }
      .sc .l { font-size: 11px; color: #666; margin-top: 3px; }
      .system-block { margin: 24px 0; page-break-inside: avoid; }
      .sh { background: #1f2937; color: white; padding: 9px 12px; border-radius: 6px 6px 0 0; }
      .sh h2 { margin: 0; font-size: 13px; }
      .sh .sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #ef4444; color: white; padding: 8px 9px; text-align: left; font-size: 11px; }
      td { border-bottom: 1px solid #e5e7eb; padding: 7px 9px; font-size: 11px; vertical-align: top; }
      tr:nth-child(even) td { background: #fafafa; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; color: white; }
      .no-entries { padding: 14px; text-align: center; color: #9ca3af; font-style: italic; background: #f9fafb; }
      .footer { margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center; }
    </style></head><body>
      <div class="header">
        <div>
          <h1>Fire Alarm Weekly Test Log</h1>
          <div class="meta">${escapeHtml(tenant.name)} &nbsp;·&nbsp; ${escapeHtml(dateLabel)} &nbsp;·&nbsp; Generated: ${new Date().toLocaleDateString('en-GB')}</div>
        </div>
        ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height:50px;"/>` : ''}
      </div>

      <div class="summary">
        <div class="sc"><div class="n">${allEntries.length}</div><div class="l">Weekly Tests</div></div>
        <div class="sc"><div class="n" style="color:#10b981">${passRate}%</div><div class="l">Pass Rate</div></div>
        <div class="sc"><div class="n" style="color:#ef4444">${failCount}</div><div class="l">Failures</div></div>
        <div class="sc"><div class="n">${systems.length}</div><div class="l">Systems</div></div>
      </div>

      ${systems.map((sys) => `
        <div class="system-block">
          <div class="sh">
            <h2>${escapeHtml(sys.name || sys.systemRef)}</h2>
            <div class="sub">Ref: ${escapeHtml(sys.systemRef)}${sys.site ? ` &nbsp;·&nbsp; ${escapeHtml(sys.site.name)}` : ''}${sys.panelMake ? ` &nbsp;·&nbsp; Panel: ${escapeHtml(sys.panelMake)}${sys.panelModel ? ' ' + escapeHtml(sys.panelModel) : ''}` : ''}</div>
          </div>
          ${sys.logEntries.length === 0
            ? `<div class="no-entries">No weekly tests for this period</div>`
            : `<table><thead><tr>
                <th>Date</th><th>Tested By</th><th>Outcome</th>
                <th>Alarm OK</th><th>Zone OK</th><th>Reset OK</th><th>Faults Found</th><th>Notes</th>
               </tr></thead><tbody>
               ${sys.logEntries.map((e) => {
                 const d = (e.data || {}) as Record<string, unknown>;
                 return `<tr>
                   <td>${new Date(e.conductedAt).toLocaleDateString('en-GB')}</td>
                   <td>${escapeHtml(e.conductedBy)}</td>
                   <td><span class="badge" style="background:${outcomeColour(e.outcome)}">${e.outcome.toUpperCase()}</span></td>
                   <td>${bool(d.alarmActivated)}</td>
                   <td>${bool(d.zoneCorrect)}</td>
                   <td>${bool(d.resetOk)}</td>
                   <td>${bool(d.faultsFound)}</td>
                   <td style="color:#555">${escapeHtml(e.notes || '—')}</td>
                 </tr>`;
               }).join('')}
               </tbody></table>`
          }
        </div>
      `).join('')}

      <div class="footer">
        <p>Generated with Firexcheck.com — Professional Fire Safety Management &nbsp;·&nbsp; ${new Date().toISOString()}</p>
      </div>
    </body></html>`;

    return this.renderPdf(html);
  }

  // ─── Fire Alarm Fault History Report ─────────────────────────────────────

  async buildFireAlarmFaultHistoryReport(params: {
    tenant: { name: string; logoUrl?: string };
    systems: Array<{
      systemRef: string;
      name?: string | null;
      site?: { name: string } | null;
      logEntries: Array<{
        conductedBy: string;
        conductedAt: Date | string;
        outcome: string;
        notes?: string | null;
        data?: Record<string, unknown> | null;
      }>;
    }>;
    dateLabel: string;
  }): Promise<Buffer> {
    const { tenant, systems, dateLabel } = params;

    const allEntries = systems.flatMap((s) => s.logEntries);
    const resolvedCount = allEntries.filter((e) => (e.data as any)?.resolved === true).length;
    const criticalCount = allEntries.filter((e) => (e.data as any)?.severity === 'critical').length;
    const majorCount = allEntries.filter((e) => (e.data as any)?.severity === 'major').length;

    const sevColour = (s: string) =>
      s === 'critical' ? '#ef4444' : s === 'major' ? '#f97316' : '#f59e0b';

    const html = `<html><head><style>
      * { box-sizing: border-box; }
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; font-size: 12px; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #ef4444; padding-bottom: 14px; }
      h1 { margin: 0; color: #ef4444; font-size: 20px; }
      .meta { color: #666; font-size: 11px; margin-top: 4px; }
      .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0 24px; }
      .sc { background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center; }
      .sc .n { font-size: 26px; font-weight: bold; color: #ef4444; }
      .sc .l { font-size: 11px; color: #666; margin-top: 3px; }
      .system-block { margin: 24px 0; page-break-inside: avoid; }
      .sh { background: #1f2937; color: white; padding: 9px 12px; border-radius: 6px 6px 0 0; }
      .sh h2 { margin: 0; font-size: 13px; }
      .sh .sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #ef4444; color: white; padding: 8px 9px; text-align: left; font-size: 11px; }
      td { border-bottom: 1px solid #e5e7eb; padding: 7px 9px; font-size: 11px; vertical-align: top; }
      tr:nth-child(even) td { background: #fafafa; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; color: white; }
      .resolved { color: #10b981; font-weight: bold; }
      .open { color: #f59e0b; font-weight: bold; }
      .no-entries { padding: 14px; text-align: center; color: #9ca3af; font-style: italic; background: #f9fafb; }
      .footer { margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center; }
    </style></head><body>
      <div class="header">
        <div>
          <h1>Fire Alarm Fault History</h1>
          <div class="meta">${escapeHtml(tenant.name)} &nbsp;·&nbsp; ${escapeHtml(dateLabel)} &nbsp;·&nbsp; Generated: ${new Date().toLocaleDateString('en-GB')}</div>
        </div>
        ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height:50px;"/>` : ''}
      </div>

      <div class="summary">
        <div class="sc"><div class="n">${allEntries.length}</div><div class="l">Total Faults</div></div>
        <div class="sc"><div class="n" style="color:#ef4444">${criticalCount}</div><div class="l">Critical</div></div>
        <div class="sc"><div class="n" style="color:#f97316">${majorCount}</div><div class="l">Major</div></div>
        <div class="sc"><div class="n" style="color:#10b981">${resolvedCount}</div><div class="l">Resolved</div></div>
      </div>

      ${systems.map((sys) => `
        <div class="system-block">
          <div class="sh">
            <h2>${escapeHtml(sys.name || sys.systemRef)}</h2>
            <div class="sub">Ref: ${escapeHtml(sys.systemRef)}${sys.site ? ` &nbsp;·&nbsp; ${escapeHtml(sys.site.name)}` : ''}</div>
          </div>
          ${sys.logEntries.length === 0
            ? `<div class="no-entries">No faults recorded for this period</div>`
            : `<table><thead><tr>
                <th>Date</th><th>Reported By</th><th>Severity</th>
                <th>Description</th><th>Remedial Action</th><th>Status</th>
               </tr></thead><tbody>
               ${sys.logEntries.map((e) => {
                 const d = (e.data || {}) as Record<string, unknown>;
                 const sev = String(d.severity || 'minor');
                 const resolved = d.resolved === true;
                 return `<tr>
                   <td>${new Date(e.conductedAt).toLocaleDateString('en-GB')}</td>
                   <td>${escapeHtml(e.conductedBy)}</td>
                   <td><span class="badge" style="background:${sevColour(sev)}">${sev.toUpperCase()}</span></td>
                   <td style="color:#333">${escapeHtml(e.notes || '—')}</td>
                   <td style="color:#555">${escapeHtml(String(d.remedialAction || '—'))}</td>
                   <td class="${resolved ? 'resolved' : 'open'}">${resolved ? '✓ Resolved' : '⚠ Open'}</td>
                 </tr>`;
               }).join('')}
               </tbody></table>`
          }
        </div>
      `).join('')}

      <div class="footer">
        <p>Generated with Firexcheck.com — Professional Fire Safety Management &nbsp;·&nbsp; ${new Date().toISOString()}</p>
      </div>
    </body></html>`;

    return this.renderPdf(html);
  }

  // ─── Fire Alarm Engineer Maintenance Report ───────────────────────────────

  async buildFireAlarmEngineerReport(params: {
    tenant: { name: string; logoUrl?: string };
    systems: Array<{
      systemRef: string;
      name?: string | null;
      site?: { name: string } | null;
      logEntries: Array<{
        conductedBy: string;
        conductedAt: Date | string;
        outcome: string;
        notes?: string | null;
        data?: Record<string, unknown> | null;
      }>;
    }>;
    dateLabel: string;
  }): Promise<Buffer> {
    const { tenant, systems, dateLabel } = params;

    const allEntries = systems.flatMap((s) => s.logEntries);
    const passCount = allEntries.filter((e) => e.outcome === 'pass').length;
    const failCount = allEntries.filter((e) => e.outcome === 'fail').length;
    const passRate = allEntries.length > 0 ? Math.round((passCount / allEntries.length) * 100) : 0;

    const outcomeColour = (o: string) => o === 'pass' ? '#10b981' : o === 'fail' ? '#ef4444' : '#f59e0b';

    const html = `<html><head><style>
      * { box-sizing: border-box; }
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; font-size: 12px; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #ef4444; padding-bottom: 14px; }
      h1 { margin: 0; color: #ef4444; font-size: 20px; }
      .meta { color: #666; font-size: 11px; margin-top: 4px; }
      .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0 24px; }
      .sc { background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center; }
      .sc .n { font-size: 26px; font-weight: bold; color: #ef4444; }
      .sc .l { font-size: 11px; color: #666; margin-top: 3px; }
      .system-block { margin: 24px 0; page-break-inside: avoid; }
      .sh { background: #1f2937; color: white; padding: 9px 12px; border-radius: 6px 6px 0 0; }
      .sh h2 { margin: 0; font-size: 13px; }
      .sh .sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #ef4444; color: white; padding: 8px 9px; text-align: left; font-size: 11px; }
      td { border-bottom: 1px solid #e5e7eb; padding: 7px 9px; font-size: 11px; vertical-align: top; }
      tr:nth-child(even) td { background: #fafafa; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; color: white; }
      .next-action { font-size: 10px; color: #6366f1; margin-top: 2px; }
      .no-entries { padding: 14px; text-align: center; color: #9ca3af; font-style: italic; background: #f9fafb; }
      .footer { margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center; }
    </style></head><body>
      <div class="header">
        <div>
          <h1>Fire Alarm Engineer Maintenance Report</h1>
          <div class="meta">${escapeHtml(tenant.name)} &nbsp;·&nbsp; ${escapeHtml(dateLabel)} &nbsp;·&nbsp; Generated: ${new Date().toLocaleDateString('en-GB')}</div>
        </div>
        ${tenant.logoUrl ? `<img src="${escapeHtml(tenant.logoUrl)}" style="height:50px;"/>` : ''}
      </div>

      <div class="summary">
        <div class="sc"><div class="n">${allEntries.length}</div><div class="l">Engineer Visits</div></div>
        <div class="sc"><div class="n" style="color:#10b981">${passRate}%</div><div class="l">Pass Rate</div></div>
        <div class="sc"><div class="n" style="color:#ef4444">${failCount}</div><div class="l">Failures</div></div>
        <div class="sc"><div class="n">${systems.length}</div><div class="l">Systems</div></div>
      </div>

      ${systems.map((sys) => `
        <div class="system-block">
          <div class="sh">
            <h2>${escapeHtml(sys.name || sys.systemRef)}</h2>
            <div class="sub">Ref: ${escapeHtml(sys.systemRef)}${sys.site ? ` &nbsp;·&nbsp; ${escapeHtml(sys.site.name)}` : ''}</div>
          </div>
          ${sys.logEntries.length === 0
            ? `<div class="no-entries">No engineer visits for this period</div>`
            : `<table><thead><tr>
                <th>Date</th><th>Engineer</th><th>Company</th>
                <th>Work Carried Out</th><th>Outcome</th><th>Next Action</th>
               </tr></thead><tbody>
               ${sys.logEntries.map((e) => {
                 const d = (e.data || {}) as Record<string, unknown>;
                 return `<tr>
                   <td>${new Date(e.conductedAt).toLocaleDateString('en-GB')}</td>
                   <td>${escapeHtml(e.conductedBy)}</td>
                   <td>${escapeHtml(String(d.company || '—'))}</td>
                   <td style="color:#333">${escapeHtml(e.notes || '—')}</td>
                   <td><span class="badge" style="background:${outcomeColour(e.outcome)}">${e.outcome.toUpperCase()}</span></td>
                   <td style="color:#6366f1">${escapeHtml(String(d.nextAction || '—'))}</td>
                 </tr>`;
               }).join('')}
               </tbody></table>`
          }
        </div>
      `).join('')}

      <div class="footer">
        <p>Generated with Firexcheck.com — Professional Fire Safety Management &nbsp;·&nbsp; ${new Date().toISOString()}</p>
      </div>
    </body></html>`;

    return this.renderPdf(html);
  }

  // ─── PAT Test Report ──────────────────────────────────────────────────────

  async buildPATTestReport(params: {
    tenant: { name: string; logoUrl?: string };
    appliances: {
      applianceRef: string; description: string; location: string;
      applianceClass?: string | null;
      tests: {
        testedBy: string; testedAt: string | Date; visualInspect: string;
        earthOhms?: number | null; insulationMohms?: number | null;
        functionalCheck: string; outcome: string; nextTestDate?: string | Date | null;
        comments?: string | null; reportRef?: string | null;
      }[];
    }[];
    dateLabel: string;
  }): Promise<Buffer> {
    const { tenant, appliances, dateLabel } = params;
    const reportNo = `PAT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const fmt = (d: string | Date | null | undefined) =>
      d ? new Date(d).toLocaleDateString('en-GB') : '—';
    const badge = (v: string) =>
      v === 'pass'
        ? `<span style="color:#16a34a;font-weight:700;">PASS</span>`
        : v === 'fail'
        ? `<span style="color:#dc2626;font-weight:700;">FAIL</span>`
        : `<span style="color:#6b7280;">N/A</span>`;

    // Flatten all tests into rows, each tagged with the appliance
    const rows = appliances.flatMap(app =>
      app.tests.length > 0
        ? app.tests.map(t => ({ app, t }))
        : [{ app, t: null as any }],
    );

    const tableRows = rows.map(({ app, t }, i) => {
      if (!t) {
        return `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
          <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(app.applianceRef)}</td>
          <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(app.description)}</td>
          <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(app.location)}</td>
          <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${esc(app.applianceClass ?? '—')}</td>
          <td colspan="7" style="padding:5px 6px;border:1px solid #e5e7eb;color:#9ca3af;font-style:italic;">No tests recorded</td>
        </tr>`;
      }
      return `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
        <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(app.applianceRef)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(app.description)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(app.location)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${esc(app.applianceClass ?? '—')}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${badge(t.visualInspect)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${t.earthOhms != null ? esc(t.earthOhms) : '—'}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${t.insulationMohms != null ? esc(t.insulationMohms) : '—'}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${badge(t.functionalCheck)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${fmt(t.nextTestDate)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${badge(t.outcome)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;font-size:10px;">${esc(t.comments)}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 0; padding: 0; }
  .header { background: #1e3a5f; color: #fff; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { margin: 0; font-size: 16px; font-weight: 700; }
  .header .sub { font-size: 11px; opacity: 0.85; margin-top: 2px; }
  .meta { display: flex; gap: 24px; padding: 10px 20px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
  .meta span { font-weight: 600; }
  table { border-collapse: collapse; width: 100%; font-size: 10.5px; }
  th { background: #1e3a5f; color: #fff; padding: 6px 6px; border: 1px solid #1e3a5f; text-align: left; font-size: 10px; }
  .footer { margin-top: 20px; padding: 10px 20px; font-size: 9px; color: #6b7280; border-top: 1px solid #e5e7eb; }
</style></head><body>
<div class="header">
  <div>
    <div class="sub">${esc(tenant.name)}</div>
    <h1>Portable Appliance Testing Report</h1>
    <div class="sub">${dateLabel}</div>
  </div>
  <div style="text-align:right;">
    <div><span>Report No:</span> ${esc(reportNo)}</div>
    <div style="margin-top:4px;"><span>Date:</span> ${new Date().toLocaleDateString('en-GB')}</div>
  </div>
</div>
<div class="meta">
  <div>Total Appliances: <span>${appliances.length}</span></div>
  <div>Passed: <span style="color:#16a34a;">${rows.filter(r => r.t?.outcome === 'pass').length}</span></div>
  <div>Failed: <span style="color:#dc2626;">${rows.filter(r => r.t?.outcome === 'fail').length}</span></div>
  <div>Not Yet Tested: <span style="color:#6b7280;">${appliances.filter(a => a.tests.length === 0).length}</span></div>
</div>
<table>
  <thead>
    <tr>
      <th>ID No.</th>
      <th>Description</th>
      <th>Location</th>
      <th>Class</th>
      <th>Visual<br>Inspect</th>
      <th>Earth<br>Ω</th>
      <th>Insulation<br>MΩ</th>
      <th>Functional<br>Check</th>
      <th>Next Test</th>
      <th>Pass/Fail</th>
      <th>Comments</th>
    </tr>
  </thead>
  <tbody>${tableRows}</tbody>
</table>
<div class="footer">
  This report is generated in accordance with BS EN 60335 and IEE Code of Practice for In-service Inspection and Testing of Electrical Equipment.
  Generated ${new Date().toLocaleString('en-GB')} — Firexcheck.com
</div>
</body></html>`;

    return this.renderPdf(html);
  }

  // ─── Emergency Lighting Report ───────────────────────────────────────────

  async buildEmergencyLightingReport(params: {
    tenant: { name: string; logoUrl?: string };
    luminaires: {
      luminaireRef: string; description: string; location: string;
      luminaireType: string; zone?: string | null;
      tests: {
        testType: string; testedBy: string; testedAt: string | Date;
        durationSecs?: number | null; durationMins?: number | null;
        luxReading?: number | null; outcome: string;
        defectsFound?: string | null; nextTestDate?: string | Date | null;
        comments?: string | null;
      }[];
    }[];
    dateLabel: string;
  }): Promise<Buffer> {
    const { tenant, luminaires, dateLabel } = params;
    const reportNo = `EL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const fmt = (d: string | Date | null | undefined) =>
      d ? new Date(d).toLocaleDateString('en-GB') : '—';
    const badge = (v: string) =>
      v === 'pass'
        ? `<span style="color:#16a34a;font-weight:700;">PASS</span>`
        : `<span style="color:#dc2626;font-weight:700;">FAIL</span>`;

    const testTypeLabel: Record<string, string> = {
      daily: 'Daily',
      monthly: 'Monthly',
      annual: 'Annual',
      three_yearly: '3-Yearly',
    };

    const rows = luminaires.flatMap(lum =>
      lum.tests.length > 0
        ? lum.tests.map(t => ({ lum, t }))
        : [{ lum, t: null as any }],
    );

    const tableRows = rows.map(({ lum, t }, i) => {
      if (!t) {
        return `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
          <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(lum.luminaireRef)}</td>
          <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(lum.description)}</td>
          <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(lum.location)}</td>
          <td style="padding:5px 6px;border:1px solid #e5e7eb;font-size:9px;">${esc(lum.luminaireType.replace('_', ' '))}</td>
          <td colspan="8" style="padding:5px 6px;border:1px solid #e5e7eb;color:#9ca3af;font-style:italic;">No tests recorded</td>
        </tr>`;
      }
      const dur = t.testType === 'monthly' && t.durationSecs != null
        ? `${t.durationSecs}s`
        : t.durationMins != null
        ? `${t.durationMins}min`
        : '—';
      return `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
        <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(lum.luminaireRef)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(lum.description)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;">${esc(lum.location)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;font-size:9px;">${esc(lum.luminaireType.replace(/_/g, ' '))}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${esc(testTypeLabel[t.testType] ?? t.testType)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${fmt(t.testedAt)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${esc(t.testedBy)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${dur}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${t.luxReading != null ? `${esc(t.luxReading)} lx` : '—'}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${badge(t.outcome)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;font-size:10px;">${esc(t.defectsFound)}</td>
        <td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:center;">${fmt(t.nextTestDate)}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 0; padding: 0; }
  .header { background: #78350f; color: #fff; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { margin: 0; font-size: 16px; font-weight: 700; }
  .header .sub { font-size: 11px; opacity: 0.85; margin-top: 2px; }
  .meta { display: flex; gap: 24px; padding: 10px 20px; background: #fffbeb; border-bottom: 1px solid #fde68a; font-size: 11px; }
  .meta span { font-weight: 600; }
  table { border-collapse: collapse; width: 100%; font-size: 10px; }
  th { background: #78350f; color: #fff; padding: 6px 6px; border: 1px solid #78350f; text-align: left; font-size: 9.5px; }
  .footer { margin-top: 20px; padding: 10px 20px; font-size: 9px; color: #6b7280; border-top: 1px solid #e5e7eb; }
</style></head><body>
<div class="header">
  <div>
    <div class="sub">${esc(tenant.name)}</div>
    <h1>Emergency Lighting Test Report</h1>
    <div class="sub">${dateLabel}</div>
  </div>
  <div style="text-align:right;">
    <div><span>Report No:</span> ${esc(reportNo)}</div>
    <div style="margin-top:4px;"><span>Date:</span> ${new Date().toLocaleDateString('en-GB')}</div>
  </div>
</div>
<div class="meta">
  <div>Total Luminaires: <span>${luminaires.length}</span></div>
  <div>Passed: <span style="color:#16a34a;">${rows.filter(r => r.t?.outcome === 'pass').length}</span></div>
  <div>Failed: <span style="color:#dc2626;">${rows.filter(r => r.t?.outcome === 'fail').length}</span></div>
  <div>Not Yet Tested: <span style="color:#6b7280;">${luminaires.filter(l => l.tests.length === 0).length}</span></div>
</div>
<table>
  <thead>
    <tr>
      <th>Ref</th>
      <th>Description</th>
      <th>Location</th>
      <th>Type</th>
      <th>Test Type</th>
      <th>Date</th>
      <th>Tested By</th>
      <th>Duration</th>
      <th>Lux (lx)</th>
      <th>Pass/Fail</th>
      <th>Defects</th>
      <th>Next Test</th>
    </tr>
  </thead>
  <tbody>${tableRows}</tbody>
</table>
<div class="footer">
  Generated in accordance with BS 5266-1:2016 Emergency Lighting — Code of Practice for the Emergency Lighting of Premises.
  Generated ${new Date().toLocaleString('en-GB')} — Firexcheck.com
</div>
</body></html>`;

    return this.renderPdf(html);
  }

  // ─── Shared PDF renderer ──────────────────────────────────────────────────

  private async renderPdf(html: string): Promise<Buffer> {
    let browser: Browser | undefined;
    try {
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      return Buffer.from(await page.pdf({ format: 'A4', printBackground: true }));
    } finally {
      if (browser) await browser.close();
    }
  }
}
