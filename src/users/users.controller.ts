import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(TenantGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Get all users in the tenant
   */
  @Get()
  async getAllUsers(@CurrentUser() user: CurrentUserData) {
    return this.usersService.findAllUsers(user.tenantId);
  }

  /**
   * Get a specific user by ID
   */
  @Get(':userId')
  async getUser(@CurrentUser() user: CurrentUserData, @Param('userId') userId: string) {
    return this.usersService.findOneUser(user.tenantId, userId);
  }

  /**
   * Get sites accessible to a user
   */
  @Get(':userId/sites')
  async getUserSites(@CurrentUser() user: CurrentUserData, @Param('userId') userId: string) {
    return this.usersService.getUserSites(user.tenantId, userId);
  }

  /**
   * Grant a user access to a site
   */
  @Post(':userId/sites/:siteId')
  async grantSiteAccess(
    @CurrentUser() user: CurrentUserData,
    @Param('userId') userId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.usersService.grantSiteAccess(user.tenantId, userId, siteId);
  }

  /**
   * Revoke a user's access to a site
   */
  @Delete(':userId/sites/:siteId')
  async revokeSiteAccess(
    @CurrentUser() user: CurrentUserData,
    @Param('userId') userId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.usersService.revokeSiteAccess(user.tenantId, userId, siteId);
  }

  /**
   * Set all sites a user has access to (replaces existing access)
   */
  @Post(':userId/sites')
  async setSiteAccess(
    @CurrentUser() user: CurrentUserData,
    @Param('userId') userId: string,
    @Body('siteIds') siteIds: string[],
  ) {
    return this.usersService.setSiteAccess(user.tenantId, userId, siteIds);
  }
}
