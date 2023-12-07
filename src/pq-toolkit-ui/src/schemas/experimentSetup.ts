export interface ExperimentSetup {
  name: string
  title: string
  tests: TestSetup[]
}

export interface TestSetup {
  id: number
  type: string
  samples: TestSample[]
  questions: TestQuestion[]
}

export interface TestSample {
  id: string
  assetPath: string
}

export interface TestQuestion {
  text: string
}
