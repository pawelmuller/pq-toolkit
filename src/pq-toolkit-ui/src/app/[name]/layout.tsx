'use client'
import { createContext } from 'react'
import {
  experimentSetupSchema,
  type ExperimentSetup
} from '@/schemas/experimentSetup'
import {
  SWRConfigProvider,
  validateApiData
} from '@/core/apiHandlers/clientApiHandler'
import useSWR from 'swr'
import Loading from './loading'

export const ExperimentContext = createContext<{
  data: ExperimentSetup
  error: boolean
} | null>(null)

const TestProviderWrapper = ({
  children,
  params
}: {
  children: React.ReactNode
  params: { name: string }
}): JSX.Element => {
  const { name: experimentName } = params

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
    experimentSetupSchema
  )
  if (validationError != null)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        Invalid experiment configuration file
      </div>
    )

  return (
    <ExperimentContext.Provider value={{ data, error }}>
      {children}
    </ExperimentContext.Provider>
  )
}

const ExperimentContextWrapper = ({
  children,
  params
}: {
  children: React.ReactNode
  params: { name: string }
}): JSX.Element => {
  return (
    <SWRConfigProvider>
      <TestProviderWrapper params={params}>{children}</TestProviderWrapper>
    </SWRConfigProvider>
  )
}

export default ExperimentContextWrapper
