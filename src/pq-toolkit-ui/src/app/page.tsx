'use client'
import Link from 'next/link'
import { experimentsListSchema } from './models'
import useSWR from 'swr'
import Loading from './loading'
import { validateApiData } from '@/core/apiHandlers/clientApiHandler'
import Header from '@/lib/components/basic/header'

const Home = (): JSX.Element => {
  return (
    <main className="flex min-h-screen p-24 bg-gray-100">
      <div className="fixed w-11/12 md:mx-auto top-0 left-0 right-0">
        <div className="w-full flex items-center justify-between pt-7 pb-2 pr-2 pl-0">
          <a className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-3xl lg:text-4xl md:text-4xl transform duration-300 ease-in-out fadeInUp" href="/">
            <img src='/logo.svg' alt="image" className="flex -mt-2.5 w-20 h-11 md:h-auto md:p-2 transform hover:scale-125 duration-300 ease-in-out" />
            PQ<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500">Toolkit</span>
          </a>
          <div className="flex w-1/2 justify-end content-center fadeInUp">
            <a className="inline-block text-blue-400 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 -mt-2.5 md:h-auto md:p-1 transform hover:scale-125 duration-300 ease-in-out" href="https://github.com/pawelmuller/pq-toolkit">
              <svg className="fill-current h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                <path
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
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
    </main>
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
