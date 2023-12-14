'use client'

import { useState } from 'react'
import { UploadForm } from './uploadForm'

const AdminPage = (): JSX.Element => {
  const addNewExperiment = (name: string): void => {
    console.log(name)
    fetch('/api/v1/experiments', {
      method: 'POST',
      body: JSON.stringify({ name })
    }).catch(console.error)
  }

  const deleteExperiment = (name: string): void => {
    console.log(name)
    fetch('/api/v1/experiments', {
      method: 'DELETE',
      body: JSON.stringify({ name })
    }).catch(console.error)
  }

  const [name, setName] = useState('')

  return (
    <main className="flex min-h-screen p-24">
      <div className="flex flex-col h-full w-full items-center justify-center my-auto">
        <div
          className="relative before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:-translate-y-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]
        text-center"
        >
          <h1 className="text-6xl font-bold">Admin page</h1>
        </div>
        <div className="mt-md">
          <div>
            <input
              className="text-black"
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
          <div className="mt-sm items-center flex justify-center">
            <button
              className="bg-green-500 text-white p-xs rounded-sm"
              onClick={() => {
                addNewExperiment(name)
              }}
            >
              ADD
            </button>
          </div>
        </div>
        <div className="mt-md">
          Upload configuration
          <UploadForm url={`/api/v1/experiments/${name}`} />
        </div>
        <div className="mt-md">
          Upload samples
          <UploadForm url={`/api/v1/experiments/${name}/samples`} />
        </div>
        <div className="mt-lg">
          <button
            className="bg-red-500 text-white p-xs rounded-sm"
            onClick={() => {
              deleteExperiment(name)
            }}
          >
            DELETE
          </button>
        </div>
      </div>
    </main>
  )
}

export default AdminPage
