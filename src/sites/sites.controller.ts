import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('sites')
@UseGuards(TenantGuard)
export class SitesController {
  constructor(private sitesService: SitesService) {}

  @Post()
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() body: {
      name: string;
      address?: string;
      city?: string;
      postcode?: string;
      country?: string;
      contactName?: string;
      contactPhone?: string;
      contactEmail?: string;
    },
  ) {
    return this.sitesService.create(user.tenantId, body);
  }

  @Get()
  async findAll(@CurrentUser() user: CurrentUserData) {
    return this.sitesService.findAll(user.tenantId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.sitesService.findOne(user.tenantId, id);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      address?: string;
      city?: string;
      postcode?: string;
      country?: string;
      contactName?: string;
      contactPhone?: string;
      contactEmail?: string;
      status?: string;
    },
  ) {
    return this.sitesService.update(user.tenantId, id, body);
  }

  @Delete(':id')
  async delete(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.sitesService.delete(user.tenantId, id);
  }
}
