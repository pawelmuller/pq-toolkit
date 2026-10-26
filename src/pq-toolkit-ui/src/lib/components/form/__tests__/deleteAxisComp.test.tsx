import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, type RenderResult } from '@testing-library/react';
import DeleteAxisComp from '../deleteAxisComp';
import { type APETest } from '@/lib/schemas/experimentSetup';

interface SetupReturn {
  setCurrentTest: jest.Mock
  getByLabelText: RenderResult['getByLabelText']
  queryByLabelText: RenderResult['queryByLabelText']
}

const setup = (): SetupReturn => {
  const currentTest: APETest = {
    testNumber: 1,
    type: 'APE',
    samples: [
      {
        sampleId: 's1',
        assetPath: 'sample 1.mp3'
      }
    ],
    axis: [
      { questionId: 'q1', text: 'Question 1' },
      { questionId: 'q2', text: 'Question 2' },
      { questionId: 'q3', text: 'Question 3' }
    ]
  };

  const setCurrentTest = jest.fn();

  const utils = render(
    <DeleteAxisComp
      index={1}
      currentTest={currentTest}
      setCurrentTest={setCurrentTest}
    />
  );

  return {
    setCurrentTest,
    getByLabelText: utils.getByLabelText,
    queryByLabelText: utils.queryByLabelText
  };
};

describe('DeleteAxisComp', () => {
  test('renders delete icon initially', () => {
    const { getByLabelText } = setup();
    const deleteIcon = getByLabelText('delete-icon');
    expect(deleteIcon).toBeInTheDocument();
    expect(deleteIcon).toHaveClass('fill-red-500');
  });

  test('clicking delete icon shows confirm icons', () => {
    const { getByLabelText, queryByLabelText } = setup();
    const deleteIcon = getByLabelText('delete-icon');

    fireEvent.click(deleteIcon);

    expect(queryByLabelText('delete-icon')).toBeNull();
    expect(getByLabelText('confirm-delete')).toBeInTheDocument();
    expect(getByLabelText('cancel-delete')).toBeInTheDocument();
  });

  test('clicking cancel icon hides confirm icons', () => {
    const { getByLabelText, queryByLabelText } = setup();
    const deleteIcon = getByLabelText('delete-icon');

    fireEvent.click(deleteIcon);

    const cancelIcon = getByLabelText('cancel-delete');
    fireEvent.click(cancelIcon);

    expect(queryByLabelText('confirm-delete')).toBeNull();
    expect(queryByLabelText('cancel-delete')).toBeNull();
    expect(getByLabelText('delete-icon')).toBeInTheDocument();
  });

  test('clicking confirm icon calls setCurrentTest with updated test', () => {
    const { getByLabelText, setCurrentTest } = setup();
    const deleteIcon = getByLabelText('delete-icon');

    fireEvent.click(deleteIcon);

    const confirmIcon = getByLabelText('confirm-delete');
    fireEvent.click(confirmIcon);

    expect(setCurrentTest).toHaveBeenCalledTimes(1);
    expect(setCurrentTest).toHaveBeenCalledWith(expect.any(Function));

    const setCurrentTestCallback = setCurrentTest.mock.calls[0][0];
    const newTest = setCurrentTestCallback({
      testNumber: 1,
      type: 'APE',
      samples: [
        {
          sampleId: 's1',
          assetPath: 'sample 1.mp3'
        }
      ],
      axis: [
        { questionId: 'q1', text: 'Question 1' },
        { questionId: 'q2', text: 'Question 2' },
        { questionId: 'q3', text: 'Question 3' }
      ]
    });

    expect(newTest.axis).toHaveLength(2);
    expect(newTest.axis).toEqual([
      { questionId: 'q1', text: 'Question 1' },
      { questionId: 'q3', text: 'Question 3' }
    ]);
  });
});
