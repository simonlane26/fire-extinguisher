import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: {
    name: string;
    address?: string;
    city?: string;
    postcode?: string;
    country?: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
  }) {
    return this.prisma.site.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.site.findMany({
      where: {
        tenantId,
        status: 'active',
      },
      include: {
        _count: {
          select: { extinguishers: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const site = await this.prisma.site.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        extinguishers: {
          select: {
            id: true,
            location: true,
            building: true,
            type: true,
            status: true,
            nextInspection: true,
          },
        },
      },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    return site;
  }

  async update(tenantId: string, id: string, data: {
    name?: string;
    address?: string;
    city?: string;
    postcode?: string;
    country?: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    status?: string;
  }) {
    const site = await this.prisma.site.findFirst({
      where: { id, tenantId },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    return this.prisma.site.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    const site = await this.prisma.site.findFirst({
      where: { id, tenantId },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    // Soft delete - set status to inactive
    return this.prisma.site.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}
