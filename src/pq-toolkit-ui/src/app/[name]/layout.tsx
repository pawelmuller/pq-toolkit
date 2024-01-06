'use client'
import { createContext } from 'react'
import {
  ExperimentSetupSchema,
  type ExperimentSetup
} from '@/lib/schemas/experimentSetup'
import { validateApiData } from '@/core/apiHandlers/clientApiHandler'
import useSWR from 'swr'
import Loading from './loading'
import { validateTestSchema } from '@/lib/schemas/utils'
import {
  type BaseResult,
  type ABResult,
  type ABXResult,
  type APEResult,
  type MUSHRAResult,
  type PartialResult
} from '@/lib/schemas/experimentState'
import { fillTest } from './utils'

/**
 * Context which provides all values used during testing
 * and stores all intermediate test results
 */
export const ExperimentContext = createContext<{
  data: ExperimentSetup
  error: boolean
  results: Record<string, unknown>
  setAnswer: (result: BaseResult) => void
  saveResults: () => Promise<void>
} | null>(null)

const ExperimentContextProvider = ({
  children,
  params
}: {
  children: React.ReactNode
  params: { name: string }
}): JSX.Element => {
  const { name: experimentName } = params

  // Loading and parsing experiment data
  const {
    data: apiData,
    error,
    isLoading
  } = useSWR(`/api/v1/experiments/${experimentName}`)

  if (isLoading) return <Loading />
  if (error != null)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        API Error
        <br />
        {error.toString()}
      </div>
    )

  const { data, validationError } = validateApiData(
    apiData,
    ExperimentSetupSchema
  )
  if (validationError != null)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        Invalid experiment configuration file
      </div>
    )

  const testValidationErrors: string[] = []
  data.tests.forEach((test) => {
    const validationResult = validateTestSchema(test)
    if (validationResult.validationError != null)
      testValidationErrors.push(validationResult.validationError)
    else test = validationResult.data
  })
  if (testValidationErrors.length > 0)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        One or more tests have invalid configuration
      </div>
    )

  // Fill all randomizable values
  data.tests = data.tests.map((test) => fillTest(test))

  // Prepare results object
  const results: { results: BaseResult[] } = { results: [] }

  const setAnswer = (
    result:
      | PartialResult<ABResult>
      | PartialResult<ABXResult>
      | PartialResult<MUSHRAResult>
      | PartialResult<APEResult>
  ): void => {
    const temp = results.results.filter(
      (v) => v.testNumber !== result.testNumber
    )
    temp.push(result)
    results.results = temp
  }

  const saveResults = async (): Promise<void> => {
    await fetch(`/api/v1/experiments/${experimentName}/results`, {
      method: 'POST',
      body: JSON.stringify(results)
    })
  }

  return (
    <ExperimentContext.Provider
      value={{ data, error, results, setAnswer, saveResults }}
    >
      {children}
    </ExperimentContext.Provider>
  )
}

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
  )
}

export default ExperimentContextWrapper
