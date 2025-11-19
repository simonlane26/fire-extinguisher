import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('inventory')
@UseGuards(TenantGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  // ===== INVENTORY ITEMS =====

  @Get('items')
  async getAllItems(@CurrentUser() user: CurrentUserData) {
    return this.inventoryService.findAllItems(user.tenantId);
  }

  @Get('items/low-stock')
  async getLowStockItems(@CurrentUser() user: CurrentUserData) {
    return this.inventoryService.getLowStockItems(user.tenantId);
  }

  @Get('items/:id')
  async getItem(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.inventoryService.findOneItem(user.tenantId, id);
  }

  @Post('items')
  async createItem(@CurrentUser() user: CurrentUserData, @Body() body: any) {
    return this.inventoryService.createItem(user.tenantId, body);
  }

  @Put('items/:id')
  async updateItem(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.inventoryService.updateItem(user.tenantId, id, body);
  }

  @Delete('items/:id')
  async deleteItem(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.inventoryService.deleteItem(user.tenantId, id);
  }

  // ===== PART USAGE =====

  @Post('usage')
  async recordUsage(@CurrentUser() user: CurrentUserData, @Body() body: any) {
    return this.inventoryService.recordUsage(user.tenantId, body);
  }

  @Get('usage')
  async getUsages(
    @CurrentUser() user: CurrentUserData,
    @Query('inventoryItemId') inventoryItemId?: string,
    @Query('extinguisherId') extinguisherId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (inventoryItemId) filters.inventoryItemId = inventoryItemId;
    if (extinguisherId) filters.extinguisherId = extinguisherId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.inventoryService.findAllUsages(user.tenantId, filters);
  }

  @Get('stats')
  async getStats(
    @CurrentUser() user: CurrentUserData,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.inventoryService.getUsageStats(
      user.tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }
}
