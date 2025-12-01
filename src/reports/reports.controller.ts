import { Body, Controller, Post, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('reports')
@UseGuards(TenantGuard)
export class ReportsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reports: ReportsService,
  ) {}

  @Post('generate')
  async generate(
    @CurrentUser() user: CurrentUserData,
    @Body() body: { jobIds: string[]; photoIds?: string[]; visitDate: string; technician?: string }
  ) {
    const tenantId = user.tenantId;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    // If no jobIds provided, fetch all jobs for the tenant (for quick testing)
    // In production, you'd want to add date filters or a limit
    console.log('Fetching jobs for tenantId:', tenantId, 'jobIds:', body.jobIds);
    let jobs = body.jobIds && body.jobIds.length > 0
      ? await this.prisma.serviceJob.findMany({
          where: { tenantId, id: { in: body.jobIds } },
        })
      : await this.prisma.serviceJob.findMany({
          where: { tenantId },
          orderBy: { createdAt: 'desc' },
          take: 50, // Limit to most recent 50 jobs
        });

    console.log('Found jobs:', jobs.length);

    // If no service jobs, try to use extinguisher data as a fallback
    if (jobs.length === 0) {
      console.log('No service jobs found, fetching extinguishers instead...');
      const extinguishers = await this.prisma.extinguisher.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      console.log('Found extinguishers:', extinguishers.length);

      // Transform extinguishers to match the job structure for the report
      jobs = extinguishers.map(ext => ({
        id: ext.id,
        location: ext.location,
        building: ext.building,
        type: ext.type,
        serviceType: ext.serviceType || 'Inspection',
        notes: ext.notes,
        lastInspection: ext.lastInspection,
        scheduledDate: ext.nextInspection || ext.nextMaintenance,
        structured: {
          type: ext.type,
          findings: ext.condition,
          recommendations: ext.status === 'Active' ? 'Continue regular maintenance' : 'Requires attention',
          nextDue: ext.nextInspection || ext.nextMaintenance,
          lastInspection: ext.lastInspection,
        }
      } as any));
    }

    const photos = body.photoIds?.length
      ? await this.prisma.inspectionPhoto.findMany({
          where: { tenantId, id: { in: body.photoIds } },
        })
      : [];

    const pdfUrl = await this.reports.buildReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      visitDate: body.visitDate,
      technician: body.technician,
      jobs,
      photos,
    });

    const report = await this.prisma.serviceReport.create({
      data: {
        tenantId,
        visitDate: new Date(body.visitDate),
        technician: body.technician ?? null,
        jobIds: jobs.map((j: { id: string }) => j.id),
        pdfUrl,
      },
    });

    return { report, pdfUrl };
  }

  @Get('extinguisher/:id/history')
  async getExtinguisherHistory(
    @CurrentUser() user: CurrentUserData,
    @Param('id') extinguisherId: string,
  ) {
    const tenantId = user.tenantId;

    // Get extinguisher with all related data
    const extinguisher = await this.prisma.extinguisher.findFirst({
      where: { id: extinguisherId, tenantId },
      include: {
        inspections: {
          orderBy: { serviceDate: 'desc' },
        },
        site: true,
      },
    });

    if (!extinguisher) {
      throw new Error('Extinguisher not found');
    }

    // Get photos related to this extinguisher
    const photos = await this.prisma.inspectionPhoto.findMany({
      where: { extinguisherId, tenantId },
      orderBy: { createdAt: 'desc' },
    });

    // Get parts usage history
    const partsUsage = await this.prisma.partUsage.findMany({
      where: { extinguisherId, tenantId },
      include: {
        inventoryItem: true,
      },
      orderBy: { usedAt: 'desc' },
    });

    return {
      extinguisher,
      inspections: extinguisher.inspections,
      photos,
      partsUsage,
      totalInspections: extinguisher.inspections.length,
      totalPhotos: photos.length,
      totalPartsReplaced: partsUsage.length,
    };
  }

  @Post('extinguisher/:id/history-pdf')
  async generateExtinguisherHistoryPDF(
    @CurrentUser() user: CurrentUserData,
    @Param('id') extinguisherId: string,
  ) {
    const tenantId = user.tenantId;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    // Get full history
    const history = await this.getExtinguisherHistory(user, extinguisherId);

    // Generate comprehensive PDF
    const pdfUrl = await this.reports.buildExtinguisherHistoryReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      extinguisher: history.extinguisher,
      inspections: history.inspections,
      photos: history.photos,
      partsUsage: history.partsUsage,
    });

    return { pdfUrl };
  }

  @Post('extinguisher/:id/certificate')
  async generateInspectionCertificate(
    @CurrentUser() user: CurrentUserData,
    @Param('id') extinguisherId: string,
    @Body() body: { inspectionId?: string },
  ) {
    const tenantId = user.tenantId;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    const extinguisher = await this.prisma.extinguisher.findFirst({
      where: { id: extinguisherId, tenantId },
      include: {
        site: true,
      },
    });

    if (!extinguisher) {
      throw new Error('Extinguisher not found');
    }

    // Get specific inspection or latest one
    const inspection = body.inspectionId
      ? await this.prisma.inspection.findFirst({
          where: { id: body.inspectionId, extinguisherId, tenantId },
        })
      : await this.prisma.inspection.findFirst({
          where: { extinguisherId, tenantId },
          orderBy: { serviceDate: 'desc' },
        });

    if (!inspection) {
      throw new Error('No inspection found');
    }

    const pdfUrl = await this.reports.buildComplianceCertificate({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      extinguisher,
      inspection,
    });

    return { pdfUrl };
  }

  @Get('extinguisher/:id/export-excel')
  async exportExtinguisherHistoryExcel(
    @CurrentUser() user: CurrentUserData,
    @Param('id') extinguisherId: string,
    @Res() res: Response,
  ) {
    // Get full history
    const history = await this.getExtinguisherHistory(user, extinguisherId);

    // Generate Excel file
    const excelBuffer = await this.reports.buildExtinguisherHistoryExcel({
      extinguisher: history.extinguisher,
      inspections: history.inspections,
      partsUsage: history.partsUsage,
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=extinguisher-${extinguisherId}-history.xlsx`);
    res.send(excelBuffer);
  }
}

