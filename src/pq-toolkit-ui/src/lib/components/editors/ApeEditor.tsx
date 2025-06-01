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
import { FaPlus } from 'react-icons/fa';
import DeleteAxisComp from '../form/deleteAxisComp';
import { useToast, ToastType } from '@/lib/contexts/ToastContext';

const ApeEditor = ({
  currentTest,
  setCurrentTest,
  fileList,
  setSetup
}: {
  currentTest: APETest
  setCurrentTest: React.Dispatch<
    React.SetStateAction<
      ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest
    >
  >
  fileList: string[]
  setSetup: React.Dispatch<React.SetStateAction<ExperimentSetup>>
}): JSX.Element => {
  const [newQuestion, setNewQuestion] = useState('');
  const [sampleTest, setSampleTest] = useState<Sample[]>(currentTest.samples);
  const { addToast } = useToast();
  
  const handleAddAxis = () => {
    if (newQuestion.length === 0) {
      addToast('Axis label cannot be empty', ToastType.WARNING);
      return;
    }
  
    if (currentTest.axis?.some((q) => q.text === newQuestion)) {
      addToast('This axis already exists', ToastType.WARNING);
      return;
    }
  
    const updatedAxis = currentTest.axis != null
      ? [...currentTest.axis, { questionId: newQuestion, text: newQuestion }]
      : [{ questionId: newQuestion, text: newQuestion }];
  
    const updatedTest = {
      ...currentTest,
      axis: updatedAxis
    };
  
    setCurrentTest(updatedTest);
    setNewQuestion('');
    addToast('Axis added successfully', ToastType.SUCCESS);
  };

  return (
    <div className="w-full">
      <h4 className="font-semibold text-sm lg:text-base mb-1 mt-3">Samples</h4>
      <div className="flex flex-row justify-between mb-4">
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
                      const foundJSON = sampleTest.find(
                        (item) => item.assetPath === assetPath
                      );
                      if (foundJSON !== undefined) {
                        setSampleTest((oldarray) =>
                          oldarray.filter(
                            (sample) => sample.assetPath !== assetPath
                          )
                        );
                      }
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
      <h4 className="font-semibold text-sm lg:text-base mb-2">Axes</h4>
      <div className="flex items-center w-full mb-2">
        <input
          className="rounded outline-0 border-2 bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-500 text-black dark:text-white w-full"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddAxis();
            }
          }}
        />
        <button
          onClick={() => {
            if (currentTest.axis != null) {
              setCurrentTest({
                ...currentTest,
                axis: [
                  ...currentTest.axis,
                  {
                    questionId: newQuestion,
                    text: newQuestion
                  }
                ]
              });
            } else {
              setCurrentTest({
                ...currentTest,
                axis: [{ questionId: newQuestion, text: newQuestion }]
              });
            }
            setNewQuestion('');
          }}
          disabled={
            newQuestion.length === 0 ||
            currentTest.axis?.some((q) => q.text === newQuestion)
          }
          className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-500 dark:disabled:text-gray-300 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 disabled:transform-none transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs ml-4 text-white"
        >
          <FaPlus />
        </button>
      </div>
      <div className="mb-8">
        {currentTest.axis !== undefined
          ? currentTest.axis.map((question, index) => (
              <div
                key={index}
                className="p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center"
              >
                <p className="text-black dark:text-white whitespace-normal break-words w-9/12 lg:w-10/12">
                  {question.text}
                </p>
                <DeleteAxisComp
                  index={index}
                  setCurrentTest={setCurrentTest}
                  currentTest={currentTest}
                />
              </div>
            ))
          : null}
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
              samples: sampleTest
            };

            if ('questions' in updatedTest) {
              delete updatedTest.questions;
            }
            if ('anchors' in updatedTest) {
              delete updatedTest.anchors;
            }
            if ('reference' in updatedTest) {
              delete updatedTest.reference;
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
export default ApeEditor;
