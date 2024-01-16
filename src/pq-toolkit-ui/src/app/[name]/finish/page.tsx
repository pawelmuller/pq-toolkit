'use client'
import { useContext } from 'react'
import InvalidConfigurationError from '../invalid-configuration-error'
import Loading from '../loading'
import { ExperimentContext } from '../layout'
import Link from "next/link";

const FinishPage = ({ params }: { params: { name: string } }): JSX.Element => {
  const context = useContext(ExperimentContext)
  const data = context?.data

  if (context?.error === true) return <InvalidConfigurationError />
  if (data == null) return <Loading />

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
        <div className="text-lg">
          {data.endText ??
            'Thank you for participating in this test. Your results have been submitted.'}
        </div>
        <Link href={`/`} className="mt-md">Go back to homepage</Link>
      </div>
    </main>
  )
}

export default FinishPage
