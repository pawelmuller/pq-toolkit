import { z } from 'zod'

export const experimentStateSchema = z.object({
  name: z.string(),
  description: z.string()
})

export type ExperimentState = z.infer<typeof experimentStateSchema>
