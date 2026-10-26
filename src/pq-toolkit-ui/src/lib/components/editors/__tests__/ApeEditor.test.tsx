import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  type RenderResult
} from '@testing-library/react';
import ApeEditor from '../ApeEditor';
import { type APETest } from '@/lib/schemas/experimentSetup';

describe('ApeEditor', () => {
  const sampleFileList: File[] = [
    new File(['sample1'], 'sample1.mp3'),
    new File(['sample2'], 'sample2.mp3')
  ];

  const mockSetCurrentTest = jest.fn();
  const mockSetSetup = jest.fn();

  const currentTest: APETest = {
    testNumber: 1,
    type: 'APE',
    samples: [],
    axis: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (): RenderResult => {
    return render(
      <ApeEditor
        currentTest={currentTest}
        setCurrentTest={mockSetCurrentTest}
        fileList={sampleFileList}
        setSetup={mockSetSetup}
      />
    );
  };

  test('should render without crashing', () => {
    renderComponent();
    expect(screen.getByText('Samples')).toBeInTheDocument();
    expect(screen.getByText('Axes')).toBeInTheDocument();
  });

  test('should display no samples message when fileList is empty', () => {
    render(
      <ApeEditor
        currentTest={currentTest}
        setCurrentTest={mockSetCurrentTest}
        fileList={[]}
        setSetup={mockSetSetup}
      />
    );
    expect(
      screen.getByText('No Samples available. Please upload some.')
    ).toBeInTheDocument();
  });

  test('should display sample checkboxes when fileList is provided', () => {
    renderComponent();
    expect(screen.getAllByLabelText('sample1.mp3').length).toBe(1);
    expect(screen.getAllByLabelText('sample2.mp3').length).toBe(1);
  });

  test('should add and remove samples', () => {
    renderComponent();

    const sample1Checkbox = screen.getByLabelText('sample1.mp3');
    const sample2Checkbox = screen.getByLabelText('sample2.mp3');

    fireEvent.click(sample1Checkbox);
    expect(sample1Checkbox).toBeChecked();

    fireEvent.click(sample2Checkbox);
    expect(sample2Checkbox).toBeChecked();

    fireEvent.click(sample1Checkbox);
    expect(sample1Checkbox).not.toBeChecked();

    expect(mockSetCurrentTest).not.toHaveBeenCalled();
  });

  test('should add new axis', () => {
    renderComponent();

    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: '' });

    fireEvent.change(input, { target: { value: 'New axis?' } });
    fireEvent.click(addButton);

    expect(mockSetCurrentTest).toHaveBeenCalledWith(
      expect.objectContaining({
        axis: [{ questionId: 'q1', text: 'New axis?' }]
      })
    );
  });

  test('should save test setup', () => {
    renderComponent();

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockSetSetup).toHaveBeenCalled();
  });

  test('should delete test', () => {
    renderComponent();

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockSetSetup).toHaveBeenCalled();
  });
});
