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
    @Res() res: Response,
  ) {
    const tenantId = user.tenantId;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    const history = await this.getExtinguisherHistory(user, extinguisherId);

    const pdfBuffer = await this.reports.buildExtinguisherHistoryReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      extinguisher: history.extinguisher,
      inspections: history.inspections,
      photos: history.photos,
      partsUsage: history.partsUsage,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="extinguisher-${extinguisherId}-history.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  @Post('extinguisher/:id/certificate')
  async generateInspectionCertificate(
    @CurrentUser() user: CurrentUserData,
    @Param('id') extinguisherId: string,
    @Body() body: { inspectionId?: string },
    @Res() res: Response,
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

    const pdfBuffer = await this.reports.buildComplianceCertificate({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      extinguisher,
      inspection,
      photoUrl: recentPhoto?.url,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="extinguisher-${extinguisherId}-certificate.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
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

  // Get all users for dropdown
  @Get('users')
  async getUsers(@CurrentUser() user: CurrentUserData) {
    const tenantId = user.tenantId;

    const users = await this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });

    return users;
  }

  // User Management Report
  @Get('users/report')
  async generateUserReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Query('userId') userId?: string,
  ) {
    const tenantId = user.tenantId;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    // Build where clause for users
    const userWhereClause: any = { tenantId };
    if (userId && userId !== 'all') {
      userWhereClause.id = userId;
    }

    const users = await this.prisma.user.findMany({
      where: userWhereClause,
      orderBy: { createdAt: 'desc' },
    });

    // First, let's see what technician values exist in the database
    const allInspections = await this.prisma.inspection.findMany({
      where: { tenantId },
      select: { technician: true, partsReplaced: true },
    });

    const uniqueTechnicians = [...new Set(allInspections.map(i => i.technician))].filter(Boolean);
    const totalInspections = allInspections.length;
    const inspectionsWithRepairs = allInspections.filter(i => i.partsReplaced).length;

    console.log('\n=== DATABASE ANALYSIS ===');
    console.log(`Total inspections in database: ${totalInspections}`);
    console.log(`Inspections with repairs (partsReplaced not null): ${inspectionsWithRepairs}`);
    console.log(`All unique technician names in database:`, uniqueTechnicians);
    console.log('\n=== USER NAMES ===');
    console.log('User names in system:', users.map(u => `"${u.name}" (${u.email})`));

    // Get activity metrics for each user
    const usersWithActivity = await Promise.all(
      users.map(async (u) => {
        console.log(`\nChecking activity for user: "${u.name}" (${u.email})`);

        // Try multiple matching strategies to find user's work
        // 1. Match by name (full or partial)
        // 2. Match by email
        // 3. Match by user ID if available
        const nameWords = u.name.split(' ');
        const lastName = nameWords.length > 0 ? nameWords[nameWords.length - 1] : u.name;
        const firstInitial = u.name.charAt(0);

        // Count inspections performed (try multiple matching strategies)
        const inspectionsCount = await this.prisma.inspection.count({
          where: {
            tenantId,
            OR: [
              // Full name match
              { technician: { equals: u.name, mode: 'insensitive' } },
              // Email match
              { technician: { equals: u.email, mode: 'insensitive' } },
              // "FirstInitial LastName" pattern (e.g., "S lane" for "Simon Charles Lane")
              { technician: { contains: `${firstInitial} ${lastName}`, mode: 'insensitive' } },
              // Just last name
              { technician: { contains: lastName, mode: 'insensitive' } },
            ],
          },
        });

        console.log(`  - Matching patterns tried: Full name="${u.name}", Email="${u.email}", Pattern="${firstInitial} ${lastName}", Last name="${lastName}"`);
        console.log(`  - Inspections found: ${inspectionsCount}`);

        // Count service jobs
        const serviceJobsCount = await this.prisma.serviceJob.count({
          where: {
            tenantId,
            OR: [
              { technician: { equals: u.name, mode: 'insensitive' } },
              { technician: { equals: u.email, mode: 'insensitive' } },
              { technician: { contains: `${firstInitial} ${lastName}`, mode: 'insensitive' } },
              { technician: { contains: lastName, mode: 'insensitive' } },
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
              { uploadedBy: { contains: `${firstInitial} ${lastName}`, mode: 'insensitive' } },
              { uploadedBy: { contains: lastName, mode: 'insensitive' } },
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
              { technician: { contains: `${firstInitial} ${lastName}`, mode: 'insensitive' } },
              { technician: { contains: lastName, mode: 'insensitive' } },
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
              { technician: { contains: `${firstInitial} ${lastName}`, mode: 'insensitive' } },
              { technician: { contains: lastName, mode: 'insensitive' } },
            ],
            partsReplaced: { not: null },
          },
        });

        console.log(`  - Repairs found: ${repairsCount}`);

        // Get last activity date
        const lastInspection = await this.prisma.inspection.findFirst({
          where: {
            tenantId,
            OR: [
              { technician: { equals: u.name, mode: 'insensitive' } },
              { technician: { equals: u.email, mode: 'insensitive' } },
              { technician: { contains: `${firstInitial} ${lastName}`, mode: 'insensitive' } },
              { technician: { contains: lastName, mode: 'insensitive' } },
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

    const pdfBuffer = await this.reports.buildUserReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      users: usersWithActivity,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="users-report.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  // Extinguishers by Site Report
  @Get('extinguishers/by-site')
  async generateExtinguishersBySiteReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Query('siteId') siteId?: string,
    @Query('status') status?: string,
  ) {
    const tenantId = user.tenantId;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    const whereClause: any = { tenantId };
    if (siteId && siteId !== 'all') {
      whereClause.siteId = siteId;
    }
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const extinguishers = await this.prisma.extinguisher.findMany({
      where: whereClause,
      include: { site: true },
      orderBy: [{ site: { name: 'asc' } }, { location: 'asc' }],
    });

    const groupedBySite = extinguishers.reduce((acc, ext) => {
      const key = ext.site?.name || 'No Site Assigned';
      if (!acc[key]) acc[key] = [];
      acc[key].push(ext);
      return acc;
    }, {} as Record<string, any[]>);

    const pdfBuffer = await this.reports.buildExtinguishersBySiteReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      extinguishers,
      groupedBySite,
      filterSiteId: siteId || 'all',
      filterStatus: status || 'all',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="extinguishers-by-site-report.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  // Fire Alarm Logbook Report
  @Get('fire-alarm/logbook')
  async generateFireAlarmLogbookReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Query('systemId') systemId?: string,
    @Query('days') daysStr?: string,
  ) {
    const tenantId = user.tenantId;
    const days = daysStr ? parseInt(daysStr, 10) : 365;

    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });

    const systemWhere: any = { tenantId };
    if (systemId && systemId !== 'all') systemWhere.id = systemId;

    const cutoff = days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;

    const systems = await this.prisma.fireAlarmSystem.findMany({
      where: systemWhere,
      include: {
        site: { select: { name: true } },
        logEntries: {
          where: cutoff ? { conductedAt: { gte: cutoff } } : {},
          orderBy: { conductedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const dateLabel = days === 0
      ? 'All time'
      : days <= 31 ? `Last ${days} days`
      : days <= 92 ? 'Last 3 months'
      : days <= 183 ? 'Last 6 months'
      : 'Last 12 months';

    const pdfBuffer = await this.reports.buildFireAlarmLogbookReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      systems,
      dateLabel,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="fire-alarm-logbook-${new Date().toISOString().slice(0, 10)}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  // Fire Alarm Weekly Test Log
  @Get('fire-alarm/weekly-tests')
  async generateFireAlarmWeeklyTestReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Query('systemId') systemId?: string,
    @Query('days') daysStr?: string,
  ) {
    const tenantId = user.tenantId;
    const days = daysStr ? parseInt(daysStr, 10) : 365;
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    const systemWhere: any = { tenantId };
    if (systemId && systemId !== 'all') systemWhere.id = systemId;
    const cutoff = days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;

    const systems = await this.prisma.fireAlarmSystem.findMany({
      where: systemWhere,
      include: {
        site: { select: { name: true } },
        logEntries: {
          where: { entryType: 'weekly', ...(cutoff ? { conductedAt: { gte: cutoff } } : {}) },
          orderBy: { conductedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const dateLabel = days === 0 ? 'All time' : days <= 31 ? `Last ${days} days` : days <= 92 ? 'Last 3 months' : days <= 183 ? 'Last 6 months' : 'Last 12 months';
    const pdfBuffer = await this.reports.buildFireAlarmWeeklyTestReport({ tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined }, systems: systems as any, dateLabel });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="fire-alarm-weekly-tests-${new Date().toISOString().slice(0, 10)}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  // Fire Alarm Fault History Report
  @Get('fire-alarm/fault-history')
  async generateFireAlarmFaultHistoryReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Query('systemId') systemId?: string,
    @Query('days') daysStr?: string,
  ) {
    const tenantId = user.tenantId;
    const days = daysStr ? parseInt(daysStr, 10) : 365;
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    const systemWhere: any = { tenantId };
    if (systemId && systemId !== 'all') systemWhere.id = systemId;
    const cutoff = days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;

    const systems = await this.prisma.fireAlarmSystem.findMany({
      where: systemWhere,
      include: {
        site: { select: { name: true } },
        logEntries: {
          where: { entryType: 'fault', ...(cutoff ? { conductedAt: { gte: cutoff } } : {}) },
          orderBy: { conductedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const dateLabel = days === 0 ? 'All time' : days <= 31 ? `Last ${days} days` : days <= 92 ? 'Last 3 months' : days <= 183 ? 'Last 6 months' : 'Last 12 months';
    const pdfBuffer = await this.reports.buildFireAlarmFaultHistoryReport({ tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined }, systems: systems as any, dateLabel });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="fire-alarm-fault-history-${new Date().toISOString().slice(0, 10)}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  // Fire Alarm Engineer Maintenance Report
  @Get('fire-alarm/engineer-visits')
  async generateFireAlarmEngineerReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Query('systemId') systemId?: string,
    @Query('days') daysStr?: string,
  ) {
    const tenantId = user.tenantId;
    const days = daysStr ? parseInt(daysStr, 10) : 365;
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    const systemWhere: any = { tenantId };
    if (systemId && systemId !== 'all') systemWhere.id = systemId;
    const cutoff = days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;

    const systems = await this.prisma.fireAlarmSystem.findMany({
      where: systemWhere,
      include: {
        site: { select: { name: true } },
        logEntries: {
          where: { entryType: 'engineer_visit', ...(cutoff ? { conductedAt: { gte: cutoff } } : {}) },
          orderBy: { conductedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const dateLabel = days === 0 ? 'All time' : days <= 31 ? `Last ${days} days` : days <= 92 ? 'Last 3 months' : days <= 183 ? 'Last 6 months' : 'Last 12 months';
    const pdfBuffer = await this.reports.buildFireAlarmEngineerReport({ tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined }, systems: systems as any, dateLabel });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="fire-alarm-engineer-visits-${new Date().toISOString().slice(0, 10)}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  // Extinguishers by Type Report
  @Get('extinguishers/by-type')
  async generateExtinguishersByTypeReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
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

    const pdfBuffer = await this.reports.buildExtinguishersByTypeReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      extinguishers,
      groupedByType,
      filterType: type || 'all',
      filterBuilding: building || 'all',
      filterStatus: status || 'all',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="extinguishers-by-type-report.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  // PAT Testing Report
  @Get('pat-testing')
  async generatePATTestReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Query('siteId') siteId?: string,
    @Query('days') daysStr?: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (!tenant) throw new Error('Tenant not found');

    const days = daysStr ? parseInt(daysStr, 10) : 365;
    const cutoff = days > 0 ? new Date(Date.now() - days * 86_400_000) : undefined;

    const appliances = await this.prisma.pATAppliance.findMany({
      where: { tenantId: user.tenantId, ...(siteId && siteId !== 'all' ? { siteId } : {}) },
      include: {
        site: { select: { name: true } },
        tests: {
          where: cutoff ? { testedAt: { gte: cutoff } } : undefined,
          orderBy: { testedAt: 'desc' },
        },
      },
      orderBy: [{ siteId: 'asc' }, { applianceRef: 'asc' }],
    });

    const dateLabel = days === 0 ? 'All time' : days <= 31 ? `Last ${days} days` : days <= 92 ? 'Last 3 months' : days <= 183 ? 'Last 6 months' : 'Last 12 months';
    const pdfBuffer = await this.reports.buildPATTestReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      appliances: appliances as any,
      dateLabel,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="pat-testing-report-${new Date().toISOString().slice(0, 10)}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  // Emergency Lighting Report
  @Get('emergency-lighting')
  async generateEmergencyLightingReport(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Query('siteId') siteId?: string,
    @Query('days') daysStr?: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (!tenant) throw new Error('Tenant not found');

    const days = daysStr ? parseInt(daysStr, 10) : 365;
    const cutoff = days > 0 ? new Date(Date.now() - days * 86_400_000) : undefined;

    const luminaires = await (this.prisma as any).emergencyLuminaire.findMany({
      where: { tenantId: user.tenantId, ...(siteId && siteId !== 'all' ? { siteId } : {}) },
      include: {
        site: { select: { name: true } },
        tests: {
          where: cutoff ? { testedAt: { gte: cutoff } } : undefined,
          orderBy: { testedAt: 'desc' },
        },
      },
      orderBy: [{ siteId: 'asc' }, { luminaireRef: 'asc' }],
    });

    const dateLabel = days === 0 ? 'All time' : days <= 31 ? `Last ${days} days` : days <= 92 ? 'Last 3 months' : days <= 183 ? 'Last 6 months' : 'Last 12 months';
    const pdfBuffer = await this.reports.buildEmergencyLightingReport({
      tenant: { name: tenant.companyName, logoUrl: tenant.logoUrl ?? undefined },
      luminaires: luminaires as any,
      dateLabel,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="emergency-lighting-report-${new Date().toISOString().slice(0, 10)}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }
}

