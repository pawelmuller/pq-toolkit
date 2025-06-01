'use client';

import ABTestComponent from '@/lib/components/experiments/ABTestComponent';
import ABXTestComponent from '@/lib/components/experiments/ABXTestComponent';
import APETestComponent from '@/lib/components/experiments/APETestComponent';
import MUSHRATestComponent from '@/lib/components/experiments/MUSHRATestComponent';
import {
  TestTypeEnum,
  type ABTest,
  type APETest,
  type FullABXTest,
  type FullMUSHRATest
} from '@/lib/schemas/experimentSetup';
import Link from 'next/link';
import { useContext, useState } from 'react';
import InvalidConfigurationError from '../invalid-configuration-error';
import { ExperimentContext } from '../layout';
import Loading from '../loading';
import {
  type PartialResult,
  type ABResult,
  type ABXResult,
  type MUSHRAResult,
  type APEResult
} from '@/lib/schemas/experimentState';
import Header from '@/lib/components/basic/header';
import Blobs from '../../../lib/components/basic/blobs';

const TestPage = ({
  params
}: {
  params: { name: string; step: string }
}): JSX.Element => {
  const name = params.name;

  const context = useContext(ExperimentContext);
  const data = context?.data;
  const results = context?.results;
  const saveResults = context?.saveResults;

  const [feedback, setFeedback] = useState('');

  if (context?.error === true) {
      return <InvalidConfigurationError />;
  }
  if (data == null || results == null) {
      return <Loading />;
  }

  const tests = data.tests;

  const step = parseInt(params.step);
  if (isNaN(step) || step > tests.length || step < 1) {
    return <div>Invalid step</div>;
  }

  const currentTest = tests[step - 1];

  const getTestComponent = (): JSX.Element => {
    switch (currentTest.type) {
      case TestTypeEnum.enum.AB:
        return (
          <ABTestComponent
            testData={currentTest as ABTest}
            initialValues={
              results.results.find(
                (r) => r.testNumber === currentTest.testNumber
              ) as PartialResult<ABResult>
            }
            experimentName={name}
            setAnswer={(result) => {
              context?.setAnswer(result);
            }}
            feedback={feedback}
          />
        );
      case TestTypeEnum.enum.ABX:
        return (
          <ABXTestComponent
            testData={currentTest as FullABXTest}
            initialValues={
              results.results.find(
                (r) => r.testNumber === currentTest.testNumber
              ) as PartialResult<ABXResult>
            }
            experimentName={name}
            setAnswer={(result) => {
              context?.setAnswer(result);
            }}
            feedback={feedback}
          />
        );
      case TestTypeEnum.enum.MUSHRA:
        return (
          <MUSHRATestComponent
            testData={currentTest as FullMUSHRATest}
            initialValues={
              results.results.find(
                (r) => r.testNumber === currentTest.testNumber
              ) as PartialResult<MUSHRAResult>
            }
            experimentName={name}
            setAnswer={(result) => {
              context?.setAnswer(result);
            }}
            feedback={feedback}
          />
        );
      case TestTypeEnum.enum.APE:
        return (
          <APETestComponent
            testData={currentTest as APETest}
            initialValues={
              results.results.find(
                (r) => r.testNumber === currentTest.testNumber
              ) as PartialResult<APEResult>
            }
            experimentName={name}
            setAnswer={(result) => {
              context?.setAnswer(result);
            }}
            feedback={feedback}
          />
        );
    }
  };

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
            <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm">
              Test #{step}
            </h2>
          </div>
        </div>
        <div className="flex content-center justify-center fadeInUp z-10 p-3 -mt-14 md:mt-4">
          <div className="flex flex-col justify-center content-center scale-75 md:scale-100">
            <div className="flex flex-col items-center text-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-stone-800 rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-xs">{getTestComponent()}</div>
                {
                  <div className="relative w-full mt-2 self-center">
                    <textarea
                      className="w-full p-2 rounded-md border-2 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-500 text-black dark:text-white  focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-600"
                      placeholder="Write your feedback here..."
                      value={feedback}
                      onChange={(e) => {
                        setFeedback(e.target.value);
                      }}
                    />
                  </div>
                }
                <div className="flex justify-center gap-sm">
                  {step > 1 && (
                    <Link href={(step - 1).toString()}>
                      <button className="bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 ease-in-out rounded-md p-2 font-semibold text-white">
                        Previous
                      </button>
                    </Link>
                  )}
                  {step === tests.length ? (
                    <Link href="finish" onClick={saveResults}>
                      <button className="bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 ease-in-out rounded-md p-2 px-6 font-semibold text-white">
                        Finish
                      </button>
                    </Link>
                  ) : (
                    <Link href={(step + 1).toString()}>
                      <button className="bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-110 duration-300 ease-in-out rounded-md py-2 px-6 font-semibold text-white">
                        Next
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
