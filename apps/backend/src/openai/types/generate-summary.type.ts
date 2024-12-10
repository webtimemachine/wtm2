import { z } from 'zod';

export const SummaryPromptSchema = z.object({
  data: z.object({
    content: z.string(),
    tags: z.array(z.string()),
    source: z.string(),
  }),
});

export type SummaryPromptResponse = z.infer<typeof SummaryPromptSchema>;
