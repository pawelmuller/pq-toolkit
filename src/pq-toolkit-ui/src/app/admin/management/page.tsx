'use client';
import React, {useState} from 'react';
import useSWR, {type KeyedMutator} from 'swr';
import Loading from '../../loading';
import LoginPage from '../../../lib/components/login/login-page';
import {userFetch} from '@/lib/utils/fetchers';
import {
    type getExperimentsData,
    type UserData
} from '@/lib/schemas/apiResults';
import {validateApiData} from '@/core/apiHandlers/clientApiHandler';
import {adminExperimentsListSchema} from '../models';
import Header from '@/lib/components/basic/header';
import Blobs from '@/lib/components/basic/blobs';
import {TbLogout2} from 'react-icons/tb';
import {FaTrash} from "react-icons/fa";
import ExperimentDetails from '@/lib/components/details/experimentDetails';

const AdminPage = ({
                       refreshAdminPage
                   }: {
    refreshAdminPage: KeyedMutator<UserData>;
}): JSX.Element => {
    const {
        data: apiData,
        error,
        isLoading,
        mutate
    } = useSWR<getExperimentsData>(`/api/v1/experiments`);

    const [expandedExperiment, setExpandedExperiment] = useState<string | null>(null);

    const refreshExperiments = async () => {
        await mutate();
    };

    if (isLoading) return <Loading/>;
    if (error != null)
        return (
            <div className="flex w-full min-h-screen items-center justify-center text-center h2">
                API Error
                <br/>
                {error.toString()}
            </div>
        );
    const {data, validationError} = validateApiData(
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
            <Header/>
            <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-32">
                <div className="relative text-center mb-sm md:mb-md lg:mb-lg dark:text-white">
                    <Blobs/>
                    <div className="fadeInUp">
                        <h1 className="relative text-5xl md:text-6xl font-bold">
                            Perceptual Qualities Toolkit
                        </h1>
                        <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm">
                            Experiments Management
                        </h2>
                    </div>
                </div>
                <div className="flex flex-col w-11/12 justify-center items-center fadeInUp">
                    <AdminExperimentsListWidget
                        experiments={data.experiments}
                        setExpandedExperiment={setExpandedExperiment}
                        refreshExperiments={refreshExperiments}
                    />
                    {expandedExperiment && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                            <div
                                className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
                            >
                                <div className="flex flex-col items-center">
                                    <ExperimentDetails
                                        experimentName={expandedExperiment}
                                        closeDetails={() => setExpandedExperiment(null)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminExperimentsListWidget = ({
                                        experiments,
                                        setExpandedExperiment,
                                        refreshExperiments
                                    }: {
    experiments: string[];
    setExpandedExperiment: React.Dispatch<React.SetStateAction<string | null>>;
    refreshExperiments: () => void;
}): JSX.Element => {
    const handleDeleteExperiment = async (experimentName: string) => {
        try {
            const response = await fetch("/api/v1/experiments", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: experimentName}),
            });

            if (!response.ok) {
                throw new Error(`Failed to delete experiment: ${experimentName}`);
            }

            refreshExperiments();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center fadeInUpFast z-10 w-full max-w-full 2xl:max-w-md text-black dark:text-white bg-gray-50 dark:bg-stone-800 rounded-3xl p-8 shadow-2xl"
        >
            <div className="flex text-lg md:text-xl font-semibold mb-4">Experiments:</div>
            <ul className="space-y-2 w-full">
                {experiments.map((name, idx) => (
                    <li
                        key={idx}
                        className="flex items-center gap-4 justify-between whitespace-normal break-words"
                    >
                        <div
                            className="font-semibold text-white w-full bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-105 duration-300 ease-in-out p-2 rounded-md cursor-pointer"
                            onClick={() => setExpandedExperiment(name)}
                        >
                            {name}
                        </div>
                        <button
                            onClick={() => handleDeleteExperiment(name)}
                            className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                            aria-label="Delete sample"
                        >
                            <FaTrash className="w-6 h-6"/>
                        </button>
                    </li>
                ))}
            </ul>
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
    if (isLoading) return <Loading/>;
    if (error != null)
        if (error.message.includes('"status":401') as boolean) {
            return <LoginPage refreshAdminPage={mutate}/>;
        } else
            return (
                <div>
                    <div>Authorization Error</div>
                    <div>{error.toString()}</div>
                </div>
            );
    if (apiData?.is_active ?? false) {
        return <AdminPage refreshAdminPage={mutate}/>;
    } else {
        return <LoginPage refreshAdminPage={mutate}/>;
    }
};

export default LoginSwitch;
