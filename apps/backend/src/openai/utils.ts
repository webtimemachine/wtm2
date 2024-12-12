import { z } from 'zod';
import { BaseOutputParser } from '@langchain/core/output_parsers';

const outputSchema = z.boolean();

export class FlagParser extends BaseOutputParser<boolean> {
  lc_namespace = ['langchain', 'output_parsers'];

  async parse(text: string): Promise<boolean> {
    const normalizedText = text.toLowerCase().trim();
    const output = outputSchema.safeParse(!normalizedText.includes('false'));

    if (!output.success) {
      throw new Error(`Failed to parse: ${text}. Expected "true" or "false".`);
    }
    const result = output.data.valueOf();

    return result;
  }

  getFormatInstructions(): string {
    return 'Your response must be either "true" or "false".';
  }
}
