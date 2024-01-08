import {Slider} from '@mui/material'
import React, {Dispatch, SetStateAction} from 'react'

const VerticalMultislider = ({ratings, setRatings}: {
  ratings: Map<string, number>
  setRatings: Dispatch<SetStateAction<Map<string, number>>>
}): JSX.Element => {
  const updateState = (key: string, value: number | number[]) => {
    setRatings((prevState) => {
      const newState = new Map(prevState)
      if (typeof value === 'number') newState.set(key, value)
      return newState
    })
  }

  return (
    <div className="w-full flex justify-between mx-sm">
      {Array.from(ratings.entries()).map(([key, value], index) => (
        <div key={`slider_${index}`} className={`flex flex-col`}>
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
                value={ratings.get(key)}
                onChange={(_, value) => {
                  updateState(key, value)
                }}
              />
            </div>
            <div className="w-10"/>
          </div>
          {/*<div className="self-center">{key}</div>*/}
        </div>
      ))}
    </div>
  )
}

export default VerticalMultislider
