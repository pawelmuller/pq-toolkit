'use client'
import { useState } from 'react'
import SinglePlayer from '@/components/player/SinglePlayer'

const TestPage = (): JSX.Element => {
  const testEntry = {
    id: 1,
    type: 'AB',
    samples: [
      {
        id: 'a',
        assetPath: '/examples/samples/file_sample_5.mp3',
        name: 'Sample A'
      },
      {
        id: 'b',
        assetPath: '/examples/samples/file_sample_700.mp3',
        name: 'Sample B'
      }
    ],
    questions: [
      {
        id: 0,
        text: 'Select better quality'
      },
      {
        id: 1,
        text: 'Select more warmth'
      }
    ]
  }

  const { id, type, samples, questions } = testEntry

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
        <div className="text-xl font-semibold">
          Test {type} #{id + 1}
        </div>
        <div className="flex gap-md mt-md">
          {samples.map((sample, idx) => (
            <SinglePlayer
              key={`sample_player_${idx}`}
              assetPath={sample.assetPath}
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
        <div className="flex justify-center mt-md">
          <button className="bg-blue-500 rounded-md p-xs font-semibold text-white">
            Next
          </button>
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
  options: Array<{ id: string, name: string }>
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
            {option.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestPage
