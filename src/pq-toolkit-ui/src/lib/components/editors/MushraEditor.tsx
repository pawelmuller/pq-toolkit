import {
  type Sample,
  type ABTest,
  type ABXTest,
  type APETest,
  type BaseTest,
  type ExperimentSetup,
  type FullABXTest,
  type MUSHRATest
} from '@/lib/schemas/experimentSetup';
import { useState } from 'react';

const MushraEditor = ({
  currentTest,
  setCurrentTest,
  fileList,
  setSetup
}: {
  currentTest: MUSHRATest
  setCurrentTest: React.Dispatch<React.SetStateAction<ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest>>
  fileList: string[];
  setSetup: React.Dispatch<React.SetStateAction<ExperimentSetup>>
}): JSX.Element => {
  const [sampleTest, setSampleTest] = useState<Sample[]>(currentTest.samples);
  const [anchorsTest, setAnchorsTest] = useState<Sample[]>(
    currentTest.anchors ?? []
  );
  const [referenceTest, setReferenceTest] = useState<Sample>(
    currentTest.reference ?? { sampleId: '', assetPath: '' }
  );
  return (
    <div className="w-full">
      <h4 className="font-semibold text-sm lg:text-base mb-1 mt-3">
        Reference
      </h4>
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
          {fileList.length === 0 ? (
            <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">
              No Reference samples available. Please upload some samples.
            </h3>
          ) : (
            fileList.map((assetPath, index) => (
              <label
                key={index}
                className="flex items-center relative cursor-pointer mr-2"
              >
                <input
                  type="radio"
                  id={assetPath}
                  checked={referenceTest.assetPath === assetPath}
                  name="reference"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setReferenceTest({
                        sampleId: 'ref',
                        assetPath: assetPath
                      });
                    } else {
                      setReferenceTest({ sampleId: '', assetPath: '' });
                    }
                  }}
                  className="hidden"
                />
                <span className="w-4 h-4 flex items-center justify-center">
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      referenceTest.assetPath === assetPath
                        ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                        : 'bg-gray-200 border-gray-400'
                    } transition-transform transform hover:scale-110 duration-100 ease-in-out`}
                  >
                    {referenceTest.assetPath === assetPath && (
                      <span className="w-2 h-2 rounded-full bg-white dark:bg-gray-100"></span>
                    )}
                  </span>
                </span>
                <span className="ml-2 break-words w-full">{assetPath}</span>
              </label>
            ))
          )}
        </div>
      </div>
      <h4 className="font-semibold text-sm lg:text-base mb-1">Anchors</h4>
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
          {fileList.length === 0 ? (
            <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">
              No Anchor samples available. Please upload some samples.
            </h3>
          ) : (
            fileList.map((assetPath, index) => (
              <label
                key={index}
                className="flex items-center relative cursor-pointer mr-2 break-words w-full"
              >
                <input
                  type="checkbox"
                  id={assetPath}
                  checked={anchorsTest.some(
                    (sample) => sample.assetPath === assetPath
                  )}
                  name={assetPath}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAnchorsTest((oldarray) => [
                        ...oldarray,
                        { sampleId: assetPath, assetPath: assetPath }
                      ]);
                    } else {
                      setAnchorsTest((oldarray) =>
                        oldarray.filter(
                          (sample) => sample.assetPath !== assetPath
                        )
                      );
                    }
                  }}
                  className="hidden"
                />
                <span className="w-4 h-4 flex items-center justify-center">
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      anchorsTest.some(
                        (sample) => sample.assetPath === assetPath
                      )
                        ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                        : 'bg-gray-200 border-gray-400'
                    } transition-transform transform hover:scale-110 duration-100 ease-in-out`}
                  >
                    {anchorsTest.some(
                      (sample) => sample.assetPath === assetPath
                    ) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="4"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </span>
                </span>
                <span className="ml-2 break-words w-full">{assetPath}</span>
              </label>
            ))
          )}
        </div>
      </div>
      <h4 className="font-semibold text-sm lg:text-base mb-1">Samples</h4>
      <div className="flex flex-row justify-between mb-8">
        <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
          {fileList.length === 0 ? (
            <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">
              No Samples available. Please upload some.
            </h3>
          ) : (
            fileList.map((assetPath, index) => (
              <label
                key={index}
                className="flex items-center relative cursor-pointer mr-2 break-words w-full"
              >
                <input
                  type="checkbox"
                  id={assetPath}
                  checked={sampleTest.some(
                    (sample) => sample.assetPath === assetPath
                  )}
                  name={assetPath}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSampleTest((oldarray) => [
                        ...oldarray,
                        { sampleId: assetPath, assetPath: assetPath }
                      ]);
                    } else {
                      setSampleTest((oldarray) =>
                        oldarray.filter(
                          (sample) => sample.assetPath !== assetPath
                        )
                      );
                    }
                  }}
                  className="hidden"
                />
                <span className="w-4 h-4 flex items-center justify-center">
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      sampleTest.some(
                        (sample) => sample.assetPath === assetPath
                      )
                        ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                        : 'bg-gray-200 border-gray-400'
                    } transition-transform transform hover:scale-110 duration-100 ease-in-out`}
                  >
                    {sampleTest.some(
                      (sample) => sample.assetPath === assetPath
                    ) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="4"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </span>
                </span>
                <span className="ml-2 break-words w-full">{assetPath}</span>
              </label>
            ))
          )}
        </div>
      </div>
      <div className="mt-auto ml-auto mb-2 self-center mr-auto flex flex-row justify-around max-w-[15rem] space-x-2 sm:space-x-sm lg:space-x-md">
        <button
          className="px-5 sm:px-8 py-2 bg-pink-500 dark:bg-pink-600 text-white font-semibold rounded-lg shadow-sm hover:bg-pink-600 dark:hover:bg-pink-700 transform hover:scale-105 duration-300 ease-in-out"
          onClick={() => {
            setSetup((oldSetup) => ({
              ...oldSetup,
              tests: oldSetup.tests
                .filter((test) => test.testNumber !== currentTest.testNumber)
                .map((test) => {
                  if (test.testNumber > currentTest.testNumber) {
                    return { ...test, testNumber: test.testNumber - 1 };
                  }
                  return test;
                })
            }));
            setCurrentTest((oldTest) => ({ ...oldTest, testNumber: -1 }));
          }}
        >
          Delete
        </button>
        <button
          className="px-7 sm:px-10 py-2 bg-blue-400 dark:bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 transform hover:scale-105 duration-300 ease-in-out"
          onClick={() => {
            const updatedTest = {
              ...currentTest,
              samples: sampleTest,
              anchors: anchorsTest,
              reference: referenceTest
            };

            if ('questions' in updatedTest) {
              delete updatedTest.questions;
            }
            if ('axis' in updatedTest) {
              delete updatedTest.axis;
            }

            setSetup((oldSetup) => ({
              ...oldSetup,
              tests: oldSetup.tests.map((test) =>
                test.testNumber === updatedTest.testNumber ? updatedTest : test
              )
            }));

            setCurrentTest(updatedTest);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default MushraEditor;
