'use client';

import useSWR, { type KeyedMutator } from 'swr';
import Loading from '../loading';
import LoginPage from '../../lib/components/login/login-page';
import { addNewExperimentFetch, userFetch } from '@/lib/utils/fetchers';
import {
  addExperimentSchema,
  type getExperimentsData,
  type UserData
} from '@/lib/schemas/apiResults';
import { useState } from 'react';
import { validateApiData } from '@/core/apiHandlers/clientApiHandler';
import { adminExperimentsListSchema } from './models';
import Header from '@/lib/components/basic/header';
import Blobs from '@/lib/components/basic/blobs';
import { FaExpand, FaMinus, FaPlus } from 'react-icons/fa';
import CreateExperimentForm from '@/lib/components/form/createExperimentForm';
import DeleteButton from '@/lib/components/basic/deleteButton';
import { TbLogout2 } from 'react-icons/tb';

const MAX_EXPERIMENTS = 15;
const MAX_EXPERIMENT_NAME_LENGTH = 50;

const AdminPage = ({
  refreshAdminPage
}: {
  refreshAdminPage: KeyedMutator<UserData>
}): JSX.Element => {
  const {
    data: apiData,
    error,
    isLoading,
    mutate
  } = useSWR<getExperimentsData>(`/api/v1/experiments`);

  const [selectedExperiment, setSelectedExperiment] = useState<string>('');
  const [isListVisible, setIsListVisible] = useState<boolean>(true);

  if (isLoading) {
      return <Loading />;
  }
  if (error != null)
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        API Error
        <br />
        {error.toString()}
      </div>
    );
  const { data, validationError } = validateApiData(
    apiData,
    adminExperimentsListSchema
  );
  if (validationError != null) {
    console.error(validationError);
    return (
      <div className="flex w-full min-h-screen items-center justify-center text-center h2">
        Invalid data from API, please check console for details
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      <Header />
      <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-32">
        <div className="relative text-center mb-sm md:mb-md lg:mb-lg">
          <Blobs />
          <div className="fadeInUp">
            <h1 className="relative text-5xl md:text-6xl font-bold dark:text-white">
              Perceptual Qualities Toolkit
            </h1>
            <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm dark:text-white">
              Experiment Configurator
            </h2>
          </div>
        </div>
        <div className="flex flex-col-reverse 2xl:flex-row w-11/12 justify-center items-center fadeInUp pl-10 pr-10 space-x-0 space-y-reverse space-y-3 2xl:space-x-3 2xl:space-y-0 mb-10">
          {isListVisible ? (
            <AdminExperimentsListWidget
              experiments={data.experiments}
              setSelectedExperiment={setSelectedExperiment}
              setIsListVisible={setIsListVisible}
              refreshPage={mutate}
              selectedExperiment={selectedExperiment}
            />
          ) : (
            <div className="flex flex-col fadeInUpFast items-center 2xl:absolute 2xl:mr-96 2xl:ml-[23rem] 2xl:mb-96 2xl:mt-96 2xl:-top-5">
              <button
                className="flex items-center text-sm bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs text-white"
                onClick={() => {
                  setIsListVisible(true);
                }}
              >
                <FaExpand className="mr-2" />
                <span className="font-semibold text-xs sm:text-sm">
                  Expand List
                </span>
              </button>
            </div>
          )}
          {selectedExperiment === '' ? null : (
            <CreateExperimentForm
              setSelectedExperiment={setSelectedExperiment}
              selectedExperiment={selectedExperiment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AdminExperimentsListWidget = ({
  experiments,
  setSelectedExperiment,
  setIsListVisible,
  refreshPage,
  selectedExperiment
}: {
  experiments: string[]
  setSelectedExperiment: React.Dispatch<React.SetStateAction<string>>
  setIsListVisible: React.Dispatch<React.SetStateAction<boolean>>
  refreshPage: KeyedMutator<getExperimentsData>
  selectedExperiment: string
}): JSX.Element => {
  return (
    <div className="flex flex-col self-start fadeInUpFast items-center z-10 w-full max-w-full 2xl:max-w-md text-black dark:text-white bg-gray-50 dark:bg-stone-800 rounded-3xl p-8 shadow-2xl relative">
      <button
        className="absolute top-4 right-4 flex items-center text-sm bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs text-white"
        onClick={() => {
          setIsListVisible(false);
        }}
      >
        <FaMinus className="mr-2" />
        <span className="font-semibold text-xs sm:text-sm">Minimize</span>
      </button>
      <div className="flex text-lg md:text-xl font-semibold">
        Add Experiment
      </div>
      <AddExperimentWidget
        experiments={experiments}
        refreshPage={refreshPage}
      />
      <div className="flex self-start mt-3 mb-2 text-sm md:text-base font-semibold text-black dark:text-white">
        Experiments:
      </div>
      <div className="w-full">
        <ul className="space-y-2 w-full">
          {experiments.map((name, idx) => (
            <li
              key={idx}
              className="flex items-center gap-sm justify-between whitespace-normal break-words"
            >
              <div
                className="font-semibold text-white w-9/12 sm:w-[85%] lg:w-[90%] 2xl:w-10/12 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-105 duration-300 ease-in-out p-2 rounded-md cursor-pointer"
                onClick={() => {
                  setSelectedExperiment(name);
                }}
              >
                {name}
              </div>
              <DeleteButton
                name={name}
                selectedExperiment={selectedExperiment}
                setSelectedExperiment={setSelectedExperiment}
                refreshPage={refreshPage}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AddExperimentWidget = ({
  experiments,
  refreshPage
}: {
  experiments: string[]
  refreshPage: KeyedMutator<getExperimentsData>
}): JSX.Element => {
  const [newExperimentName, setNewExperimentName] = useState('');

  const handleAdd = () => {
    if (
      newExperimentName.length === 0 ||
      newExperimentName.length > MAX_EXPERIMENT_NAME_LENGTH ||
      experiments.includes(newExperimentName) ||
      experiments.length >= MAX_EXPERIMENTS
    ) {
      return;
    }

    addNewExperimentFetch(newExperimentName, addExperimentSchema)
      .then(async () => {
        try {
          await refreshPage();
        } catch (error) {
          console.error(error);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    setNewExperimentName('');
  };

  return (
    <div className="flex flex-col items-center z-10 mt-4 w-full">
      <div className="flex items-center w-full">
        <input
          className="rounded outline-0 border-2 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white text-black w-full"
          onChange={(e) => setNewExperimentName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
          value={newExperimentName}
          maxLength={MAX_EXPERIMENT_NAME_LENGTH}
        />
        <button
          onClick={handleAdd}
          disabled={
            newExperimentName.length === 0 ||
            newExperimentName.length > MAX_EXPERIMENT_NAME_LENGTH ||
            experiments.includes(newExperimentName) ||
            experiments.length >= MAX_EXPERIMENTS
          }
          className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 disabled:transform-none ease-in-out rounded-xl p-xxs ml-4 text-white"
        >
          <FaPlus />
        </button>
      </div>
      <div className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
        First time?{' '}
        <a
          href="/admin/guide"
          className="text-blue-500 dark:text-blue-400 hover:underline"
        >
          Check administrator guide
        </a>
      </div>
      {experiments.length >= MAX_EXPERIMENTS && (
        <div className="mt-2 text-red-500 dark:text-red-400">
          Maximum number of experiments reached.
        </div>
      )}
    </div>
  );
};

const LoginSwitch = (): JSX.Element => {
  const {
    data: apiData,
    error,
    isLoading,
    mutate
  } = useSWR<UserData>(`/api/v1/auth/user`, userFetch);
  if (isLoading) {
      return <Loading />;
  }
  if (error != null)
    if (error.message.includes('"status":401') as boolean) {
      return <LoginPage refreshAdminPage={mutate} />;
    } else
      return (
        <div>
          <div>Authorization Error</div>
          <div>{error.toString()}</div>
        </div>
      );
  if (apiData?.is_active ?? false) {
    return <AdminPage refreshAdminPage={mutate} />;
  } else {
    return <LoginPage refreshAdminPage={mutate} />;
  }
};

export default LoginSwitch;

