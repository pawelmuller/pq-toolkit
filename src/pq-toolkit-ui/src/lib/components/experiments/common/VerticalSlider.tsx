'use client'
import {Slider} from '@mui/material'
import React from 'react'

const VerticalSlider = ({
  rating,
  setRating,
  className
}: {
  rating: number
  setRating: (value: number) => void
  className?: string
}): JSX.Element => {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="h-[16rem] self-center my-xs relative">
        <div className="absolute top-0 h-full w-full flex flex-col justify-between">
          {[...Array(6)].map((_, index) => (
            <div
              className="w-4 h-1 self-center"
              style={{backgroundColor: '#1976d2'}}
              key={index}
            />
          ))}
        </div>
        <Slider
          orientation="vertical"
          min={0}
          max={100}
          value={rating}
          onChange={(_: Event, value: number | number[]) => typeof value === 'number' && setRating(value)}
        />
      </div>
    </div>
  )
}

export default VerticalSlider
