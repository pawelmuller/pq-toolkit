'use client';
import { useContext } from 'react';
import InvalidConfigurationError from '../invalid-configuration-error';
import Loading from '../loading';
import { ExperimentContext } from '../layout';
import Link from 'next/link';
import Header from '@/lib/components/basic/header';
import Blobs from '../../../lib/components/basic/blobs';

const FinishPage = ({ params }: { params: { name: string } }): JSX.Element => {
  const context = useContext(ExperimentContext);
  const data = context?.data;

  if (context?.error === true) {
    return <InvalidConfigurationError />;
  }
  if (data == null) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      <Header />
      <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-40">
        <div className="relative text-center mb-sm dark:text-white">
          <Blobs />
          <div className="fadeInUp">
            <h1 className="relative text-5xl md:text-6xl font-bold">
              Perceptual Qualities Toolkit
            </h1>
            <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm -ml-2">
              Thank You
            </h2>
          </div>
        </div>
        <div className="flex content-center self-center bg-gray-50 dark:bg-stone-800 rounded-2xl justify-center fadeInUp z-10 p-6 mt-4 md:mt-8 max-w-xs sm:max-w-md md:max-w-xl">
          <div className="flex flex-col justify-center content-center text-center w-full">
            <div className="text-black mb-4 dark:text-white whitespace-normal break-words w-full text-lg md:text-xl">
              {data.endText ?? 'Thank you for participating in this test. Your results have been submitted.'}
            </div>
            <Link href={`/`}>
              <button className="bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 ease-in-out rounded-md p-2 font-semibold text-white">
                Go back to homepage
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;
