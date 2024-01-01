'use client'
import Link from 'next/link'
import { useContext } from 'react'
import { ExperimentContext } from './layout'
import Loading from './loading'
import InvalidConfigurationError from './invalid-configuration-error'

const ExperimentWelcomePage = ({
  params
}: {
  params: { name: string }
}): JSX.Element => {
  const { name: experimentName } = params

  return (
    <main className="flex min-h-screen min-w-[480px] flex-col items-center justify-center">
      <WelcomeContent name={experimentName} />
    </main>
  )
}

const WelcomeContent = async ({
  name: experimentName
}: {
  name: string
}): Promise<JSX.Element> => {
  const context = useContext(ExperimentContext)
  const data = context?.data

  if (context?.error === true) return <InvalidConfigurationError />
  if (data == null) return <Loading />

  return (
    <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
      <div className="text-lg">
        Welcome to experiment <b>{data.name}</b>
      </div>
      <div className="mt-sm">{data.description}</div>
      <div className="mt-md">
        <Link href={`/${experimentName}/1`}>
          <button className="bg-blue-500 p-xs rounded-lg text-white font-bold">
            Start
          </button>
        </Link>
      </div>
    </div>
  )
}

export default ExperimentWelcomePage
