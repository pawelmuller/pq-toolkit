'use client'

import { type FullABXTest } from '@/lib/schemas/experimentSetup'
import { useEffect, useState } from 'react'
import MultiPlayer from '../player/MultiPlayer'
import SingleSelectQuestion from './common/SingleSelectQuestion'
import { getSampleUrl } from './common/utils'
import {
  type PartialResult,
  type ABXResult
} from '@/lib/schemas/experimentState'

const ABXTestComponent = ({
  testData,
  experimentName,
  setAnswer
}: {
  testData: FullABXTest
  experimentName: string
  setAnswer: (result: PartialResult<ABXResult>) => void
}): JSX.Element => {
  const { samples, questions } = testData

  const [questionsSelected, setQuestionsSelected] = useState<
    Record<string, string>
  >({})
  const [xSelected, setXSelected] = useState<string>()

  const getCombinedSamples = (): Map<string, string> => {
    const map = samples.reduce<Map<string, string>>((map, sample, idx) => {
      map.set(
        `Sample ${idx + 1}`,
        getSampleUrl(experimentName, sample.assetPath)
      )
      return map
    }, new Map<string, string>())
    map.set(
      'X',
      getSampleUrl(
        experimentName,
        samples.find((s) => s.sampleId === testData.xSampleId)?.assetPath ?? ''
      )
    )
    return map
  }

  const updateSelections = (questionId: string, sampleIdx: number): void => {
    const selectedSampleId = samples[sampleIdx].sampleId
    setQuestionsSelected((prev) => ({
      ...prev,
      [questionId]: selectedSampleId
    }))
  }

  useEffect(() => {
    const result: PartialResult<ABXResult> = {
      testNumber: testData.testNumber,

      xSampleId: testData.xSampleId,
      xSelected,

      selections: Object.keys(questionsSelected).map((questionId) => ({
        questionId,
        sampleId: questionsSelected[questionId]
      }))
    }
    setAnswer(result)
  }, [
    questionsSelected,
    setAnswer,
    testData.testNumber,
    testData.xSampleId,
    xSelected
  ])

  return (
    <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
      <div className="flex gap-md mt-md">
        <MultiPlayer assets={getCombinedSamples()} />
      </div>
      <div className="flex flex-col gap-sm w-full mt-md">
        <SingleSelectQuestion
          text="Which sample is X?"
          sampleNames={Array.from(
            { length: samples.length },
            (_, i) => `Sample ${i + 1}`
          )}
          onOptionSelect={(selectedIdx) => {
            setXSelected(testData.samples[selectedIdx].sampleId)
          }}
        />
      </div>
      {questions != null && (
        <div className="flex flex-col gap-sm w-full mt-md">
          {questions.map((question, idx) => (
            <SingleSelectQuestion
              key={`question_${idx}`}
              text={question.text}
              sampleNames={Array.from(
                { length: samples.length },
                (_, i) => `Sample ${i + 1}`
              )}
              onOptionSelect={(selectedId) => {
                updateSelections(question.questionId, selectedId)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ABXTestComponent
