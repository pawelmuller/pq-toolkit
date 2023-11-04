import { type Draft, Draft07, type JsonError } from 'json-schema-library'
import experimentSchema from '@/utils/schemas/experiment-setup.schema.json'
import { fetchJsonData } from '@/utils/dataFetch'
import Link from 'next/link'

const ExperimentWelcomePage = ({
  params
}: {
  params: { testName: string }
}): JSX.Element => {
  const { testName } = params

  return (
    <main className="flex min-h-screen min-w-[480px] flex-col items-center justify-center">
      <WelcomeContent testName={testName} />
    </main>
  )
}

const WelcomeContent = async ({
  testName
}: {
  testName: string
}): Promise<JSX.Element> => {
  const data = await fetchJsonData(
    `http://localhost:3000/examples/experiments/${testName}/setup.json`
  )

  const jsonSchema: Draft = new Draft07(experimentSchema)
  const errors: JsonError[] = jsonSchema.validate(data)

  if (errors.length > 0) return <h2>Invalid experiment configuration file</h2>

  return (
    <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
      <div className="text-lg">
        This is welcome page for experiment <b>{testName}</b>
      </div>
      <div className="mt-sm">{data.title}</div>
      <div className="mt-md">
        <Link href={`/user/${testName}/1`}>
          <button className="bg-blue-500 p-xs rounded-lg text-white font-bold">
            Start
          </button>
        </Link>
      </div>
    </div>
  )
}

export default ExperimentWelcomePage
