'use client';

import { useContext, useEffect, useState } from 'react';
import { ExperimentContext } from './layout';
import Loading from './loading';
import InvalidConfigurationError from './invalid-configuration-error';
import Header from '@/lib/components/basic/header';
import Blobs from '../../lib/components/basic/blobs';

const ExperimentWelcomePage = (props: {
  params: { name: string }
}): JSX.Element => {
  const { name: experimentName } = props.params;
  const context = useContext(ExperimentContext);
  const data = context?.data;
  const [errorRequest, setErrorRequest] = useState(false);

  useEffect(() => {
    if (context?.error ?? false) {
      setErrorRequest(true);
    }
  }, [context?.error]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      <Header />
      <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-40">
        <div className="relative w-[55%] h-[60%]">
          <Blobs />
        </div>
        <div className="flex flex-col content-center rounded-2xl justify-center items-center self-center fadeInUp z-10 p-3 mr-4 ml-4 w-full relative">
          <div className="flex flex-col justify-center content-center items-center text-center">
            {errorRequest ? (
              <InvalidConfigurationError />
            ) : data == null ? (
              <Loading />
            ) : (
              <div className="flex flex-col items-center text-black dark:text-white bg-gray-50 dark:bg-stone-800 rounded-3xl p-6 shadow-xl whitespace-normal w-full max-w-xs sm:max-w-md md:max-w-xl">
                <div className="w-full">
                  <h1 className="text-lg md:text-xl w-full whitespace-normal break-words">
                    Welcome to experiment <b>{data.name}</b>
                  </h1>
                  <h2 className="mt-sm text-sm font-normal md:text-base whitespace-normal break-words w-full">
                    {data.description}
                  </h2>
                </div>
                <div className="mt-md">
                  <div
                    className="bg-clip-text text-base md:text-lg font-bold text-transparent bg-gradient-to-r from-cyan-500  to-pink-500 cursor-pointer"
                    onClick={() => {
                      window.location.href = `/${experimentName}/1`;
                    }}
                  >
                    Start
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentWelcomePage;
