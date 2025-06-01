import React, {useEffect, useState, useRef} from 'react';
import {FaXmark} from 'react-icons/fa6';
import {FaPlus, FaInfoCircle, FaExclamationTriangle, FaSave, FaExclamationCircle, FaCheckCircle} from 'react-icons/fa';
import {validateTestSchema} from '@/lib/schemas/utils';
import SampleUploadWidget from '@/lib/components/basic/SampleUploadWidget';
import {validateApiData} from '@/core/apiHandlers/clientApiHandler';
import {type ExperimentSetup, ExperimentSetupSchema, type ABTest, type ABXTest, type FullABXTest, type MUSHRATest, type APETest, type BaseTest} from '@/lib/schemas/experimentSetup';
import {getExperimentFetch, getSampleFetch, getSamplesFetch, setUpExperimentFetch,} from '@/lib/utils/fetchers';
import {getSampleSchema, getSamplesSchema, setUpExperimentSchema, uploadSampleSchema} from '@/lib/schemas/apiResults';
import AbEditor from '../editors/AbEditor';
import AbxEditor from '../editors/AbxEditor';
import MushraEditor from '../editors/MushraEditor';
import ApeEditor from '../editors/ApeEditor';
import { useToast, ToastType } from '@/lib/contexts/ToastContext';

function generateRandomString(): string {
    const segments = [];
    for (let i = 0; i < 4; i++) {
        segments.push(Math.floor(1000 + Math.random() * 9000));
    }
    return segments.join('-');
}

const MAX_TESTS = 10;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_END_TEXT_LENGTH = 100;

