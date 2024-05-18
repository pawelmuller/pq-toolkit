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
      <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-40">
      <div className="relative text-center mb-sm">
        <Blobs />
          <div className="fadeInUp">
            <h1 className="relative text-5xl md:text-6xl font-bold">Perceptual Qualities Toolkit</h1>
            <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm">
              Admin page
            </h2>
        </div>
      </div>
        <div className='flex flex-row w-screen justify-between pr-10 pl-10 fadeInUp'>
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
