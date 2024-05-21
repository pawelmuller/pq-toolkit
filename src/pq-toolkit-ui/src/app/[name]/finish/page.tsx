'use client'
import { useContext } from 'react'
import InvalidConfigurationError from '../invalid-configuration-error'
import Loading from '../loading'
import { ExperimentContext } from '../layout'
import Link from "next/link"
import Header from "@/lib/components/basic/header"
import Blobs from "../../components/blobs"

const FinishPage = ({ params }: { params: { name: string } }): JSX.Element => {
  const context = useContext(ExperimentContext)
  const data = context?.data

  if (context?.error === true) return <InvalidConfigurationError />
  if (data == null) return <Loading />

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      <Header />
      <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-40">
        <div className="relative text-center mb-sm">
          <Blobs />
          <div className="fadeInUp">
            <h1 className="relative text-5xl md:text-6xl font-bold">Perceptual Qualities Toolkit</h1>
            <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm">
              Thank You
            </h2>
          </div>
        </div>
        <div className="flex content-center bg-white dark:bg-stone-900 rounded-2xl justify-center fadeInUp z-10 p-6 mt-4 md:mt-8">
          <div className="flex flex-col justify-center content-center text-center">
            <div className="text-lg mb-md">
              {data.endText ??
                'Thank you for participating in this test. Your results have been submitted.'}
            </div>
            <Link href={`/`}>
              <button className="bg-blue-500 rounded-md p-2 font-semibold text-white hover:bg-pink-500 dark:hover:bg-pink-600">
                Go back to homepage
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinishPage
