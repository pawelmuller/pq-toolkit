import { useCallback, useEffect, useState, useRef } from "react"
import Header from "@/lib/components/basic/header"
import { FaArrowLeft, FaXmark } from "react-icons/fa6";
import { FaArrowRight, FaPlus, FaSadTear } from "react-icons/fa";
import { array } from "zod";
import { validateTestSchema } from "@/lib/schemas/utils";
import { validateApiData } from "@/core/apiHandlers/clientApiHandler";
import {
    ExperimentSetupSchema
} from '@/lib/schemas/experimentSetup'

type questionType = {
    questionId: string
    text: string
}

type fileType = {
    sampleId: string
    assetPath: string
}

type Test = {
    testNumber: number
    type: string
    samples: fileType[]
    questions?: questionType[]
    axis?: questionType[]
    anchors?: fileType[]
    reference?: fileType
}

type ExperimentSetup = {
    uid: string
    name: string
    description: string
    endText: string
    tests: Test[]
}

type propsEditor = {
    currentTest: Test
    setCurrentTest: Function
    fileList: string[]
    setFileList: Function
    setup: ExperimentSetup
    setSetup: Function
}

const CreateExperimentForm = (props: any): JSX.Element => {
    useEffect(() => {
        setSetup({
            uid: "",
            name: "",
            description: "",
            endText: "",
            tests: []
        })
        console.log('zmiana')
    }, [props.selectedExperiment]);
    const [setup, setSetup] = useState<ExperimentSetup>({
        uid: "",
        name: "",
        description: "",
        endText: "",
        tests: []
    })
    const [fileList, setFileList] = useState<string[]>([])
    const readSampleFiles = (event: any) => {
        const fileReader = new FileReader();
        const { files } = event.target;
        for (let i = 0; i < files.length; i++) {
            setFileList((oldSampleFiles) => [...oldSampleFiles, files.item(i).name])
        }
        setFileList((oldSampleFiles) => { return oldSampleFiles.filter((value, index, array) => { return array.indexOf(value) === index }) })
    };
    let fileRef = useRef(null);

    const readFile = (event: any) => {
        const fileReader = new FileReader();
        const { files } = event.target;
        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = (e: any) => {
            const content = e.target.result;
            try {
                const uploadedData: ExperimentSetup = JSON.parse(content)
                const { data, validationError } = validateApiData(uploadedData, ExperimentSetupSchema)
                const testValidationErrors: string[] = []
                if (validationError !== null) {
                    console.log('zly setup')
                }
                if (data !== null) {
                    data.tests.forEach(test => {
                        const validationResult = validateTestSchema(test)
                        if (validationResult.validationError != null)
                            testValidationErrors.push(validationResult.validationError)
                        else test = validationResult.data
                    });
                    if (testValidationErrors.length <= 0) {
                        setSetup(uploadedData)
                    } else {
                        console.log('zly setup')
                    }
                }
            } catch (error) {
                console.log('zly setup')
            }
        };
    };

    const areAllFilesProvided = (test: Test, fileList: string[]) => {
        if (test.hasOwnProperty('reference')) {
            if (test.reference !== undefined) {
                if (!fileList.includes(test.reference.assetPath)) {
                    return false
                }
            }
        }
        if (test.hasOwnProperty('anchors')) {
            if (test.anchors !== undefined) {
                if (!test.anchors.every(sample => fileList.includes(sample.assetPath))) {
                    return false
                }
            }
        }
        if (!test.samples.every(sample => fileList.includes(sample.assetPath))) {
            return false
        }
        return true
    }

    const [currentTest, setCurrentTest] = useState<Test>({
        testNumber: -1,
        type: "AB",
        samples: [],
        questions: [],
        axis: [],
        anchors: []
    })
    return <div className="flex flex-col text-black bg-white border-2 w-400 z-10 rounded-lg p-4 h-200">
        <div className="flex justify-between">
            <span className=" text-4xl">{props.selectedExperiment} experiment setup:</span>
            <FaXmark onClick={() => props.setSelectedExperiment(undefined)} className="cursor-pointer" size={30} />
        </div>
        <div className="flex flex-row mt-10 h-full">
            <div className="flex flex-col border-r-2 h-full w-52">
                <div onClick={() => setSetup((oldSetup) => ({
                    ...oldSetup, tests: [...oldSetup.tests, {
                        testNumber: 1,
                        type: "AB",
                        samples: [
                        ],
                        questions: [
                        ]
                    }]
                }))}>dodaj nowy test</div>
                {setup.tests.map(test => <div onClick={() => setCurrentTest(test)}>{
                    areAllFilesProvided(test, fileList) ? <div>{test.testNumber}</div> : <div>{test.testNumber}!</div>}</div>)}

                <div className="mt-auto">Upload samples
                    <input ref={fileRef} multiple type="file" onChange={readSampleFiles} />
                    Upload experiment setup
                    <input ref={fileRef} type="file" onChange={readFile} />
                </div>
            </div>

            {currentTest.testNumber === -1 ? <div /> : <div className="flex flex-col w-full">
                <div>
                    Type of Experiment
                    <div>
                        <input type="radio" value="MUSHRA" name="type" checked={currentTest.type === "MUSHRA"} onClick={(e) => setCurrentTest({ ...currentTest, type: (e.target as HTMLTextAreaElement).value, anchors: [], reference: { sampleId: "", assetPath: "" } })} />MUSHRA
                        <input type="radio" value="AB" name="type" checked={currentTest.type === "AB"} onClick={(e) => setCurrentTest({ ...currentTest, type: (e.target as HTMLTextAreaElement).value, questions: [] })} />AB
                        <input type="radio" value="ABX" name="type" checked={currentTest.type === "ABX"} onClick={(e) => setCurrentTest({ ...currentTest, type: (e.target as HTMLTextAreaElement).value, questions: [] })} />ABX
                        <input type="radio" value="APE" name="type" checked={currentTest.type === "APE"} onClick={(e) => setCurrentTest({ ...currentTest, type: (e.target as HTMLTextAreaElement).value, axis: [] })} />APE
                    </div>
                </div>
                {(() => {
                    switch (currentTest.type) {
                        case "MUSHRA": return <MushraEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} setup={setup} setSetup={setSetup} />;
                        case "AB": return <AbEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} setup={setup} setSetup={setSetup} />;
                        case "ABX": return <AbxEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} setup={setup} setSetup={setSetup} />;
                        case "APE": return <ApeEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} setup={setup} setSetup={setSetup} />;
                    }
                })()}
            </div>}
        </div>
    </div>

}

