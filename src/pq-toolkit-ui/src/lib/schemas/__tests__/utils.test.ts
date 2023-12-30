import '@testing-library/jest-dom'
import structuredClone from '@ungap/structured-clone'

import { validateTestSchema } from '../utils'

const baseABValidationData: any = {
  testNumber: 1,
  type: 'AB',
  samples: [
    {
      sampleId: '1',
      assetPath: '1.mp3'
    },
    {
      sampleId: '2',
      assetPath: '2.mp3'
    }
  ],
  questions: [
    {
      questionId: '1',
      text: 'Which sample is better?'
    }
  ]
}

test('valid AB test schema', () => {
  const validationResult = validateTestSchema(baseABValidationData)

  expect(validationResult.data).toEqual(baseABValidationData)
  expect(validationResult.validationError).toBeNull()
})

test('invalid AB test schema', () => {
  // Missing samples
  const missingSamplesData = structuredClone(baseABValidationData)
  missingSamplesData.samples = []

  const validationMissingSamples = validateTestSchema(missingSamplesData)

  expect(validationMissingSamples.data).toBeNull()
  expect(validationMissingSamples.validationError).toBeDefined()

  // Only one sample
  const oneSampleData = structuredClone(baseABValidationData)
  oneSampleData.samples = [baseABValidationData.samples[0]]

  const validationOneSample = validateTestSchema(oneSampleData)

  expect(validationOneSample.data).toBeNull()
  expect(validationOneSample.validationError).toBeDefined()

  // Missing questions
  const missingQuestionsData = structuredClone(baseABValidationData)
  missingQuestionsData.questions = []

  const validationMissingQuestions = validateTestSchema(missingQuestionsData)

  expect(validationMissingQuestions.data).toBeNull()
  expect(validationMissingQuestions.validationError).toBeDefined()
})
