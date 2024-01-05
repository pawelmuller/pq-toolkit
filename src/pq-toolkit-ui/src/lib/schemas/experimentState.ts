import { z } from 'zod'

export const BaseResultSchema = z.object({
  testNumber: z.number()
})

export type BaseResult = z.infer<typeof BaseResultSchema>

/**
 * Defines AB test result
 * User must select one of the samples as preferred
 * for each of the questions
 */
export const ABResultSchema = BaseResultSchema.extend({
  selections: z.array(
    z.object({
      questionId: z.string().min(1),
      sampleId: z.string().min(1)
    })
  )
})

export type ABResult = z.infer<typeof ABResultSchema>

/**
 * Defines ABX test result
 */
export const ABXResultSchema = BaseResultSchema.extend({
  // TODO: fill
})

export type ABXResult = z.infer<typeof ABXResultSchema>

/**
 * Defines MUSHRA test result
 */
export const MUSHRAResultSchema = BaseResultSchema.extend({
  // TODO: fill
})

export type MUSHRAResult = z.infer<typeof MUSHRAResultSchema>

/**
 * Defines APE test result
 */
export const APEResultSchema = BaseResultSchema.extend({
  // TODO: fill
})

export type APEResult = z.infer<typeof APEResultSchema>
