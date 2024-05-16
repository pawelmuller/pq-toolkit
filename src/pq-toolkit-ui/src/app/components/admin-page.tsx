import { useState } from 'react'
import { adminExperimentsListSchema } from '../admin/models'
import Link from 'next/link'
import { FaCheck, FaPlus, FaTrash } from 'react-icons/fa'
import useSWR from 'swr'
import Loading from '../[name]/loading'
import { validateApiData } from '@/core/apiHandlers/clientApiHandler'
import { fireConfirmationModal } from '@/lib/components/modals/confirmationModals'
import verifyAuth from "@/lib/authentication/is-auth";
import Header from '@/lib/components/basic/header'
import DeleteButton from './deleteButton'
import CreateExperimentForm from './createExperimentForm'
const AdminPage = (props: any): JSX.Element => {
  const {
    data: apiData,
    error,
    isLoading,
    mutate
  } = useSWR(`/api/v1/experiments`)
  const [selectedExperiment, setSelectedExperiment] = useState(undefined)
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
      body: JSON.stringify({ name })
    })
      .then(async () => {
        await mutate()
      })
      .catch(console.error)
  }

  const addNewExperiment = (name: string): void => {
    fetch('/api/v1/experiments', {
      method: 'POST',
      body: JSON.stringify({ name })
    })
      .then(async () => {
        await mutate()
      })
      .catch(console.error)
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <Header>
        <div className='flex justify-end mr-10'>
          <button className='text-black' onClick={() => {
            fetch("/api/v1/logout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }).then(async () => {
              await props.refresh()
            });
          }}>Wyloguj</button>
        </div>
        <div className="flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-40">
          <div className="relative -mb-xl">
            <div className='absolute -top-14 right-36 w-80 h-80 bg-gradient-to-r from-pink-700 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000' />
            <div className='absolute -top-14 left-36 w-80 h-80 bg-gradient-to-r from-cyan-600 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-6000' />
            <div className='absolute top-10 right-64 w-80 h-80 bg-gradient-to-r from-pink-500 to-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000' />
            <div className='absolute -top-28 -right-6 w-96 h-96 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-8000' />
            <div className='absolute -top-24 -left-11 w-96 h-96 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-10000' />
          </div>
          <div className='flex flex-row w-screen justify-between pr-10 pl-10'>
            {selectedExperiment == undefined ? <div /> : <CreateExperimentForm setSelectedExperiment={setSelectedExperiment} selectedExperiment={selectedExperiment} />}

            <AdminExperimentsListWidget
              experiments={data.experiments}
              deleteExperiment={deleteExperiment}
              addNewExperiment={addNewExperiment}
              setSelectedExperiment={setSelectedExperiment}
            />
          </div>
        </div>
      </Header>
    </div>
  )
}

const AdminExperimentsListWidget = ({
  experiments,
  deleteExperiment,
  addNewExperiment,
  setSelectedExperiment
}: {
  experiments: string[]
  deleteExperiment: (name: string) => void
  addNewExperiment: (name: string) => void
  setSelectedExperiment: (name: any) => void
}): JSX.Element => {
  return (
    <div className="flex flex-col items-center z-10 self-end border-2 h-200 w-80 bg-white pr-10 pl-5 rounded-lg">
      <AddExperimentWidget
        experiments={experiments}
        addExperiment={addNewExperiment}
      />
      <div className="flex self-start mt-3 mb-2 text-black">Experiments:</div>
      <div className='overflow-y-auto w-72'>
        <ul>
          {experiments.map((name, idx) => (
            <li key={idx} className="flex items-center gap-sm justify-between pl-4 z-10">
              {/* <div onClick={() => setSelectedExperiment(name)}>{name}</div> */}
              {<Link href={`/admin/${name}`} className="text-black">{name}</Link>}
              <DeleteButton deleteExperiment={deleteExperiment} name={name} />
            </li>
          ))}
        </ul>
      </div>
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
    <div className="flex items-center z-10 mt-4">
      <input
        className="rounded outline-0 border-2 bg-gray-200 text-black"
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
        className="flex items-center text-sm disabled:bg-gray-400 bg-blue-500 rounded-xl p-xxs ml-4"
      >
        <FaPlus />
      </button>
    </div>
  )
}

export default AdminPage
