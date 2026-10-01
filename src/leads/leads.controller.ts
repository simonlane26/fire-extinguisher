import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 per hour per IP
  @Post('checklist-signup')
  async checklistSignup(@Body('email') email: string) {
    return this.leadsService.captureChecklistLead(email);
  }
}
