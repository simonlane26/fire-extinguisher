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

    const jobs = await this.prisma.serviceJob.findMany({
      where: { tenantId, id: { in: body.jobIds } },
    });

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

    return { report };
  }
}

