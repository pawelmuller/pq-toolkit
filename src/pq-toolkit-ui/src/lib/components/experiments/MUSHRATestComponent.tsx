'use client'

import { type MUSHRATest } from '@/lib/schemas/experimentSetup'
import {
  type MUSHRAResult,
  type PartialResult
} from '@/lib/schemas/experimentState'
import MultiPlayer from '../player/MultiPlayer'
import { getSampleUrl } from './common/utils'
import VerticalMultislider from './common/VerticalMultislider'

const MUSHRATestComponent = ({
  testData,
  experimentName,
  setAnswer
}: {
  testData: MUSHRATest
  experimentName: string
  setAnswer: (result: PartialResult<MUSHRAResult>) => void
}): JSX.Element => {
  const { reference, anchor, samples, question } = testData

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
      <div className="flex w-full mt-md">
        <VerticalMultislider samples={samples}/>
      </div>
    </div>
  )
}

export default MUSHRATestComponent
