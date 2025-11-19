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
    const nextInspection = extinguisher.nextInspection ? new Date(extinguisher.nextInspection) : null;
    const lastInspection = extinguisher.lastInspection ? new Date(extinguisher.lastInspection) : null;

    // Calculate compliance status
    const isOverdue = nextInspection && nextInspection < now;
    const daysUntilDue = nextInspection
      ? Math.ceil((nextInspection.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;
    const daysSinceInspection = lastInspection
      ? Math.floor((now.getTime() - lastInspection.getTime()) / (1000 * 60 * 60 * 24))
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
      lastInspection: lastInspection ? {
        date: lastInspection.toISOString().split('T')[0],
        daysAgo: daysSinceInspection,
        formattedDate: this.formatDate(lastInspection),
      } : null,
      nextInspection: nextInspection ? {
        date: nextInspection.toISOString().split('T')[0],
        daysUntil: daysUntilDue,
        formattedDate: this.formatDate(nextInspection),
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
