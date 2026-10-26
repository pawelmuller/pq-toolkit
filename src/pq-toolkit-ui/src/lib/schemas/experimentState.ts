import { z } from 'zod';

/**
 * Defines a single selection of a sample for a question
 */
export const SelectionSchema = z.object({
  questionId: z.string().min(1),
  sampleId: z.string().min(1)
});

/**
 * Type from {@link SelectionSchema}
 * Defines a single selection of a sample for a question
 * @field questionId - unique question identifier
 * @field sampleId - unique sample identifier
 */
export type Selection = z.infer<typeof SelectionSchema>

/**
 * Defines a base result of a test
 * All test results extend it
 */
export const BaseResultSchema = z.object({
  testNumber: z.number(),
  feedback: z.string().optional()
});

/**
 * Type from {@link BaseResultSchema}
 * Defines a base result of a test
 * All test results extend it
 * @field testNumber - ordinal number of test, must be unique
 * @field feedback - optional feedback for the test
 */
export type BaseResult = z.infer<typeof BaseResultSchema>

/**
 * Defines AB test result
 * User must select one of the samples as preferred
 * for each of the questions
 */
export const ABResultSchema = BaseResultSchema.extend({
  selections: z.array(SelectionSchema)
});

/**
 * Type from {@link ABResultSchema}
 * Defines AB test result
 * @field selections - array of selections {@link SelectionSchema}
 */
export type ABResult = z.infer<typeof ABResultSchema>

/**
 * Defines ABX test result
 * User must select one of the samples as preferred
 * for each of the questions
 * User must also select which sample is hidden as X
 */
export const ABXResultSchema = BaseResultSchema.extend({
  xSampleId: z.string(),
  xSelected: z.string(),
  selections: z.array(SelectionSchema).optional()
});

/**
 * Type from {@link ABXResultSchema}
 * Defines ABX test result
 * @field xSampleId - sample which was hidden as X
 * @field xSelected - which sample was selected as X
 * @field selections - array of selections {@link SelectionSchema}
 */
export type ABXResult = z.infer<typeof ABXResultSchema>

/**
 * Defines MUSHRA test result
 * Scores of all samples on scale from 0 to 100
 */
export const MUSHRAResultSchema = BaseResultSchema.extend({
  referenceScore: z.number().min(0).max(100),
  anchorsScores: z.array(
    z.object({
      sampleId: z.string().min(1),
      score: z.number().min(0).max(100)
    })
  ),
  samplesScores: z.array(
    z.object({
      sampleId: z.string().min(1),
      score: z.number().min(0).max(100)
    })
  )
});

/**
 * Type from {@link MUSHRAResultSchema}
 * Defines MUSHRA test result
 * @field referenceScore - score of reference sample
 * @field anchorsScores - array of scores for anchor samples
 * @field samplesScores - array of scores for samples
 */
export type MUSHRAResult = z.infer<typeof MUSHRAResultSchema>

/**
 * Defines APE test result
 * User must rate each sample on a scale from 0 to 100
 * for each of the questions
 */
export const APEResultSchema = BaseResultSchema.extend({
  axisResults: z.array(
    z.object({
      axisId: z.string(),
      sampleRatings: z.array(
        z.object({
          sampleId: z.string().min(1),
          rating: z.number().min(0).max(100)
        })
      )
    })
  )
});

/**
 * Type from {@link APEResultSchema}
 * Defines APE test result
 * @field axisResults - array of axis results
 */
export type APEResult = z.infer<typeof APEResultSchema>

/**
 * Partial result of a test, only contains test number which is required
 * for identifying the test
 */
export type PartialResult<T extends BaseResult> = Partial<T> & BaseResult
