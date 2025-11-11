import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtinguishersService } from './extinguishers.service';
import { CreateExtinguisherDto } from './dto/create-extinguisher.dto';
import { UpdateExtinguisherDto } from './dto/update-extinguisher.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('extinguishers')
@UseGuards(TenantGuard)
export class ExtinguishersController {
  constructor(private readonly service: ExtinguishersService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserData, @Body() dto: CreateExtinguisherDto) {
    return this.service.create(user.tenantId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserData) {
    return this.service.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.findOne(user.tenantId, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: CurrentUserData, @Param('id') id: string, @Body() dto: UpdateExtinguisherDto) {
    return this.service.update(user.tenantId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.remove(user.tenantId, id);
  }

  @Get('export/csv')
  async exportCsv(@CurrentUser() user: CurrentUserData, @Res() res: Response) {
    const csv = await this.service.exportToCsv(user.tenantId);
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="fire-extinguishers-${Date.now()}.csv"`);
    res.send(csv);
  }

  @Post('import/csv')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const csvContent = file.buffer.toString('utf-8');
    return this.service.importFromCsv(user.tenantId, csvContent);
  }
}


