import { string, z } from 'zod'

export const getExperimentsSchema = z.object({
  experiments: z.array(string())
})

export type getExperimentsData = z.infer<typeof getExperimentsSchema>

export const addExperimentSchema = z.object({
    experiments: z.array(string())
  })
  
export type addExperimentData = z.infer<typeof addExperimentSchema>

export const deleteExperimentSchema = z.object({
    experiments: z.array(string())
  })
  
export type deleteExperimentData = z.infer<typeof deleteExperimentSchema>

