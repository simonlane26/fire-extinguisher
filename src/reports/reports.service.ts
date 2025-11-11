// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { S3Service } from '../storage/storage.service';

@Injectable()
export class ReportsService {
  constructor(private s3: S3Service) {}

  async buildReport(params: {
    tenant: { name: string, logoUrl?: string | null };
    visitDate: string;
    technician?: string;
    jobs: Array<{ id: string; structured: any }>;
    photos: Array<{ url: string; findings?: any }>;
  }) {
    const html = this.template(params);
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    const key = `reports/${Date.now()}-report.pdf`;
    const pdfUrl = await this.s3.uploadBuffer(key, Buffer.from(pdfBuffer), 'application/pdf');
    return pdfUrl;
  }

  private template({ tenant, visitDate, technician, jobs, photos }: any) {
    // keep it simple; style with inline CSS or Tailwind via CDN if you prefer
    const jobRows = jobs.map(j => `
      <tr>
        <td>${j.id}</td>
        <td>${j.structured?.type ?? ''}</td>
        <td>${(j.structured?.defects ?? []).join(', ')}</td>
        <td>${(j.structured?.actions ?? []).join(', ')}</td>
        <td>${j.structured?.nextDue ?? ''}</td>
      </tr>`).join('');

    const photoCards = photos.map(p => `
      <div style="margin:8px; display:inline-block">
        <img src="${p.url}" style="width:180px; height:auto; border:1px solid #ddd"/>
        <div style="font-size:12px">${p.findings ? JSON.stringify(p.findings) : ''}</div>
      </div>
    `).join('');

    return `
      <html>
      <body style="font-family: Arial, sans-serif; padding:24px">
        <div style="display:flex; align-items:center; justify-content:space-between">
          <h1>${tenant.name} – Service Report</h1>
          ${tenant.logoUrl ? `<img src="${tenant.logoUrl}" style="height:48px"/>` : ''}
        </div>
        <p><strong>Date:</strong> ${visitDate} &nbsp; <strong>Technician:</strong> ${technician ?? ''}</p>

        <h2>Summary</h2>
        <table border="1" cellspacing="0" cellpadding="6" width="100%" style="border-collapse:collapse">
          <thead><tr><th>Job</th><th>Type</th><th>Non-conformities</th><th>Actions</th><th>Next Due</th></tr></thead>
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
