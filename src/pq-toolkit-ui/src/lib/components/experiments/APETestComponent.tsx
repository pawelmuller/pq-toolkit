'use client';

import { type APETest } from '@/lib/schemas/experimentSetup';
import {
  type APEResult,
  type PartialResult
} from '@/lib/schemas/experimentState';
import MultiPlayer from '../player/MultiPlayer';
import { getSampleUrl } from './common/utils';
import OrderSlider from './common/OrderSlider';
import { useEffect, useState } from 'react';

const APETestComponent = ({
  testData,
  initialValues,
  experimentName,
  setAnswer,
  feedback
}: {
  testData: APETest
  initialValues?: PartialResult<APEResult>
  experimentName: string
  setAnswer: (result: PartialResult<APEResult>) => void
  feedback: string
}): JSX.Element => {
  const { axis, samples } = testData;
  const selectedPlayerState = useState<number>(0);
  const [responses, setResponses] = useState(
    axis.reduce<Map<string, Map<string, number>>>((mapAxis, sampleAxis) => {
      const axisResults = initialValues?.axisResults?.find(
        (r) => r.axisId === sampleAxis.questionId
      );
      mapAxis.set(
        sampleAxis.questionId,
        samples.reduce<Map<string, number>>((mapSamples, sampleSamples) => {
          const idx = axisResults?.sampleRatings.findIndex((r) => r.sampleId === sampleSamples.sampleId) ?? -1;

          if (idx !== -1) {
            mapSamples.set(sampleSamples.sampleId, axisResults?.sampleRatings[idx].rating ?? 0);
          } else {
            mapSamples.set(sampleSamples.sampleId, 0);
          }

          return mapSamples;
        }, new Map<string, number>())
      );
      return mapAxis;
    }, new Map<string, Map<string, number>>())
  );

  useEffect(() => {
    const result: PartialResult<APEResult> = {
      testNumber: testData.testNumber,
      axisResults: Array.from(responses.keys()).map((questionId) => ({
        axisId: questionId,
        sampleRatings: Array.from(
          Array.from((responses.get(questionId) as Map<string, number>).keys())
        ).map((sampleId) => ({
          sampleId,
          rating: responses.get(questionId)?.get(sampleId) as number
        }))
      })),
      feedback
    };
    setAnswer(result);
  }, [responses, setAnswer, testData.testNumber, feedback]);

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-2xl">
      <h2 className="relative text-center text-3xl md:text-2xl font-semibold -mb-2">
        APE Test
      </h2>
      <div className="flex gap-md mt-md">
        <MultiPlayer
          assets={samples.reduce<Map<string, { url: string }>>(
            (map, sample, idx) => {
              map.set(`Sample ${idx + 1}`, {
                url: getSampleUrl(experimentName, sample.assetPath)
              });
              return map;
            },
            new Map<string, { url: string }>()
          )}
          selectedPlayerState={selectedPlayerState}
        />
      </div>
      <div className="flex flex-col gap-sm w-full mt-4">
        {axis.map(({ text, questionId }) => (
          <div className="mb-sm" key={`q${questionId}`}>
            <div className="font-semibold text-2xl md:text-lg mb-1">{text}</div>
            <OrderSlider
              key={`slider_${questionId}`}
              currentSample={selectedPlayerState[0]}
              samples={samples}
              initialValues={responses.get(questionId)}
              updateResponses={(newValueMap: Map<string, number>) => {
                setResponses((prevState) => {
                  const newResponses = new Map(prevState);
                  newResponses.set(questionId, newValueMap);
                  return newResponses;
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default APETestComponent;
