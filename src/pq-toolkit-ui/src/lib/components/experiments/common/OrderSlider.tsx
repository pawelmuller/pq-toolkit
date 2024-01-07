import React, { useState } from 'react'

const OrderSlider = ({
  text
}: // state,
// setState
{
  text: string
  // state: Map<string, number>
  // setState: (state: Map<string, number>) => void
}): JSX.Element => {
  const [state, setState] = useState(
    new Map<string, number>([
      ['aaa', 10],
      ['bbb', 20]
    ])
  )

  return (
    <div className="relative w-full">
      {Array.from(state.entries()).map(([key]) => (
        <input
          key={`slider_${key}`}
          className="w-full absolute"
          type="range"
          min="1"
          max="100"
          value={state.get(key)}
          onChange={(e) => {
            setState((prevState) => {
              const newState = new Map(prevState)
              newState.set(key, parseInt(e.target.value))
              return newState
            })
          }}
        />
      ))}
    </div>
  )
}

export default OrderSlider
