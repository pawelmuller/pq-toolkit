'use client';
import React, {useState, useEffect} from 'react';
import Loading from '../../../app/loading';

const ExperimentDetails = ({
                               experimentName,
                               closeDetails,
                           }: {
    experimentName: string;
    closeDetails: () => void;
}): JSX.Element => {
    const [details, setDetails] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExperimentDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`/api/v1/experiments/${experimentName}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch experiment details: ${experimentName}`);
                }
                const data = await response.json();
                setDetails(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExperimentDetails();
    }, [experimentName]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Loading/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center text-red-500">
                <p>Failed to load experiment details:</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg p-6 shadow-lg w-full max-w-2xl mt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{experimentName} Details</h2>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
                    onClick={closeDetails}
                >
                    Close
                </button>
            </div>

            <div className="mt-6">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Description</h3>
                    <p>{details.description || 'No description available'}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Test List</h3>
                    {details.tests && details.tests.length > 0 ? (
                        <ul className="space-y-4">
                            {details.tests.map((test: any, testIndex: number) => (
                                <li key={testIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-md">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Test {test.testNumber}</span>
                                        <span className="text-sm text-gray-400">{test.type}</span>
                                    </div>

                                    {test.samples && test.samples.length > 0 && (
                                        <div className="mt-2">
                                            <h4 className="font-medium">Samples</h4>
                                            <ul className="list-disc pl-5">
                                                {test.samples.map(
                                                    (sample: {
                                                        sampleId: string;
                                                        assetPath: string
                                                    }, sampleIdx: number) => (
                                                        <li key={sampleIdx}>{sample.assetPath}</li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {test.questions && test.questions.length > 0 && (
                                        <div className="mt-2">
                                            <h4 className="font-medium">Questions</h4>
                                            <ul className="list-disc pl-5">
                                                {test.questions.map(
                                                    (question: {
                                                        questionId: string;
                                                        text: string
                                                    }, questionIdx: number) => (
                                                        <li key={questionIdx}>{question.text}</li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {test.type === 'APE' && test.axis && test.axis.length > 0 && (
                                        <div className="mt-2">
                                            <h4 className="font-medium">Axis</h4>
                                            <ul className="list-disc pl-5">
                                                {test.axis.map(
                                                    (axis: { questionId: string; text: string }, axisIdx: number) => (
                                                        <li key={axisIdx}>{axis.text}</li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {test.type === 'MUSHRA' && (
                                        <div className="mt-2">
                                            <h4 className="font-medium">Reference</h4>
                                            <ul className="list-disc pl-5">
                                                <li>{test.reference?.assetPath || 'No reference available'}</li>
                                            </ul>
                                            {test.anchors && test.anchors.length > 0 && (
                                                <div className="mt-2">
                                                    <h4 className="font-medium">Anchors</h4>
                                                    <ul className="list-disc pl-5">
                                                        {test.anchors.map(
                                                            (anchor: {
                                                                sampleId: string;
                                                                assetPath: string
                                                            }, anchorIdx: number) => (
                                                                <li key={anchorIdx}>{anchor.assetPath}</li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tests available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperimentDetails;
