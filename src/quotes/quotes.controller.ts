// src/quotes/quotes.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('quotes')
@UseGuards(TenantGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() createQuoteDto: CreateQuoteDto,
  ) {
    const createdBy = user.name || user.email;
    return this.quotesService.create(user.tenantId, createdBy, createQuoteDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserData,
    @Query('status') status?: string,
  ) {
    return this.quotesService.findAll(user.tenantId, status);
  }

  @Get('stats')
  async getStats(@CurrentUser() user: CurrentUserData) {
    return this.quotesService.getStats(user.tenantId);
  }

  @Get('by-extinguisher/:extinguisherId')
  async findByExtinguisher(
    @CurrentUser() user: CurrentUserData,
    @Param('extinguisherId') extinguisherId: string,
  ) {
    return this.quotesService.findByExtinguisher(user.tenantId, extinguisherId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.quotesService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ) {
    return this.quotesService.update(user.tenantId, id, updateQuoteDto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.quotesService.delete(user.tenantId, id);
  }
}
