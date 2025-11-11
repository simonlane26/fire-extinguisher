// src/assistant/assistant.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssistantService {
  async parseText(text: string): Promise<any> {
    // PSEUDO: call your LLM with a JSON-schema style instruction.
    // The output we want:
    // {
    //   type: "CO2 5kg",
    //   defects: ["horn cracked", "bracket loose"],
    //   actions: ["replace horn", "tighten bracket"],
    //   parts: ["CO2 horn 5kg", "M8 bracket bolts"],
    //   nextDue: "2025-06-01",
    //   severity: "minor|major"
    // }
    // For now stub:
    return {
      type: "CO2 5kg",
      defects: ["horn cracked", "bracket loose"],
      actions: ["replace horn", "secure bracket"],
      parts: ["CO2 5kg horn", "Bracket screws"],
      nextDue: "2025-06-01",
      severity: "minor"
    };
  }
}
