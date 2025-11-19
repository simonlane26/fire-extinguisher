import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // ===== INVENTORY ITEMS =====

  async findAllItems(tenantId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { usages: true }
        }
      },
      orderBy: { partName: 'asc' }
    });
  }

  async findOneItem(tenantId: string, id: string) {
    return this.prisma.inventoryItem.findFirst({
      where: { id, tenantId },
      include: {
        usages: {
          orderBy: { usedAt: 'desc' },
          take: 10 // Last 10 usages
        }
      }
    });
  }

  async createItem(tenantId: string, data: any) {
    return this.prisma.inventoryItem.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async updateItem(tenantId: string, id: string, data: any) {
    // Verify ownership
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, tenantId },
    });
    if (!item) throw new Error('Item not found');

    return this.prisma.inventoryItem.update({
      where: { id },
      data,
    });
  }

  async deleteItem(tenantId: string, id: string) {
    // Verify ownership
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, tenantId },
    });
    if (!item) throw new Error('Item not found');

    return this.prisma.inventoryItem.delete({
      where: { id },
    });
  }

  // Get low stock items
  async getLowStockItems(tenantId: string) {
    // Fetch all items and filter in memory since Prisma doesn't support column comparison
    const items = await this.prisma.inventoryItem.findMany({
      where: { tenantId },
      orderBy: { quantityInStock: 'asc' }
    });

    return items.filter(item => item.quantityInStock <= item.minStockLevel);
  }

  // ===== PART USAGE =====

  async recordUsage(tenantId: string, data: {
    inventoryItemId: string;
    extinguisherId?: string;
    inspectionId?: string;
    quantityUsed: number;
    usedBy?: string;
    notes?: string;
  }) {
    // Verify item exists and belongs to tenant
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: data.inventoryItemId, tenantId }
    });
    if (!item) throw new Error('Inventory item not found');

    // Check stock availability
    if (item.quantityInStock < data.quantityUsed) {
      throw new Error(`Insufficient stock. Available: ${item.quantityInStock}, Requested: ${data.quantityUsed}`);
    }

    // Create usage record and update stock in transaction
    return this.prisma.$transaction(async (tx) => {
      // Record usage
      const usage = await tx.partUsage.create({
        data: {
          ...data,
          tenantId,
        },
      });

      // Decrement stock
      await tx.inventoryItem.update({
        where: { id: data.inventoryItemId },
        data: {
          quantityInStock: {
            decrement: data.quantityUsed
          }
        }
      });

      return usage;
    });
  }

  async findAllUsages(tenantId: string, filters?: {
    inventoryItemId?: string;
    extinguisherId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { tenantId };

    if (filters?.inventoryItemId) {
      where.inventoryItemId = filters.inventoryItemId;
    }

    if (filters?.extinguisherId) {
      where.extinguisherId = filters.extinguisherId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.usedAt = {};
      if (filters.startDate) where.usedAt.gte = filters.startDate;
      if (filters.endDate) where.usedAt.lte = filters.endDate;
    }

    return this.prisma.partUsage.findMany({
      where,
      include: {
        inventoryItem: {
          select: {
            partNumber: true,
            partName: true,
            category: true
          }
        }
      },
      orderBy: { usedAt: 'desc' }
    });
  }

  // Get usage statistics
  async getUsageStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: any = { tenantId };

    if (startDate || endDate) {
      where.usedAt = {};
      if (startDate) where.usedAt.gte = startDate;
      if (endDate) where.usedAt.lte = endDate;
    }

    const usages = await this.prisma.partUsage.findMany({
      where,
      include: {
        inventoryItem: {
          select: {
            partNumber: true,
            partName: true,
            category: true,
            unitPrice: true
          }
        }
      }
    });

    // Calculate total cost
    const totalCost = usages.reduce((sum, usage) => {
      const cost = (usage.inventoryItem.unitPrice || 0) * usage.quantityUsed;
      return sum + cost;
    }, 0);

    // Group by category
    const byCategory: Record<string, number> = {};
    usages.forEach(usage => {
      const cat = usage.inventoryItem.category || 'Uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + usage.quantityUsed;
    });

    return {
      totalUsages: usages.length,
      totalQuantity: usages.reduce((sum, u) => sum + u.quantityUsed, 0),
      totalCost,
      byCategory
    };
  }
}
