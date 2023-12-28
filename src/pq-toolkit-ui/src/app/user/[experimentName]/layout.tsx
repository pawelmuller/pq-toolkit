'use client'
import { fetchJsonData } from '@/app/utils/dataFetch'
import { type Draft, Draft07, type JsonError } from 'json-schema-library'
import { createContext, useEffect, useState } from 'react'
import experimentSchema from '@/utils/schemas/experiment-setup.schema.json'
import { type ExperimentSetup } from '@/utils/schemas/experimentSetup'

export const ExperimentContext = createContext<{
  data: ExperimentSetup
  error: boolean
} | null>(null)

const TestProviderWrapper = ({
  children,
  params
}: {
  children: React.ReactNode
  params: { experimentName: string }
}): JSX.Element => {
  const { experimentName } = params

  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    fetchJsonData(`/api/v1/experiments/${experimentName}`)
      .then((result) => {
        const jsonSchema: Draft = new Draft07(experimentSchema)
        const errors: JsonError[] = jsonSchema.validate(result)

        if (errors.length > 0) {
          setError(true)
          setData(null)
        } else {
          setError(false)
          setData(result)
        }
      })
      .catch(() => {
        setError(true)
      })
  }, [experimentName])

  return (
    <ExperimentContext.Provider value={{ data, error }}>
      {children}
    </ExperimentContext.Provider>
  )
}

export default TestProviderWrapper
