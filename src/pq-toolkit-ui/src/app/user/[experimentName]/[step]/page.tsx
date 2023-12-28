'use client'
import { useContext, useState } from 'react'
import SinglePlayer from '@/components/player/SinglePlayer'
import Loading from '../loading'
import { ExperimentContext } from '../layout'
import InvalidConfigurationError from '../invalid-configuration-error'
import { type TestSample } from '@/utils/schemas/experimentSetup'
import Link from 'next/link'

export const revalidate = 0

const TestPage = ({
  params
}: {
  params: { experimentName: string, step: string }
}): JSX.Element => {
  const context = useContext(ExperimentContext)
  const data = context?.data

  if (context?.error === true) return <InvalidConfigurationError />
  if (data == null) return <Loading />

  const { tests } = data

  const step = parseInt(params.step)
  if (isNaN(step) || step > tests.length || step < 1) {
    return <div>Invalid step</div>
  }

  const currentTest = tests[step - 1]
  const { type, samples, questions } = currentTest

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
        <div className="text-xl font-semibold">
          Test {type} #{step}
        </div>
        <div className="flex gap-md mt-md">
          {samples.map((sample, idx) => (
            <SinglePlayer
              key={`sample_player_${idx}`}
              assetPath={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments/${params.experimentName}/${sample.assetPath}`}
              name={`Sample ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-sm w-full mt-md">
          {questions.map((question, idx) => (
            <SingleSelectQuestion
              key={`question_${idx}`}
              text={question.text}
              options={samples}
            />
          ))}
        </div>
        <div className="flex justify-center mt-md gap-sm">
          {step > 1 && (
            <Link href={(step - 1).toString()}>
              <button className="bg-blue-500 rounded-md p-xs font-semibold text-white">
                Previous
              </button>
            </Link>
          )}
          {step === tests.length
            ? (
            <Link href="finish">
              <button className="bg-blue-500 rounded-md p-xs font-semibold text-white">
                Finish
              </button>
            </Link>
              )
            : (
            <Link href={(step + 1).toString()}>
              <button className="bg-blue-500 rounded-md p-xs font-semibold text-white">
                Next
              </button>
            </Link>
              )}
        </div>
      </div>
    </main>
  )
}

const SingleSelectQuestion = ({
  text,
  options
}: {
  text: string
  options: TestSample[]
}): JSX.Element => {
  const [selectableOptions, setSelectableOptions] = useState(
    options.map((option) => ({
      ...option,
      selected: false
    }))
  )

  const onOptionSelect = (selectedId: string): void => {
    setSelectableOptions((prevState) => {
      return prevState.map((option) => ({
        ...option,
        selected: option.id === selectedId
      }))
    })
  }

  return (
    <div className="w-full">
      <div className="text-md font-semibold">{text}</div>
      <div className="flex gap-sm">
        {selectableOptions.map((option, idx) => (
          <div
            key={`option_${idx}`}
            className={`w-full min-h-[4rem] h-max max-h-[8rem] rounded-md ${
              option.selected ? 'bg-blue-500' : 'bg-blue-100'
            } flex items-center justify-center cursor-pointer`}
            onClick={() => {
              onOptionSelect(option.id)
            }}
          >
            Sample {idx + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestPage
