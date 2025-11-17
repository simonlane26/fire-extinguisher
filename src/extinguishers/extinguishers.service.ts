import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateExtinguisherDto } from './dto/create-extinguisher.dto';
import { UpdateExtinguisherDto } from './dto/update-extinguisher.dto';

@Injectable()
export class ExtinguishersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  create(tenantId: string, dto: CreateExtinguisherDto) {
    const data: any = { ...dto, tenantId };

    // Convert date strings to DateTime objects
    if (data.installDate) data.installDate = new Date(data.installDate);
    if (data.expiryDate) data.expiryDate = new Date(data.expiryDate);
    if (data.lastInspection) data.lastInspection = new Date(data.lastInspection);
    if (data.nextInspection) data.nextInspection = new Date(data.nextInspection);
    if (data.lastMaintenance) data.lastMaintenance = new Date(data.lastMaintenance);
    if (data.nextMaintenance) data.nextMaintenance = new Date(data.nextMaintenance);

    return this.prisma.extinguisher.create({ data });
  }

  findAll(tenantId: string) {
    return this.prisma.extinguisher.findMany({
      where: { tenantId },
      include: {
        site: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const extinguisher = await this.prisma.extinguisher.findFirst({
      where: { id, tenantId },
    });

    if (!extinguisher) {
      throw new NotFoundException('Extinguisher not found');
    }

    return extinguisher;
  }

  /**
   * Public method to find extinguisher by ID without tenant filtering
   * Used for public QR code verification
   */
  async findOneById(id: string) {
    const extinguisher = await this.prisma.extinguisher.findUnique({
      where: { id },
      include: {
        tenant: {
          select: {
            companyName: true,
            logoUrl: true,
          },
        },
      },
    });

    return extinguisher;
  }

  async update(tenantId: string, id: string, dto: UpdateExtinguisherDto) {
    const existing = await this.findOne(tenantId, id); // Verify ownership

    // Convert date strings to DateTime objects
    const updateData: any = { ...dto };
    if (updateData.installDate) updateData.installDate = new Date(updateData.installDate);
    if (updateData.expiryDate) updateData.expiryDate = new Date(updateData.expiryDate);
    if (updateData.lastInspection) updateData.lastInspection = new Date(updateData.lastInspection);
    if (updateData.nextInspection) updateData.nextInspection = new Date(updateData.nextInspection);
    if (updateData.lastMaintenance) updateData.lastMaintenance = new Date(updateData.lastMaintenance);
    if (updateData.nextMaintenance) updateData.nextMaintenance = new Date(updateData.nextMaintenance);

    const updated = await this.prisma.extinguisher.update({ where: { id }, data: updateData });

    // Send notifications for important status changes
    await this.sendUpdateNotifications(existing, updated, tenantId);

    return updated;
  }

  /**
   * Send push notifications when extinguisher status changes
   */
  private async sendUpdateNotifications(oldExt: any, newExt: any, tenantId: string) {
    try {
      // Get all users for this tenant
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { users: true }
      });

      if (!tenant || tenant.users.length === 0) return;

      // Notify if condition changed to critical states
      if (oldExt.condition !== newExt.condition) {
        if (newExt.condition === 'Needs Attention') {
          for (const user of tenant.users) {
            await this.notificationsService.sendToUser(user.id, {
              title: '⚠️ Extinguisher Needs Attention',
              body: `${newExt.building} - ${newExt.location} requires attention`,
              icon: '/icon-192x192.png',
              badge: '/badge-72x72.png',
              data: {
                type: 'condition_change',
                extinguisherId: newExt.id,
                url: `/extinguishers/${newExt.id}`
              },
              tag: `condition-${newExt.id}`,
              requireInteraction: true,
            });
          }
        } else if (newExt.condition === 'Out of Service') {
          for (const user of tenant.users) {
            await this.notificationsService.sendToUser(user.id, {
              title: '❌ Extinguisher Out of Service',
              body: `${newExt.building} - ${newExt.location} is out of service`,
              icon: '/icon-192x192.png',
              badge: '/badge-72x72.png',
              data: {
                type: 'out_of_service',
                extinguisherId: newExt.id,
                url: `/extinguishers/${newExt.id}`
              },
              tag: `out-of-service-${newExt.id}`,
              requireInteraction: true,
            });
          }
        }
      }

      // Notify if status changed to Inactive
      if (oldExt.status !== newExt.status && newExt.status === 'Inactive') {
        for (const user of tenant.users) {
          await this.notificationsService.sendToUser(user.id, {
            title: 'ℹ️ Extinguisher Deactivated',
            body: `${newExt.building} - ${newExt.location} has been marked as inactive`,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            data: {
              type: 'status_change',
              extinguisherId: newExt.id,
              url: `/extinguishers/${newExt.id}`
            },
            tag: `status-${newExt.id}`,
            requireInteraction: false,
          });
        }
      }

      // Notify if inspection or maintenance was completed (dates changed to future)
      const inspectionCompleted = oldExt.lastInspection && newExt.lastInspection &&
        new Date(newExt.lastInspection) > new Date(oldExt.lastInspection);

      if (inspectionCompleted) {
        for (const user of tenant.users) {
          await this.notificationsService.sendToUser(user.id, {
            title: '✅ Inspection Completed',
            body: `${newExt.building} - ${newExt.location} inspection completed`,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            data: {
              type: 'inspection_completed',
              extinguisherId: newExt.id,
              url: `/extinguishers/${newExt.id}`
            },
            tag: `inspection-complete-${newExt.id}`,
            requireInteraction: false,
          });
        }
      }
    } catch (error) {
      // Don't fail the update if notification fails
      console.error('Failed to send update notification:', error);
    }
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id); // Verify ownership
    return this.prisma.extinguisher.delete({ where: { id } });
  }

  async exportToCsv(tenantId: string): Promise<string> {
    const extinguishers = await this.findAll(tenantId);

    if (extinguishers.length === 0) {
      throw new BadRequestException('No extinguishers to export');
    }

    // CSV header
    const headers = ['Location', 'Building', 'Type', 'Serial Number', 'Last Inspection Date', 'Next Inspection Date', 'Status', 'Notes'];

    // CSV rows
    const rows = extinguishers.map(ext => [
      ext.location || '',
      ext.building || '',
      ext.type || '',
      ext.serialNumber || '',
      ext.lastInspection ? new Date(ext.lastInspection).toISOString().split('T')[0] : '',
      ext.nextInspection ? new Date(ext.nextInspection).toISOString().split('T')[0] : '',
      ext.status || '',
      (ext.notes || '').replace(/"/g, '""'), // Escape quotes in notes
    ]);

    // Build CSV
    const csvLines = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ];

    return csvLines.join('\n');
  }

  async importFromCsv(tenantId: string, csvContent: string) {
    const lines = csvContent.trim().split('\n');

    if (lines.length < 2) {
      throw new BadRequestException('CSV file is empty or invalid');
    }

    // Skip header row
    const dataLines = lines.slice(1);
    const imported = [];
    const errors = [];

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i].trim();
        if (!line) continue;

        // Parse CSV line (handle quoted fields)
        const fields = this.parseCSVLine(line);

        if (fields.length < 3) {
          errors.push({ line: i + 2, error: 'Insufficient fields' });
          continue;
        }

        const [location, building, type, serialNumber, lastInspection, nextInspection, status, notes] = fields;

        // Validate required fields
        if (!location || !building || !type) {
          errors.push({ line: i + 2, error: 'Missing required fields (location, building, type)' });
          continue;
        }

        const extinguisher = await this.prisma.extinguisher.create({
          data: {
            tenantId,
            location,
            building,
            type,
            serialNumber: serialNumber || null,
            lastInspection: lastInspection ? new Date(lastInspection) : null,
            nextInspection: nextInspection ? new Date(nextInspection) : null,
            status: status || 'active',
            notes: notes || null,
          },
        });

        imported.push(extinguisher);
      } catch (error) {
        errors.push({ line: i + 2, error: error.message });
      }
    }

    return {
      success: true,
      imported: imported.length,
      errors: errors.length,
      details: errors.length > 0 ? errors : undefined,
    };
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());

    return result;
  }
}

