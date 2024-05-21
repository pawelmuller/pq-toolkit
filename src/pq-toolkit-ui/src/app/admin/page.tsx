'use client'

import { useState } from 'react'
import { adminExperimentsListSchema } from './models'
import Link from 'next/link'
import { FaPlus, FaTrash } from 'react-icons/fa'
import useSWR from 'swr'
import Loading from '../[name]/loading'
import { validateApiData } from '@/core/apiHandlers/clientApiHandler'
import { fireConfirmationModal } from '@/lib/components/modals/confirmationModals'

const AdminPage = (): JSX.Element => {
  const {
    data: apiData,
    error,
    isLoading,
    mutate
  } = useSWR(`/api/v1/experiments`)

  if (isLoading) return <Loading />
  if (error != null)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        API Error
        <br />
        {error.toString()}
      </div>
    )
  const { data, validationError } = validateApiData(
    apiData,
    adminExperimentsListSchema
  )
  if (validationError != null) {
    console.error(validationError)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        Invalid data from API, please check console for details
      </div>
    )
  }

  const deleteExperiment = (name: string): void => {
    fetch('/api/v1/experiments', {
      method: 'DELETE',
      body: JSON.stringify({ name }),
      headers: {'Content-Type': 'application/json'}
    })
      .then(async () => {
        await mutate()
      })
      .catch(console.error)
  }

  const addNewExperiment = (name: string): void => {
    fetch('/api/v1/experiments', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {'Content-Type': 'application/json'}
    })
      .then(async () => {
        await mutate()
      })
      .catch(console.error)
  }

  return (
    <main className="flex min-h-screen p-24">
      <div className="flex flex-col h-full w-full items-center justify-center my-auto">
        <div
          className="relative before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:-translate-y-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]
        text-center mb-md"
        >
          <h1 className="font-bold">PQ Toolkit admin page</h1>
        </div>
        <AdminExperimentsListWidget
          experiments={data.experiments}
          deleteExperiment={deleteExperiment}
        />
        <AddExperimentWidget
          experiments={data.experiments}
          addExperiment={addNewExperiment}
        />
      </div>
    </main>
  )
}

const AdminExperimentsListWidget = ({
  experiments,
  deleteExperiment
}: {
  experiments: string[]
  deleteExperiment: (name: string) => void
}): JSX.Element => {
  return (
    <div className="flex flex-col items-center z-10">
      <div className="">Configured experiments:</div>
      <ul>
        {experiments.map((name, idx) => (
          <li key={idx} className="flex items-center gap-sm justify-center">
            <Link href={`/admin/${name}`}>{name}</Link>
            <button
              onClick={() => {
                fireConfirmationModal({
                  title: `Delete ${name}?`,
                  onConfirm: () => {
                    deleteExperiment(name)
                  }
                }).catch(console.error)
              }}
            >
              <FaTrash className="fill-red-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const AddExperimentWidget = ({
  addExperiment,
  experiments
}: {
  addExperiment: (name: string) => void
  experiments: string[]
}): JSX.Element => {
  const [newName, setNewName] = useState('')

  return (
    <div className="mt-md flex gap-sm items-center">
      <input
        className="text-black"
        onChange={(e) => {
          setNewName(e.target.value)
        }}
        value={newName}
      />
      <button
        onClick={() => {
          addExperiment(newName)
          setNewName('')
        }}
        disabled={newName.length === 0 || experiments.includes(newName)}
        className="flex items-center text-sm disabled:bg-gray-400 bg-blue-500 rounded-sm p-xxs"
      >
        ADD
        <FaPlus className="ml-xs" />
      </button>
    </div>
  )
}

export default AdminPage
