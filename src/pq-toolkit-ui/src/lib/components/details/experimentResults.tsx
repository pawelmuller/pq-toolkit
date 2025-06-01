import React, { useState, useEffect } from 'react';
import Loading from '../../../app/loading';

const ExperimentResults = ({
  experimentName,
  closeDetails: closeResults
}: {
  experimentName: string;
  closeDetails: () => void;
}): JSX.Element => {
  const [results, setResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching experiment results
  useEffect(() => {
    const fetchExperimentResults = async () => {
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

  // Calculate average score
  const calculateAverage = (scores: number[]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return sum / scores.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
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

  // Render progress bar
  const renderScoreWithProgress = (score: number) => {
    const percentage = Math.min(Math.max(score, 0), 100); // Ensure score is in 0-100 range
    return (
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="font-semibold">{score}</span>
          <span className="text-sm">{percentage}%</span>
        </div>
        <div className="mt-1 h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-green-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg p-6 shadow-lg w-full max-w-2xl mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{experimentName} Results</h2>
        <button
          className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
          onClick={closeResults}
        >
          Close
        </button>
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Results</h3>
          {/* Render experiment results */}
          {results && results.results ? (
            <ul className="space-y-4">
              {results.results.map((result: any, index: number) => (
                <li key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-md">
                  <div className="flex justify-between">
                    <span className="font-semibold">Test {result.testNumber}</span>
                    <span className="text-sm text-gray-400">{result.type}</span>
                  </div>
                  <div className="mt-2">
                  <strong>Sample ID:</strong> {result.xSampleId}<br />
                    <strong>Selected ID:</strong> {result.xSelected}
                  </div>
                  {result.selections && result.selections.length > 0 ? (
                    <div className="mt-2">
                      <h4 className="font-medium">Selections</h4>
                      <ul className="list-disc pl-5">
                        {result.selections.map((selection: { questionId: string, sampleId: string }, idx: number) => (
                          <li key={idx}>
                            <strong>Question ID:</strong> {selection.questionId}<br />
                            <strong>Sample ID:</strong> {selection.sampleId}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No selections available</p>  
                  )}
                  {result.axisResults && result.axisResults.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">Axis Results</h4>
                      <ul className="list-disc pl-5">
                        {result.axisResults.map((axisResult: { axisId: string, sampleRatings: { sampleId: string, rating: number }[] }, idx: number) => {
                          const averageRating = calculateAverage(axisResult.sampleRatings.map((rating: any) => rating.rating));
                          return (
                            <li key={idx}>
                              <strong>Axis ID:</strong> {axisResult.axisId}
                              <ul className="list-disc pl-5">
                                <li>
                                  <strong>Average Rating:</strong> {averageRating}
                                </li>
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {result.referenceScore && (
                    <div className="mt-2">
                      <h4 className="font-medium">Reference Score</h4>
                      {renderScoreWithProgress(result.referenceScore)}
                    </div>
                  )}
                  {result.anchorsScores && result.anchorsScores.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">Anchors Scores</h4>
                      <ul className="list-disc pl-5">
                        {result.anchorsScores.map((anchorScore: { sampleId: string, score: number }, idx: number) => (
                          <li key={idx}>
                            <strong>Sample ID:</strong> {anchorScore.sampleId}<br />
                            <strong>Score:</strong> {renderScoreWithProgress(anchorScore.score)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.samplesScores && result.samplesScores.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">Samples Scores</h4>
                      <ul className="list-disc pl-5">
                        {result.samplesScores.map((sampleScore: { sampleId: string, score: number }, idx: number) => (
                          <li key={idx}>
                            <strong>Sample ID:</strong> {sampleScore.sampleId}<br />
                            <strong>Score:</strong> {renderScoreWithProgress(sampleScore.score)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No results available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperimentResults;
