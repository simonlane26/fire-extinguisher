// src/extinguishers/extinguishers-public.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ExtinguishersService } from './extinguishers.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('public/extinguishers')
export class ExtinguishersPublicController {
  constructor(private readonly service: ExtinguishersService) {}

  /**
   * Public endpoint - no authentication required
   * Returns limited, safe-to-share information for QR code scanning
   */
  @Public()
  @Get(':id/verify')
  async verifyExtinguisher(@Param('id') id: string) {
    const extinguisher = await this.service.findOneById(id);

    if (!extinguisher) {
      throw new NotFoundException('Extinguisher not found');
    }

    const now = new Date();
    // Use lastMaintenance for annual inspection/service (not lastInspection which is 5-year extended)
    const lastService = extinguisher.lastMaintenance ? new Date(extinguisher.lastMaintenance) : null;

    // Calculate next service as 1 year from last service (annual check)
    const nextService = lastService ? new Date(lastService) : null;
    if (nextService) {
      nextService.setFullYear(nextService.getFullYear() + 1);
    }

    // Calculate compliance status
    const isOverdue = nextService && nextService < now;
    const daysUntilDue = nextService
      ? Math.ceil((nextService.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;
    const daysSinceService = lastService
      ? Math.floor((now.getTime() - lastService.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Determine status and message
    let status: 'compliant' | 'warning' | 'overdue';
    let statusMessage: string;

    if (isOverdue) {
      status = 'overdue';
      statusMessage = 'Inspection Overdue - Service Required';
    } else if (daysUntilDue !== null && daysUntilDue <= 14) {
      status = 'warning';
      statusMessage = 'Inspection Due Soon';
    } else {
      status = 'compliant';
      statusMessage = 'Compliant & Up to Date';
    }

    // Return only public-safe information
    return {
      id: extinguisher.id,
      location: extinguisher.location,
      building: extinguisher.building,
      floor: extinguisher.floor,
      type: extinguisher.type,
      capacity: extinguisher.capacity,
      status: extinguisher.status,
      condition: extinguisher.condition,
      lastInspection: lastService ? {
        date: lastService.toISOString().split('T')[0],
        daysAgo: daysSinceService,
        formattedDate: this.formatDate(lastService),
      } : null,
      nextInspection: nextService ? {
        date: nextService.toISOString().split('T')[0],
        daysUntil: daysUntilDue,
        formattedDate: this.formatDate(nextService),
      } : null,
      complianceStatus: {
        status,
        message: statusMessage,
        isCompliant: status === 'compliant',
      },
      tenant: {
        companyName: extinguisher.tenant.companyName,
        logoUrl: extinguisher.tenant.logoUrl,
      },
      certificateNumber: `${extinguisher.id}-${new Date().getFullYear()}`,
      verifiedAt: new Date().toISOString(),
    };
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
