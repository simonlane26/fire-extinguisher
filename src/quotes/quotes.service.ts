// src/quotes/quotes.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto, CreateQuoteLineDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createdBy: string, createQuoteDto: CreateQuoteDto) {
    const { extinguisherId, inspectionId, validUntil, vatRate, notes, termsConditions, lines } = createQuoteDto;

    // Verify extinguisher exists and belongs to tenant
    const extinguisher = await this.prisma.extinguisher.findFirst({
      where: { id: extinguisherId, tenantId },
    });

    if (!extinguisher) {
      throw new NotFoundException('Extinguisher not found');
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
        extinguisherId,
        inspectionId: inspectionId || null,
        quoteNumber,
        status: 'draft',
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
