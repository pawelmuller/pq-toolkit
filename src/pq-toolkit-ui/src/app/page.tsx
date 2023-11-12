import { fetchJsonData } from '@/utils/dataFetch'
import Link from 'next/link'
import { Suspense } from 'react'

const Home = async (): Promise<JSX.Element> => {
  return (
    <main className="flex min-h-screen p-24">
      <div className="flex flex-col h-full w-full items-center justify-center my-auto">
        <div
          className="relative before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:-translate-y-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]
        text-center"
        >
          <h1 className="text-6xl font-bold">Perceptual Qualities Toolkit</h1>
          <h2 className="text-xl font-semibold mt-sm">
            Home page of experiment UI for Perceptual Qualities Python Toolkit
          </h2>
        </div>
        <div className="flex flex-col items-center mt-md z-10">
          <div>Configured experiments:</div>
          <Suspense fallback={<div>Loading</div>}>
            <ExperimentsList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

const ExperimentsList = async (): Promise<JSX.Element> => {
  const data: { experiments: any[] } = await fetchJsonData(
    'http://localhost:3000/examples/experiments/index.json'
  )

  return (
    <ul>
      {data.experiments.map((e, idx) => (
        <li key={idx}>
          <Link href={`/user/${e}`}>{e}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Home
