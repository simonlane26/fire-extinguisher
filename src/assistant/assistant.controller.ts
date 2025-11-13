// src/assistant/assistant.controller.ts
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private prisma: PrismaService, private assistant: AssistantService) {}

  @Post('parse')
  async parseToJob(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: { text: string; extinguisherId?: string; createdByUserId?: string }
  ) {
    // Call LLM to get structured JSON
    const structured = await this.assistant.parseText(body.text);

    const job = await this.prisma.serviceJob.create({
      data: {
        tenantId,
        extinguisherId: body.extinguisherId ?? null,
        location: structured?.location || 'Unknown',
        building: structured?.building || 'Unknown',
        type: structured?.type || 'Unknown',
        serviceType: structured?.serviceType || 'Unknown',
        rawInput: body.text,
        structured,
        createdByUserId: body.createdByUserId ?? null,
      },
    });

    return { job };
  }
}
