import Link from 'next/link'

const Home = (): JSX.Element => {
  return (
    <main className="flex min-h-screen p-24">
      <div className="flex flex-col h-full w-full items-center justify-center my-auto">
        <div
          className="relative before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:-translate-y-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]
        text-center"
        >
          <h1 className="text-6xl font-bold">Home Page</h1>
        </div>
        <div className="flex mt-md z-10">
          <Link href="/test-1">Go to experiment page</Link>
        </div>
      </div>
    </main>
  )
}

export default Home
