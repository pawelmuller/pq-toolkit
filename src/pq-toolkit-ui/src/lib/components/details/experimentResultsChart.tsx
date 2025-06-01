'use client';
import React, {useState, useEffect} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import Loading from '../../../app/loading';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExperimentResultsChart = ({
                                    experimentName,
                                    closeDetails: closeResults,
                                }: {
    experimentName: string;
    closeDetails: () => void;
}): JSX.Element => {
    const [results, setResults] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExperimentResults = async (): Promise<void> => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`/api/v1/experiments/${experimentName}/results`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch experiment results: ${experimentName}`);
                }
                const data = await response.json();
                setResults(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExperimentResults();
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
                <p>Failed to load experiment results:</p>
                <p>{error}</p>
            </div>
        );
    }

    const parseSelections = (testResults: any[]) => {
        return testResults.flatMap((result) => result.selections || []);
    };

    const getSampleScores = (testResults: any[], key: string) => {
        return testResults.flatMap((result) => result[key] || []);
    };

    const calculateAverageScores = (scores: any[]) => {
        const scoreMap: { [sampleId: string]: number[] } = {};
        scores.forEach((score) => {
            if (!scoreMap[score.sampleId]) {
                scoreMap[score.sampleId] = [];
            }
            scoreMap[score.sampleId].push(score.score);
        });

        return Object.keys(scoreMap).map((sampleId) => ({
            sampleId,
            average: scoreMap[sampleId].reduce((sum, score) => sum + score, 0) / scoreMap[sampleId].length,
        }));
    };

    const calculateAverageScoresAPE = (scores: any[]) => {
        const scoreMap: { [sampleId: string]: number[] } = {};
        scores.forEach((score) => {
            if (!scoreMap[score.sampleId]) {
                scoreMap[score.sampleId] = [];
            }
            scoreMap[score.sampleId].push(score.rating);
        });

        return Object.keys(scoreMap).map((sampleId) => ({
            sampleId,
            average: scoreMap[sampleId].reduce((sum, score) => sum + score, 0) / scoreMap[sampleId].length,
        }));
    };

    const downloadCSV = (testNumber: number, testType: string) => {
        const link = document.createElement('a');
        link.href = `/api/v1/experiments/${experimentName}/${testNumber}/download_csv?test_type=${testType}`;
        link.setAttribute('download', `${experimentName}_test_${testNumber}_${testType}.csv`);
        link.click();
    };

    return (
        <div
            className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg p-6 shadow-lg w-full max-w-2xl mt-4">
            <div className="mt-3">
                {Array.from(new Set(results.results.map((r: any) => r.testNumber))).map((testNumber) => {
                    const testResults = results.results.filter((r: any) => r.testNumber === testNumber);
                    const testType = testResults[0]?.type;

                    if (testType === 'AB') {
                        const selections = parseSelections(testResults);
                        const questionIds = Array.from(new Set(selections.map((s: any) => s.questionId)));
                        const sampleIds = Array.from(new Set(selections.map((s: any) => s.sampleId)));

                        const datasets = sampleIds.map((sampleId) => {
                            const data = questionIds.map((questionId) =>
                                selections.filter(
                                    (s: any) => s.sampleId === sampleId && s.questionId === questionId
                                ).length
                            );
                            return {
                                label: sampleId,
                                data,
                                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                                    Math.random() * 255
                                )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                            };
                        });

                        return (
                            <div key={testNumber as React.Key} className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Test {testNumber} (AB) Chart</h3>
                                <Bar
                                    data={{
                                        labels: questionIds,
                                        datasets,
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {position: 'top'},
                                            title: {
                                                display: true,
                                                text: `Selections per Question (Test ${testNumber})`,
                                            },
                                        },
                                        scales: {
                                            x: {title: {display: true, text: 'Questions'}},
                                            y: {
                                                title: {display: true, text: 'Number of Selections'},
                                                ticks: {
                                                    stepSize: 1,
                                                    callback: function (value: any) {
                                                        return Number.isInteger(value) ? value : '';
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                                <div className="flex justify-center mt-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => downloadCSV(testNumber, testType)}
                                    >
                                        Download result
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    if (testType === 'ABX') {
                        const selections = parseSelections(testResults);

                        const correctCount = testResults.filter(
                            (result: any) => result.xSampleId === result.xSelected
                        ).length;
                        const incorrectCount = testResults.length - correctCount;

                        if (selections.length === 0) {
                            // Wykres dla sytuacji bez selections
                            return (
                                <div key={testNumber as React.Key} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Test {testNumber} (ABX) Chart</h3>
                                    <Bar
                                        data={{
                                            labels: ['Correct', 'Incorrect'],
                                            datasets: [
                                                {
                                                    label: 'Selections',
                                                    data: [correctCount, incorrectCount],
                                                    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {display: false},
                                                title: {
                                                    display: true,
                                                    text: `Correct vs Incorrect Selections (Test ${testNumber})`,
                                                },
                                            },
                                            scales: {
                                                x: {title: {display: true, text: 'Outcome'}},
                                                y: {title: {display: true, text: 'Count'}},
                                            },
                                        }}
                                    />
                                    <div className="flex justify-center mt-4">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => downloadCSV(testNumber, testType)}
                                        >
                                            Download result
                                        </button>
                                    </div>
                                </div>
                            );
                        } else {
                            // Wykresy dla sytuacji z selections
                            const questionIds = Array.from(new Set(selections.map((s: any) => s.questionId)));
                            const sampleIds = Array.from(new Set(selections.map((s: any) => s.sampleId)));

                            // Dane do pierwszego wykresu (taki jak dla sytuacji bez selections)
                            const firstChartData = {
                                labels: ['Correct', 'Incorrect'],
                                datasets: [
                                    {
                                        label: 'Selections',
                                        data: [correctCount, incorrectCount],
                                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                                    },
                                ],
                            };

                            // Dane do drugiego wykresu (liczba wyborów poszczególnych sampli dla każdego pytania)
                            const sampleDatasets = sampleIds.map((sampleId) => {
                                const data = questionIds.map((questionId) =>
                                    selections.filter(
                                        (s: any) => s.sampleId === sampleId && s.questionId === questionId
                                    ).length
                                );
                                return {
                                    label: sampleId,
                                    data,
                                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                                        Math.random() * 255
                                    )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                                };
                            });

                            return (
                                <div key={testNumber as React.Key} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Test {testNumber} (ABX) Charts</h3>

                                    {/* Pierwszy wykres */}
                                    <Bar
                                        data={firstChartData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {display: false},
                                                title: {
                                                    display: true,
                                                    text: `Correct vs Incorrect Selections (Test ${testNumber})`,
                                                },
                                            },
                                            scales: {
                                                x: {title: {display: true, text: 'Outcome'}},
                                                y: {title: {display: true, text: 'Count'}},
                                            },
                                        }}
                                    />

                                    {/* Drugi wykres */}
                                    <div className="mt-8">
                                        <Bar
                                            data={{
                                                labels: questionIds,
                                                datasets: sampleDatasets,
                                            }}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {position: 'top'},
                                                    title: {
                                                        display: true,
                                                        text: `Sample Selections per Question (Test ${testNumber})`,
                                                    },
                                                },
                                                scales: {
                                                    x: {title: {display: true, text: 'Questions'}},
                                                    y: {title: {display: true, text: 'Number of Selections'}},
                                                },
                                            }}
                                        />
                                    </div>

                                    <div className="flex justify-center mt-4">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => downloadCSV(testNumber, testType)}
                                        >
                                            Download result
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                    }


                    if (testType === 'MUSHRA') {
                        const anchorsScores = getSampleScores(testResults, 'anchorsScores');
                        const samplesScores = getSampleScores(testResults, 'samplesScores');
                        const averageScores = calculateAverageScores([...anchorsScores, ...samplesScores]);
                        const referenceScore = testResults[0]?.referenceScore || 0;

                        return (
                            <div key={testNumber as React.Key} className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Test {testNumber} (MUSHRA) Chart</h3>
                                <Bar
                                    data={{
                                        labels: [
                                            ...averageScores.map((score) => score.sampleId),
                                            'Reference',
                                        ],
                                        datasets: [
                                            {
                                                data: [
                                                    ...averageScores.map((score) => score.average),
                                                    referenceScore,
                                                ],
                                                backgroundColor: [
                                                    ...averageScores.map(
                                                        () =>
                                                            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                                                                Math.random() * 255
                                                            )}, ${Math.floor(Math.random() * 255)}, 0.6)`
                                                    ),
                                                    'rgba(255, 99, 132, 0.6)', // Fixed color for reference score
                                                ],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false, // Remove legend
                                            },
                                            title: {
                                                display: true,
                                                text: `Scores with Reference (Test ${testNumber})`,
                                            },
                                        },
                                        scales: {
                                            x: {title: {display: true, text: 'Samples'}},
                                            y: {title: {display: true, text: 'Scores'}},
                                        },
                                    }}
                                />
                                <div className="flex justify-center mt-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => downloadCSV(testNumber, testType)}
                                    >
                                        Download result
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    if (testType === 'APE') {
                        const axisResults = testResults.flatMap(
                            (result: {
                                axisResults?: {
                                    axisId: string;
                                    sampleRatings: { sampleId: string; rating: number }[];
                                }[];
                            }) => result.axisResults || []
                        );
                        const groupedByAxisId = axisResults.reduce((acc: any, axisResult: any) => {
                            if (!acc[axisResult.axisId]) {
                                acc[axisResult.axisId] = [];
                            }
                            acc[axisResult.axisId].push(...axisResult.sampleRatings);
                            return acc;
                        }, {});

                        let isLastAPEChart = false; // Flaga, aby wykryć ostatni wykres APE
                        const apeTestNumbers = results.results
                            .filter((r: any) => r.type === 'APE')
                            .map((r: any) => r.testNumber);

                        return Object.entries(groupedByAxisId).map(([axisId, sampleRatings], index) => {
                            const averageScores = calculateAverageScoresAPE(sampleRatings as any[]);
                            isLastAPEChart = index === Object.entries(groupedByAxisId).length - 1;

                            return (
                                <div key={`${testNumber}-${axisId}`} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">
                                        Test {String(testNumber)} (APE) - {axisId} Chart
                                    </h3>
                                    <Bar
                                        data={{
                                            labels: averageScores.map((score) => score.sampleId),
                                            datasets: [
                                                {
                                                    data: averageScores.map((score) => score.average),
                                                    backgroundColor: averageScores.map(
                                                        () =>
                                                            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                                                                Math.random() * 255
                                                            )}, ${Math.floor(Math.random() * 255)}, 0.6)`
                                                    ),
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    display: false, // Remove legend
                                                },
                                                title: {
                                                    display: true,
                                                    text: `Average Ratings for ${axisId} (Test ${testNumber})`,
                                                },
                                            },
                                            scales: {
                                                x: {title: {display: true, text: 'Samples'}},
                                                y: {title: {display: true, text: 'Ratings'}},
                                            },
                                        }}
                                    />
                                    {isLastAPEChart && (
                                        <div className="flex justify-center mt-4">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => downloadCSV(testNumber, testType)}
                                            >
                                                Download result
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        });
                    }

                    return null;
                })}
            </div>
        </div>
    );
};

export default ExperimentResultsChart;
