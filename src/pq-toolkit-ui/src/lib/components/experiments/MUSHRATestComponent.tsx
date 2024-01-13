'use client'

import { type MUSHRATest } from '@/lib/schemas/experimentSetup'
import {
  type MUSHRAResult,
  type PartialResult
} from '@/lib/schemas/experimentState'
import MultiPlayer from '../player/MultiPlayer'
import { getSampleUrl, shuffleArray } from './common/utils'
import VerticalMultislider from './common/VerticalMultislider'
import { useEffect, useState } from 'react'

const MUSHRATestComponent = ({
  testData,
  experimentName,
  setAnswer
}: {
  testData: MUSHRATest
  experimentName: string
  setAnswer: (result: PartialResult<MUSHRAResult>) => void
}): JSX.Element => {
  const { reference, anchors, samples, question } = testData

  const prepareSamples = (): Array<{ sampleId: string; assetPath: string }> => {
    const samplesCombined = [...samples, ...anchors, reference]
    const samplesCombinedMixed = shuffleArray(samplesCombined)
    return samplesCombinedMixed
  }

  const [shuffledSamples] = useState<
    Array<{ sampleId: string; assetPath: string }>
  >(prepareSamples())

  const [ratings, setRatings] = useState<Map<string, number>>(
    shuffledSamples.reduce<Map<string, number>>((map, sample) => {
      map.set(sample.sampleId, 50)
      return map
    }, new Map<string, number>())
  )

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
      <div className="flex gap-md mt-md">
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
