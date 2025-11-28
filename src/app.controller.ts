import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { PrismaService } from './prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  async getHealth() {
    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      };
    }
  }

  @Public()
  @Get('debug-frontend-files')
  getDebugFrontendFiles() {
    const frontendPath = join(process.cwd(), 'frontend', 'dist');
    const indexHtmlPath = join(frontendPath, 'index.html');
    const assetsPath = join(frontendPath, 'assets');

    try {
      const indexHtmlExists = fs.existsSync(indexHtmlPath);
      const indexHtmlContent = indexHtmlExists ? fs.readFileSync(indexHtmlPath, 'utf-8') : 'NOT FOUND';
      const assetsFiles = fs.existsSync(assetsPath) ? fs.readdirSync(assetsPath) : [];

      return {
        frontendPath,
        indexHtmlExists,
        indexHtmlContent: indexHtmlContent.substring(0, 500), // First 500 chars
        assetsFiles: assetsFiles.slice(0, 20), // First 20 files
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
        frontendPath,
      };
    }
  }
}
