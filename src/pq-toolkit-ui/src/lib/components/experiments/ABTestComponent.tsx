'use client'

import { type ABTest } from '@/lib/schemas/experimentSetup'
import SingleSelectQuestion from './common/SingleSelectQuestion'
import SinglePlayer from '../player/SinglePlayer'
import { type ABResult } from '@/lib/schemas/experimentState'
import { useEffect, useState } from 'react'

const ABTestComponent = ({
  testData,
  experimentName,
  setAnswer
}: {
  testData: ABTest
  experimentName: string
  setAnswer: (result: ABResult) => void
}): JSX.Element => {
  const { samples, questions } = testData

  const [selected, setSelected] = useState<Record<string, string>>({})

  const updateSelections = (questionId: string, sampleIdx: number): void => {
    const selectedSampleId = samples[sampleIdx].sampleId
    setSelected((prev) => ({
      ...prev,
      [questionId]: selectedSampleId
    }))
  }

  useEffect(() => {
    const result: ABResult = {
      selections: Object.keys(selected).map((questionId) => ({
        questionId,
        sampleId: selected[questionId]
      }))
    }
    setAnswer(result)
  }, [setAnswer, selected])

  return (
    <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
      <div className="flex gap-md mt-md">
        {samples.map((sample, idx) => (
          <SinglePlayer
            key={`sample_player_${idx}`}
            assetPath={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments/${experimentName}/${sample.assetPath}`}
            name={`Sample ${idx + 1}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-sm w-full mt-md">
        {questions.map((question, idx) => (
          <SingleSelectQuestion
            key={`question_${idx}`}
            text={question.text}
            sampleCount={samples.length}
            onOptionSelect={(selectedId) => {
              updateSelections(question.questionId, selectedId)
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ABTestComponent
