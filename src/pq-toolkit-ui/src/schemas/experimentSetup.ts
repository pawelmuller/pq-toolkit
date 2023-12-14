import { z } from 'zod'

export const testSampleSchema = z.object({
  id: z.string(),
  assetPath: z.string()
})

export type TestSample = z.infer<typeof testSampleSchema>

export const testQuestionSchema = z.object({
  text: z.string()
})

export type TestQuestion = z.infer<typeof testQuestionSchema>

export const testSetupSchema = z.object({
  id: z.number(),
  type: z.string(),
  samples: z.array(
    z.object({
      id: z.string(),
      assetPath: z.string()
    })
  ),
  questions: z.array(
    z.object({
      text: z.string()
    })
  )
})

export type TestSetup = z.infer<typeof testSetupSchema>

export const experimentSetupSchema = z.object({
  name: z.string(),
  title: z.string(),
  tests: z.array(testSetupSchema)
})

export type ExperimentSetup = z.infer<typeof experimentSetupSchema>
