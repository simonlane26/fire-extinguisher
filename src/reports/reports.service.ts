// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

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
}
