import { Body, Controller, Post, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
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

    console.log('📋 Certificate generation - Tenant data:', {
      id: tenant.id,
      companyName: tenant.companyName,
      logoUrl: tenant.logoUrl,
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
    let inspection = body.inspectionId
      ? await this.prisma.inspection.findFirst({
          where: { id: body.inspectionId, extinguisherId, tenantId },
        })
      : await this.prisma.inspection.findFirst({
          where: { extinguisherId, tenantId },
          orderBy: { serviceDate: 'desc' },
        });

    // If no formal inspection record exists, create a synthetic one from extinguisher data
    if (!inspection) {
      // Check if the extinguisher has been serviced (has lastInspection or lastMaintenance)
      if (!extinguisher.lastInspection && !extinguisher.lastMaintenance) {
        throw new Error('No service history found for this extinguisher. Please complete at least one service or inspection before generating a certificate.');
      }

      // Create synthetic inspection record from extinguisher's current state
      inspection = {
        id: 'synthetic',
        tenantId,
        extinguisherId,
        serviceDate: extinguisher.lastInspection || extinguisher.lastMaintenance || new Date(),
        serviceType: extinguisher.serviceType || 'Service',
        technician: extinguisher.inspector || 'Technician',
        condition: extinguisher.condition,
        notes: extinguisher.notes || null,
        partsReplaced: null,
        nextServiceDate: extinguisher.nextInspection || extinguisher.nextMaintenance || null,
        createdAt: new Date(),
      } as any;
    }

    // Get the most recent photo for the extinguisher
    const recentPhoto = await this.prisma.inspectionPhoto.findFirst({
      where: { extinguisherId, tenantId },
      orderBy: { createdAt: 'desc' },
      select: { url: true },
    });

    const pdfUrl = await this.reports.buildComplianceCertificate({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      extinguisher,
      inspection,
      photoUrl: recentPhoto?.url,
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

  // User Management Report
  @Get('users/report')
  async generateUserReport(@CurrentUser() user: CurrentUserData) {
    const tenantId = user.tenantId;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    const users = await this.prisma.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    // Get activity metrics for each user
    const usersWithActivity = await Promise.all(
      users.map(async (u) => {
        console.log(`Checking activity for user: ${u.name} (${u.email})`);

        // Count inspections performed (matched by technician name or email, case-insensitive)
        const inspectionsCount = await this.prisma.inspection.count({
          where: {
            tenantId,
            OR: [
              { technician: { equals: u.name, mode: 'insensitive' } },
              { technician: { equals: u.email, mode: 'insensitive' } },
            ],
          },
        });

        console.log(`  - Inspections: ${inspectionsCount}`);

        // Count service jobs (matched by technician name, email, or createdByUserId)
        const serviceJobsCount = await this.prisma.serviceJob.count({
          where: {
            tenantId,
            OR: [
              { technician: { equals: u.name, mode: 'insensitive' } },
              { technician: { equals: u.email, mode: 'insensitive' } },
              { createdByUserId: u.id },
            ],
          },
        });

        // Count photos uploaded
        const photosCount = await this.prisma.inspectionPhoto.count({
          where: {
            tenantId,
            OR: [
              { uploadedBy: { equals: u.name, mode: 'insensitive' } },
              { uploadedBy: { equals: u.email, mode: 'insensitive' } },
            ],
          },
        });

        // Get last 30 days activity
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentInspectionsCount = await this.prisma.inspection.count({
          where: {
            tenantId,
            OR: [
              { technician: { equals: u.name, mode: 'insensitive' } },
              { technician: { equals: u.email, mode: 'insensitive' } },
            ],
            serviceDate: { gte: thirtyDaysAgo },
          },
        });

        // Count repairs (inspections with parts replaced)
        const repairsCount = await this.prisma.inspection.count({
          where: {
            tenantId,
            OR: [
              { technician: { equals: u.name, mode: 'insensitive' } },
              { technician: { equals: u.email, mode: 'insensitive' } },
            ],
            partsReplaced: { not: null },
          },
        });

        console.log(`  - Repairs: ${repairsCount}`);

        // Get last activity date
        const lastInspection = await this.prisma.inspection.findFirst({
          where: {
            tenantId,
            OR: [
              { technician: { equals: u.name, mode: 'insensitive' } },
              { technician: { equals: u.email, mode: 'insensitive' } },
            ],
          },
          orderBy: { serviceDate: 'desc' },
          select: { serviceDate: true },
        });

        return {
          ...u,
          activity: {
            totalInspections: inspectionsCount,
            totalServiceJobs: serviceJobsCount,
            totalRepairs: repairsCount,
            totalPhotos: photosCount,
            recentInspections: recentInspectionsCount,
            lastActivity: lastInspection?.serviceDate || null,
          },
        };
      })
    );

    const pdfUrl = await this.reports.buildUserReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      users: usersWithActivity,
    });

    return { pdfUrl };
  }

  // Extinguishers by Type Report
  @Get('extinguishers/by-type')
  async generateExtinguishersByTypeReport(
    @CurrentUser() user: CurrentUserData,
    @Query('type') type?: string,
    @Query('building') building?: string,
    @Query('status') status?: string,
  ) {
    const tenantId = user.tenantId;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    // Build where clause based on filters
    const whereClause: any = { tenantId };
    if (type && type !== 'all') {
      whereClause.type = type;
    }
    if (building && building !== 'all') {
      whereClause.building = building;
    }
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const extinguishers = await this.prisma.extinguisher.findMany({
      where: whereClause,
      include: {
        site: true,
      },
      orderBy: { type: 'asc' },
    });

    // Group by type for summary
    const groupedByType = extinguishers.reduce((acc, ext) => {
      if (!acc[ext.type]) {
        acc[ext.type] = [];
      }
      acc[ext.type].push(ext);
      return acc;
    }, {} as Record<string, any[]>);

    const pdfUrl = await this.reports.buildExtinguishersByTypeReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      extinguishers,
      groupedByType,
      filterType: type || 'all',
      filterBuilding: building || 'all',
      filterStatus: status || 'all',
    });

    return { pdfUrl };
  }
}

