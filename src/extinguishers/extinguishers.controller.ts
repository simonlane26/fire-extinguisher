import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, UseInterceptors, UploadedFile, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtinguishersService } from './extinguishers.service';
import { CreateExtinguisherDto } from './dto/create-extinguisher.dto';
import { UpdateExtinguisherDto } from './dto/update-extinguisher.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { TenantGuard } from '../auth/tenant.guard';
import { StripeService } from '../stripe/stripe.service';

@Controller('extinguishers')
@UseGuards(TenantGuard)
export class ExtinguishersController {
  constructor(
    private readonly service: ExtinguishersService,
    private readonly stripeService: StripeService,
  ) {}

  @Post()
  async create(@CurrentUser() user: CurrentUserData, @Body() dto: CreateExtinguisherDto) {
    // Check if tenant can add more extinguishers
    if (this.stripeService.isConfigured()) {
      const canAdd = await this.stripeService.canAddExtinguisher(user.tenantId);
      if (!canAdd) {
        throw new ForbiddenException('Extinguisher limit reached for your plan. Please upgrade to add more.');
      }
    }

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
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max for CSV files
    },
    fileFilter: (req, file, callback) => {
      // Validate MIME type for CSV
      const allowedMimeTypes = ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
          new BadRequestException('Invalid file type. Only CSV files are allowed.'),
          false
        );
      }

      // Validate file extension
      const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      if (ext !== '.csv') {
        return callback(
          new BadRequestException('Invalid file extension. Only .csv files are allowed.'),
          false
        );
      }

      callback(null, true);
    },
  }))
  async importCsv(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const csvContent = file.buffer.toString('utf-8');

    // Check plan limits before importing
    if (this.stripeService.isConfigured()) {
      const result = await this.service.validateCsvImport(user.tenantId, csvContent);
      if (!result.canImport) {
        throw new ForbiddenException(result.message);
      }
    }

    return this.service.importFromCsv(user.tenantId, csvContent);
  }
}


