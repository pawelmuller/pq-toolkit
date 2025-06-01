import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  type RenderResult
} from '@testing-library/react';
import MushraEditor from '../MushraEditor';
import { type MUSHRATest } from '@/lib/schemas/experimentSetup';

describe('MushraEditor', () => {
  const sampleFileList: File[] = [
    new File(['sample1'], 'sample1.mp3'),
    new File(['sample2'], 'sample2.mp3')
  ];

  const mockSetCurrentTest = jest.fn();
  const mockSetSetup = jest.fn();

  const currentTest: MUSHRATest = {
    testNumber: 1,
    type: 'MUSHRA',
    samples: [],
    anchors: [],
    reference: { sampleId: '', assetPath: '' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (): RenderResult => {
    return render(
      <MushraEditor
        currentTest={currentTest}
        setCurrentTest={mockSetCurrentTest}
        fileList={sampleFileList}
        setSetup={mockSetSetup}
      />
    );
  };

  test('should render without crashing', () => {
    renderComponent();
    expect(screen.getByText('Reference')).toBeInTheDocument();
    expect(screen.getByText('Anchors')).toBeInTheDocument();
    expect(screen.getByText('Samples')).toBeInTheDocument();
  });

  test('should display no reference samples message when fileList is empty', () => {
    render(
      <MushraEditor
        currentTest={currentTest}
        setCurrentTest={mockSetCurrentTest}
        fileList={[]}
        setSetup={mockSetSetup}
      />
    );
    expect(
      screen.getByText(
        'No Reference samples available. Please upload some samples.'
      )
    ).toBeInTheDocument();
  });

  test('should display sample checkboxes when fileList is provided', () => {
    renderComponent();
    expect(screen.getAllByLabelText('sample1.mp3').length).toBe(3);
    expect(screen.getAllByLabelText('sample2.mp3').length).toBe(3);
  });

  test('should add new reference sample', () => {
    renderComponent();

    const sample1Radio = screen.getAllByLabelText('sample1.mp3')[0];

    fireEvent.click(sample1Radio);
    expect(sample1Radio).toBeChecked();

    expect(mockSetCurrentTest).not.toHaveBeenCalled();
  });

  test('should add and remove anchor samples', () => {
    renderComponent();

    const sample1Checkboxes = screen.getAllByLabelText('sample1.mp3');
    const sample2Checkboxes = screen.getAllByLabelText('sample2.mp3');

    const sample1Checkbox = sample1Checkboxes[1];
    const sample2Checkbox = sample2Checkboxes[1];

    fireEvent.click(sample1Checkbox);
    expect(sample1Checkbox).toBeChecked();

    fireEvent.click(sample2Checkbox);
    expect(sample2Checkbox).toBeChecked();

    fireEvent.click(sample1Checkbox);
    expect(sample1Checkbox).not.toBeChecked();

    expect(mockSetCurrentTest).not.toHaveBeenCalled();
  });

  test('should add and remove samples', () => {
    renderComponent();

    const sample1Checkboxes = screen.getAllByLabelText('sample1.mp3');
    const sample2Checkboxes = screen.getAllByLabelText('sample2.mp3');

    const sample1Checkbox = sample1Checkboxes[2];
    const sample2Checkbox = sample2Checkboxes[2];

    fireEvent.click(sample1Checkbox);
    expect(sample1Checkbox).toBeChecked();

    fireEvent.click(sample2Checkbox);
    expect(sample2Checkbox).toBeChecked();

    fireEvent.click(sample1Checkbox);
    expect(sample1Checkbox).not.toBeChecked();

    expect(mockSetCurrentTest).not.toHaveBeenCalled();
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
