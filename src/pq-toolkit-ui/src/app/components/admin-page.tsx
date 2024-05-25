import { useState } from 'react'
import { adminExperimentsListSchema } from '../admin/models'
import { FaPlus, FaMinus, FaExpand } from 'react-icons/fa'
import useSWR from 'swr'
import Loading from '../[name]/loading'
import { validateApiData } from '@/core/apiHandlers/clientApiHandler'
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
  const [isListVisible, setIsListVisible] = useState(true)

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
    }).catch((err) => { console.error(err) })
      .then(async () => {
        await mutate()
      }).catch((err) => { console.error(err) })
  }

  const addNewExperiment = (name: string): void => {
    fetch('/api/v1/experiments', {
      method: 'POST',
      body: JSON.stringify({ name })
    }).catch((err) => { console.error(err) })
      .then(async () => {
        await mutate()
      })
      .catch((err) => { console.error(err) })
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      <Header />
      <div className='flex justify-end fadeInUp mr-4 md:mr-10 z-50'>
        <button
          className='flex items-center font-semibold max-md:text-sm max-md:px-2 max-md:py-1 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 text-white px-4 py-2 rounded-full shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105'
          onClick={() => {
            fetch("/api/v1/logout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            })
              .catch((err) => { console.error(err) })
              .then(async () => {
                await props.refresh()
              }).catch((err) => { console.error(err) });
          }}>
          <TbLogout2 className="mr-2" />
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
        <div className='flex flex-col-reverse 2xl:flex-row w-11/12 justify-center items-center fadeInUp pl-10 pr-10 space-x-0 space-y-reverse space-y-3 2xl:space-x-3 2xl:space-y-0 mb-10'>
          {isListVisible ? (
            <AdminExperimentsListWidget
              experiments={data.experiments}
              deleteExperiment={deleteExperiment}
              addNewExperiment={addNewExperiment}
              setSelectedExperiment={setSelectedExperiment}
              setIsListVisible={setIsListVisible}
            />
          ) : (
            <div className="flex flex-col fadeInUpFast items-center 2xl:absolute 2xl:mr-96 2xl:ml-[23rem] 2xl:mb-96 2xl:mt-96 2xl:-top-5">
              <button
                className="flex items-center text-sm bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs text-white"
                onClick={() => { setIsListVisible(true) }}
              >
                <FaExpand className="mr-2" />
                <span className='font-semibold text-xs sm:text-sm'>Expand List</span>
              </button>
            </div>
          )}
          {selectedExperiment === undefined ? null : <CreateExperimentForm setSelectedExperiment={setSelectedExperiment} selectedExperiment={selectedExperiment} />}
        </div>
      </div>
    </div>
  )
}

const AdminExperimentsListWidget = ({
  experiments,
  deleteExperiment,
  addNewExperiment,
  setSelectedExperiment,
  setIsListVisible
}: {
  experiments: string[]
  deleteExperiment: (name: string) => void
  addNewExperiment: (name: string) => void
  setSelectedExperiment: (name: any) => void
  setIsListVisible: (visible: boolean) => void
}): JSX.Element => {
  return (
    <div className="flex flex-col self-start fadeInUpFast items-center z-10 w-full max-w-4xl 2xl:max-w-md text-black dark:text-white bg-gray-50 dark:bg-stone-800 rounded-3xl p-8 shadow-2xl relative">
      <button
        className="absolute top-4 right-4 flex items-center text-sm bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs text-white"
        onClick={() => { setIsListVisible(false) }}
      >
        <FaMinus className="mr-2" />
        <span className='font-semibold text-xs sm:text-sm'>Minimize</span>
      </button>
      <div className="flex text-lg md:text-xl font-semibold">Add Experiment</div>
      <AddExperimentWidget
        experiments={experiments}
        addExperiment={addNewExperiment}
      />
      <div className="flex self-start mt-3 mb-2 text-sm md:text-base font-semibold text-black dark:text-white">Experiments:</div>
      <div className='w-full'>
        <ul className="space-y-2 w-full">
          {experiments.map((name, idx) => (
            <li key={idx} className="flex items-center gap-sm justify-between whitespace-normal break-words">
              <div className='font-semibold text-white w-9/12 sm:w-[85%] lg:w-[90%] 2xl:w-10/12 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-105 duration-300 ease-in-out p-2 rounded-md cursor-pointer' onClick={() => { setSelectedExperiment(name) }}>
                {name}
              </div>
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
        className="rounded outline-0 border-2 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black w-full"
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
        className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 disabled:transform-none ease-in-out rounded-xl p-xxs ml-4 text-white"
      >
        <FaPlus />
      </button>
    </div>
  )
}

export default AdminPage
