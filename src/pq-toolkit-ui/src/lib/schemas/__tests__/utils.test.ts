import '@testing-library/jest-dom';
import structuredClone from '@ungap/structured-clone';

import { validateTestSchema } from '../utils';

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
};

test('valid AB test schema', () => {
  const validationResult = validateTestSchema(baseABValidationData);

  expect(validationResult.data).toEqual(baseABValidationData);
  expect(validationResult.validationError).toBeNull();
});

test('invalid AB test schema', () => {
  // Missing samples
  const missingSamplesData = structuredClone(baseABValidationData);
  missingSamplesData.samples = [];

  const validationMissingSamples = validateTestSchema(missingSamplesData);

  expect(validationMissingSamples.data).toBeNull();
  expect(validationMissingSamples.validationError).toBeDefined();

  // Only one sample
  const oneSampleData = structuredClone(baseABValidationData);
  oneSampleData.samples = [baseABValidationData.samples[0]];

  const validationOneSample = validateTestSchema(oneSampleData);

  expect(validationOneSample.data).toBeNull();
  expect(validationOneSample.validationError).toBeDefined();

  // Missing questions
  const missingQuestionsData = structuredClone(baseABValidationData);
  missingQuestionsData.questions = [];

  const validationMissingQuestions = validateTestSchema(missingQuestionsData);

  expect(validationMissingQuestions.data).toBeNull();
  expect(validationMissingQuestions.validationError).toBeDefined();
});

test('valid ABX test schema', () => {
  const baseABXValidationData = structuredClone(baseABValidationData);
  baseABXValidationData.type = 'ABX';

  const validationResult = validateTestSchema(baseABXValidationData);

  expect(validationResult.data).toEqual(baseABXValidationData);
  expect(validationResult.validationError).toBeNull();
});

test('invalid ABX test schema', () => {
  // Missing samples
  const missingSamplesData = structuredClone(baseABValidationData);
  missingSamplesData.samples = [];

  const validationMissingSamples = validateTestSchema(missingSamplesData);

  expect(validationMissingSamples.data).toBeNull();
  expect(validationMissingSamples.validationError).toBeDefined();

  // Only one sample
  const oneSampleData = structuredClone(baseABValidationData);
  oneSampleData.samples = [baseABValidationData.samples[0]];

  const validationOneSample = validateTestSchema(oneSampleData);

  expect(validationOneSample.data).toBeNull();
  expect(validationOneSample.validationError).toBeDefined();

  // Missing questions
  const missingQuestionsData = structuredClone(baseABValidationData);
  missingQuestionsData.questions = [];

  const validationMissingQuestions = validateTestSchema(missingQuestionsData);

  expect(validationMissingQuestions.data).toBeNull();
  expect(validationMissingQuestions.validationError).toBeDefined();
});

const baseMUSHRAValidationData: any = {
  testNumber: 1,
  type: 'MUSHRA',
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
  reference: {
    sampleId: 'ref',
    assetPath: 'ref.mp3'
  },
  anchors: [
    {
      sampleId: 'a1',
      assetPath: 'a1.mp3'
    },
    {
      sampleId: 'a2',
      assetPath: 'a2.mp3'
    }
  ]
};

test('valid MUSHRA test schema', () => {
  const MUSHRAValidationDataClone = structuredClone(baseMUSHRAValidationData);

  const validationResult = validateTestSchema(MUSHRAValidationDataClone);

  expect(validationResult.data).toEqual(MUSHRAValidationDataClone);
  expect(validationResult.validationError).toBeNull();
});

test('invalid MUSHRA test schema', () => {
  // Missing samples
  const missingSamplesData = structuredClone(baseMUSHRAValidationData);
  missingSamplesData.samples = [];

  const validationMissingSamples = validateTestSchema(missingSamplesData);

  expect(validationMissingSamples.data).toBeNull();
  expect(validationMissingSamples.validationError).toBeDefined();

  // Only one sample
  const oneSampleData = structuredClone(baseMUSHRAValidationData);
  oneSampleData.samples = [baseMUSHRAValidationData.samples[0]];

  const validationOneSample = validateTestSchema(oneSampleData);

  expect(validationOneSample.data).toBeNull();
  expect(validationOneSample.validationError).toBeDefined();

  // Missing reference
  const missingReferenceData = structuredClone(baseMUSHRAValidationData);
  missingReferenceData.reference = null;

  const validationMissingReference = validateTestSchema(missingReferenceData);

  expect(validationMissingReference.data).toBeNull();
  expect(validationMissingReference.validationError).toBeDefined();

  // Missing anchors
  const missingAnchorsData = structuredClone(baseMUSHRAValidationData);
  missingAnchorsData.anchors = [];

  const validationMissingAnchors = validateTestSchema(missingAnchorsData);

  expect(validationMissingAnchors.data).toBeNull();
  expect(validationMissingAnchors.validationError).toBeDefined();
});

const baseAPEValidationData: any = {
  testNumber: 1,
  type: 'APE',
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
  axis: [
    {
      questionId: '1',
      text: 'Which sample is better?'
    }
  ]
};

test('valid APE test schema', () => {
  const APEValidationData = structuredClone(baseAPEValidationData);

  const validationResult = validateTestSchema(APEValidationData);

  expect(validationResult.data).toEqual(APEValidationData);
  expect(validationResult.validationError).toBeNull();
});

test('invalid APE test schema', () => {
  // Missing samples
  const missingSamplesData = structuredClone(baseAPEValidationData);
  missingSamplesData.samples = [];

  const validationMissingSamples = validateTestSchema(missingSamplesData);

  expect(validationMissingSamples.data).toBeNull();
  expect(validationMissingSamples.validationError).toBeDefined();

  // Only one sample
  const oneSampleData = structuredClone(baseAPEValidationData);
  oneSampleData.samples = [baseAPEValidationData.samples[0]];

  const validationOneSample = validateTestSchema(oneSampleData);

  expect(validationOneSample.data).toBeNull();
  expect(validationOneSample.validationError).toBeDefined();

  // Missing axis
  const missingAxisData = structuredClone(baseAPEValidationData);
  missingAxisData.axis = [];

  const validationMissingAxis = validateTestSchema(missingAxisData);

  expect(validationMissingAxis.data).toBeNull();
  expect(validationMissingAxis.validationError).toBeDefined();
});
