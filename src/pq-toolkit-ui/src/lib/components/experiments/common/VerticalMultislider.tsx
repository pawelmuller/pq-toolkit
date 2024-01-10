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

  const sampleRatingLabels = ['terrible', 'bad', 'poor', 'fair', 'good', 'excellent']

  return (
    <div className="w-full flex flex-row">
      <table className="w-full h-full">
        <tbody>
        <tr>
          <td className="h-full flex-col">
            <div className="h-full flex flex-col justify-between w-[8rem] mr-7">
              {sampleRatingLabels.reverse().map((label) => (
                <div className="text-right">{label}</div>
              ))}
            </div>
          </td>
          <td className="w-full px-12">
            <div className="w-full flex justify-between">
              {Array.from(ratings.entries()).map(([key, value], index) => (
                <div key={`slider_${index}`} className={`flex flex-col`}>
                  <div className="flex flex-row">
                    <div className="h-[16rem] self-center my-sm relative">
                      <div className="absolute top-0 h-full w-full flex flex-col justify-between">
                        {sampleRatingLabels.map(_ => (
                          <div className="w-4 h-1 self-center" style={{backgroundColor: "#1976d2"}}/>
                        ))}
                      </div>
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
                  </div>
                  {/*<div className="self-center">{key}</div>*/}
                </div>
              ))}
            </div>
          </td>
        </tr>
        <tr>
          <td/>
          <td className="flex flex-row justify-around -mx-3">
            {Array.from(ratings.entries()).map(([key, value], index) => (
              <div key={`slider_${index}`} className="self-center text-center w-12">
                {value}
              </div>
            ))}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

export default VerticalMultislider
