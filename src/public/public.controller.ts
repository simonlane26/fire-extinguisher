import { Controller, Get, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class PublicController {
  private readonly logger = new Logger(PublicController.name);

  private servePolicyFile(filename: string, res: Response) {
    const filePath = join(process.cwd(), 'frontend', 'dist', filename);
    this.logger.log(`Attempting to serve ${filename} from: ${filePath}`);
    this.logger.log(`File exists: ${existsSync(filePath)}`);

    if (!existsSync(filePath)) {
      this.logger.error(`File not found: ${filePath}`);
      return res.status(404).send(`Policy file not found: ${filename}`);
    }

    return res.sendFile(filePath);
  }

  @Public()
  @Get('privacy-policy.html')
  getPrivacyPolicy(@Res() res: Response) {
    return this.servePolicyFile('privacy-policy.html', res);
  }

  @Public()
  @Get('terms-of-service.html')
  getTermsOfService(@Res() res: Response) {
    return this.servePolicyFile('terms-of-service.html', res);
  }

  @Public()
  @Get('cookie-policy.html')
  getCookiePolicy(@Res() res: Response) {
    return this.servePolicyFile('cookie-policy.html', res);
  }
}
