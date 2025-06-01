import { z } from 'zod';

export const experimentsListSchema = z.object({
  experiments: z.array(z.string())
});

export type ExperimentsList = z.infer<typeof experimentsListSchema>
