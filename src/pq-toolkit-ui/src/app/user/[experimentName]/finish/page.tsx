'use client'
import { useContext } from 'react'
import InvalidConfigurationError from '../invalid-configuration-error'
import Loading from '../loading'
import { ExperimentContext } from '../layout'

const FinishPage = ({
  params
}: {
  params: { experimentName: string }
}): JSX.Element => {
  const context = useContext(ExperimentContext)
  const data = context?.data

  if (context?.error === true) return <InvalidConfigurationError />
  if (data == null) return <Loading />

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
        <div className="text-lg">
          This is finish page for experiment <b>{params.experimentName}</b>
        </div>
      </div>
    </main>
  )
}

export default FinishPage
