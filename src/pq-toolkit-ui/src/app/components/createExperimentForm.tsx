import React, { useEffect, useState, useRef } from "react"
import { FaXmark } from "react-icons/fa6";
import { FaPlus, FaInfoCircle, FaExclamationTriangle, FaSave, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import DeleteQuestionComp from "./deleteQuestionComp";
import DeleteAxisComp from "./deleteAxisComp";
import { validateTestSchema } from "@/lib/schemas/utils";
import { validateApiData } from "@/core/apiHandlers/clientApiHandler";
import {
    type ExperimentSetup, ExperimentSetupSchema, type ABTest, type ABXTest, type FullABXTest, type MUSHRATest, type APETest, type BaseTest, type Sample
} from '@/lib/schemas/experimentSetup'
import axios from "axios";

const sendSaveExperimentRequest = async (experimentName: string, experimentJSON: ExperimentSetup): Promise<any> => {
    const formData = new FormData()
    const jsonBlob = new Blob([JSON.stringify(experimentJSON)], { type: 'application/json' });
    formData.append('file', jsonBlob, 'setup.json')
    await axios.post(`/api/v1/experiments/${experimentName}`, formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })

}

const sendUploadSample = async (experimentName: string, sample: File, sampleName: string): Promise<any> => {
    const formData = new FormData()
    formData.append('file', sample, sampleName)
    const response = await axios.post(`/api/v1/experiments/${experimentName}/samples`, formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    return response
}

const getExperiment = async (experimentName: string): Promise<any> => {
    const response = await axios.get(`/api/v1/experiments/${experimentName}`, {
        headers: {
            'accept': 'application/json',
        }
    })
    return response
}

const getSamples = async (experimentName: string): Promise<any> => {
    const response = await axios.get(`/api/v1/experiments/${experimentName}/samples`, {
        headers: {
            'accept': 'application/json',
        }
    })
    return response
}

const getSample = async (experimentName: string, fileName: string): Promise<any> => {
    const response = await axios.get(`/api/v1/experiments/${experimentName}/samples/${fileName}`, {
        headers: {
            'accept': 'application/json',
        }
    })
    return response
}

const CreateExperimentForm = (props: any): JSX.Element => {
    useEffect(() => {
        getExperiment(props.selectedExperiment).then((response) => { setSetup(response.data) }).catch(error => {
            setSetup({
                uid: "",
                name: "",
                description: "",
                endText: "",
                tests: []
            })
            console.error(error)
        })
        getSamples(props.selectedExperiment).then((response) => {
            for (const sampleName of response.data) {
                getSample(props.selectedExperiment, sampleName).then(response => {
                    const responseData: ArrayBuffer = response.data
                    const newFile = new File([responseData], sampleName);
                    setFileList((oldSampleFiles) => {
                        const fileExists = oldSampleFiles.some(file => file.name === newFile.name);
                        if (!fileExists) {
                            return [...oldSampleFiles, newFile];
                        } else {
                            return oldSampleFiles;
                        }
                    });
                }).catch(error => { console.error(error) })
            }
        }).catch(error => { console.error(error) })
    }, [props.selectedExperiment]);

    const [setup, setSetup] = useState<ExperimentSetup>({
        uid: " ",
        name: " ",
        description: "",
        endText: "",
        tests: []
    })
    const [currentTest, setCurrentTest] = useState<ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest>({
        testNumber: -1,
        type: "AB",
        samples: [],
        questions: []
    })

    const [fileList, setFileList] = useState<File[]>([])
    const [setupUploadedFlag, setSetupUploadedFlag] = useState(false)
    const [setupList, setSetupList] = useState<string[]>([])
    const [invalidfileList, setInvalidFileList] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [setupError, setSetupError] = useState<string | null>(null)
    const [showTooltip, setShowTooltip] = useState<number | null>(null)
    const [showTooltipSample, setShowTooltipSample] = useState<boolean>(false)
    const [showTooltipSetup, setShowTooltipSetup] = useState<boolean>(false)
    const fileRef = useRef(null)
    const [showInfo, setShowInfo] = useState(false)

    const readSampleFiles = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { files } = event.target;
        const invalidFiles: File[] = [];
        if (files !== null) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].type === 'audio/mpeg') {
                    const newFile = files.item(i);
                    if (newFile !== null) {
                        sendUploadSample(props.selectedExperiment, newFile, newFile.name).then((response) => {
                            setFileList((oldSampleFiles) => {
                                return [...oldSampleFiles, newFile]
                            })
                        }).catch((error) => { console.error(error) })

                    }
                } else {
                    invalidFiles.push(files[i])
                }
            }
        }
        if (invalidFiles.length > 0) {
            setError(`Invalid file(s) detected: ${invalidFiles.join(', ')}`)
        } else {
            setError(null)
        }
        setFileList((oldSampleFiles) => { return oldSampleFiles.filter((value, index, array) => { return array.indexOf(value) === index }) })
    }

    const readFile = (event: any): void => {
        const fileReader = new FileReader();
        const { files } = event.target;
        if (files[0].type !== 'application/json') {
            setSetupError('Invalid file type. Please upload a JSON file.');
            return;
        }
        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = (e: any) => {
            const content = e.target.result
            try {
                const uploadedData: ExperimentSetup = JSON.parse(content)
                const { data, validationError } = validateApiData(uploadedData, ExperimentSetupSchema)
                const testValidationErrors: string[] = []
                console.log(uploadedData)
                if (validationError !== null) {
                    setSetupError('Invalid setup file.')
                }
                if (data !== null) {
                    data.tests.forEach(test => {
                        const validationResult = validateTestSchema(test)
                        if (validationResult.validationError != null)
                            testValidationErrors.push(validationResult.validationError)
                        else test = validationResult.data
                    })
                    if (testValidationErrors.length <= 0) {
                        setSetup(uploadedData)
                        setSetupError(null)
                    } else {
                        setSetupError('Invalid setup file.')
                    }
                }
            } catch (error) {
                setSetupError('Invalid setup file.')
            }
        }
    }

    const areAllFilesProvided = (test: ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest, fileList: File[]): boolean => {
        if (Object.prototype.hasOwnProperty.call(test, 'reference')) {
            if ('reference' in test && test.reference !== undefined) {
                const fileExists = fileList.some(file => file.name === test.reference.assetPath);
                if (!fileExists) {
                    return false;
                }
            }
        }
        if (Object.prototype.hasOwnProperty.call(test, 'anchors')) {
            if ('anchors' in test && test.anchors !== undefined) {
                const anchorsExist = test.anchors.every(anchor =>
                    fileList.some(file => file.name === anchor.assetPath)
                );
                if (!anchorsExist) {
                    return false;
                }
            }
        }
        const samplesExist = test.samples.every(sample =>
            fileList.some(file => file.name === sample.assetPath)
        );
        if (!samplesExist) {
            return false;
        }
        return true
    }

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.add('drag-over')
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.add('drag-over')
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('drag-over')
    };

    const handleDropSamples = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('drag-over')

        const files = e.dataTransfer.files
        const invalidFiles: string[] = []
        setFileList([])
        setInvalidFileList([])

        for (let i = 0; i < files.length; i++) {
            if (files[i].type === 'audio/mpeg') {
                setFileList((oldSampleFiles) => {
                    const newFile = files.item(i);
                    if (newFile !== null) {
                        return [...oldSampleFiles, newFile];
                    }
                    return oldSampleFiles;
                })
            } else {
                invalidFiles.push(files[i].name)
                setInvalidFileList(invalidFiles)
            }
        }

        if (invalidFiles.length > 0) {
            setError(`Invalid file(s) detected: ${invalidFiles.join(', ')}`);
        } else {
            setError(null)
        }

        setFileList((oldSampleFiles) => { return oldSampleFiles.filter((value, index, array) => { return array.indexOf(value) === index }) })
    }

    const handleDropSetup = (e: React.DragEvent<HTMLLabelElement>): void => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('drag-over')
        setSetupList([])
        setSetupUploadedFlag(true)

        const fileReader = new FileReader()
        const files = e.dataTransfer.files

        if (files[0].type !== 'application/json') {
            setSetupError('Invalid file type. Please upload a JSON file.')
            return
        }

        fileReader.readAsText(files[0], "UTF-8")
        fileReader.onload = (e: any) => {
            const content = e.target.result
            if (JSON.parse(content).tests === undefined) {
                setSetupError('Invalid setup file.')
                return
            }
            setSetupList([files[0].name])
            setSetup(JSON.parse(content))
            setSetupError(null)
        }
    }

    return (
        <div className="flex flex-col self-center fadeInUpFast 2xl:self-start text-black dark:text-white bg-gray-50 dark:bg-stone-800 rounded-3xl shadow-lg 2xl:shadow-2xl w-full max-w-4xl z-10 p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6 w-full whitespace-normal break-words">
                <span className="text-lg lg:text-xl font-semibold w-8/12 sm:w-9/12">&apos;{props.selectedExperiment}&apos; Experiment Setup:</span>
                <div className="flex flex-row space-x-2 ml-4 self-start">
                    <FaSave onClick={() => {
                        void (async () => {
                            try {
                                await sendSaveExperimentRequest(props.selectedExperiment, setup);
                            } catch (error) {
                                console.error(error)
                            }
                        })();
                    }} className="cursor-pointer text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-110 duration-300 ease-in-out" size={35} />
                    <FaXmark onClick={() => props.setSelectedExperiment(undefined)} className="cursor-pointer text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-110 duration-300 ease-in-out" size={40} />
                </div>
            </div>
            <div className="flex flex-col md:flex-row h-full space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col border-r-0 border-b-2 md:border-r-2 md:border-b-0 h-full w-full md:w-2/3 p-4">
                    <h3 className="text-sm lg:text-base font-semibold -mb-5">Tests</h3>
                    <div className="flex flex-col space-y-2 mb-6">
                        <button className="flex items-center self-end bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 text-white text-sm font-medium py-1 lg:py-2 px-1 lg:px-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110"
                            onClick={() => {
                                setSetup((oldSetup) => ({
                                    ...oldSetup,
                                    tests: [
                                        ...oldSetup.tests,
                                        {
                                            testNumber: oldSetup.tests.length + 1,
                                            type: "AB",
                                            samples: [],
                                            questions: []
                                        }
                                    ]
                                }));
                            }}
                        >
                            <FaPlus />
                        </button>
                        {setup.tests.length === 0 ? (
                            <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">
                                No tests available. Please upload the Experiment Setup or add new test.
                            </h3>
                        ) : (
                            setup.tests.map((test, index) => (
                                <div
                                    key={index}
                                    className="relative cursor-pointer p-2 text-white font-semibold bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-105 duration-300 ease-in-out rounded-md"
                                    onClick={() => { setCurrentTest(test) }}
                                >
                                    <div className="flex items-center">
                                        <span>{test.testNumber}</span>
                                        {!areAllFilesProvided(test, fileList) && (
                                            <div
                                                className="relative flex items-center ml-2"
                                                onMouseEnter={() => { setShowTooltip(index) }}
                                                onMouseLeave={() => { setShowTooltip(null) }}
                                            >
                                                <FaExclamationTriangle className="text-yellow-400 transform hover:scale-125 duration-100 ease-in-out" />
                                                {showTooltip === index && (
                                                    <div className="absolute left-0 bottom-full mb-2 w-40 p-2 text-xs text-white bg-gray-800 dark:text-black dark:bg-gray-300 rounded-md shadow-lg">
                                                        Some sample files are missing for this test
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <h4 className="font-semibold text-sm lg:text-base mb-2">Description</h4>
                    <div className="flex items-center w-full mb-3">
                        <input
                            className="rounded outline-0 border-2 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-500 text-black dark:text-white w-full"
                            value={setup.description}
                            onChange={(e) => { setSetup((oldSetup) => ({ ...oldSetup, description: e.target.value })) }}
                        />
                        {/* <button
                            onClick={() => {
                            }}
                            // disabled={null}
                            className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-500 dark:disabled:text-gray-300 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 disabled:transform-none transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs ml-4 text-white"
                        >
                            <FaPlus />
                        </button> */}
                    </div>
                    <h4 className="font-semibold text-sm lg:text-base mb-2">End Credits</h4>
                    <div className="flex items-center w-full mb-6">
                        <input
                            className="rounded outline-0 border-2 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-500 text-black dark:text-white w-full"
                            value={setup.endText}
                            onChange={(e) => { setSetup((oldSetup) => ({ ...oldSetup, endText: e.target.value })) }}
                        />
                        {/* <button
                            onClick={() => {
                            }}
                            // disabled={null}
                            className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-500 dark:disabled:text-gray-300 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 disabled:transform-none transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs ml-4 text-white"
                        >
                            <FaPlus />
                        </button> */}
                    </div>
                    <div className="mt-auto">
                        <h4 className="text-sm lg:text-base font-semibold mb-2">Upload Samples</h4>
                        <div className="flex items-center justify-center w-full mb-3">
                            <label
                                htmlFor="dropzone-file-samples"
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDropSamples}
                                className="dropzone flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-1 text-xs text-center text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">(MP3 files)</p>
                                </div>
                                <input id="dropzone-file-samples" ref={fileRef} multiple type="file" onChange={readSampleFiles} className="hidden" />
                                {(fileList.length > 0 || invalidfileList.length > 0) && (
                                    <div className="absolute self-end mb-16 mr-2 z-20" onMouseEnter={() => { setShowTooltipSample(true); }} onMouseLeave={() => { setShowTooltipSample(false); }}>
                                        {(error != null) ? (
                                            <FaExclamationCircle className="text-red-500 transform hover:scale-110 duration-100 ease-in-out" size={24} />
                                        ) : (
                                            <FaCheckCircle className="text-green-500 transform hover:scale-110 duration-100 ease-in-out" size={24} />
                                        )}
                                        {showTooltipSample && (
                                            <div className="absolute right-0 top-full mt-2 w-64 p-2 text-xs text-white bg-gray-800 dark:text-black dark:bg-gray-300 rounded-md shadow-lg z-10">
                                                {(error != null) && <p className="text-pink-500 dark:text-pink-600 text-sm font-medium whitespace-normal break-words w-2/3">{error}</p>}
                                                {fileList.length > 0 ? (
                                                    <div>
                                                        <h4 className="text-sm font-semibold">Uploaded files:</h4>
                                                        <ul className="list-disc pl-5">
                                                            {fileList.map((file, index) => (
                                                                <li key={index} className="text-sm break-words">{file.name}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (null)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </label>
                        </div>
                        <h4 className="font-semibold text-sm lg:text-base mb-2 mt-4">Upload Experiment Setup</h4>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file-setup"
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDropSetup}
                                className="dropzone flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-1 text-xs text-center text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">(JSON files)</p>
                                </div>
                                <input id="dropzone-file-setup" ref={fileRef} type="file" onChange={readFile} className="hidden" />
                                {setupUploadedFlag && (
                                    <div className="absolute self-end mb-16 mr-2 z-20" onMouseEnter={() => { setShowTooltipSetup(true); }} onMouseLeave={() => { setShowTooltipSetup(false); }}>
                                        {(setupError != null) ? (
                                            <FaExclamationCircle className="text-red-500 transform hover:scale-110 duration-100 ease-in-out" size={24} />
                                        ) : (
                                            <FaCheckCircle className="text-green-500 transform hover:scale-110 duration-100 ease-in-out" size={24} />
                                        )}
                                        {showTooltipSetup && (
                                            <div className="absolute right-0 top-full mt-2 w-64 p-2 text-xs text-white bg-gray-800 dark:text-black dark:bg-gray-300 rounded-md shadow-lg z-10">
                                                {setupList.length > 0 ? (
                                                    <div>
                                                        <h4 className="text-sm font-semibold">Uploaded Setup:</h4>
                                                        <ul className="list-disc pl-5">
                                                            {setupList.map((setup, index) => (
                                                                <li key={index} className="text-sm break-words">{setup}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (null)}
                                                {(setupError != null) && <p className="text-pink-500 dark:text-pink-600 text-sm font-medium whitespace-normal break-words">{setupError}</p>}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
                {currentTest.testNumber === -1 ? <div /> : (
                    <div className="flex flex-col w-full h-full p-4 whitespace-normal break-words md:w-2/3 bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg text-gray-700 dark:text-gray-300">
                        <div>
                            <h1 className="text-base lg:text-lg font-bold mb-4 text-center text-blue-400 dark:text-blue-500">Test #{currentTest.testNumber} Configuration</h1>
                            <h4 className="text-sm lg:text-base font-semibold mb-2 flex items-center">
                                Type of Experiment
                                <FaInfoCircle
                                    className="ml-2 text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-110 duration-100 ease-in-out cursor-pointer"
                                    onClick={() => { setShowInfo(!showInfo) }}
                                />
                            </h4>
                            {showInfo && (
                                <div className="mb-4 p-2 text-sm rounded-3xl bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 fadeInDown">
                                    Choose the <span className="font-semibold">type of experiment</span> you would like to configure for the given test. For more information about all types of experiments,
                                    please visit our <span className="font-semibold">About page</span>.
                                </div>
                            )}
                            <div className="grid sm:flex md:grid lg:flex justify-normal sm:justify-evenly md:justify-normal lg:justify-evenly mb-4">
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input type="radio" value="MUSHRA" name="type" checked={currentTest.type === "MUSHRA"} onClick={(e) => { setCurrentTest({ ...currentTest, type: (e.target as HTMLTextAreaElement).value as "MUSHRA", anchors: [], reference: { sampleId: "", assetPath: "" } }) }} className="hidden" />
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentTest.type === "MUSHRA" ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        <span className={`w-2 h-2 rounded-full ${currentTest.type === "MUSHRA" ? "bg-white dark:bg-gray-100" : ""}`}></span>
                                    </span>
                                    <span className="ml-2">MUSHRA</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input type="radio" value="AB" name="type" checked={currentTest.type === "AB"} onClick={(e) => { setCurrentTest({ ...currentTest, type: (e.target as HTMLTextAreaElement).value as "AB", questions: [] }) }} className="hidden" />
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentTest.type === "AB" ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        <span className={`w-2 h-2 rounded-full ${currentTest.type === "AB" ? "bg-white dark:bg-gray-100" : ""}`}></span>
                                    </span>
                                    <span className="ml-2">AB</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input type="radio" value="ABX" name="type" checked={currentTest.type === "ABX"} onClick={(e) => { setCurrentTest({ ...currentTest, type: (e.target as HTMLTextAreaElement).value as "ABX", questions: [] }) }} className="hidden" />
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentTest.type === "ABX" ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        <span className={`w-2 h-2 rounded-full ${currentTest.type === "ABX" ? "bg-white dark:bg-gray-100" : ""}`}></span>
                                    </span>
                                    <span className="ml-2">ABX</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input type="radio" value="APE" name="type" checked={currentTest.type === "APE"} onClick={(e) => { setCurrentTest({ ...currentTest, type: (e.target as HTMLTextAreaElement).value as "APE", axis: [] }) }} className="hidden" />
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentTest.type === "APE" ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        <span className={`w-2 h-2 rounded-full ${currentTest.type === "APE" ? "bg-white dark:bg-gray-100" : ""}`}></span>
                                    </span>
                                    <span className="ml-2">APE</span>
                                </label>
                            </div>
                        </div>
                        {(() => {
                            switch (currentTest.type) {
                                case "MUSHRA":
                                    return <MushraEditor currentTest={currentTest as MUSHRATest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} setup={setup} setSetup={setSetup} />;
                                case "AB":
                                    return <AbEditor currentTest={currentTest as ABTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} setup={setup} setSetup={setSetup} />;
                                case "ABX":
                                    return <AbxEditor currentTest={currentTest as ABXTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} setup={setup} setSetup={setSetup} />;
                                case "APE":
                                    return <ApeEditor currentTest={currentTest as APETest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} setup={setup} setSetup={setSetup} />;
                                default:
                                    return null;
                            }
                        })()}
                    </div>
                )}
            </div>
        </div>
    )
}

const MushraEditor = (props: {
    currentTest: MUSHRATest
    setCurrentTest: React.Dispatch<React.SetStateAction<ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest>>
    fileList: File[]
    setFileList: React.Dispatch<React.SetStateAction<File[]>>
    setup: ExperimentSetup
    setSetup: React.Dispatch<React.SetStateAction<ExperimentSetup>>
}): JSX.Element => {
    const [sampleTest, setSampleTest] = useState<Sample[]>(props.currentTest.samples)
    const [anchorsTest, setAnchorsTest] = useState<Sample[]>(props.currentTest.anchors ?? [])
    const [referenceTest, setReferenceTest] = useState<Sample>(props.currentTest.reference ?? { sampleId: "", assetPath: "" })
    return (
        <div className="w-full">
            <h4 className="font-semibold text-sm lg:text-base mb-1 mt-3">Reference</h4>
            <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
                    {props.fileList.length === 0 ? (
                        <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">No Reference samples available. Please upload some samples.</h3>) : (
                        props.fileList.map((file, index) => (
                            <label key={index} className="flex items-center relative cursor-pointer mr-2">
                                <input
                                    type="radio"
                                    id={file.name}
                                    checked={referenceTest.assetPath === file.name}
                                    name="reference"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setReferenceTest({ 'sampleId': 'ref', 'assetPath': file.name })
                                        } else {
                                            setReferenceTest({ sampleId: "", assetPath: "" })
                                        }
                                    }}
                                    className="hidden"
                                />
                                <span className="w-4 h-4 flex items-center justify-center">
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${referenceTest.assetPath === file.name ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        {referenceTest.assetPath === file.name && <span className="w-2 h-2 rounded-full bg-white dark:bg-gray-100"></span>}
                                    </span>
                                </span>
                                <span className="ml-2 break-words w-full">{file.name}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>
            <h4 className="font-semibold text-sm lg:text-base mb-1">Anchors</h4>
            <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
                    {props.fileList.length === 0 ? (
                        <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">No Anchor samples available. Please upload some samples.</h3>) : (
                        props.fileList.map((file, index) => (
                            <label key={index} className="flex items-center relative cursor-pointer mr-2 break-words w-full">
                                <input
                                    type="checkbox"
                                    id={file.name}
                                    checked={anchorsTest.some(sample => sample.assetPath === file.name)}
                                    name={file.name}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAnchorsTest((oldarray) => [...oldarray, { 'sampleId': 'a0', 'assetPath': file.name }])
                                        } else {
                                            setAnchorsTest((oldarray) => oldarray.filter(sample => sample.assetPath !== file.name))
                                        }
                                    }}
                                    className="hidden"
                                />
                                <span className="w-4 h-4 flex items-center justify-center">
                                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${anchorsTest.some(sample => sample.assetPath === file.name) ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        {anchorsTest.some(sample => sample.assetPath === file.name) && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </span>
                                </span>
                                <span className="ml-2 break-words w-full">{file.name}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>
            <h4 className="font-semibold text-sm lg:text-base mb-1">Samples</h4>
            <div className="flex flex-row justify-between mb-8">
                <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
                    {props.fileList.length === 0 ? (
                        <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">No Samples available. Please upload some.</h3>) : (
                        props.fileList.map((file, index) => (
                            <label key={index} className="flex items-center relative cursor-pointer mr-2 break-words w-full">
                                <input
                                    type="checkbox"
                                    id={file.name}
                                    checked={sampleTest.some(sample => sample.assetPath === file.name)}
                                    name={file.name}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file.name }])
                                        } else {
                                            setSampleTest((oldarray) => oldarray.filter(sample => sample.assetPath !== file.name))
                                        }
                                    }}
                                    className="hidden"
                                />
                                <span className="w-4 h-4 flex items-center justify-center">
                                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${sampleTest.some(sample => sample.assetPath === file.name) ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        {sampleTest.some(sample => sample.assetPath === file.name) && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </span>
                                </span>
                                <span className="ml-2 break-words w-full">{file.name}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>
            <div className="mt-auto ml-auto mb-2 self-center mr-auto flex flex-row justify-around max-w-[15rem] space-x-2 sm:space-x-sm lg:space-x-md">
                <button
                    className="px-5 sm:px-8 py-2 bg-pink-500 dark:bg-pink-600 text-white font-semibold rounded-lg shadow-sm hover:bg-pink-600 dark:hover:bg-pink-700 transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        props.setSetup((oldSetup) => ({ ...oldSetup, tests: oldSetup.tests.filter(test => test.testNumber !== props.currentTest.testNumber) }))
                        props.setCurrentTest((oldTest) => ({ ...oldTest, testNumber: -1 }))
                    }}
                >
                    Delete
                </button>
                <button
                    className="px-7 sm:px-10 py-2 bg-blue-400 dark:bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        const updatedTest = {
                            ...props.currentTest,
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

                        props.setSetup((oldSetup) => ({
                            ...oldSetup,
                            tests: oldSetup.tests.map(test =>
                                test.testNumber === updatedTest.testNumber ? updatedTest : test
                            ),
                        }));

                        props.setCurrentTest(updatedTest);
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

const ApeEditor = (props: {
    currentTest: APETest
    setCurrentTest: React.Dispatch<React.SetStateAction<ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest>>
    fileList: File[]
    setFileList: React.Dispatch<React.SetStateAction<File[]>>
    setup: ExperimentSetup
    setSetup: React.Dispatch<React.SetStateAction<ExperimentSetup>>
}): JSX.Element => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<Sample[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <h4 className="font-semibold text-sm lg:text-base mb-1 mt-3">Samples</h4>
            <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
                    {props.fileList.length === 0 ? (
                        <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">No Samples available. Please upload some.</h3>) : (
                        props.fileList.map((file, index) => (
                            <label key={index} className="flex items-center relative cursor-pointer mr-2 break-words w-full">
                                <input
                                    type="checkbox"
                                    id={file.name}
                                    checked={sampleTest.some(sample => sample.assetPath === file.name)}
                                    name={file.name}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file.name }]);
                                        } else {
                                            const foundJSON = sampleTest.find(item => item.assetPath === file.name);
                                            if (foundJSON !== undefined) {
                                                setSampleTest((oldarray) => oldarray.filter(sample => sample.assetPath !== file.name));
                                            }
                                        }
                                    }}
                                    className="hidden"
                                />
                                <span className="w-4 h-4 flex items-center justify-center">
                                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${sampleTest.some(sample => sample.assetPath === file.name) ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        {sampleTest.some(sample => sample.assetPath === file.name) && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </span>
                                </span>
                                <span className="ml-2 break-words w-full">{file.name}</span>
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
                    onChange={(e) => { setNewQuestion(e.target.value) }}
                />
                <button
                    onClick={() => {
                        if (props.currentTest.axis != null) {
                            props.setCurrentTest({
                                ...props.currentTest,
                                axis: [...props.currentTest.axis, { questionId: `q${props.currentTest.axis.length + 1}`, text: newQuestion }]
                            })
                        } else {
                            props.setCurrentTest({
                                ...props.currentTest,
                                axis: [{ questionId: 'q1', text: newQuestion }]
                            })
                        }
                        setNewQuestion('')
                    }}
                    disabled={newQuestion.length === 0 || props.currentTest.axis?.some(q => q.text === newQuestion)}
                    className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-500 dark:disabled:text-gray-300 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 disabled:transform-none transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs ml-4 text-white"
                >
                    <FaPlus />
                </button>
            </div>
            <div className="mb-8">
                {props.currentTest.axis !== undefined ? (
                    props.currentTest.axis.map((question, index) => (
                        <div key={index} className="p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
                            <p className="text-black dark:text-white whitespace-normal break-words w-9/12 lg:w-10/12">{question.text}</p>
                            <DeleteAxisComp
                                index={index}
                                setCurrentTest={props.setCurrentTest}
                                currentTest={props.currentTest}
                            />
                        </div>
                    ))
                ) : null}
            </div>
            <div className="mt-auto ml-auto mb-2 self-center mr-auto flex flex-row justify-around max-w-[15rem] space-x-2 sm:space-x-sm lg:space-x-md">
                <button
                    className="px-5 sm:px-8 py-2 bg-pink-500 dark:bg-pink-600 text-white font-semibold rounded-lg shadow-sm hover:bg-pink-600 dark:hover:bg-pink-700 transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        props.setSetup((oldSetup) => ({ ...oldSetup, tests: oldSetup.tests.filter(test => test.testNumber !== props.currentTest.testNumber) }))
                        props.setCurrentTest((oldTest) => ({ ...oldTest, testNumber: -1 }))
                    }}
                >
                    Delete
                </button>
                <button
                    className="px-7 sm:px-10 py-2 bg-blue-400 dark:bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        const updatedTest = {
                            ...props.currentTest,
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

                        props.setSetup((oldSetup) => ({
                            ...oldSetup,
                            tests: oldSetup.tests.map(test =>
                                test.testNumber === updatedTest.testNumber ? updatedTest : test
                            ),
                        }));

                        props.setCurrentTest(updatedTest);
                    }
                    }
                >
                    Save
                </button>
            </div>
        </div >
    )
}

const AbxEditor = (props: {
    currentTest: ABXTest
    setCurrentTest: React.Dispatch<React.SetStateAction<ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest>>
    fileList: File[]
    setFileList: React.Dispatch<React.SetStateAction<File[]>>
    setup: ExperimentSetup
    setSetup: React.Dispatch<React.SetStateAction<ExperimentSetup>>
}): JSX.Element => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<Sample[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <h4 className="font-semibold text-sm lg:text-base mb-1 mt-3">Samples</h4>
            <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
                    {props.fileList.length === 0 ? (
                        <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">No Samples available. Please upload some.</h3>
                    ) : (
                        props.fileList.map((file) => {
                            const isChecked = sampleTest.filter(sample => sample.assetPath === file.name).length > 0;

                            const isDisabled = !isChecked && sampleTest.length >= 2
                            return (
                                <label key={file.name} className="flex items-center relative cursor-pointer mr-2 break-words w-full">
                                    <input
                                        type="checkbox"
                                        id={file.name}
                                        checked={isChecked}
                                        name={file.name}
                                        disabled={isDisabled}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                if (sampleTest.length < 2) {
                                                    setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file.name }]);
                                                }
                                            } else {
                                                const foundJSON = sampleTest.find(item => item.assetPath === file.name);
                                                if (foundJSON !== undefined) {
                                                    setSampleTest((oldarray) => oldarray.filter(sample => sample.assetPath !== file.name));
                                                }
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <span className="w-4 h-4 flex items-center justify-center">
                                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isChecked ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} ${isDisabled ? "bg-gray-100 border-gray-300 dark:bg-gray-600 dark:border-gray-500 opacity-50 cursor-not-allowed" : "transition-transform transform hover:scale-110 duration-100 ease-in-out"}`}>
                                            {isChecked && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            )}
                                        </span>
                                    </span>
                                    <span className={`ml-2 break-words w-full ${isDisabled ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>
                                        {file.name}
                                    </span>
                                </label>
                            );
                        })
                    )}
                </div>
            </div>
            <h4 className="font-semibold text-sm lg:text-base mb-2">Questions</h4>
            <div className="flex items-center w-full mb-2">
                <input
                    className="rounded outline-0 border-2 bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-500 text-black dark:text-white w-full"
                    value={newQuestion}
                    onChange={(e) => { setNewQuestion(e.target.value) }}
                />
                <button
                    onClick={() => {
                        if (props.currentTest.questions != null) {
                            props.setCurrentTest({
                                ...props.currentTest,
                                questions: [...props.currentTest.questions, { questionId: `q${props.currentTest.questions.length + 1}`, text: newQuestion }]
                            })
                        } else {
                            props.setCurrentTest({
                                ...props.currentTest,
                                questions: [{ questionId: 'q1', text: newQuestion }]
                            })
                        }
                        setNewQuestion('')
                    }}
                    disabled={newQuestion.length === 0 || props.currentTest.questions?.some(q => q.text === newQuestion)}
                    className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-500 dark:disabled:text-gray-300 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 disabled:transform-none transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs ml-4 text-white"
                >
                    <FaPlus />
                </button>
            </div>
            <div className="mb-8">
                {props.currentTest.questions !== undefined && props.currentTest.questions !== null ? (
                    props.currentTest.questions.map((question, index) => (
                        <div key={index} className="p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
                            <p className="text-black dark:text-white whitespace-normal break-words w-9/12 lg:w-10/12">{question.text}</p>
                            <DeleteQuestionComp
                                index={index}
                                setCurrentTest={props.setCurrentTest}
                                currentTest={props.currentTest}
                            />
                        </div>
                    ))
                ) : null}
            </div>
            <div className="mt-auto ml-auto mb-2 self-center mr-auto flex flex-row justify-around max-w-[15rem] space-x-2 sm:space-x-sm lg:space-x-md">
                <button
                    className="px-5 sm:px-8 py-2 bg-pink-500 dark:bg-pink-600 text-white font-semibold rounded-lg shadow-sm hover:bg-pink-600 dark:hover:bg-pink-700 transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        props.setSetup((oldSetup) => ({ ...oldSetup, tests: oldSetup.tests.filter(test => test.testNumber !== props.currentTest.testNumber) }))
                        props.setCurrentTest((oldTest) => ({ ...oldTest, testNumber: -1 }))
                    }}
                >
                    Delete
                </button>
                <button
                    className="px-7 sm:px-10 py-2 bg-blue-400 dark:bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        const updatedTest = {
                            ...props.currentTest,
                            samples: sampleTest
                        };

                        if ('axis' in updatedTest) {
                            delete updatedTest.axis;
                        }
                        if ('anchors' in updatedTest) {
                            delete updatedTest.anchors;
                        }
                        if ('reference' in updatedTest) {
                            delete updatedTest.reference;
                        }

                        props.setSetup((oldSetup) => ({
                            ...oldSetup,
                            tests: oldSetup.tests.map(test =>
                                test.testNumber === updatedTest.testNumber ? updatedTest : test
                            ),
                        }));

                        props.setCurrentTest(updatedTest);
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

const AbEditor = (props: {
    currentTest: ABTest
    setCurrentTest: React.Dispatch<React.SetStateAction<ABTest | ABXTest | FullABXTest | MUSHRATest | APETest | BaseTest>>
    fileList: File[]
    setFileList: React.Dispatch<React.SetStateAction<File[]>>
    setup: ExperimentSetup
    setSetup: React.Dispatch<React.SetStateAction<ExperimentSetup>>
}): JSX.Element => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<Sample[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <h4 className="font-semibold text-sm lg:text-base mb-1 mt-3">Samples</h4>
            <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-col space-y-1 whitespace-normal break-words w-11/12">
                    {props.fileList.length === 0 ? (
                        <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">No Samples available. Please upload some.</h3>
                    ) : (
                        props.fileList.map((file) => {
                            const isChecked = sampleTest.filter(sample => sample.assetPath === file.name).length > 0;
                            const isDisabled = !isChecked && sampleTest.length >= 2
                            return (
                                <label key={file.name} className="flex items-center relative cursor-pointer mr-2 break-words w-full">
                                    <input
                                        type="checkbox"
                                        id={file.name}
                                        checked={isChecked}
                                        name={file.name}
                                        disabled={isDisabled}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                if (sampleTest.length < 2) {
                                                    setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file.name }])
                                                }
                                            } else {
                                                const foundJSON = sampleTest.find(item => { return item.assetPath === file.name })
                                                if (foundJSON !== undefined) {
                                                    setSampleTest((oldarray) => oldarray.filter(sample => ![foundJSON.assetPath].includes(sample.assetPath)))
                                                }
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <span className="w-4 h-4 flex items-center justify-center">
                                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isChecked ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} ${isDisabled ? "bg-gray-100 border-gray-300 dark:bg-gray-600 dark:border-gray-500 opacity-50 cursor-not-allowed" : "transition-transform transform hover:scale-110 duration-100 ease-in-out"}`}>
                                            {isChecked && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            )}
                                        </span>
                                    </span>
                                    <span className={`ml-2 break-words w-full ${isDisabled ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>
                                        {file.name}
                                    </span>
                                </label>
                            )
                        })
                    )}
                </div>
            </div>
            <h4 className="font-semibold text-sm lg:text-base mb-2">Questions</h4>
            <div className="flex items-center w-full mb-2">
                <input
                    className="rounded outline-0 border-2 bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-500 text-black dark:text-white w-full"
                    value={newQuestion}
                    onChange={(e) => { setNewQuestion(e.target.value) }}
                />
                <button
                    onClick={() => {
                        if (props.currentTest.questions != null) {
                            props.setCurrentTest({
                                ...props.currentTest,
                                questions: [...props.currentTest.questions, { questionId: `q${props.currentTest.questions.length + 1}`, text: newQuestion }]
                            })
                        } else {
                            props.setCurrentTest({
                                ...props.currentTest,
                                questions: [{ questionId: 'q1', text: newQuestion }]
                            })
                        }
                        setNewQuestion('')
                    }}
                    disabled={newQuestion.length === 0 || props.currentTest.questions?.some(q => q.text === newQuestion)}
                    className="flex items-center text-sm disabled:bg-gray-400 dark:disabled:bg-gray-500 dark:disabled:text-gray-300 bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 disabled:transform-none transform hover:scale-110 duration-300 ease-in-out rounded-xl p-xxs ml-4 text-white"
                >
                    <FaPlus />
                </button>
            </div>
            <div className="mb-8">
                {props.currentTest.questions !== undefined ? (
                    props.currentTest.questions.map((question, index) => (
                        <div key={index} className="p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
                            <p className="text-black dark:text-white whitespace-normal break-words w-9/12 lg:w-10/12">{question.text}</p>
                            <DeleteQuestionComp
                                index={index}
                                setCurrentTest={props.setCurrentTest}
                                currentTest={props.currentTest}
                            />
                        </div>
                    ))
                ) : null}
            </div>
            <div className="mt-auto ml-auto mb-2 self-center mr-auto flex flex-row justify-around max-w-[15rem] space-x-2 sm:space-x-sm lg:space-x-md">
                <button
                    className="px-5 sm:px-8 py-2 bg-pink-500 dark:bg-pink-600 text-white font-semibold rounded-lg shadow-sm hover:bg-pink-600 dark:hover:bg-pink-700 transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        props.setSetup((oldSetup) => ({ ...oldSetup, tests: oldSetup.tests.filter(test => test.testNumber !== props.currentTest.testNumber) }))
                        props.setCurrentTest((oldTest) => ({ ...oldTest, testNumber: -1 }))
                    }}
                >
                    Delete
                </button>
                <button
                    className="px-7 sm:px-10 py-2 bg-blue-400 dark:bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        const updatedTest = {
                            ...props.currentTest,
                            samples: sampleTest
                        };

                        if ('axis' in updatedTest) {
                            delete updatedTest.axis;
                        }
                        if ('anchors' in updatedTest) {
                            delete updatedTest.anchors;
                        }
                        if ('reference' in updatedTest) {
                            delete updatedTest.reference;
                        }

                        props.setSetup((oldSetup) => ({
                            ...oldSetup,
                            tests: oldSetup.tests.map(test =>
                                test.testNumber === updatedTest.testNumber ? updatedTest : test
                            ),
                        }));

                        props.setCurrentTest(updatedTest);
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default CreateExperimentForm