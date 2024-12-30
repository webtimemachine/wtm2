import { z } from 'zod';

export const SummaryPromptSchema = z.object({
  data: z.object({
    content: z.string(),
    tags: z.optional(z.array(z.string())),
    source: z.optional(z.string()),
  }),
});

export type SummaryPromptResponse = z.infer<typeof SummaryPromptSchema>;
