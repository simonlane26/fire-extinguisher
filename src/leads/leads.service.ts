import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async captureChecklistLead(email: string) {
    const trimmed = (email || '').trim().toLowerCase();

    if (!EMAIL_RE.test(trimmed)) {
      throw new BadRequestException('Please enter a valid email address.');
    }

    // userId/tenant context doesn't apply — this is an anonymous public lead capture
    // eslint-disable-next-line local/require-tenant-scope
    await this.prisma.checklistLead.upsert({
      where: { email: trimmed },
      create: { email: trimmed, source: 'homepage' },
      update: {},
    });

    try {
      await this.emailService.sendComplianceChecklistEmail(trimmed);
    } catch (error) {
      // Lead is already captured even if the immediate send fails — don't fail the request
      this.logger.error(`Failed to send checklist email to ${trimmed}:`, error);
    }

    return { message: 'Checklist sent! Check your inbox.' };
  }
}
