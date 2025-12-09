// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  private readonly reportsDir = path.join(process.cwd(), 'uploads', 'reports');

  constructor() {
    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
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

      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

      // Save locally instead of S3
      const filename = `${Date.now()}-report.pdf`;
      const filepath = path.join(this.reportsDir, filename);
      fs.writeFileSync(filepath, pdfBuffer);

      // Return a local URL path that can be served
      return `/uploads/reports/${filename}`;
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
        <td>${location} ${building ? '(' + building + ')' : ''}</td>
        <td>${serviceType}</td>
        <td>${findings}</td>
        <td>${recommendations}</td>
        <td>${serviceDates.annual}</td>
        <td>${serviceDates.extended}</td>
      </tr>`;
    }).join('');

    const photoCards = photos.map(p => `
      <div style="margin:8px; display:inline-block">
        <img src="${p.url}" style="width:180px; height:auto; border:1px solid #ddd"/>
        <div style="font-size:12px">${p.findings ? JSON.stringify(p.findings) : ''}</div>
      </div>
    `).join('');

    return `
      <html>
      <body style="font-family: Arial, sans-serif; padding:24px">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
          <div>
            <h1 style="margin:0">${tenant.name} – Service Report</h1>
            <p style="margin:4px 0 0 0; font-size:12px; color:#7c3aed">Powered by Fireexcheck.com</p>
          </div>
          ${tenant.logoUrl ? `<img src="${tenant.logoUrl}" style="height:48px"/>` : ''}
        </div>
        <p><strong>Date:</strong> ${visitDate} &nbsp; <strong>Technician:</strong> ${technician ?? ''}</p>

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

  // Generate comprehensive extinguisher history PDF
  async buildExtinguisherHistoryReport(params: {
    tenant: { name: string; logoUrl?: string };
    extinguisher: any;
    inspections: any[];
    photos: any[];
    partsUsage: any[];
  }) {
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
            <h1 style="margin: 0;">${tenant.name}</h1>
            <h2 style="margin: 8px 0; color: #7c3aed;">Fire Extinguisher Lifecycle Report</h2>
            <p style="margin: 0; color: #666; font-size: 12px;">Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          ${tenant.logoUrl ? `<img src="${tenant.logoUrl}" style="height: 60px;"/>` : ''}
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
                    <td>${p.inventoryItem.partNumber}</td>
                    <td>${p.inventoryItem.partName}</td>
                    <td>${p.quantity}</td>
                    <td>${p.reason || 'Routine maintenance'}</td>
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
                  <img src="${p.url}" />
                  <p style="font-size: 12px; margin: 4px 0;">${new Date(p.createdAt).toLocaleDateString()}</p>
                  ${p.caption ? `<p style="font-size: 11px; color: #666;">${p.caption}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
          <p>Generated with Fireexcheck.com - Professional Fire Safety Management</p>
          <p>Report ID: ${extinguisher.id} | Generated: ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;

    const filename = `extinguisher-${extinguisher.id}-history-${Date.now()}.pdf`;
    const filepath = path.join(this.reportsDir, filename);

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

      await page.pdf({ path: filepath, format: 'A4', printBackground: true });

      return `/uploads/reports/${filename}`;
    } finally {
      if (browser) await browser.close();
    }
  }

  // Generate compliance certificate PDF
  async buildComplianceCertificate(params: {
    tenant: { name: string; logoUrl?: string };
    extinguisher: any;
    inspection: any;
    photoUrl?: string;
  }) {
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
            ${tenant.logoUrl ? `<img src="${tenant.logoUrl}" style="height: 80px; margin-bottom: 16px;"/>` : ''}
            <div class="title">INSPECTION CERTIFICATE</div>
            <div class="subtitle">${tenant.name}</div>
          </div>

          ${photoUrl ? `<img src="${photoUrl}" class="extinguisher-photo" alt="Extinguisher Photo"/>` : ''}

          <p style="font-size: 16px; margin: 24px 0;">This certifies that the fire extinguisher described below has been inspected and tested in accordance with applicable regulations.</p>

          <div class="content">
            <div class="info-row">
              <div class="info-label">Serial Number:</div>
              <div>${extinguisher.serialNumber || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Type:</div>
              <div>${extinguisher.type}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Capacity:</div>
              <div>${extinguisher.capacity || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Location:</div>
              <div>${extinguisher.building} - ${extinguisher.location}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Inspection Date:</div>
              <div>${new Date(inspection.serviceDate).toLocaleDateString()}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Service Type:</div>
              <div>${inspection.serviceType}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Technician:</div>
              <div>${inspection.technician || 'Certified Technician'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Condition:</div>
              <div style="font-weight: bold; color: ${inspection.condition === 'Good' ? '#10b981' : '#ef4444'};">${inspection.condition}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Next Service Due:</div>
              <div>${inspection.nextServiceDate ? new Date(inspection.nextServiceDate).toLocaleDateString() : 'N/A'}</div>
            </div>
            ${inspection.notes ? `
              <div class="info-row">
                <div class="info-label">Notes:</div>
                <div>${inspection.notes}</div>
              </div>
            ` : ''}
          </div>

          <div style="margin-top: 48px;">
            <div class="signature">
              <div style="font-weight: bold;">${inspection.technician || 'Certified Technician'}</div>
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

    const filename = `certificate-${extinguisher.id}-${Date.now()}.pdf`;
    const filepath = path.join(this.reportsDir, filename);

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

      await page.pdf({ path: filepath, format: 'A4', printBackground: true });

      return `/uploads/reports/${filename}`;
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
    workbook.creator = 'Fireexcheck.com';
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
}
