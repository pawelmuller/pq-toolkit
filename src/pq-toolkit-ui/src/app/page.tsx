'use client'
import Link from 'next/link'
import { Suspense } from 'react'
import { experimentsListSchema } from './models'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import Error from './error'
import useSWR from 'swr'
import Loading from './[name]/loading'
import { validateApiData } from '@/core/apiHandlers/clientApiHandler'

const Home = (): JSX.Element => {
  return (
    <main className="flex min-h-screen p-24">
      <div className="flex flex-col h-full w-full items-center justify-center my-auto">
        <div
          className="relative before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:-translate-y-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]
        text-center mb-md"
        >
          <h1 className="text-6xl font-bold">Perceptual Qualities Toolkit</h1>
          <h2 className="text-xl font-semibold mt-sm">
            Home page of experiment UI for Perceptual Qualities Python Toolkit
          </h2>
        </div>
        <ErrorBoundary errorComponent={Error}>
          <Suspense fallback={<div>Loading</div>}>
            <ExperimentsListWidget />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  )
}

const ExperimentsListWidget = async (): Promise<JSX.Element> => {
  const { data: apiData, error, isLoading } = useSWR(`/api/v1/experiments`)

  if (isLoading) return <Loading />
  if (error != null)
    return (
      <div className="flex w-full items-center justify-center text-center h2">
        API Error
        <br />
        {error.toString()}
      </div>
    )
  const { data, validationError } = validateApiData(
    apiData,
    experimentsListSchema
  )
  if (validationError != null) {
    console.error(validationError)
    return (
      <div className="flex w-full items-center justify-center text-center h2">
        Invalid data from API, please check console for details
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center z-10">
      <div>Configured experiments:</div>
      <ul>
        {data.experiments.map((name, idx) => (
          <li key={idx}>
            <Link href={`/${name}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
