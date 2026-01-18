// src/quotes/quotes.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto, CreateQuoteLineDto, CreateBulkQuoteDto, BulkQuoteFilterDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createdBy: string, createQuoteDto: CreateQuoteDto) {
    const { extinguisherId, inspectionId, isBulkQuote, validUntil, vatRate, notes, termsConditions, lines } = createQuoteDto;

    // For non-bulk quotes, verify extinguisher exists and belongs to tenant
    if (!isBulkQuote && extinguisherId) {
      const extinguisher = await this.prisma.extinguisher.findFirst({
        where: { id: extinguisherId, tenantId },
      });

      if (!extinguisher) {
        throw new NotFoundException('Extinguisher not found');
      }
    }

    // For bulk quotes with lines, verify all extinguisher IDs in lines exist
    if (isBulkQuote && lines) {
      const extinguisherIds = [...new Set(lines.filter(l => l.extinguisherId).map(l => l.extinguisherId))];
      if (extinguisherIds.length > 0) {
        const extinguishers = await this.prisma.extinguisher.findMany({
          where: { id: { in: extinguisherIds as string[] }, tenantId },
          select: { id: true },
        });
        const foundIds = new Set(extinguishers.map(e => e.id));
        const missingIds = extinguisherIds.filter(id => !foundIds.has(id!));
        if (missingIds.length > 0) {
          throw new NotFoundException(`Extinguishers not found: ${missingIds.join(', ')}`);
        }
      }
    }

    // Generate quote number
    const year = new Date().getFullYear();
    const lastQuote = await this.prisma.quote.findFirst({
      where: {
        tenantId,
        quoteNumber: {
          startsWith: `Q-${year}-`,
        },
      },
      orderBy: { quoteNumber: 'desc' },
    });

    let sequentialNumber = 1;
    if (lastQuote) {
      const lastNumber = parseInt(lastQuote.quoteNumber.split('-')[2]);
      sequentialNumber = lastNumber + 1;
    }

    const quoteNumber = `Q-${year}-${sequentialNumber.toString().padStart(4, '0')}`;

    // Set default valid until date (30 days from now)
    const defaultValidUntil = new Date();
    defaultValidUntil.setDate(defaultValidUntil.getDate() + 30);

    // Calculate totals
    let subtotal = 0;
    const processedLines = (lines || []).map((line, index) => {
      const lineTotal = line.quantity * line.unitPrice;
      subtotal += lineTotal;
      return {
        ...line,
        lineTotal,
        sortOrder: index,
      };
    });

    const vat = vatRate !== undefined ? vatRate : 20;
    const vatAmount = (subtotal * vat) / 100;
    const totalAmount = subtotal + vatAmount;

    // Create quote with lines
    const quote = await this.prisma.quote.create({
      data: {
        tenantId,
        extinguisherId: isBulkQuote ? null : extinguisherId,
        inspectionId: inspectionId || null,
        quoteNumber,
        status: 'draft',
        isBulkQuote: isBulkQuote || false,
        validUntil: validUntil ? new Date(validUntil) : defaultValidUntil,
        subtotal,
        vatRate: vat,
        vatAmount,
        totalAmount,
        notes: notes || null,
        termsConditions: termsConditions || null,
        createdBy,
        lines: {
          create: processedLines,
        },
      },
      include: {
        extinguisher: {
          select: {
            location: true,
            building: true,
            floor: true,
            type: true,
            capacity: true,
          },
        },
        lines: {
          include: {
            extinguisher: {
              select: {
                id: true,
                location: true,
                building: true,
                floor: true,
                type: true,
                capacity: true,
              },
            },
            inventoryItem: {
              select: {
                partNumber: true,
                partName: true,
                category: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return quote;
  }

  async getExtinguishersForBulkQuote(tenantId: string, filters: BulkQuoteFilterDto) {
    const { siteId, building, conditions } = filters;

    // Default conditions if not specified
    const conditionFilter = conditions && conditions.length > 0
      ? conditions
      : ['Out of Service', 'Needs Attention'];

    const where: any = {
      tenantId,
      condition: { in: conditionFilter },
    };

    if (siteId) {
      where.siteId = siteId;
    }

    if (building) {
      where.building = building;
    }

    const extinguishers = await this.prisma.extinguisher.findMany({
      where,
      include: {
        site: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { building: 'asc' },
        { location: 'asc' },
      ],
    });

    return extinguishers;
  }

  async getBulkQuoteFilters(tenantId: string) {
    // Get distinct sites and buildings for extinguishers needing attention
    const extinguishers = await this.prisma.extinguisher.findMany({
      where: {
        tenantId,
        condition: { in: ['Out of Service', 'Needs Attention'] },
      },
      select: {
        siteId: true,
        building: true,
        condition: true,
        site: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const sites = [...new Map(
      extinguishers
        .filter(e => e.site)
        .map(e => [e.site!.id, e.site!])
    ).values()];

    const buildings = [...new Set(extinguishers.map(e => e.building))].sort();

    const conditions = [...new Set(extinguishers.map(e => e.condition))];

    return {
      sites,
      buildings,
      conditions,
      totalCount: extinguishers.length,
    };
  }

  async findAll(tenantId: string, status?: string) {
    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    return this.prisma.quote.findMany({
      where,
      include: {
        extinguisher: {
          select: {
            location: true,
            building: true,
            floor: true,
            type: true,
            capacity: true,
          },
        },
        lines: {
          include: {
            extinguisher: {
              select: {
                id: true,
                location: true,
                building: true,
                floor: true,
                type: true,
                capacity: true,
              },
            },
            inventoryItem: {
              select: {
                partNumber: true,
                partName: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, tenantId },
      include: {
        extinguisher: {
          select: {
            location: true,
            building: true,
            floor: true,
            type: true,
            capacity: true,
            serialNumber: true,
            manufacturer: true,
            model: true,
          },
        },
        lines: {
          include: {
            extinguisher: {
              select: {
                id: true,
                location: true,
                building: true,
                floor: true,
                type: true,
                capacity: true,
              },
            },
            inventoryItem: {
              select: {
                partNumber: true,
                partName: true,
                category: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    return quote;
  }

  async findByExtinguisher(tenantId: string, extinguisherId: string) {
    return this.prisma.quote.findMany({
      where: { tenantId, extinguisherId },
      include: {
        lines: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(tenantId: string, id: string, updateQuoteDto: UpdateQuoteDto) {
    const quote = await this.findOne(tenantId, id);

    // Can only edit draft quotes
    if (quote.status !== 'draft' && updateQuoteDto.lines) {
      throw new BadRequestException('Cannot modify lines of a non-draft quote');
    }

    const { lines, status, ...otherUpdates } = updateQuoteDto;

    // If updating lines, recalculate totals
    let dataToUpdate: any = {
      ...otherUpdates,
    };

    if (lines) {
      // Delete existing lines
      await this.prisma.quoteLine.deleteMany({
        where: { quoteId: id },
      });

      // Calculate new totals
      let subtotal = 0;
      const processedLines = lines.map((line, index) => {
        const lineTotal = line.quantity * line.unitPrice;
        subtotal += lineTotal;
        return {
          ...line,
          lineTotal,
          sortOrder: index,
        };
      });

      const vatRate = updateQuoteDto.vatRate !== undefined ? updateQuoteDto.vatRate : quote.vatRate;
      const vatAmount = (subtotal * vatRate) / 100;
      const totalAmount = subtotal + vatAmount;

      dataToUpdate = {
        ...dataToUpdate,
        subtotal,
        vatAmount,
        totalAmount,
        vatRate,
        lines: {
          create: processedLines,
        },
      };
    }

    // Handle status changes
    if (status) {
      dataToUpdate.status = status;
      if (status === 'sent' && !quote.sentAt) {
        dataToUpdate.sentAt = new Date();
      } else if (status === 'accepted' && !quote.acceptedAt) {
        dataToUpdate.acceptedAt = new Date();
      } else if (status === 'rejected' && !quote.rejectedAt) {
        dataToUpdate.rejectedAt = new Date();
      }
    }

    return this.prisma.quote.update({
      where: { id },
      data: dataToUpdate,
      include: {
        extinguisher: {
          select: {
            location: true,
            building: true,
            floor: true,
            type: true,
            capacity: true,
          },
        },
        lines: {
          include: {
            inventoryItem: {
              select: {
                partNumber: true,
                partName: true,
                category: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  async delete(tenantId: string, id: string) {
    const quote = await this.findOne(tenantId, id);

    // Can only delete draft quotes
    if (quote.status !== 'draft') {
      throw new BadRequestException('Can only delete draft quotes');
    }

    await this.prisma.quote.delete({
      where: { id },
    });

    return { success: true, message: 'Quote deleted successfully' };
  }

  async getStats(tenantId: string) {
    const quotes = await this.prisma.quote.findMany({
      where: { tenantId },
      select: {
        status: true,
        totalAmount: true,
      },
    });

    const stats = {
      total: quotes.length,
      draft: quotes.filter(q => q.status === 'draft').length,
      sent: quotes.filter(q => q.status === 'sent').length,
      accepted: quotes.filter(q => q.status === 'accepted').length,
      rejected: quotes.filter(q => q.status === 'rejected').length,
      totalValue: quotes.reduce((sum, q) => sum + q.totalAmount, 0),
      acceptedValue: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.totalAmount, 0),
      acceptanceRate: quotes.filter(q => q.status === 'sent' || q.status === 'accepted' || q.status === 'rejected').length > 0
        ? (quotes.filter(q => q.status === 'accepted').length / quotes.filter(q => q.status === 'sent' || q.status === 'accepted' || q.status === 'rejected').length) * 100
        : 0,
    };

    return stats;
  }
}
