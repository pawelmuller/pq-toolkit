import React, {useEffect, useState} from 'react'

const OrderSlider = ({
                       currentSample,
                       samples,
                       updateResponses
                     }: {
  currentSample?: number
  samples: { sampleId: string, assetPath: string }[]
  // changeResponses: (_1: string, _2: number) => void
  updateResponses: (state: Map<string, number>) => void
}): JSX.Element => {
  const [responses, setResponses] = useState(
    new Map<string, number>(samples.reduce<Map<string, number>>((map, sample) => {
          map.set(
            sample.sampleId,
            0
          )
          return map
        }, new Map<string, number>()
      )
    )
  )

  const [lastZindex, setZindex] = useState(responses.size)
  const [Zindices, setZindices] = useState(Array.from(Array(responses.size).keys()))
  const [currentSampleId, setCurrentSampleId] = useState(Array.from(responses.keys())[0])

  function getZindex() {
    const zIndex = lastZindex
    setZindex((prevState) => prevState + 1)
    return zIndex
  }

  function getAccentColor(index: number) {
    return ["red", "blue", "green"].at(index % 3);
  }

  useEffect(() => {
    if (currentSample === undefined)
      return

    setCurrentSampleId(Array.from(responses.keys())[currentSample])

    setZindices((prevState) => {
      let newState = prevState
      newState[currentSample] = getZindex()
      return newState
    })
  }, [currentSample]);

  return (
    <div className="relative w-full">
      <input
        key={`background`}
        className="custom-slider w-full absolute"
        style={{colorScheme: "light", accentColor: getAccentColor(currentSample ?? 0)}}
        type="range"
        value={responses.get(currentSampleId)}
      />
      {Array.from(responses.entries()).map(([key], index) => (
        <input
          key={`slider_${key}`}
          className="w-full absolute"
          style={{
            appearance: "none",
            backgroundColor: "transparent",
            zIndex: Zindices[index],
            accentColor: getAccentColor(index)
          }}
          type="range"
          min="1"
          max="100"
          value={responses.get(key)}
          onChange={(e) => {
            setResponses((prevState) => {
              const newState = new Map(prevState)
              newState.set(key, parseInt(e.target.value))
              return newState
            })
            updateResponses(responses)
          }}
        />
      ))}
    </div>
  )
}

export default OrderSlider
