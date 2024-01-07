'use client'

import { type APETest } from '@/lib/schemas/experimentSetup'
import {
  type APEResult,
  type PartialResult
} from '@/lib/schemas/experimentState'
import MultiPlayer from '../player/MultiPlayer'
import { getSampleUrl } from './common/utils'
import OrderSlider from './common/OrderSlider'

const APETestComponent = ({
  testData,
  experimentName,
  setAnswer
}: {
  testData: APETest
  experimentName: string
  setAnswer: (result: PartialResult<APEResult>) => void
}): JSX.Element => {
  const { axis, samples } = testData

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
        />
      </div>
      <div className="flex flex-col gap-sm w-full mt-md">
        {axis.map((value, idx) => (
          <OrderSlider key={`slider_${idx}`} text={value.text} />
        ))}
      </div>
    </div>
  )
}

export default APETestComponent
