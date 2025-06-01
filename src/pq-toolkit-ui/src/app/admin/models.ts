import { z } from 'zod';

export const adminExperimentsListSchema = z.object({
  experiments: z.array(z.string())
});

export type AdminExperimentsList = z.infer<typeof adminExperimentsListSchema>
