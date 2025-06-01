'use client';
import Link from 'next/link';
import { experimentsListSchema } from './models';
import useSWR from 'swr';
import Loading from './loading';
import { validateApiData } from '@/core/apiHandlers/clientApiHandler';
import Header from '@/lib/components/basic/header';
import Blobs from '../lib/components/basic/blobs';

const Home = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      <Header />
      <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-40">
        <div className="relative text-center mb-sm md:mb-md lg:mb-lg">
          <Blobs />
          <div className="fadeInUp">
            <h1 className="relative text-5xl md:text-6xl font-bold dark:text-white">
              Perceptual Qualities Toolkit
            </h1>
            <h2 className="relative text-lg md:text-xl font-semibold mt-sm dark:text-white">
              Home page of experiment UI for Perceptual Qualities Python Toolkit
            </h2>
          </div>
        </div>
        <ExperimentsListWidget />
      </div>
    </div>
  );
};

const ExperimentsListWidget = (): JSX.Element => {
  const { data: apiData, error, isLoading } = useSWR(`/api/v1/experiments/`);

  if (isLoading)
    return (
      <div className="fadeInUp">
        <Loading />
      </div>
    );
  if (error != null)
    return (
      <div className="flex w-full fadeInUp items-center justify-center text-center h2">
        API Error
        <br />
        {error.toString()}
      </div>
    );
  const { data, validationError } = validateApiData(
    apiData,
    experimentsListSchema
  );
  if (validationError != null) {
    console.error(validationError);
    return (
      <div className="flex w-full fadeInUp items-center justify-center text-center h2">
        Invalid data from API, please check console for details
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center fadeInUp z-10 w-full max-w-2xl mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
      <div className="font-bold text-xl md:text-2xl mb-10 dark:text-white">
        Configured Experiments
      </div>
      <ul className="space-y-2 w-full">
        {data.experiments.map((name, idx) => (
          <li
            key={idx}
            className="text-center text-base font-semibold justify-center rounded-md transition-transform transform hover:scale-105 whitespace-normal break-words"
          >
            <Link
              href={`/${name}`}
              className="block bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 p-2 rounded-md"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
