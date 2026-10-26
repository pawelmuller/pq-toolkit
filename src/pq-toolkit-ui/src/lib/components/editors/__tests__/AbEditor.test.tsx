import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  type RenderResult
} from '@testing-library/react';
import AbEditor from '../AbEditor';
import { type ABTest } from '@/lib/schemas/experimentSetup';

describe('AbEditor', () => {
  const sampleFileList: File[] = [
    new File(['sample1'], 'sample1.mp3'),
    new File(['sample2'], 'sample2.mp3')
  ];

  const mockSetCurrentTest = jest.fn();
  const mockSetSetup = jest.fn();

  const currentTest: ABTest = {
    testNumber: 1,
    type: 'AB',
    samples: [],
    questions: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (): RenderResult => {
    return render(
      <AbEditor
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
    expect(screen.getByText('Questions')).toBeInTheDocument();
  });

  test('should display no samples message when fileList is empty', () => {
    render(
      <AbEditor
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
    expect(screen.getByLabelText('sample1.mp3')).toBeInTheDocument();
    expect(screen.getByLabelText('sample2.mp3')).toBeInTheDocument();
  });

  test('should enable/disable sample checkboxes correctly', () => {
    renderComponent();

    const sample1Checkbox = screen.getByLabelText('sample1.mp3');
    const sample2Checkbox = screen.getByLabelText('sample2.mp3');

    expect(sample1Checkbox).not.toBeChecked();
    expect(sample2Checkbox).not.toBeChecked();
    expect(sample1Checkbox).toBeEnabled();
    expect(sample2Checkbox).toBeEnabled();

    fireEvent.click(sample1Checkbox);
    expect(sample1Checkbox).toBeChecked();
    expect(sample2Checkbox).toBeEnabled();

    fireEvent.click(sample2Checkbox);
    expect(sample2Checkbox).toBeChecked();
    expect(sample1Checkbox).toBeEnabled();

    fireEvent.click(sample1Checkbox);
    expect(sample1Checkbox).not.toBeChecked();
  });

  test('should add new question', () => {
    renderComponent();

    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: '' });

    fireEvent.change(input, { target: { value: 'New question?' } });
    fireEvent.click(addButton);

    expect(mockSetCurrentTest).toHaveBeenCalledWith(
      expect.objectContaining({
        questions: [{ questionId: 'q1', text: 'New question?' }]
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
