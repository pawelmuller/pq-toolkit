import { validateApiData } from '@/core/apiHandlers/clientApiHandler';
import {
  type ExperimentSetup,
  ExperimentSetupSchema
} from '@/lib/schemas/experimentSetup';
import { validateTestSchema } from '@/lib/schemas/utils';
import useSWR from 'swr';

const useExperimentData = (
  experimentName: string,
  config?: any
): { mutate: () => Promise<void> } & (
  | {
      isLoading: boolean
      apiError?: any
      validationErrors?: string[]
      experimentData?: undefined
    }
  | {
      isLoading: false
      apiError?: undefined
      validationErrors?: undefined
      experimentData: ExperimentSetup
    }
) => {
  // Loading and parsing experiment data
  const {
    data: apiData,
    error,
    isLoading,
    mutate
  } = useSWR(`/api/v1/experiments/${experimentName}`, config);

  if (isLoading) {
    return { isLoading, mutate };
  }

  if (error != null) {
    return { isLoading, apiError: error, mutate };
  }

  const { data, validationError } = validateApiData(
    apiData,
    ExperimentSetupSchema
  );
  if (validationError != null) {
    return {isLoading, validationErrors: [validationError], mutate};
  }

  const testValidationErrors: string[] = [];
  data.tests.forEach((test) => {
    const validationResult = validateTestSchema(test);
    if (validationResult.validationError != null)
      testValidationErrors.push(validationResult.validationError);
    else test = validationResult.data;
  });
  if (testValidationErrors.length > 0) {
    return {isLoading, validationErrors: testValidationErrors, mutate};
  }

  return { isLoading, experimentData: data, mutate };
};

export default useExperimentData;
