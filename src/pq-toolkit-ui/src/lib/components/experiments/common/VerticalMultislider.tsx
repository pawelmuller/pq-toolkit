import { Slider } from '@mui/material'
import React, { useState } from 'react'

const VerticalMultislider = (): JSX.Element => {
  const [state, setState] = useState(
    new Map<string, number>([
      ['aaa', 10],
      ['bbb', 20]
    ])
  )

  return (
    <div className="w-full h-[10rem] flex justify-between">
      <div className="h-full flex-col">
        <div>100</div>
      </div>
      {Array.from(state.entries()).map(([key]) => (
        <div key={`slider_${key}`} className="flex flex-col">
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
      ))}
    </div>
  )
}

export default VerticalMultislider
