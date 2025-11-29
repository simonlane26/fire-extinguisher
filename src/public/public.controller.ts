import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class PublicController {
  @Public()
  @Get('privacy-policy.html')
  getPrivacyPolicy(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'frontend', 'dist', 'privacy-policy.html'));
  }

  @Public()
  @Get('terms-of-service.html')
  getTermsOfService(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'frontend', 'dist', 'terms-of-service.html'));
  }

  @Public()
  @Get('cookie-policy.html')
  getCookiePolicy(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'frontend', 'dist', 'cookie-policy.html'));
  }
}
