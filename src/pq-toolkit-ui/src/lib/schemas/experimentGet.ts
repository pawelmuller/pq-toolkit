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

export const setUpExperimentSchema = z.object({
    success: z.boolean()
  })
  
export type setUpExperimentData = z.infer<typeof setUpExperimentSchema>

export const uploadSampleSchema = z.object({
    success: z.boolean()
})
export type uploadSampleData = z.infer<typeof uploadSampleSchema>

export const getSamplesSchema = z.array(z.string())
export type getSamplesData = z.infer<typeof getSamplesSchema>
export const getSampleSchema = z.string()
export type getSampleData = z.infer<typeof getSampleSchema>