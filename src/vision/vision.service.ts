import { Injectable } from '@nestjs/common';

export type VisionFindings = {
  gauge: 'green'|'low'|'high'|'unknown';
  pinMissing: boolean;
  sealMissing: boolean;
  hose: 'ok'|'cracked'|'blocked'|'loose'|'unknown';
  surface: 'ok'|'dented'|'rust'|'unknown';
  confidence?: number;
};

@Injectable()
export class VisionService {
  async analyze(url: string): Promise<VisionFindings> {
    // TODO: plug in real vision later
    return { gauge: 'unknown', pinMissing: false, sealMissing: false, hose: 'unknown', surface: 'unknown', confidence: 0 };
  }
}

