import { Slider } from '@mui/material'
import React, { useState } from 'react'

const VerticalMultislider = ({
  samples
}: {
  samples: {sampleId: string, assetPath: string}[]
}): JSX.Element => {
  const [state, setState] = useState(
    new Map<string, number>(
      samples.map(i => [i.sampleId, 0])
    )
  )

  return (
    <div className="w-full flex justify-between px-2">
      {Array.from(state.entries()).map(([key, value]) => (
        <div key={`slider_${key}`} className={`${key === "ref" && 'invisible'} flex flex-col`}>
          <div className="flex flex-row">
            <div className="h-full flex flex-col w-10">
              <div>100</div>
              <div className="flex-1"/>
              <div>0</div>
            </div>
            <div className="h-[16rem] self-center my-sm">
              <Slider
                orientation="vertical"
                min={0}
                max={100}
                value={state.get(key)}
                onChange={(_, value) => {
                  setState((prevState) => {
                    const newState = new Map(prevState)
                    if (typeof value === 'number') newState.set(key, value)
                    return newState
                  })
                }}
              />
            </div>
            <div className="w-10"/>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VerticalMultislider
