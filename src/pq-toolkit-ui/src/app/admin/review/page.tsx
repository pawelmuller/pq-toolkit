'use client';
import React, { useState } from 'react';
import useSWR, { type KeyedMutator } from 'swr';
import Loading from '../../loading';
import LoginPage from '../../../lib/components/login/login-page';
import { userFetch } from '@/lib/utils/fetchers';
import {
    type getExperimentsData,
    type UserData,
} from '@/lib/schemas/apiResults';
import { validateApiData } from '@/core/apiHandlers/clientApiHandler';
import { adminExperimentsListSchema } from '../models';
import Header from '@/lib/components/basic/header';
import Blobs from '@/lib/components/basic/blobs';
import ExperimentResultsChart from '@/lib/components/details/experimentResultsChart';

const AdminPage = ({
    refreshAdminPage,
}: {
    refreshAdminPage: KeyedMutator<UserData>;
}): JSX.Element => {
    const {
        data: apiData,
        error,
        isLoading,
        mutate,
    } = useSWR<getExperimentsData>(`/api/v1/experiments`);

    const [expandedExperiment, setExpandedExperiment] = useState<string | null>(null);

    if (isLoading) return <Loading />;
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
                <div className="relative text-center mb-sm md:mb-md lg:mb-lg dark:text-white">
                    <Blobs />
                    <div className="fadeInUp">
                        <h1 className="relative text-5xl md:text-6xl font-bold">
                            Perceptual Qualities Toolkit
                        </h1>
                        <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm">
                            Experiments Review
                        </h2>
                    </div>
                </div>
                <div className="flex flex-col w-11/12 justify-center items-center fadeInUp">
                    <AdminExperimentsListWidget
                        experiments={data.experiments}
                        setExpandedExperiment={setExpandedExperiment}
                    />
                    {expandedExperiment && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold dark:text-white">
                                        {expandedExperiment} Results
                                    </h3>
                                    <button
                                        onClick={() => setExpandedExperiment(null)}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
                                    >
                                        Close
                                    </button>
                                </div>
                                <div className="overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700 space-y-8 w-full max-w-[800px] mx-auto">
                                    <ExperimentResultsChart
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
}: {
    experiments: string[];
    setExpandedExperiment: React.Dispatch<React.SetStateAction<string | null>>;
}): JSX.Element => {
    const [downloadMenuIdx, setDownloadMenuIdx] = useState<number | null>(null);

    const downloadAll = (experimentName: string, format: 'csv' | 'pdf') => {
        const link = document.createElement('a');
        if (format === 'csv') {
            link.href = `/api/v1/experiments/${experimentName}/download_csv`;
            link.setAttribute('download', `${experimentName}_all_tests.zip`);
        } else {
            link.href = `/api/v1/experiments/${experimentName}/download_pdf`;
            link.setAttribute('download', `${experimentName}_all_tests.pdf`);
        }
        link.click();
    };

    return (
        <div className="flex flex-col items-center justify-center fadeInUpFast z-10 w-full max-w-full 2xl:max-w-md text-black dark:text-white bg-gray-50 dark:bg-stone-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex text-lg md:text-xl font-semibold mb-4">
                Experiments:
            </div>
            <ul className="space-y-2 w-full">
                {experiments.map((name, idx) => (
                    <li
                        key={idx}
                        className="flex items-center justify-between whitespace-normal break-words relative"
                    >
                        <div
                            className="font-semibold text-white w-full bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-105 duration-300 ease-in-out p-2 rounded-md cursor-pointer"
                            onClick={() => setExpandedExperiment(name)}
                        >
                            {name}
                        </div>
                        <div
                            className="ml-4 relative"
                            onMouseEnter={() => setDownloadMenuIdx(idx)}
                            onMouseLeave={() => setDownloadMenuIdx(null)}
                            style={{display: 'inline-block'}}
                        >
                            <button
                                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-2 rounded whitespace-nowrap"
                                style={{marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}
                            >
                                Download results
                            </button>
                            {downloadMenuIdx === idx && (
                                <div
                                    className="absolute right-0 w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-b shadow-lg z-50"
                                    style={{marginTop: 0, top: '100%'}}
                                >
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => downloadAll(name, 'csv')}
                                    >
                                        CSV
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => downloadAll(name, 'pdf')}
                                    >
                                        PDF
                                    </button>
                                </div>
                            )}
                        </div>
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
        mutate,
    } = useSWR<UserData>(`/api/v1/auth/user`, userFetch);
    if (isLoading) return <Loading />;
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
