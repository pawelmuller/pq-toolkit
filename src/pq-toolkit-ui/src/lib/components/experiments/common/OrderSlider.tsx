import React, { useEffect, useState } from 'react';

const OrderSlider = ({
  currentSample,
  samples,
  updateResponses,
  initialValues
}: {
  currentSample?: number
  samples: Array<{ sampleId: string; assetPath: string }>
  updateResponses: (state: Map<string, number>) => void
  initialValues?: Map<string, number>
}): JSX.Element => {
  const [responses, setResponses] = useState(
    new Map<string, number>(
      samples.reduce<Map<string, number>>((map, sample) => {
        const idx = initialValues?.get(sample.sampleId);
        if (idx !== undefined) map.set(sample.sampleId, idx);
        else map.set(sample.sampleId, 0);
        return map;
      }, new Map<string, number>())
    )
  );

  const [lastZindex, setZindex] = useState(responses.size);
  const [Zindices, setZindices] = useState(
    Array.from(Array(responses.size).keys())
  );
  const [currentSampleId, setCurrentSampleId] = useState(
    Array.from(responses.keys())[0]
  );

  useEffect(() => {
    if (currentSample === undefined) {
      return;
    }

    setCurrentSampleId(Array.from(responses.keys())[currentSample]);

    setZindices((prevState) => {
      const getZindex = (): number => {
        const zIndex = lastZindex;
        setZindex((prevState) => prevState + 1);
        return zIndex;
      };

      const newState = prevState;
      newState[currentSample] = getZindex();
      return newState;
    });
  }, [currentSample]);

  useEffect(() => {
    updateResponses(responses);
  }, [responses]);

  return (
    <div className="relative w-full">
      <input
        key={`background`}
        className="custom-slider w-full absolute accent-blue-500 outline-0"
        type="range"
        value={responses.get(currentSampleId)}
        onChange={() => {}}
      />
      {Array.from(responses.entries()).map(([key], index) => (
        <input
          key={`slider_${key}`}
          className={`w-full absolute appearance-none bg-transparent outline-0 ${
            currentSample !== index ? 'accent-gray-400' : 'accent-blue-500'
          }`}
          style={{ zIndex: Zindices[index] }}
          type="range"
          min="1"
          max="100"
          value={responses.get(key)}
          onChange={(e) => {
            setResponses((prevState) => {
              const newState = new Map(prevState);
              newState.set(key, parseInt(e.target.value));
              return newState;
            });
          }}
        />
      ))}
    </div>
  );
};

export default OrderSlider;
