'use client';

import { type FullABXTest } from '@/lib/schemas/experimentSetup';
import { useEffect, useState } from 'react';
import MultiPlayer from '../player/MultiPlayer';
import SingleSelectQuestion from './common/SingleSelectQuestion';
import { getSampleUrl } from './common/utils';
import {
  type PartialResult,
  type ABXResult
} from '@/lib/schemas/experimentState';

const ABXTestComponent = ({
  testData,
  initialValues,
  experimentName,
  setAnswer,
  feedback
}: {
  testData: FullABXTest
  initialValues?: PartialResult<ABXResult>
  experimentName: string
  setAnswer: (result: PartialResult<ABXResult>) => void
  feedback: string
}): JSX.Element => {
  const { samples, questions } = testData;

  const getInitialSelections = (): Record<string, string> => {
    if (initialValues?.selections == null) return {};

    const result: Record<string, string> = {};
    initialValues.selections.forEach((selection) => {
      result[selection.questionId] = selection.sampleId;
    });
    return result;
  };

  const [questionsSelected, setQuestionsSelected] = useState<Record<string, string>>(getInitialSelections());
  const [xSelected, setXSelected] = useState<string | undefined>(initialValues?.xSelected);

  const selectedPlayerState = useState<number>(0);

  const getCombinedSamples = (): Map<string, { url: string }> => {
    const map = samples.reduce<Map<string, { url: string }>>(
      (map, sample, idx) => {
        map.set(`Sample ${idx + 1}`, {
          url: getSampleUrl(experimentName, sample.assetPath)
        });
        return map;
      },
      new Map<string, { url: string }>()
    );
    map.set('X', {
      url: getSampleUrl(
        experimentName,
        samples.find((s) => s.sampleId === testData.xSampleId)?.assetPath ?? ''
      )
    });
    return map;
  };

  const updateSelections = (questionId: string, sampleIdx: number): void => {
    const selectedSampleId = samples[sampleIdx].sampleId;
    setQuestionsSelected((prev) => ({
      ...prev,
      [questionId]: selectedSampleId
    }));
  };

  useEffect(() => {
    const result: PartialResult<ABXResult> = {
      testNumber: testData.testNumber,

      xSampleId: testData.xSampleId,
      xSelected,

      selections: Object.keys(questionsSelected).map((questionId) => ({
        questionId,
        sampleId: questionsSelected[questionId]
      })),
      feedback
    };
    setAnswer(result);
  }, [
    questionsSelected,
    setAnswer,
    testData.testNumber,
    testData.xSampleId,
    xSelected,
    feedback
  ]);

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-2xl">
      <h2 className="relative text-center text-3xl md:text-2xl font-semibold -mb-2">
        ABX Test
      </h2>
      <div className="flex gap-md mt-md">
        <MultiPlayer
          assets={getCombinedSamples()}
          selectedPlayerState={selectedPlayerState}
        />
      </div>
      <div className="flex flex-col gap-sm w-full mt-md">
        <SingleSelectQuestion
          text="Which sample is X?"
          sampleNames={Array.from(
            { length: samples.length },
            (_, i) => `Sample ${i + 1}`
          )}
          onOptionSelect={(selectedIdx) => {
            setXSelected(testData.samples[selectedIdx].sampleId);
          }}
          initialSelection={samples.findIndex((s) => s.sampleId === xSelected)}
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
                updateSelections(question.questionId, selectedId);
              }}
              initialSelection={samples.findIndex(
                (s) => s.sampleId === questionsSelected[question.questionId]
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ABXTestComponent;
