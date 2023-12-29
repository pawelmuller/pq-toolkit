import { z } from 'zod'

/**
 * Defines a single sample used in test
 * Samples can be shared between tests
 * Sample is identified by unique sampleId
 */
export const SampleSchema = z.object({
  sampleId: z.string().min(1),
  assetPath: z.string().min(1)
})

export type Sample = z.infer<typeof SampleSchema>

/**
 * Defines a single question used in test
 * Questions have text that is displayed to user,
 * then user has to choose one of the options
 * corresponding to played samples
 * Question is identified by questionId, which is usually
 * an ordinal number, it is not unique between tests
 */
export const QuestionSchema = z.object({
  questionId: z.string().min(1),
  text: z.string().min(1)
})

export type Question = z.infer<typeof QuestionSchema>

// Definitions for all available test types

/**
 * Enum of all test types
 */
export const TestTypeEnum = z.enum(['AB', 'ABX', 'MUSHRA', 'APE'])

export type TestType = z.infer<typeof TestTypeEnum>

/**
 * Base test schema, all test schemas extend it
 */
export const BaseTestSchema = z.object({
  testNumber: z.number(),
  type: TestTypeEnum,
  samples: z.array(SampleSchema)
})

export type BaseTest = z.infer<typeof BaseTestSchema>

/**
 * AB test schema
 * AB test consist of 2 samples, user must select one of them
 * as preferred in one or more questions attached to this test
 */
export const ABTestSchema = BaseTestSchema.extend({
  type: z.enum(['AB']),
  samples: z.array(SampleSchema).min(2),
  questions: z.array(QuestionSchema).min(1)
})

export type ABTest = z.infer<typeof ABTestSchema>

/**
 * ABX test schema
 * ABX test extends AB test with additional sample X
 * which has to be identified as one of the samples A or B
 * X sample can be provided (as index of selected sample) or will be
 * generated randomly when test is started
 */
export const ABXTestSchema = BaseTestSchema.extend({
  type: z.enum(['ABX'])
  // TODO: fill
})

export type ABXTest = z.infer<typeof ABXTestSchema>

/**
 * MUSHRA test schema
 */
export const MUSHRATestSchema = BaseTestSchema.extend({
  type: z.enum(['MUSHRA'])
  // TODO: fill
})

export type MUSHRATest = z.infer<typeof MUSHRATestSchema>

/**
 * APE test schema
 */
export const APETestSchema = BaseTestSchema.extend({
  type: z.enum(['APE'])
  // TODO: fill
})

export type APETest = z.infer<typeof APETestSchema>

/**
 * Defines full experiment setup, which contains:
 * - start page
 * - multiple tests of different types
 * - ending page
 */
export const ExperimentSetupSchema = z.object({
  uid: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  endText: z.string().optional(),
  tests: z.array(BaseTestSchema.passthrough()).min(1)
})

export type ExperimentSetup = z.infer<typeof ExperimentSetupSchema>
