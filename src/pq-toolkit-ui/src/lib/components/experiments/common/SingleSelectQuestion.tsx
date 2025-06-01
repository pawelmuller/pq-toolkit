'use client';

import { useState } from 'react';

const SingleSelectQuestion = ({
  text,
  sampleNames,
  onOptionSelect,
  initialSelection
}: {
  text: string
  sampleNames: string[]
  onOptionSelect: (i: number) => void
  initialSelection?: number
}): JSX.Element => {
  const [selectableOptions, setSelectableOptions] = useState(
    sampleNames.map((name, idx) => ({
      idx,
      name,
      selected: initialSelection === idx
    }))
  );

  const onSelect = (selectedIdx: number): void => {
    setSelectableOptions((prevState) => {
      return prevState.map((option) => ({
        ...option,
        selected: option.idx === selectedIdx
      }));
    });
    onOptionSelect(selectedIdx);
  };

  return (
    <div className="w-full">
      <div className="font-semibold text-2xl md:text-lg">{text}</div>
      <div className="flex gap-sm mt-sm">
        {selectableOptions.map((option, idx) => (
          <div
            key={`option_${idx}`}
            className={`w-full min-h-[4rem] h-max max-h-[8rem] rounded-md font-semibold text-lg md:text-base text-white transform hover:scale-105 duration-300 ease-in-out ${
              option.selected
                ? 'bg-pink-500 dark:bg-pink-600'
                : 'bg-pink-200 dark:bg-pink-300 hover:bg-pink-500 dark:hover:bg-pink-600'
            } flex items-center justify-center cursor-pointer`}
            onClick={() => {
              onSelect(option.idx);
            }}
          >
            Sample {idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleSelectQuestion;
