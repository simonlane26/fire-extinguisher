import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlatformAdminGuard } from './platform-admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('platform-admin')
@UseGuards(JwtAuthGuard, PlatformAdminGuard)
export class PlatformAdminController {
  constructor(private readonly prisma: PrismaService) {}

  /** List all tenants with their feature flags and user/extinguisher counts */
  @Get('tenants')
  async getTenants() {
    return this.prisma.tenant.findMany({
      select: {
        id: true,
        companyName: true,
        subdomain: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        stockManagementEnabled: true,
        fireAlarmEnabled: true,
        patTestingEnabled: true,
        emergencyLightingEnabled: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            extinguishers: true,
            sites: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Update feature flags for a tenant */
  @Patch('tenants/:id/features')
  async updateFeatures(
    @Param('id') id: string,
    @Body() body: {
      stockManagementEnabled?: boolean;
      fireAlarmEnabled?: boolean;
      patTestingEnabled?: boolean;
      emergencyLightingEnabled?: boolean;
    },
  ) {
    return this.prisma.tenant.update({
      where: { id },
      data: {
        ...(body.stockManagementEnabled !== undefined && { stockManagementEnabled: body.stockManagementEnabled }),
        ...(body.fireAlarmEnabled !== undefined && { fireAlarmEnabled: body.fireAlarmEnabled }),
        ...(body.patTestingEnabled !== undefined && { patTestingEnabled: body.patTestingEnabled }),
        ...(body.emergencyLightingEnabled !== undefined && { emergencyLightingEnabled: body.emergencyLightingEnabled }),
      },
      select: {
        id: true,
        companyName: true,
        stockManagementEnabled: true,
        fireAlarmEnabled: true,
        patTestingEnabled: true,
        emergencyLightingEnabled: true,
      },
    });
  }
}
