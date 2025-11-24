import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
        scheduledDate: ext.nextInspection || ext.nextMaintenance,
        structured: {
          type: ext.type,
          findings: ext.condition,
          recommendations: ext.status === 'Active' ? 'Continue regular maintenance' : 'Requires attention',
          nextDue: ext.nextInspection || ext.nextMaintenance,
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
}

