import { useCallback, useEffect, useState, useRef } from "react"
import Header from "@/lib/components/basic/header"
import { FaArrowLeft, FaXmark } from "react-icons/fa6";
import { FaArrowRight, FaPlus, FaSadTear } from "react-icons/fa";
import { array } from "zod";


const CreateExperimentForm = (props: any): JSX.Element => {
    const [setup, setSetup] = useState({
        name: 'test 1', tests: []
    })
    const [fileList, setFileList] = useState<string[]>([])
    const readSampleFiles = (event: any) => {
        const fileReader = new FileReader();
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
    const [currentTest, setCurrentTest] = useState({ isEmpty: true })
    return <div className="flex flex-col text-black bg-white border-2 w-400 z-10 rounded-lg p-4 h-200">
        <div className="flex justify-between">
            <span className=" text-4xl">{props.selectedExperiment} experiment setup:</span>
            <FaXmark onClick={() => props.setSelectedExperiment(undefined)} className="cursor-pointer" size={30} />
        </div>
        <div className="flex flex-row mt-10 h-full">
            <div className="flex flex-col border-r-2 h-full w-52">
                {setup.tests.map(test => <div onClick={() => setCurrentTest(test)}>{test.testNumber}</div>)}

                <div className="mt-auto">Upload samples
                    <input ref={fileRef} multiple type="file" onChange={readSampleFiles} />
                    Upload experiment setup
                    <input ref={fileRef} type="file" onChange={readFile} />
                </div>
            </div>

            {currentTest.isEmpty ? <div /> : <div className="flex flex-col w-full">
                <div>
                    Type of Experiment
                    <div>
                        <input type="radio" value="MUSHRA" name="type" checked={currentTest.type === "MUSHRA"} onClick={(e) => setCurrentTest({ ...currentTest, type: e.target.value })} />MUSHRA
                        <input type="radio" value="AB" name="type" checked={currentTest.type === "AB"} onClick={(e) => setCurrentTest({ ...currentTest, type: e.target.value })} />AB
                        <input type="radio" value="ABX" name="type" checked={currentTest.type === "ABX"} onClick={(e) => setCurrentTest({ ...currentTest, type: e.target.value })} />ABX
                        <input type="radio" value="APE" name="type" checked={currentTest.type === "APE"} onClick={(e) => setCurrentTest({ ...currentTest, type: e.target.value })} />APE
                    </div>
                </div>
                {(() => {
                    switch (currentTest.type) {
                        case "MUSHRA": return <MushraEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} />;
                        case "AB": return <AbEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} />;
                        case "ABX": return <AbxEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} />;
                        case "APE": return <ApeEditor currentTest={currentTest} setCurrentTest={setCurrentTest} fileList={fileList} setFileList={setFileList} />;
                    }
                })()}
            </div>}
        </div>
    </div>

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