'use client'

import { type MUSHRATest } from '@/lib/schemas/experimentSetup'
import {
  type MUSHRAResult,
  type PartialResult
} from '@/lib/schemas/experimentState'
import MultiPlayer from '../player/MultiPlayer'
import {getSampleUrl, shuffleArray} from './common/utils'
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

  function prepareSamples(): {sampleId: string, assetPath: string}[] {
    const samples_anchor = [...samples, anchor]
    const samples_anchor_mixed = shuffleArray(samples_anchor)
    const reference_samples_anchor = [reference, ...samples_anchor_mixed]
    return reference_samples_anchor
  }

  const shuffled_samples = prepareSamples()

  return (
    <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
      <div className="flex gap-md mt-md">
        <MultiPlayer
          assets={shuffled_samples.reduce<Map<string, string>>((map, sample, idx) => {
            const sample_name = sample.sampleId === 'ref' ? 'Reference' : `Sample ${idx + 1}`
            map.set(
              sample_name,
              getSampleUrl(experimentName, sample.assetPath)
            )
            return map
          }, new Map<string, string>())}
        />
      </div>
      <div className="flex w-full mt-md">
        <VerticalMultislider samples={shuffled_samples}/>
      </div>
    </div>
  )
}

export default MUSHRATestComponent