const CreateExperimentForm = ({
                                  selectedExperiment,
                                  setSelectedExperiment
                              }: {
    selectedExperiment: string
    setSelectedExperiment: React.Dispatch<React.SetStateAction<string>>
}): JSX.Element => {
    const { addToast } = useToast();
    const setupLoadedRef = useRef(false);

    useEffect(() => {
        let isSubscribed = true;
        setupLoadedRef.current = false;

        setSetupUploadedFlag(false);
        setSetupError(null);

        getExperimentFetch(selectedExperiment, ExperimentSetupSchema)
            .then((response) => {
                if (isSubscribed) {
                    if (response.tests.length > MAX_TESTS) {
                        addToast(
                            `Experiment contains too many tests (max ${MAX_TESTS} allowed).`,
                            ToastType.WARNING
                        );
                        response.tests = response.tests.slice(0, MAX_TESTS);
                    }
                    setSetup(response);
                    if (!setupLoadedRef.current) {
                        addToast('Experiment setup loaded successfully', ToastType.SUCCESS);
                        setupLoadedRef.current = true;
                    }
                }
            })
            .catch(() => {
                if (isSubscribed) {
                    setSetup({
                        uid: generateRandomString(),
                        name: selectedExperiment,
                        description: ' ',
                        endText: '',
                        tests: []
                    });
                    if (!setupLoadedRef.current) {
                        setupLoadedRef.current = true;
                    }
                }
            });

        getSamplesFetch(selectedExperiment, getSamplesSchema)
            .then((response) => {
                if (isSubscribed) {
                    setFileList((oldFileList) => Array.from(new Set([...oldFileList, ...response])));
                    if (response.length > 0) {
                        addToast(`Loaded ${response.length} existing samples`, ToastType.SUCCESS);
                    }
                }
            })
            .catch((error) => {
                if (isSubscribed) {
                    console.error(error);
                    addToast('Failed to load existing samples', ToastType.ERROR);
                }
            });

        return () => {
            isSubscribed = false;
        };
    }, [selectedExperiment, addToast]);

    const [setup, setSetup] = useState<ExperimentSetup>({
        uid: generateRandomString(),
        name: selectedExperiment,
        description: ' ',
        endText: '',
        tests: []
    });
    const [currentTest, setCurrentTest] = useState<ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest>({
        testNumber: -1,
        type: 'AB',
        samples: [],
        questions: []
    });

    const [fileList, setFileList] = useState<string[]>([]);
    const [setupUploadedFlag, setSetupUploadedFlag] = useState<boolean>(false);
    const [setupList, setSetupList] = useState<string[]>([]);
    const [setupError, setSetupError] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState<number | null>(null);
    const [showUploadWidget, setShowUploadWidget] = useState(false);
    const [showTooltipSetup, setShowTooltipSetup] = useState<boolean>(false);
    const fileRef = useRef(null);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showSaveInfo, setShowSaveInfo] = useState<boolean>(false);


    const readFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const fileReader = new FileReader();
        const {files} = event.target;
        if (files === null) {
            return;
        }
        setSetupUploadedFlag(true);
        setSetupList([]);
        if (files[0].type !== 'application/json') {
            setSetupError('Invalid file type. Please upload a JSON file.');
            addToast('Invalid file type. Please upload a JSON file.', ToastType.ERROR);
            return;
        }
        fileReader.readAsText(files[0], 'UTF-8');
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target !== null) {
                const content = e.target.result as string;
                try {
                    const uploadedData: ExperimentSetup = JSON.parse(content);
                    const {data, validationError} = validateApiData(uploadedData, ExperimentSetupSchema);
                    const testValidationErrors: string[] = [];
                    if (validationError !== null) {
                        setSetupError('Invalid setup file.');
                        addToast('Invalid setup file structure', ToastType.ERROR);
                    }
                    if (data !== null) {
                        if (data.tests.length > MAX_TESTS) {
                            addToast(
                                `Experiment contains too many tests (max ${MAX_TESTS} allowed).`,
                                ToastType.WARNING
                            );
                            data.tests = data.tests.slice(0, MAX_TESTS);
                        }
                        data.tests.forEach((test) => {
                            const validationResult = validateTestSchema(test);
                            if (validationResult.validationError != null) {
                                testValidationErrors.push(validationResult.validationError);
                            }
                            else {
                                test = validationResult.data;
                            }
                        });
                        if (testValidationErrors.length <= 0) {
                            setSetup(uploadedData);
                            setSetupList([files[0].name]);
                            setSetupError(null);
                            setSetupUploadedFlag(true);
                            addToast('Experiment setup uploaded successfully', ToastType.SUCCESS);
                        } else {
                            setSetupError('Invalid setup file.');
                            addToast('Invalid test configuration in setup file', ToastType.ERROR);
                        }
                    }
                } catch (error) {
                    setSetupError('Invalid setup file.');
                    addToast('Failed to parse setup file', ToastType.ERROR);
                }
            }
        };
    };

    const areAllFilesProvided = (
        test: ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest,
        fileList: string[]
    ): boolean => {
        const samplesExist = test.samples.every((sample) =>
            fileList.includes(sample.assetPath)
        );
        return samplesExist;
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
    };


    const handleDropSetup = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
        setSetupList([]);
        setSetupUploadedFlag(true);

        const fileReader = new FileReader();
        const files = e.dataTransfer.files;

        if (files[0].type !== 'application/json') {
            setSetupError('Invalid file type. Please upload a JSON file.');
            return;
        }

        fileReader.readAsText(files[0], 'UTF-8');
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target !== null) {
                const content = e.target.result as string;
                if (JSON.parse(content).tests === undefined) {
                    setSetupError('Invalid setup file.');
                    return;
                }
                setSetupList([files[0].name]);
                setSetup(JSON.parse(content));
                setSetupError(null);
            }
        };
    };
    const handleSamplesSubmitted = (newSamples: { name: string; assetPath: string }[]): void => {
        setFileList((prev) => [...prev, ...newSamples.map(sample => sample.assetPath)]);
    };

    const handleSave = async (): Promise<void> => {
        if (setup.description.length > MAX_DESCRIPTION_LENGTH) {
            addToast(
                `Description exceeds maximum length of ${MAX_DESCRIPTION_LENGTH} characters.`,
                ToastType.WARNING
            );
            return;
        }

        if (setup.endText.length > MAX_END_TEXT_LENGTH) {
            addToast(
                `End credits exceed maximum length of ${MAX_END_TEXT_LENGTH} characters.`,
                ToastType.WARNING
            );
            return;
        }

        try {
            const response = await setUpExperimentFetch(selectedExperiment, setup, setUpExperimentSchema);
            addToast('Experiment setup saved successfully', ToastType.SUCCESS);
            return response;
        } catch (error) {
            console.error('Error saving experiment:', error);
            addToast('Failed to save experiment setup', ToastType.ERROR);
        }
    };

    const handleAddTest = () => {
        if (setup.tests.length >= MAX_TESTS) {
            addToast(
                `Maximum number of tests (${MAX_TESTS}) reached.`,
                ToastType.WARNING
            );
            return;
        }

        setSetup((oldSetup) => ({
            ...oldSetup,
            tests: [
                ...oldSetup.tests,
                {
                    testNumber: oldSetup.tests.length + 1,
                    type: 'AB',
                    samples: [],
                    questions: []
                }
            ]
        }));
    };

    return (
        <div
            className="flex flex-col self-center fadeInUpFast 2xl:self-start text-black dark:text-white bg-gray-50 dark:bg-stone-800 rounded-3xl shadow-lg 2xl:shadow-2xl w-full max-w-4xl z-10 p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6 w-full whitespace-normal break-words">
        <span className="text-lg lg:text-xl font-semibold w-8/12 sm:w-9/12">
          &apos;{selectedExperiment}&apos; Experiment Setup:
        </span>
                <div className="flex flex-row space-x-2 ml-4 self-start">
                    <div className="relative inline-block">
                        <FaSave
                            aria-label="save-setup"
                            onClick={handleSave}
                            className="cursor-pointer text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-110 duration-300 ease-in-out"
                            size={35}
                            onMouseEnter={() => {
                                setShowSaveInfo(true);
                            }}
                            onMouseLeave={() => {
                                setShowSaveInfo(false);
                            }}
                        />
                        {showSaveInfo && (
                            <div
                                className="absolute right-0 top-full mt-2 w-64 p-2 text-xs text-white bg-gray-800 dark:text-black dark:bg-gray-300 rounded-md shadow-lg z-10">
                                Overwriting the experiment will delete the results
                            </div>
                        )}
                    </div>
                    <FaXmark
                        onClick={() => {
                            setSelectedExperiment('');
                        }}
                        className="cursor-pointer text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-110 duration-300 ease-in-out"
                        size={40}
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row h-full space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col border-r-0 border-b-2 md:border-r-2 md:border-b-0 h-full w-full md:w-2/3 p-4">
                    <h3 className="text-sm lg:text-base font-semibold mb-2">STEP 1 - SUBMIT SAMPLES</h3>
                    <button
                        onClick={() => {setShowUploadWidget(true);}}
                        className="py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors shadow-sm mb-4"
                    >
                        Add samples
                    </button>
                    {showUploadWidget && (
                        <SampleUploadWidget
                            experimentName={selectedExperiment}
                            onClose={() => {setShowUploadWidget(false);}}
                            onSamplesSubmitted={handleSamplesSubmitted}
                        />
                    )}

                    <h3 className="text-sm lg:text-base font-semibold mb-2 mt-8">STEP 2 - CREATE TESTS</h3>
                    <h3 className="text-sm lg:text-base font-semibold -mb-5">Manually</h3>
                    <div className="flex flex-col space-y-2 mb-4">
                        <button
                            aria-label="Add new test"
                            className="flex items-center self-end bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 text-white text-sm font-medium py-1 lg:py-2 px-1 lg:px-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110"
                            onClick={handleAddTest}
                        >
                            <FaPlus/>
                        </button>
                        {setup.tests.length === 0 ? (
                            <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">
                                No tests have been created or uploaded yet.
                            </h3>
                        ) : (
                            setup.tests.map((test, index) => (
                                <div
                                    key={index}
                                    className="relative cursor-pointer p-2 text-white font-semibold bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-105 duration-300 ease-in-out rounded-md"
                                    onClick={() => {
                                        setCurrentTest(test);
                                    }}
                                >
                                    <div className="flex items-center">
                                        <span>Test #{test.testNumber}</span>
                                        {!areAllFilesProvided(test, fileList) && (
                                            <div
                                                className="relative flex items-center ml-2"
                                                onMouseEnter={() => {
                                                    setShowTooltip(index);
                                                }}
                                                onMouseLeave={() => {
                                                    setShowTooltip(null);
                                                }}
                                            >
                                                <FaExclamationTriangle
                                                    className="text-yellow-400 transform hover:scale-125 duration-100 ease-in-out"/>
                                                {showTooltip === index && (
                                                    <div
                                                        className="absolute left-0 bottom-full mb-2 w-40 p-2 text-xs text-white bg-gray-800 dark:text-black dark:bg-gray-300 rounded-md shadow-lg">
                                                        Some sample files are missing for this test
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {setup.tests.length >= MAX_TESTS && (
                            <div className="mt-2 text-red-500 dark:text-red-400">
                                Maximum number of tests reached.
                            </div>
                        )}
                    </div>

                    <div className="mt-auto">
                        <h4 className="font-semibold text-sm lg:text-base mb-4 mt-2">
                            OR
                        </h4>
                        <h4 className="font-semibold text-sm lg:text-base mb-2 mt-6">
                            Upload test setup from file
                        </h4>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file-setup"
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDropSetup}
                                className="dropzone flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-6 h-6 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-1 text-xs text-center text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or
                                        drag and drop
                                    </p>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                        (JSON files)
                                    </p>
                                </div>
                                <input
                                    id="dropzone-file-setup"
                                    aria-label="dropzone-file-setup"
                                    ref={fileRef}
                                    type="file"
                                    onChange={readFile}
                                    className="hidden"
                                />
                                {setupUploadedFlag && (
                                    <div
                                        className="absolute self-end mb-16 mr-2 z-20"
                                        onMouseEnter={() => {
                                            setShowTooltipSetup(true);
                                        }}
                                        onMouseLeave={() => {
                                            setShowTooltipSetup(false);
                                        }}
                                    >
                                        {setupError != null ? (
                                            <FaExclamationCircle
                                                aria-label="error-setup"
                                                className="text-red-500 transform hover:scale-110 duration-100 ease-in-out"
                                                size={24}
                                            />
                                        ) : (
                                            <FaCheckCircle
                                                aria-label="confirm-setup"
                                                className="text-green-500 transform hover:scale-110 duration-100 ease-in-out"
                                                size={24}
                                            />
                                        )}
                                        {showTooltipSetup && (
                                            <div
                                                className="absolute right-0 top-full mt-2 w-64 p-2 text-xs text-white bg-gray-800 dark:text-black dark:bg-gray-300 rounded-md shadow-lg z-10">
                                                {setupList.length > 0 ? (
                                                    <div>
                                                        <h4 className="text-sm font-semibold">
                                                            Uploaded Setup:
                                                        </h4>
                                                        <ul className="list-disc pl-5">
                                                            {setupList.map((setup, index) => (
                                                                <li key={index} className="text-sm break-words">
                                                                    {setup}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : null}
                                                {setupError != null && (
                                                    <p className="text-pink-500 dark:text-pink-600 text-sm font-medium whitespace-normal break-words">
                                                        {setupError}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <h3 className="font-semibold text-sm lg:text-base mb-2 mt-12">STEP 3 (Optional)</h3>
                    <h4 className="font-semibold text-sm lg:text-base mb-2">
                        Experiment Description
                    </h4>
                    <div className="flex items-center w-full mb-3">
                        <input
                            className="rounded outline-0 border-2 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-500 text-black dark:text-white w-full"
                            value={setup.description}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            onChange={(e) => {
                                setSetup((oldSetup) => ({
                                    ...oldSetup,
                                    description: e.target.value
                                }));
                            }}
                        />
                    </div>
                    <h4 className="font-semibold text-sm lg:text-base mb-2">
                        End Credits
                    </h4>
                    <div className="flex items-center w-full mb-6">
                        <input
                            className="rounded outline-0 border-2 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-500 text-black dark:text-white w-full"
                            value={setup.endText}
                            maxLength={MAX_END_TEXT_LENGTH}
                            onChange={(e) => {
                                setSetup((oldSetup) => ({
                                    ...oldSetup,
                                    endText: e.target.value
                                }));
                            }}
                        />
                    </div>

                </div>
                {currentTest.testNumber === -1 ? (
                    <div/>
                ) : (
                    <div
                        className="flex flex-col w-full h-full p-4 whitespace-normal break-words md:w-2/3 bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg text-gray-700 dark:text-gray-300">
                        <div>
                            <h1 className="text-base lg:text-lg font-bold mb-4 text-center text-blue-400 dark:text-blue-500">
                                Test #{currentTest.testNumber} Configuration
                            </h1>
                            <h4 className="text-sm lg:text-base font-semibold mb-2 flex items-center">
                                Type of Experiment
                                <FaInfoCircle
                                    className="ml-2 text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-110 duration-100 ease-in-out cursor-pointer"
                                    onClick={() => {
                                        setShowInfo(!showInfo);
                                    }}
                                />
                            </h4>
                            {showInfo && (
                                <div
                                    className="mb-4 p-2 text-sm rounded-3xl bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 fadeInDown">
                                    Choose the{' '}
                                    <span className="font-semibold">type of experiment</span> you
                                    would like to configure for the given test. For more
                                    information about all types of experiments, please visit our{' '}
                                    <span className="font-semibold">About page</span>.
                                </div>
                            )}
                            <div
                                className="grid sm:flex md:grid lg:flex justify-normal sm:justify-evenly md:justify-normal lg:justify-evenly mb-4">
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input
                                        type="radio"
                                        value="MUSHRA"
                                        name="type"
                                        checked={currentTest.type === 'MUSHRA'}
                                        onClick={(e) => {
                                            setCurrentTest({
                                                ...currentTest,
                                                type: (e.target as HTMLTextAreaElement)
                                                    .value as 'MUSHRA',
                                                anchors: [],
                                                reference: {sampleId: '', assetPath: ''}
                                            });
                                        }}
                                        className="hidden"
                                    />
                                    <span
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            currentTest.type === 'MUSHRA'
                                                ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                                                : 'bg-gray-200 border-gray-400'
                                        } transition-transform transform hover:scale-110 duration-100 ease-in-out`}
                                    >
                    <span
                        className={`w-2 h-2 rounded-full ${
                            currentTest.type === 'MUSHRA'
                                ? 'bg-white dark:bg-gray-100'
                                : ''
                        }`}
                    ></span>
                  </span>
                                    <span className="ml-2">MUSHRA</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input
                                        type="radio"
                                        value="AB"
                                        name="type"
                                        checked={currentTest.type === 'AB'}
                                        onClick={(e) => {
                                            setCurrentTest({
                                                ...currentTest,
                                                type: (e.target as HTMLTextAreaElement).value as 'AB',
                                                questions: [],
                                                samples: currentTest.samples.slice(0, 2)
                                            });
                                        }}
                                        className="hidden"
                                    />
                                    <span
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            currentTest.type === 'AB'
                                                ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                                                : 'bg-gray-200 border-gray-400'
                                        } transition-transform transform hover:scale-110 duration-100 ease-in-out`}
                                    >
                    <span
                        className={`w-2 h-2 rounded-full ${
                            currentTest.type === 'AB'
                                ? 'bg-white dark:bg-gray-100'
                                : ''
                        }`}
                    ></span>
                  </span>
                                    <span className="ml-2">AB</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input
                                        type="radio"
                                        value="ABX"
                                        name="type"
                                        checked={currentTest.type === 'ABX'}
                                        onClick={(e) => {
                                            setCurrentTest({
                                                ...currentTest,
                                                type: (e.target as HTMLTextAreaElement).value as 'ABX',
                                                questions: [],
                                                samples: currentTest.samples.slice(0, 2)
                                            });
                                        }}
                                        className="hidden"
                                    />
                                    <span
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            currentTest.type === 'ABX'
                                                ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                                                : 'bg-gray-200 border-gray-400'
                                        } transition-transform transform hover:scale-110 duration-100 ease-in-out`}
                                    >
                    <span
                        className={`w-2 h-2 rounded-full ${
                            currentTest.type === 'ABX'
                                ? 'bg-white dark:bg-gray-100'
                                : ''
                        }`}
                    ></span>
                  </span>
                                    <span className="ml-2">ABX</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input
                                        type="radio"
                                        value="APE"
                                        name="type"
                                        checked={currentTest.type === 'APE'}
                                        onClick={(e) => {
                                            setCurrentTest({
                                                ...currentTest,
                                                type: (e.target as HTMLTextAreaElement).value as 'APE',
                                                axis: []
                                            });
                                        }}
                                        className="hidden"
                                    />
                                    <span
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            currentTest.type === 'APE'
                                                ? 'bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600'
                                                : 'bg-gray-200 border-gray-400'
                                        } transition-transform transform hover:scale-110 duration-100 ease-in-out`}
                                    >
                    <span
                        className={`w-2 h-2 rounded-full ${
                            currentTest.type === 'APE'
                                ? 'bg-white dark:bg-gray-100'
                                : ''
                        }`}
                    ></span>
                  </span>
                                    <span className="ml-2">APE</span>
                                </label>
                            </div>
                        </div>
                        {(() => {
                            switch (currentTest.type) {
                                case 'MUSHRA':
                                    return (
                                        <MushraEditor
                                            currentTest={currentTest as MUSHRATest}
                                            setCurrentTest={setCurrentTest}
                                            fileList={fileList}
                                            setSetup={setSetup}
                                        />
                                    );
                                case 'AB':
                                    return (
                                        <AbEditor
                                            currentTest={currentTest as ABTest}
                                            setCurrentTest={setCurrentTest}
                                            fileList={fileList}
                                            setSetup={setSetup}
                                        />
                                    );
                                case 'ABX':
                                    return (
                                        <AbxEditor
                                            currentTest={currentTest as ABXTest}
                                            setCurrentTest={setCurrentTest}
                                            fileList={fileList}
                                            setSetup={setSetup}
                                        />
                                    );
                                case 'APE':
                                    return (
                                        <ApeEditor
                                            currentTest={currentTest as APETest}
                                            setCurrentTest={setCurrentTest}
                                            fileList={fileList}
                                            setSetup={setSetup}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateExperimentForm;

