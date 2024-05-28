'use client'

import { type FullMUSHRATest } from '@/lib/schemas/experimentSetup'
import {
  type MUSHRAResult,
  type PartialResult
} from '@/lib/schemas/experimentState'
import MultiPlayer from '../player/MultiPlayer'
import { getSampleUrl } from './common/utils'
import React, { useEffect, useState } from 'react'
import VerticalSlider from '@/lib/components/experiments/common/VerticalSlider'

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

  const selectedPlayerState = useState<number>(0)

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

  const sliderSetRating = (value: number, sampleId: string): void => {
    setRatings((prevState) => {
      const newState = new Map(prevState)
      newState.set(sampleId, value)
      return newState
    })
  }

  const getMUSHRAscale = (): JSX.Element => {
    const scale = ['Terrible', 'Bad', 'Poor', 'Fair', 'Good', 'Excellent']

    return (
      <div className="h-full flex flex-col justify-between">
        {scale.reverse().map((label: string) => (
          <div className="text-right text-xl font-bold text-pink-600" key={label}>
            {label}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-md p-lg flex flex-col items-center text-black dark:bg-gray-800/10">
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <div className="text-center">{question}</div>
        </div>
        <MultiPlayer
          assets={[reference, ...shuffledSamples].reduce<
            Map<string, { url: string; footers: JSX.Element[] }>
          >((map, sample, idx) => {
            const sampleName = idx === 0 ? 'Reference' : `Sample ${idx}`
            map.set(sampleName, {
              url: getSampleUrl(experimentName, sample.assetPath),
              footers:
                idx === 0
                  ? [getMUSHRAscale()]
                  : [
                      <VerticalSlider
                        key={`slider_${idx}`}
                        rating={ratings.get(sample.sampleId) ?? 0}
                        setRating={(value) => {
                          sliderSetRating(value, sample.sampleId)
                        }}
                      />,
                      <div className="text-center text-xl font-bold text-pink-600" key={`rating_${idx}`}>
                        {ratings.get(sample.sampleId) ?? 0}
                      </div>
                    ]
            })
            return map
          }, new Map<string, { url: string; footers: JSX.Element[] }>())}
          selectedPlayerState={selectedPlayerState}
        />
      </div>
    </div>
  )
}

export default MUSHRATestComponent
