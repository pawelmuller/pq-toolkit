'use client'

import {type APETest} from '@/lib/schemas/experimentSetup'
import {
  type APEResult,
  type PartialResult
} from '@/lib/schemas/experimentState'
import MultiPlayer from '../player/MultiPlayer'
import {getSampleUrl} from './common/utils'
import OrderSlider from './common/OrderSlider'
import {useEffect, useState} from "react";

const APETestComponent = ({
                            testData,
                            experimentName,
                            setAnswer
                          }: {
  testData: APETest
  experimentName: string
  setAnswer: (result: PartialResult<APEResult>) => void
}): JSX.Element => {
  const {axis, samples} = testData
  const selectedPlayerState = useState<number>(0)
  const [responses, setResponses] = useState(axis.reduce<Map<string, Map<string, number>>>((map_axis, sample_axis) => {
        map_axis.set(
          sample_axis.questionId,
          samples.reduce<Map<string, number>>((map_samples, sample_samples) => {
            map_samples.set(
              sample_samples.sampleId,
              0
            )
            return map_samples
          }, new Map<string, number>())
        )
        return map_axis
      }, new Map<string, Map<string, number>>()
    )
  )

  useEffect(() => {
    const result: PartialResult<APEResult> = {
      testNumber: testData.testNumber,
      axisResults: Object.keys(responses).map((questionId) => ({
            axisId: questionId,
            sampleRatings: Array.from(Object.keys((responses.get(questionId) as Map<string, number>).keys())).map((sampleId) => ({
              sampleId,
              rating: responses.get(questionId)!.get(sampleId) as number
            }))
          }
        )
      )
    }
    setAnswer(result)
  }, [
    responses,
    setAnswer,
    testData.testNumber,
  ])

  return (
    <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
      <div className="flex gap-md mt-md">
        <MultiPlayer
          assets={samples.reduce<Map<string, string>>((map, sample, idx) => {
            map.set(
              `Sample ${idx + 1}`,
              getSampleUrl(experimentName, sample.assetPath)
            )
            return map
          }, new Map<string, string>())}
          selectedPlayerState={selectedPlayerState}
        />
      </div>
      <div className="flex flex-col gap-sm w-full mt-md">
        {axis.map(({text, questionId}) => (
          <div className="mb-sm">
            {text}
            <OrderSlider
              key={`slider_${questionId}`}
              currentSample={selectedPlayerState[0]}
              samples={samples}
              updateResponses={(newValueMap: Map<string, number>) => {
                setResponses((prevState) => {
                  const newResponses = new Map(prevState)
                  newResponses.set(questionId, newValueMap)
                  return newResponses
                })
              }}
              // This did not work - sliders in OrderSlider wouldn't update live
              //
              // responses={responses.get(questionId) ?? new Map<string, number>()}
              // changeResponses={(sampleId: string, newValue: number) => {
              //   setResponses((prevState) => {
              //     const newState = prevState.get(questionId)
              //     newState?.set(sampleId, newValue)
              //     !!newState && prevState.set(questionId, newState)
              //     console.log(prevState)
              //     return prevState
              //   })
              // }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default APETestComponent
