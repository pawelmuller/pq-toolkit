'use client'
import { useContext } from 'react'
import Loading from '../loading'
import { ExperimentContext } from '../layout'
import InvalidConfigurationError from '../invalid-configuration-error'
import {
  type ABTest,
  type ABXTest,
  type APETest,
  type MUSHRATest,
  TestTypeEnum
} from '@/lib/schemas/experimentSetup'
import ABTestComponent from '@/lib/components/experiments/ABTestComponent'
import ABXTestComponent from '@/lib/components/experiments/ABXTestComponent'
import MUSHRATestComponent from '@/lib/components/experiments/MUSHRATestComponent'
import APETestComponent from '@/lib/components/experiments/APETestComponent'
import Link from 'next/link'

export const revalidate = 0

const TestPage = ({
  params
}: {
  params: { name: string; step: string }
}): JSX.Element => {
  const context = useContext(ExperimentContext)
  const data = context?.data
  const saveResults = context?.saveResults

  if (context?.error === true) return <InvalidConfigurationError />
  if (data == null) return <Loading />

  const { tests } = data

  const step = parseInt(params.step)
  if (isNaN(step) || step > tests.length || step < 1) {
    return <div>Invalid step</div>
  }

  const currentTest = tests[step - 1]

  const getTestComponent = (): JSX.Element => {
    switch (currentTest.type) {
      case TestTypeEnum.enum.AB:
        return (
          <ABTestComponent
            testData={currentTest as ABTest}
            experimentName={params.name}
            setAnswer={(result) => {
              context?.setAnswer(result)
            }}
          />
        )
      case TestTypeEnum.enum.ABX:
        return <ABXTestComponent testData={currentTest as ABXTest} />
      case TestTypeEnum.enum.MUSHRA:
        return <MUSHRATestComponent testData={currentTest as MUSHRATest} />
      case TestTypeEnum.enum.APE:
        return <APETestComponent testData={currentTest as APETest} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-xl font-semibold pt-md mt-auto">Test #{step}</h1>
      <div className="mb-auto mt-md">
        {getTestComponent()}
        <div className="flex justify-center mt-md gap-sm">
          {step > 1 && (
            <Link href={(step - 1).toString()}>
              <button className="bg-blue-500 rounded-md p-xs font-semibold text-white">
                Previous
              </button>
            </Link>
          )}
          {step === tests.length ? (
            <Link href="finish" onClick={saveResults}>
              <button className="bg-blue-500 rounded-md p-xs font-semibold text-white">
                Finish
              </button>
            </Link>
          ) : (
            <Link href={(step + 1).toString()}>
              <button className="bg-blue-500 rounded-md p-xs font-semibold text-white">
                Next
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestPage
