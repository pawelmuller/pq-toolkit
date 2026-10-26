import { z } from 'zod'

/**
 * Defines a single sample used in test
 * Samples can be shared between tests
 * Sample is identified by unique sampleId
 */
export const SampleSchema = z.object({
  sampleId: z.string().min(1),
  assetPath: z.string().min(1)
});

/**
 * Type from {@link SampleSchema}
 * Defines a single sample used in test
 * @field sampleId - unique sample identifier
 * @field assetPath - path to audio file
 */
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
});

/**
 * Type from {@link QuestionSchema}
 * Defines a single question used in test
 * @field questionId - unique question identifier
 * @field text - text displayed to user
 */
export type Question = z.infer<typeof QuestionSchema>

// Definitions for all available test types

/**
 * Enum of all available test types
 */
export const TestTypeEnum = z.enum(['AB', 'ABX', 'MUSHRA', 'APE']);

/**
 * Type from {@link TestTypeEnum}
 * Enum of all available test types
 */
export type TestType = z.infer<typeof TestTypeEnum>

/**
 * Base test schema, all test schemas extend it
 */
export const BaseTestSchema = z.object({
  testNumber: z.number(),
  type: TestTypeEnum,
  samples: z.array(SampleSchema)
});

/**
 * Type from {@link BaseTestSchema}
 * Base test schema, all test schemas extend it
 * @field testNumber - ordinal number of test, must be unique
 * @field type - test type {@link TestTypeEnum}
 */
export type BaseTest = z.infer<typeof BaseTestSchema>

/**
 * AB test schema
 * AB test consist of 2 (or more) samples, user must select one of them
 * as preferred in one or more questions attached to this test
 */
export const ABTestSchema = BaseTestSchema.extend({
  type: z.enum(['AB']),
  samples: z.array(SampleSchema).min(2),
  questions: z.array(QuestionSchema).min(1)
});

/**
 * Type from {@link ABTestSchema}
 * AB test schema
 * @field samples - array of samples {@link SampleSchema}
 * @field questions - array of questions {@link QuestionSchema}
 */
export type ABTest = z.infer<typeof ABTestSchema>

/**
 * ABX test schema
 * ABX test extends AB test with additional sample X
 * which has to be identified as one of the samples A or B
 * X sample can be provided (as index of selected sample) or will be
 * generated randomly when test is started
 */
export const ABXTestSchema = BaseTestSchema.extend({
  type: z.enum(['ABX']),
  samples: z.array(SampleSchema).min(2).max(2),
  xSampleId: z.string().optional().nullable(),
  questions: z.array(QuestionSchema).optional().nullable()
});

/**
 * ABX test schema with all required fields filled
 */
export const FullABXTestSchema = ABXTestSchema.extend({
  xSampleId: z.string().min(1)
});

/**
 * Type from {@link ABXTestSchema}
 * ABX test schema
 * @field samples - array of samples {@link SampleSchema}
 * @field xSampleId - id of sample X (optional)
 * @field questions - array of questions {@link QuestionSchema}
 */
export type ABXTest = z.infer<typeof ABXTestSchema>
/**
 * Type from {@link FullABXTestSchema}
 * ABX test schema with all required fields filled
 * @field samples - array of samples {@link SampleSchema}
 * @field xSampleId - id of sample X
 * @field questions - array of questions {@link QuestionSchema}
 */
export type FullABXTest = z.infer<typeof FullABXTestSchema>

/**
 * MUSHRA test schema
 * MUSHRA test consist of reference sample, one or more
 * anchor samples and multiple samples which are compared
 * to reference.
 * User must rate each sample on a scale from 0 to 100
 */
export const MUSHRATestSchema = BaseTestSchema.extend({
  type: z.enum(['MUSHRA']),
  question: z.string().optional().nullable(),
  reference: SampleSchema,
  anchors: z.array(SampleSchema).min(1),
  samples: z.array(SampleSchema).min(2)
});

/**
 * MUSHRA test schema with all required fields filled
 */
export const FullMUSHRATestSchema = MUSHRATestSchema.extend({
  samplesShuffle: z.array(z.string())
});

/**
 * Type from {@link MUSHRATestSchema}
 * MUSHRA test schema
 * @field question - question displayed to user
 * @field reference - reference sample {@link SampleSchema}
 * @field anchors - array of anchor samples {@link SampleSchema}
 * @field samples - array of samples {@link SampleSchema}
 */
export type MUSHRATest = z.infer<typeof MUSHRATestSchema>
/**
 * Type from {@link FullMUSHRATestSchema}
 * MUSHRA test schema with all required fields filled
 * @field question - question displayed to user
 * @field reference - reference sample {@link SampleSchema}
 * @field anchors - array of anchor samples {@link SampleSchema}
 * @field samples - array of samples {@link SampleSchema}
 * @field samplesShuffle - array of sample ids in shuffled order
 */
export type FullMUSHRATest = z.infer<typeof FullMUSHRATestSchema>

/**
 * APE test schema
 * APE test consist of multiple samples and multiple questions
 * User must rate each sample on a scale from 0 to 100
 * in each question
 * Every question has its own axis, which is displayed to user
 * as a slider with multiple points representing samples
 */
export const APETestSchema = BaseTestSchema.extend({
  type: z.enum(['APE']),
  samples: z.array(SampleSchema).min(2),
  axis: z.array(QuestionSchema).min(1)
});

/**
 * Type from {@link APETestSchema}
 * APE test schema
 * @field samples - array of samples {@link SampleSchema}
 * @field axis - array of questions {@link QuestionSchema}
 */
export type APETest = z.infer<typeof APETestSchema>

/**
 * Defines full experiment setup, which contains:
 * - start page
 * - multiple tests (can be of different types)
 * - ending page
 */
export const ExperimentSetupSchema = z.object({
  uid: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  endText: z.string().optional(),
  tests: z.array(BaseTestSchema.passthrough()).min(1)
});

/**
 * Type from {@link ExperimentSetupSchema}
 * Defines full experiment setup, which contains:
 * - start page
 * - multiple tests (can be of different types)
 * - ending page
 * @field uid - unique experiment identifier
 * @field name - experiment name
 * @field description - experiment description
 * @field endText - text displayed on ending page
 * @field tests - array of tests {@link BaseTestSchema}
 */
export type ExperimentSetup = z.infer<typeof ExperimentSetupSchema>
