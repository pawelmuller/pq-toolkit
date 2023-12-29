'use client'

import { useState } from 'react'

const SingleSelectQuestion = ({
  text,
  sampleCount,
  onOptionSelect
}: {
  text: string
  sampleCount: number
  onOptionSelect: (i: number) => void
}): JSX.Element => {
  const [selectableOptions, setSelectableOptions] = useState(
    Array.from({ length: sampleCount }).map((_, idx) => ({
      id: idx,
      name: `Sample ${idx + 1}`,
      selected: false
    }))
  )

  const onSelect = (selectedId: number): void => {
    setSelectableOptions((prevState) => {
      return prevState.map((option) => ({
        ...option,
        selected: option.id === selectedId
      }))
    })
    onOptionSelect(selectedId)
  }

  return (
    <div className="w-full">
      <div className="text-md font-semibold">{text}</div>
      <div className="flex gap-sm mt-sm">
        {selectableOptions.map((option, idx) => (
          <div
            key={`option_${idx}`}
            className={`w-full min-h-[4rem] h-max max-h-[8rem] rounded-md ${
              option.selected ? 'bg-blue-500' : 'bg-blue-100'
            } flex items-center justify-center cursor-pointer`}
            onClick={() => {
              onSelect(option.id)
            }}
          >
            Sample {idx + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SingleSelectQuestion
