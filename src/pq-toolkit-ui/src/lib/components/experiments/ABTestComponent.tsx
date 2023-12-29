'use client'

import { type ABTest } from '@/lib/schemas/experimentSetup'
import SingleSelectQuestion from './common/SingleSelectQuestion'
import SinglePlayer from '../player/SinglePlayer'

const ABTestComponent = ({
  testData,
  experimentName
}: {
  testData: ABTest
  experimentName: string
}): JSX.Element => {
  const { samples, questions } = testData

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
              console.log(selectedId)
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ABTestComponent
