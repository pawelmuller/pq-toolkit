import { randomInt } from '@/core/utils/mathUtils'
import {
  type BaseTest,
  type ABXTest,
  type FullABXTest
} from '@/lib/schemas/experimentSetup'

export const fillTest = (test: BaseTest): BaseTest => {
  switch (test.type) {
    case 'ABX':
      return fillABXTest(test as ABXTest)
  }

  return test
}

export const fillABXTest = (test: ABXTest): FullABXTest => {
  return {
    ...test,
    xSampleId:
      test.xSampleId ??
      test.samples[randomInt(0, test.samples.length - 1)].sampleId
  }
}
