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
import Blobs from './blobs'
import { TbLogout2 } from "react-icons/tb";


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
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      <Header />
      <div className='flex justify-end fadeInUp mr-10'>
        <button className='text-black' onClick={() => {
          fetch("/api/v1/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }).then(async () => {
            await props.refresh()
          });
        }}>
          <TbLogout2 />
          Logout
        </button>
      </div>
      <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-32">
        <div className="relative text-center mb-sm md:mb-md lg:mb-lg">
          <Blobs />
          <div className="fadeInUp">
            <h1 className="relative text-5xl md:text-6xl font-bold">Perceptual Qualities Toolkit</h1>
            <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm">
              Experiment Configurator
            </h2>
          </div>
        </div>
        <div className='flex flex-col w-full items-center fadeInUp'>
          {selectedExperiment == undefined ? <div /> : <CreateExperimentForm setSelectedExperiment={setSelectedExperiment} selectedExperiment={selectedExperiment} />}
          <AdminExperimentsListWidget
            experiments={data.experiments}
            deleteExperiment={deleteExperiment}
            addNewExperiment={addNewExperiment}
            setSelectedExperiment={setSelectedExperiment}
          />
        </div>
      </div>
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
    <div className="flex flex-col items-center z-10 w-full max-w-2xl text-white bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <div className="flex text-lg md:text-xl font-semibold">Add Experiment</div>
      <AddExperimentWidget
        experiments={experiments}
        addExperiment={addNewExperiment}
      />
      <div className="flex self-start mt-3 mb-2 text-sm md:text-base font-semibold text-black dark:text-white">Experiments:</div>
      <div className='overflow-y-auto w-full'>
        <ul className="space-y-2 w-full">
          {experiments.map((name, idx) => (
            <li key={idx} className="flex items-center gap-sm justify-between bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 p-2 rounded-md whitespace-normal break-words">
              <Link href={`/admin/${name}`} className="w-5/6 font-semibold">{name}</Link>
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
    <div className="flex items-center z-10 mt-4 w-full">
      <input
        className="rounded outline-0 border-2 bg-gray-200 dark:bg-gray-300 dark:border-gray-300 text-black w-full"
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
        className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-400 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-105 duration-300 ease-in-out rounded-xl p-xxs ml-4 text-white"
      >
        <FaPlus />
      </button>
    </div>
  )
}

export default AdminPage
