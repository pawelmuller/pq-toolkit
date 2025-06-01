'use client';
import { createContext } from 'react';
import { type ExperimentSetup } from '@/lib/schemas/experimentSetup';
import Loading from './loading';
import {
  type BaseResult,
  type ABResult,
  type ABXResult,
  type APEResult,
  type MUSHRAResult,
  type PartialResult
} from '@/lib/schemas/experimentState';
import { fillTest } from './utils';
import useExperimentData from '@/lib/components/experiments/hooks/useExperimentData';
import useStorage from '@/core/hooks/useStorage';
import { listExperimentSamples } from '@/lib/schemas/utils';
import useSWR from 'swr';

/**
 * Context which provides all values used during testing
 * and stores all intermediate test results
 */
export const ExperimentContext = createContext<{
  data: ExperimentSetup
  error: boolean
  results: { results: BaseResult[] }
  setAnswer: (result: BaseResult) => void
  saveResults: () => Promise<void>
} | null>(null);

const ExperimentContextProvider = ({
  children,
  params
}: {
  children: React.ReactNode
  params: { name: string }
}): JSX.Element => {
  const { name: experimentName } = params;

  const { getItem, setItem, removeItem } = useStorage();

  // Loading and parsing experiment data
  const {
    isLoading,
    apiError,
    experimentData: data,
    validationErrors
  } = useExperimentData(experimentName);

  // Loading available experiment samples
  const {
    data: samplesData,
    error: samplesApiError,
    isLoading: samplesLoading
  } = useSWR(`/api/v1/experiments/${experimentName}/samples`);

  if (isLoading || samplesLoading) {
    return <Loading />;
  }
  if (apiError != null || samplesApiError != null)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        API Error
        <br />
        {apiError.toString()}
        {samplesApiError.toString()}
      </div>
    );

  if (validationErrors != null && validationErrors.length > 0)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        Invalid experiment configuration file
      </div>
    );

  if (data == null)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        Cannot load experiment data
      </div>
    );

  if (samplesData == null)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        Cannot load experiment samples
      </div>
    );

  if (!validateExperimentSamples(data, samplesData)) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        Experiment samples are missing
      </div>
    );
  }

  // Fill all randomizable values with random values or restore saved values
  const savedData = getItem(`experiment-${experimentName}-data`);
  if (savedData != null && savedData.length > 0) {
    const parsedData = JSON.parse(savedData);
    data.tests = parsedData;
  } else {
    data.tests = data.tests.map((test) => fillTest(test));
    setItem(`experiment-${experimentName}-data`, JSON.stringify(data.tests));
  }

  // Prepare results object or restore saved results
  let results: { results: BaseResult[] } = { results: [] };

  const savedResults = getItem(`experiment-${experimentName}-results`);
  if (savedResults != null && savedResults.length > 0) {
    results = JSON.parse(savedResults);
  } else {
    results.results = [];
    setItem(`experiment-${experimentName}-results`, JSON.stringify(results));
  }

  const setAnswer = (
    result:
      | PartialResult<ABResult>
      | PartialResult<ABXResult>
      | PartialResult<MUSHRAResult>
      | PartialResult<APEResult>
  ): void => {
    const temp = results.results.filter(
      (v) => v.testNumber !== result.testNumber
    );
    temp.push(result);
    results.results = temp;
    setItem(`experiment-${experimentName}-results`, JSON.stringify(results));
  };

  const saveResults = async (): Promise<void> => {
    await fetch(`/api/v1/experiments/${experimentName}/results`, {
      method: 'POST',
      body: JSON.stringify(results),
      headers: { 'Content-Type': 'application/json' }
    });
    removeItem(`experiment-${experimentName}-data`);
    removeItem(`experiment-${experimentName}-results`);
  };

  return (
    <ExperimentContext.Provider
      value={{
        data,
        error: apiError != null || validationErrors != null,
        results,
        setAnswer,
        saveResults
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};

const validateExperimentSamples = (
  experimentData: ExperimentSetup,
  samplesList: string[]
): boolean => {
  const requiredSamples = listExperimentSamples(experimentData);
  const missingSamples = requiredSamples.filter(
    (sample) => !samplesList.includes(sample)
  );
  return missingSamples.length === 0;
};

/**
 * Wraps this route and all sub routes with SWR Config Provider (base API config)
 * and with ExperimentContextProvider which provides all experiment data
 * and stores experiment results until they are saved
 */
const ExperimentContextWrapper = ({
  children,
  params
}: {
  children: React.ReactNode
  params: { name: string }
}): JSX.Element => {
  return (
    <ExperimentContextProvider params={params}>
      {children}
    </ExperimentContextProvider>
  );
};

export default ExperimentContextWrapper;
