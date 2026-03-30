import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, Res, BadRequestException, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { FireAlarmService } from './fire-alarm.service';

@Controller('fire-alarm')
@UseGuards(JwtAuthGuard)
export class FireAlarmController {
  constructor(private readonly service: FireAlarmService) {}

  // ─── Systems ──────────────────────────────────────────────────────────────

  @Get('systems')
  getSystems(@CurrentUser() user: CurrentUserData, @Query('siteId') siteId?: string) {
    return this.service.getSystems(user.tenantId, siteId);
  }

  @Post('systems')
  createSystem(@CurrentUser() user: CurrentUserData, @Body() body: any) {
    return this.service.createSystem(user.tenantId, body);
  }

  @Patch('systems/:id')
  updateSystem(@CurrentUser() user: CurrentUserData, @Param('id') id: string, @Body() body: any) {
    return this.service.updateSystem(user.tenantId, id, body);
  }

  @Delete('systems/:id')
  deleteSystem(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteSystem(user.tenantId, id);
  }

  @Post('systems/import/csv')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.toLowerCase().endsWith('.csv')) {
        return callback(new BadRequestException('Only CSV files allowed'), false);
      }
      callback(null, true);
    },
  }))
  async importSystemsCsv(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.service.importSystemsFromCsv(user.tenantId, file.buffer.toString('utf-8'));
  }

  // ─── Call Points ──────────────────────────────────────────────────────────

  @Get('systems/:systemId/call-points')
  getCallPoints(@CurrentUser() user: CurrentUserData, @Param('systemId') systemId: string) {
    return this.service.getCallPoints(user.tenantId, systemId);
  }

  @Get('systems/:systemId/call-points/next-due')
  getNextDue(@CurrentUser() user: CurrentUserData, @Param('systemId') systemId: string) {
    return this.service.getNextDueCallPoint(user.tenantId, systemId);
  }

  @Post('systems/:systemId/call-points')
  addCallPoint(
    @CurrentUser() user: CurrentUserData,
    @Param('systemId') systemId: string,
    @Body() body: any,
  ) {
    return this.service.addCallPoint(user.tenantId, systemId, body);
  }

  /** CSV import: body = { rows: [{ pointRef, location?, floor?, zone? }] } */
  @Post('systems/:systemId/call-points/import')
  importCallPoints(
    @CurrentUser() user: CurrentUserData,
    @Param('systemId') systemId: string,
    @Body('rows') rows: any[],
  ) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new BadRequestException('rows must be a non-empty array');
    }
    return this.service.importCallPoints(user.tenantId, systemId, rows);
  }

  @Delete('call-points/:id')
  deleteCallPoint(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteCallPoint(user.tenantId, id);
  }

  // ─── Log Entries ──────────────────────────────────────────────────────────

  @Get('systems/:systemId/log-entries')
  getLogEntries(
    @CurrentUser() user: CurrentUserData,
    @Param('systemId') systemId: string,
    @Query('entryType') entryType?: string,
  ) {
    return this.service.getLogEntries(user.tenantId, systemId, entryType);
  }

  @Post('systems/:systemId/log-entries')
  createLogEntry(
    @CurrentUser() user: CurrentUserData,
    @Param('systemId') systemId: string,
    @Body() body: any,
  ) {
    return this.service.createLogEntry(user.tenantId, systemId, body);
  }

  @Delete('log-entries/:id')
  deleteLogEntry(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.service.deleteLogEntry(user.tenantId, id);
  }

  /** Download PDF certificate for a periodic inspection entry */
  @Get('log-entries/:id/certificate')
  async getCertificate(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdf = await this.service.generateCertificate(user.tenantId, id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="fire-alarm-certificate-${id}.pdf"`);
    res.send(pdf);
  }
}
