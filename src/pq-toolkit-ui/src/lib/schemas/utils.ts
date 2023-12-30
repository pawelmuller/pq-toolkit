import {
  TestTypeEnum,
  type ABTest,
  type ABXTest,
  type APETest,
  type BaseTest,
  type MUSHRATest,
  ABTestSchema,
  ABXTestSchema,
  APETestSchema,
  MUSHRATestSchema
} from './experimentSetup'

export const validateTestSchema = (
  test: BaseTest
):
  | { data: ABTest | ABXTest | MUSHRATest | APETest; validationError: null }
  | { data: null; validationError: string } => {
  let schema
  switch (test.type) {
    case TestTypeEnum.enum.AB:
      schema = ABTestSchema
      break
    case TestTypeEnum.enum.ABX:
      schema = ABXTestSchema
      break
    case TestTypeEnum.enum.APE:
      schema = APETestSchema
      break
    case TestTypeEnum.enum.MUSHRA:
      schema = MUSHRATestSchema
      break
  }

  const parsed = schema.safeParse(test)
  if (parsed.success) return { data: parsed.data, validationError: null }
  return { data: null, validationError: parsed.error.message }
}
