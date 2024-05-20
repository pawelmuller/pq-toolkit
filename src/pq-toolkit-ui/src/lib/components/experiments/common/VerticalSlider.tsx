'use client'
import { Slider, styled } from '@mui/material'
import React from 'react'

// Custom styling for the slider with a blue to red gradient
const CustomSlider = styled(Slider)({
  '& .MuiSlider-rail': {
    background: 'linear-gradient(to bottom, blue, red)',
    opacity: 1,
  },
  '& .MuiSlider-track': {
    background: 'linear-gradient(to bottom, blue, red)',
  },
  '& .MuiSlider-thumb': {
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:hover, &.Mui-focusVisible, &.Mui-active': {
      boxShadow: '0px 0px 0px 8px rgba(255, 0, 0, 0.16)',
    },
  },
  '& .MuiSlider-vertical': {
    width: '8px',
  },
  '& .MuiSlider-mark': {
    backgroundColor: 'currentColor',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
  },
})

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
              style={{ backgroundColor: '#1976d2' }}
              key={index}
            />
          ))}
        </div>
        <CustomSlider
          orientation="vertical"
          min={0}
          max={100}
          value={rating}
          onChange={(_: Event, value: number | number[]) => {
            if (typeof value === 'number') setRating(value)
          }}
        />
      </div>
    </div>
  )
}

export default VerticalSlider
