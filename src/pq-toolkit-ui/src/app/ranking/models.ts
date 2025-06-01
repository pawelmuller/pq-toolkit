import { z } from 'zod';

export const samplesListSchema = z.object({
    samples: z.array(
        z.object({
          sampleId: z.string(),
          name: z.string(), 
          assetPath: z.string(),
          rating: z.number(),
    })
    ),
});

export type AdminExperimentsList = z.infer<typeof samplesListSchema>
