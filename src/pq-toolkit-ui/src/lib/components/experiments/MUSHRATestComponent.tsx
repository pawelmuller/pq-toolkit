'use client'

import { type FullMUSHRATest } from '@/lib/schemas/experimentSetup'
import {
  type MUSHRAResult,
  type PartialResult
} from '@/lib/schemas/experimentState'
import MultiPlayer from '../player/MultiPlayer'
import { getSampleUrl } from './common/utils'
import VerticalMultislider from './common/VerticalMultislider'
import { useEffect, useState } from 'react'

const MUSHRATestComponent = ({
  testData,
  initialValues,
  experimentName,
  setAnswer
}: {
  testData: FullMUSHRATest
  initialValues?: PartialResult<MUSHRAResult>
  experimentName: string
  setAnswer: (result: PartialResult<MUSHRAResult>) => void
}): JSX.Element => {
  const { reference, anchors, samples, question } = testData

  const prepareSamples = (): Array<{ sampleId: string; assetPath: string }> => {
    const samplesCombined = [...samples, ...anchors, reference]
    samplesCombined.sort((a, b) =>
      testData.samplesShuffle.findIndex((v) => v === a.sampleId) >
      testData.samplesShuffle.findIndex((v) => v === b.sampleId)
        ? 1
        : -1
    )
    return samplesCombined
  }

  const [shuffledSamples] = useState<
    Array<{ sampleId: string; assetPath: string }>
  >(prepareSamples())

  const [ratings, setRatings] = useState<Map<string, number>>(() => {
    const savedRatings: Array<{ sampleId: string; score: number }> = []
    if (initialValues?.samplesScores != null) {
      savedRatings.push(...initialValues.samplesScores)
    }
    if (initialValues?.anchorsScores != null) {
      savedRatings.push(...initialValues.anchorsScores)
    }
    if (initialValues?.referenceScore != null) {
      savedRatings.push({
        sampleId: reference.sampleId,
        score: initialValues.referenceScore
      })
    }

    return shuffledSamples.reduce<Map<string, number>>((map, sample) => {
      const idx = savedRatings.findIndex((r) => r.sampleId === sample.sampleId)

      if (idx !== -1) {
        map.set(sample.sampleId, savedRatings[idx].score)
      } else {
        map.set(sample.sampleId, 50)
      }

      return map
    }, new Map<string, number>())
  })

  useEffect(() => {
    const result: MUSHRAResult = {
      testNumber: testData.testNumber,
      anchorsScores: testData.anchors.map(({ sampleId }) => ({
        sampleId,
        score: ratings.get(sampleId) ?? -1
      })),
      referenceScore: ratings.get(reference.sampleId) ?? -1,
      samplesScores: testData.samples.map(({ sampleId }) => ({
        sampleId,
        score: ratings.get(sampleId) ?? -1
      }))
    }

    setAnswer(result)
  }, [
    setAnswer,
    ratings,
    testData.testNumber,
    testData.anchors,
    testData.samples,
    reference.sampleId
  ])

  return (
    <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <div className="text-center">{question}</div>
        </div>
        <MultiPlayer
          assets={[reference, ...shuffledSamples].reduce<Map<string, string>>(
            (map, sample, idx) => {
              const sampleName = idx === 0 ? 'Reference' : `Sample ${idx}`
              map.set(
                sampleName,
                getSampleUrl(experimentName, sample.assetPath)
              )
              return map
            },
            new Map<string, string>()
          )}
        />
      </div>
      <div className="flex mt-md self-end w-full">
        <VerticalMultislider ratings={ratings} setRatings={setRatings} />
      </div>
    </div>
  )
}

export default MUSHRATestComponent
