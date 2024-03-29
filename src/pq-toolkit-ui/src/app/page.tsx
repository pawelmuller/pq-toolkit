'use client'
import Link from 'next/link'
import { experimentsListSchema } from './models'
import useSWR from 'swr'
import Loading from './loading'
import { validateApiData } from '@/core/apiHandlers/clientApiHandler'
import Header from '@/lib/components/basic/header'

const Home = (): JSX.Element => {
  return (
    <div className=" min-h-screen bg-gray-100">
      <Header>
        <div className="flex flex-col h-full w-full items-center justify-center my-auto fadeInUp">
          <div className="relative text-center mb-md">
            <div className='absolute -top-14 right-36 w-80 h-80 bg-gradient-to-r from-pink-700 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000' />
            <div className='absolute -top-14 left-36 w-80 h-80 bg-gradient-to-r from-cyan-600 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-6000' />
            <div className='absolute top-10 right-64 w-80 h-80 bg-gradient-to-r from-pink-500 to-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000' />
            <div className='absolute -top-28 -right-6 w-96 h-96 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-8000' />
            <div className='absolute -top-24 -left-11 w-96 h-96 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-10000' />
            <h1 className="relative text-6xl font-bold">Perceptual Qualities Toolkit</h1>
            <h2 className="relative text-xl font-semibold mt-sm">
              Home page of experiment UI for Perceptual Qualities Python Toolkit
            </h2>
          </div>
          <ExperimentsListWidget />
        </div>
      </Header>
    </div>
  )
}

const ExperimentsListWidget = (): JSX.Element => {
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
          <li key={idx} className="text-center justify-center hover:bg-blue-400 rounded-md">
            <Link href={`/${name}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