const MushraEditor = (props: propsEditor) => {
    const [sampleTest, setSampleTest] = useState<fileType[]>(props.currentTest.samples)
    const [anchorsTest, setAnchorsTest] = useState<fileType[]>(props.currentTest.anchors === undefined ? [] : props.currentTest.anchors)
    const [referenceTest, setReferenceTest] = useState<fileType>(props.currentTest.reference === undefined ? { sampleId: "", assetPath: "" } : props.currentTest.reference)
    return (
        <div className="w-full">
            <div >Reference</div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    {props.fileList.map((file) => <div>
                        <input type="radio" id={file} checked={referenceTest.assetPath === file ? true : false} name='reference' onChange={(e) => {
                            if (e.target.checked) { setReferenceTest({ 'sampleId': 'ref', 'assetPath': file }) } else {
                                setReferenceTest({ sampleId: "", assetPath: "" })
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
                        const foundJSON = anchorsTest.find(item => { return item.assetPath === file })
                        if (foundJSON !== undefined) setAnchorsTest((oldarray) => oldarray.filter(sample => ![foundJSON.assetPath].includes(sample.assetPath)))
                    }
                }}></input>
                {file}
            </div>)}
            <div>Samples</div>
            {props.fileList.map((file) => <div>
                <input type="checkbox" id={file} checked={sampleTest.filter(sample => [file].includes(sample.assetPath)).length > 0 ? true : false} name={file} onChange={(e) => {
                    if (e.target.checked) { setSampleTest((oldarray) => [...oldarray, { 'sampleId': 's0', 'assetPath': file }]) } else {
                        const foundJSON = sampleTest.find(item => { return item.assetPath === file })
                        if (foundJSON !== undefined) setSampleTest((oldarray) => oldarray.filter(sample => ![foundJSON.assetPath].includes(sample.assetPath)))
                    }
                }}></input>
                {file}
            </div>)}
            <div className="mt-auto ml-auto">Cancel  <div onClick={() => {
                props.setCurrentTest((oldTest: Test) => {
                    delete oldTest.questions
                    delete oldTest.axis
                    return ({ ...oldTest, 'samples': sampleTest, 'anchors': anchorsTest, 'reference': referenceTest })
                })
                props.setSetup((oldSetup: ExperimentSetup) => ({ ...oldSetup, tests: oldSetup.tests.map(test => test.testNumber === props.currentTest.testNumber ? props.currentTest : test) }))
            }}>Save</div></div>
        </div>
    )
}

