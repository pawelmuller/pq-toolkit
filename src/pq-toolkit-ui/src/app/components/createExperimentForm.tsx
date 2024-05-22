import { useCallback, useEffect, useState, useRef } from "react"
import Header from "@/lib/components/basic/header"
import { FaArrowLeft, FaXmark } from "react-icons/fa6";
import { FaArrowRight, FaPlus, FaSadTear, FaInfoCircle } from "react-icons/fa";
import { array } from "zod";


const CreateExperimentForm = (props: any): JSX.Element => {
    const [setup, setSetup] = useState({
        name: 'test 1', tests: []
    })
    const [fileList, setFileList] = useState<string[]>([])
    const readSampleFiles = (event: any) => {
        const { files } = event.target;
        setFileList([])
        for (let i = 0; i < files.length; i++) {
            setFileList((oldSampleFiles) => [...oldSampleFiles, files.item(i).name])
        }
        setFileList((oldSampleFiles) => { return oldSampleFiles.filter((value, index, array) => { return array.indexOf(value) === index }) })
    };
    let fileRef = useRef();

    const readFile = (event: any) => {
        const fileReader = new FileReader();
        const { files } = event.target;

        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = (e: any) => {
            const content = e.target.result;
            setSetup(JSON.parse(content))
        };
    };

    const [showInfo, setShowInfo] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDropSamples = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        setFileList([])
        for (let i = 0; i < files.length; i++) {
            console.log(files[i].name)
            setFileList((oldSampleFiles) => [...oldSampleFiles, files[i].name])
        }
        setFileList((oldSampleFiles) => { return oldSampleFiles.filter((value, index, array) => { return array.indexOf(value) === index }) })
    };

    const handleDropSetup = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');

        const fileReader = new FileReader();
        const files = e.dataTransfer.files;
        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = (e: any) => {
            const content = e.target.result;
            setSetup(JSON.parse(content))
        };
    };
    
    const [currentTest, setCurrentTest] = useState({ isEmpty: true })
    return (
        <div className="flex flex-col self-center fadeInUpFast 2xl:self-start text-black dark:text-white bg-gray-50 dark:bg-stone-800 rounded-3xl shadow-lg 2xl:shadow-2xl w-full max-w-4xl z-10 p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6 w-full whitespace-normal break-words">
                <span className="text-lg lg:text-xl font-semibold w-11/12">'{props.selectedExperiment}' Experiment Setup:</span>
                <FaXmark onClick={() => props.setSelectedExperiment(undefined)} className="cursor-pointer self-start text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-110 duration-300 ease-in-out" size={40} />
            </div>
            <div className="flex flex-col md:flex-row h-full space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col border-r-0 border-b-2 md:border-r-2 md:border-b-0 h-full w-full md:w-2/3 p-4">
                    <h3 className="text-sm lg:text-base font-semibold mb-2">Tests</h3>
                    <div className="flex flex-col space-y-2 mb-4">
                        {setup.tests.length === 0 ? (
                            <h3 className="text-sm font-medium text-pink-500 dark:text-pink-600">No tests available. Please upload the Experiment Setup first.</h3>) : (
                            setup.tests.map(test => <div  className="cursor-pointer p-2 text-white font-semibold bg-blue-400 dark:bg-blue-500 hover:bg-pink-500 dark:hover:bg-pink-600 transform hover:scale-105 duration-300 ease-in-out rounded-md" onClick={() => setCurrentTest(test)}>{test.testNumber}</div>)
                        )}
                    </div>
                    <div className="mt-auto">
                        <h4 className="text-sm lg:text-base font-semibold mb-2">Upload Samples</h4>

                        <div className="flex items-center justify-center w-full mb-4">
                            <label htmlFor="dropzone-file-samples" 
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDropSamples} 
                                className="dropzone flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-1 text-xs text-center text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">MP3 (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file-samples" ref={fileRef} multiple type="file" onChange={readSampleFiles} className="hidden" />
                            </label>
                        </div>

                        {/* <input className="mb-4" ref={fileRef} multiple type="file" onChange={readSampleFiles} /> */}

                        <h4 className="font-semibold text-sm lg:text-base mb-2">Upload Experiment Setup</h4>
                        
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file-setup"
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDropSetup} 
                            className="dropzone flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-1 text-xs text-center text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">JSON (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file-setup" ref={fileRef} type="file" onChange={readFile} className="hidden" />
                            </label>
                        </div>
                        
                        {/* <input ref={fileRef} type="file" onChange={readFile} /> */}
                    </div>
                </div>
                {currentTest.isEmpty ? <div /> : (
                    <div className="flex flex-col w-full p-4 whitespace-normal break-words md:w-2/3 bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg text-gray-700 dark:text-gray-300">
                        <div>
                            <h1 className="text-base lg:text-lg font-bold mb-4 text-center text-blue-400 dark:text-blue-500">Test '{currentTest.testNumber}' Configuration</h1>
                            <h4 className="text-sm lg:text-base font-semibold mb-2 flex items-center">
                                Type of Experiment
                                <FaInfoCircle
                                    className="ml-2 text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-110 duration-100 ease-in-out cursor-pointer"
                                    onClick={() => setShowInfo(!showInfo)}
                                />
                            </h4>
                            {showInfo && (
                                <div className="mb-4 p-2 text-sm rounded-3xl bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 fadeInDown">
                                    Choose the type of experiment you would like to configure.
                                </div>
                             )}
                            <div className="grid sm:flex md:grid lg:flex justify-normal sm:justify-evenly md:justify-normal lg:justify-evenly mb-4">
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input type="radio" value="MUSHRA" name="type" checked={currentTest.type === "MUSHRA"} onChange={(e) => setCurrentTest({ ...currentTest, type: e.target.value })} className="hidden" />
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentTest.type === "MUSHRA" ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        <span className={`w-2 h-2 rounded-full ${currentTest.type === "MUSHRA" ? "bg-white dark:bg-gray-100" : ""}`}></span>
                                    </span>
                                    <span className="ml-2">MUSHRA</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input type="radio" value="AB" name="type" checked={currentTest.type === "AB"} onChange={(e) => setCurrentTest({ ...currentTest, type: e.target.value })} className="hidden" />
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentTest.type === "AB" ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        <span className={`w-2 h-2 rounded-full ${currentTest.type === "AB" ? "bg-white dark:bg-gray-100" : ""}`}></span>
                                    </span>
                                    <span className="ml-2">AB</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input type="radio" value="ABX" name="type" checked={currentTest.type === "ABX"} onChange={(e) => setCurrentTest({ ...currentTest, type: e.target.value })} className="hidden" />
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentTest.type === "ABX" ? "bg-pink-500 border-pink-500 dark:bg-pink-600 dark:border-pink-600" : "bg-gray-200 border-gray-400"} transition-transform transform hover:scale-110 duration-100 ease-in-out`}>
                                        <span className={`w-2 h-2 rounded-full ${currentTest.type === "ABX" ? "bg-white dark:bg-gray-100" : ""}`}></span>
                                    </span>
                                    <span className="ml-2">ABX</span>
                                </label>
                                <label className="flex items-center relative cursor-pointer mr-2">
                                    <input type="radio" value="APE" name="type" checked={currentTest.type === "APE"} onChange={(e) => setCurrentTest({ ...currentTest, type: e.target.value })} className="hidden" />
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
                                    return <MushraEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} />;
                                case "AB":
                                    return <AbEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} />;
                                case "ABX":
                                    return <AbxEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} />;
                                case "APE":
                                    return <ApeEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} />;
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

const MushraEditor = (props: any) => {
    const [sampleTest, setSampleTest] = useState<any[]>(props.currentTest.samples)
    const [anchorsTest, setAnchorsTest] = useState<any[]>(props.currentTest.anchors)
    const [referenceTest, setReferenceTest] = useState<any>(props.currentTest.reference)

    let fileRef = useRef();
    return (
        <div className="w-full">
            <div >Reference</div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    {props.fileList.map((file) => <div>
                        <input type="radio" id={file} checked={referenceTest.assetPath === file ? true : false} name='reference' onChange={(e) => {
                            if (e.target.checked) { setReferenceTest({ 'sampleId': 'ref', 'assetPath': file }) } else {
                                setReferenceTest({})
                            }
                        }}></input>
                        {file}
                    </div>)}
                </div>
            </div>
            <div>Anchors</div>
            {props.fileList.map((file) => <div>
                <input type="checkbox" id={file} checked={anchorsTest.filter(sample => [file].includes(sample.assetPath)).length > 0 ? true : false} name={file} onChange={(e) => {
                    if (e.target.checked) { setAnchorsTest((oldarray) => [...oldarray, { 'sampleId': 'a0', 'assetPath': file }]) } else {
                        let foundJSON = anchorsTest.find(item => { return item.assetPath === file })
                        setAnchorsTest((oldarray) => oldarray.filter(sample => ![foundJSON.assetPath].includes(sample.assetPath)))
                    }
                }}></input>
                {file}
            </div>)}
            <div>Samples</div>
            {props.fileList.map((file) => <div>
                <input type="checkbox" id={file} checked={sampleTest.filter(sample => [file].includes(sample.assetPath)).length > 0 ? true : false} name={file} onChange={(e) => {
                    if (e.target.checked) { setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file }]) } else {
                        let foundJSON = sampleTest.find(item => { return item.assetPath === file })
                        setSampleTest((oldarray) => oldarray.filter(sample => ![foundJSON.assetPath].includes(sample.assetPath)))
                    }
                }}></input>
                {file}
            </div>)}
            <div className="mt-auto ml-auto">Cancel  <div onClick={() => {
                props.setCurrentTest((oldTest) => ({ ...oldTest, 'samples': sampleTest }))
                props.setCurrentTest((oldTest) => ({ ...oldTest, 'anchors': anchorsTest }))
                props.setCurrentTest((oldTest) => ({ ...oldTest, 'reference': referenceTest }))
            }}>Save</div></div>
        </div>
    )
}

const ApeEditor = (props: any) => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<any[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <div >Samples</div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h4 className="font-semibold text-sm lg:text-base mb-2">Inserted samples</h4>
                    {props.fileList.map((file) => <div>
                        <input type="checkbox" id={file} checked={sampleTest.filter(sample => [file].includes(sample.assetPath)).length > 0 ? true : false} name={file} onChange={(e) => {
                            if (e.target.checked) { setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file }]) } else {
                                let foundJSON = sampleTest.find(item => { return item.assetPath === file })
                                setSampleTest((oldarray) => oldarray.filter(sample => ![foundJSON.assetPath].includes(sample.assetPath)))
                            }
                        }}></input>
                        {file}
                    </div>)}
                </div>
            </div>
            <div>Axis</div>
            <div><input className="bg-gray-500" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}></input><FaPlus onClick={() =>
                props.setCurrentTest({ ...props.currentTest, axis: [...props.currentTest.axis, { questionId: 'q3', text: newQuestion }] })
            } /></div>
            <div>
                {props.currentTest.axis.map((question) => <div>{question.text}</div>)}
            </div>
            <div className="mt-auto ml-auto">Cancel  <div onClick={() => {
                props.setCurrentTest((oldTest) => ({ ...oldTest, 'samples': sampleTest }))
            }}>Save</div></div>
        </div>
    )
}

const AbxEditor = (props: any) => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<any[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <div >Samples</div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h4 className="font-semibold text-sm lg:text-base mb-2">Inserted samples</h4>
                    {props.fileList.map((file) => <div>
                        <input type="checkbox" id={file} checked={sampleTest.filter(sample => [file].includes(sample.assetPath)).length > 0 ? true : false} name={file} onChange={(e) => {
                            if (e.target.checked) { setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file }]) } else {
                                let foundJSON = sampleTest.find(item => { return item.assetPath === file })
                                setSampleTest((oldarray) => oldarray.filter(sample => ![foundJSON.assetPath].includes(sample.assetPath)))
                            }
                        }}></input>
                        {file}
                    </div>)}
                </div>
            </div>
            <div>Questions</div>
            <div><input className="bg-gray-500" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}></input><FaPlus onClick={() =>
                props.setCurrentTest({ ...props.currentTest, questions: [...props.currentTest.questions, { questionId: 'q3', text: newQuestion }] })
            } /></div>
            <div>
                {'questions' in props.currentTest ? (props.currentTest.questions.map((question) => <div>{question.text}</div>)) : <></>}
            </div>
            <div className="mt-auto ml-auto">Cancel  <div onClick={() => {
                props.setCurrentTest((oldTest) => ({ ...oldTest, 'samples': sampleTest }))
            }}>Save</div></div>
        </div>
    )
}

const AbEditor = (props: any) => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<any[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <div >Samples</div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h4 className="font-semibold text-sm lg:text-base mb-2">Inserted samples</h4>
                    {props.fileList.map((file) => <div>
                        <input type="checkbox" id={file} checked={sampleTest.filter(sample => [file].includes(sample.assetPath)).length > 0 ? true : false} name={file} onChange={(e) => {
                            if (e.target.checked) { setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file }]) } else {
                                let foundJSON = sampleTest.find(item => { return item.assetPath === file })
                                setSampleTest((oldarray) => oldarray.filter(sample => ![foundJSON.assetPath].includes(sample.assetPath)))
                            }
                        }}></input>
                        {file}
                    </div>)}
                </div>
            </div>
            <h4 className="font-semibold text-sm lg:text-base mb-2">Questions</h4>
            <div><input className="bg-gray-500" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}></input><FaPlus onClick={() =>
                props.setCurrentTest({ ...props.currentTest, questions: [...props.currentTest.questions, { questionId: 'q3', text: newQuestion }] })
            } /></div>
            <div>
                {props.currentTest.questions.map((question) => <div>{question.text}</div>)}
            </div>
            <div className="mt-auto ml-auto">Cancel  <div onClick={() => {
                props.setCurrentTest((oldTest) => ({ ...oldTest, 'samples': sampleTest }))
            }}>Save</div></div>
        </div>
    )
}

export default CreateExperimentForm