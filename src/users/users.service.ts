import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all users in a tenant with their site access
   */
  async findAllUsers(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        siteAccess: {
          include: {
            site: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single user with their site access
   */
  async findOneUser(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        siteAccess: {
          include: {
            site: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get sites accessible to a user
   */
  async getUserSites(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If user is admin or owner, return all sites
    if (user.role === 'admin' || user.role === 'owner') {
      return this.prisma.site.findMany({
        where: { tenantId },
        orderBy: { name: 'asc' },
      });
    }

    // Otherwise, return only sites they have access to
    const siteAccess = await this.prisma.userSiteAccess.findMany({
      where: { userId },
      include: {
        site: true,
      },
    });

    return siteAccess.map((access) => access.site);
  }

  /**
   * Grant a user access to a site
   */
  async grantSiteAccess(tenantId: string, userId: string, siteId: string) {
    // Verify user belongs to tenant
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify site belongs to tenant
    const site = await this.prisma.site.findFirst({
      where: { id: siteId, tenantId },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    // Create or update site access
    return this.prisma.userSiteAccess.upsert({
      where: {
        userId_siteId: {
          userId,
          siteId,
        },
      },
      create: {
        userId,
        siteId,
      },
      update: {},
    });
  }

  /**
   * Revoke a user's access to a site
   */
  async revokeSiteAccess(tenantId: string, userId: string, siteId: string) {
    // Verify user belongs to tenant
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete the access record
    try {
      await this.prisma.userSiteAccess.delete({
        where: {
          userId_siteId: {
            userId,
            siteId,
          },
        },
      });
    } catch (error) {
      // Access record doesn't exist, that's fine
    }

    return { success: true };
  }

  /**
   * Set all sites a user has access to (replaces existing access)
   */
  async setSiteAccess(tenantId: string, userId: string, siteIds: string[]) {
    // Verify user belongs to tenant
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify all sites belong to tenant (only if siteIds is not empty)
    if (siteIds.length > 0) {
      const sites = await this.prisma.site.findMany({
        where: {
          id: { in: siteIds },
          tenantId,
        },
      });

      if (sites.length !== siteIds.length) {
        throw new BadRequestException('One or more sites not found');
      }
    }

    // Delete existing access and create new ones in a transaction
    if (siteIds.length > 0) {
      await this.prisma.$transaction([
        // Delete all existing access for this user
        this.prisma.userSiteAccess.deleteMany({
          where: { userId },
        }),
        // Create new access records
        this.prisma.userSiteAccess.createMany({
          data: siteIds.map((siteId) => ({
            userId,
            siteId,
          })),
          skipDuplicates: true,
        }),
      ]);
    } else {
      // If siteIds is empty, just delete all existing access
      await this.prisma.userSiteAccess.deleteMany({
        where: { userId },
      });
    }

    return this.findOneUser(tenantId, userId);
  }

  /**
   * Check if a user has access to a specific site
   */
  async hasAccessToSite(userId: string, siteId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    // Admins and owners have access to all sites
    if (user.role === 'admin' || user.role === 'owner') {
      return true;
    }

    // Check if user has explicit access to this site
    const access = await this.prisma.userSiteAccess.findUnique({
      where: {
        userId_siteId: {
          userId,
          siteId,
        },
      },
    });

    return !!access;
  }
}
