import {TestTypeEnum, type ABTest, type ABXTest, type APETest, type BaseTest, type MUSHRATest, ABTestSchema, ABXTestSchema, APETestSchema, MUSHRATestSchema, type ExperimentSetup} from './experimentSetup';

/**
 * Validates if test has valid schema base on its type
 * @param test any type of test
 * @returns \{ data: ABTest | ABXTest | MUSHRATest | APETest, validationError: null } if test is valid
 * @returns \{ data: null, validationError: string } if test is invalid
 */
export const validateTestSchema = (
  test: BaseTest
):
  | { data: ABTest | ABXTest | MUSHRATest | APETest; validationError: null }
  | { data: null; validationError: string } => {
  let schema;
  switch (test.type) {
    case TestTypeEnum.enum.AB:
      schema = ABTestSchema;
      break;
    case TestTypeEnum.enum.ABX:
      schema = ABXTestSchema;
      break;
    case TestTypeEnum.enum.APE:
      schema = APETestSchema;
      break;
    case TestTypeEnum.enum.MUSHRA:
      schema = MUSHRATestSchema;
      break;
  }

  const parsed = schema.safeParse(test);
  if (parsed.success) {
    return { data: parsed.data, validationError: null };
  }
  return { data: null, validationError: parsed.error.message };
};

/**
 * Lists all sample asset path from an experiment
 * @param experiment experiment setup
 * @returns array of unique sample asset path
 */
export const listExperimentSamples = (
  experiment: ExperimentSetup
): string[] => {
  const uniqueSamples = new Set<string>();
  experiment.tests.forEach((test) => {
    if (test.type === TestTypeEnum.enum.AB) {
      const castTest = test as ABTest;
      castTest.samples.forEach((sample) => uniqueSamples.add(sample.assetPath));
    } else if (test.type === TestTypeEnum.enum.ABX) {
      const castTest = test as ABXTest;
      castTest.samples.forEach((sample) => uniqueSamples.add(sample.assetPath));
    } else if (test.type === TestTypeEnum.enum.APE) {
      const castTest = test as APETest;
      castTest.samples.forEach((sample) => uniqueSamples.add(sample.assetPath));
    } else if (test.type === TestTypeEnum.enum.MUSHRA) {
      const castTest = test as MUSHRATest;
      castTest.samples.forEach((sample) => uniqueSamples.add(sample.assetPath));
      castTest.anchors.forEach((sample) => uniqueSamples.add(sample.assetPath));
      uniqueSamples.add(castTest.reference.assetPath);
    }
  });

  return Array.from(uniqueSamples);
};
