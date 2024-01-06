'use client'

import { useState } from 'react'

const SingleSelectQuestion = ({
  text,
  sampleNames,
  onOptionSelect
}: {
  text: string
  sampleNames: string[]
  onOptionSelect: (i: number) => void
}): JSX.Element => {
  const [selectableOptions, setSelectableOptions] = useState(
    sampleNames.map((name, idx) => ({
      idx,
      name,
      selected: false
    }))
  )

  const onSelect = (selectedIdx: number): void => {
    setSelectableOptions((prevState) => {
      return prevState.map((option) => ({
        ...option,
        selected: option.idx === selectedIdx
      }))
    })
    onOptionSelect(selectedIdx)
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
              onSelect(option.idx)
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