const ApeEditor = (props: propsEditor) => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<any[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <div >Samples</div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div>Inserted samples</div>
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
            <div><input className="bg-gray-500" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}></input><FaPlus onClick={() => {
                if (props.currentTest.axis) props.setCurrentTest({ ...props.currentTest, axis: [...props.currentTest.axis, { questionId: 'q3', text: newQuestion }] })
                else props.setCurrentTest({ ...props.currentTest, axis: [{ questionId: 'q3', text: newQuestion }] })
            }
            } /></div>
            <div>
                {props.currentTest.axis !== undefined ? props.currentTest.axis.map((question) => <div>{question.text}</div>) : <></>}
            </div>
            <div className="mt-auto ml-auto">Cancel  <div onClick={() => {
                props.setCurrentTest((oldTest: Test) => {
                    delete oldTest.anchors
                    delete oldTest.questions
                    delete oldTest.reference
                    return ({ ...oldTest, 'samples': sampleTest })
                })
                props.setSetup((oldSetup: ExperimentSetup) => ({ ...oldSetup, tests: oldSetup.tests.map(test => test.testNumber === props.currentTest.testNumber ? props.currentTest : test) }))
            }}>Save</div></div>
        </div>
    )
}

const AbxEditor = (props: propsEditor) => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<any[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <div >Samples</div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div>Inserted samples</div>
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
            <div><input className="bg-gray-500" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}></input><FaPlus onClick={() => {
                if (props.currentTest.questions) props.setCurrentTest({ ...props.currentTest, questions: [...props.currentTest.questions, { questionId: 'q3', text: newQuestion }] })
                else props.setCurrentTest({ ...props.currentTest, questions: [{ questionId: 'q3', text: newQuestion }] })
            }
            } /></div>
            <div>
                {props.currentTest.questions !== undefined ? (props.currentTest.questions.map((question) => <div>{question.text}</div>)) : <></>}
            </div>
            <div className="mt-auto ml-auto">Cancel  <div onClick={() => {
                props.setCurrentTest((oldTest: Test) => {
                    delete oldTest.anchors
                    delete oldTest.axis
                    delete oldTest.reference
                    return ({ ...oldTest, 'samples': sampleTest })
                })
                props.setSetup((oldSetup: ExperimentSetup) => ({ ...oldSetup, tests: oldSetup.tests.map(test => test.testNumber === props.currentTest.testNumber ? props.currentTest : test) }))
            }}>Save</div></div>
        </div>
    )
}

const AbEditor = (props: propsEditor) => {
    const [newQuestion, setNewQuestion] = useState('')
    const [sampleTest, setSampleTest] = useState<any[]>(props.currentTest.samples)
    return (
        <div className="w-full">
            <div >Samples</div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div>Inserted samples</div>
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
            <div><input className="bg-gray-500" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}></input><FaPlus onClick={() => {
                if (props.currentTest.questions) props.setCurrentTest({ ...props.currentTest, questions: [...props.currentTest.questions, { questionId: 'q3', text: newQuestion }] })
                else props.setCurrentTest({ ...props.currentTest, questions: [{ questionId: 'q3', text: newQuestion }] })
            }
            } /></div>
            <div>
                {props.currentTest.questions !== undefined ? (props.currentTest.questions.map((question) => <div>{question.text}</div>)) : <></>}
            </div>
            <div className="mt-auto ml-auto">Cancel  <div onClick={() => {
                props.setCurrentTest((oldTest: Test) => {
                    delete oldTest.anchors
                    delete oldTest.axis
                    delete oldTest.reference
                    return ({ ...oldTest, 'samples': sampleTest })
                })
                props.setSetup((oldSetup: ExperimentSetup) => ({ ...oldSetup, tests: oldSetup.tests.map(test => test.testNumber === props.currentTest.testNumber ? props.currentTest : test) }))
            }}>Save</div></div>
        </div>
    )
}

export default CreateExperimentForm