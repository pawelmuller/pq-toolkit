import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateExperimentForm from '../createExperimentForm';
import {
  getExperimentFetch,
  getSamplesFetch,
  getSampleFetch,
  setUpExperimentFetch,
  uploadSampleFetch
} from '@/lib/utils/fetchers';
import { type ExperimentSetup } from '@/lib/schemas/experimentSetup';

jest.mock('@/lib/utils/fetchers', () => ({
  getExperimentFetch: jest.fn(),
  getSamplesFetch: jest.fn(),
  getSampleFetch: jest.fn(),
  setUpExperimentFetch: jest.fn(),
  uploadSampleFetch: jest.fn()
}));

describe('CreateExperimentForm', () => {
  const mockSetSelectedExperiment = jest.fn();

  const defaultProps = {
    selectedExperiment: 'experiment1',
    setSelectedExperiment: mockSetSelectedExperiment
  };

  const mockExperimentSetup: ExperimentSetup = {
    uid: '1234-5678-9101-1121',
    name: 'experiment1',
    description: 'A test experiment',
    endText: 'Thank you for participating!',
    tests: []
  };

  const mockSamples = ['sample1.mp3', 'sample2.mp3'];
  const mockSampleContent = 'This is a sample content';

  beforeEach(() => {
    ;(getExperimentFetch as jest.Mock).mockResolvedValue(mockExperimentSetup)
    ;(getSamplesFetch as jest.Mock).mockResolvedValue(mockSamples)
    ;(getSampleFetch as jest.Mock).mockResolvedValue(mockSampleContent)
    ;(setUpExperimentFetch as jest.Mock).mockResolvedValue(undefined)
    ;(uploadSampleFetch as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders experiment setup correctly', async () => {
    render(<CreateExperimentForm {...defaultProps} />);

    expect(
      await screen.findByText("'experiment1' Experiment Setup:")
    ).toBeInTheDocument();
    expect(screen.getByText('Tests')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('End Credits')).toBeInTheDocument();
    expect(screen.getByText('Upload Samples')).toBeInTheDocument();
    expect(screen.getByText('Upload Experiment Setup')).toBeInTheDocument();
  });

  test('handles adding a new test', async () => {
    render(<CreateExperimentForm {...defaultProps} />);

    const addButton = await screen.findByLabelText('Add new test');
    fireEvent.click(addButton);

    expect(screen.getByText('Test #1')).toBeInTheDocument();
  });

  test('handles sample file upload', async () => {
    render(<CreateExperimentForm {...defaultProps} />);

    const fileInput = await screen.findByLabelText('dropzone-file-samples');
    const file = new File(['sample'], 'sample.mp3', { type: 'audio/mpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(uploadSampleFetch).toHaveBeenCalledWith(
        'experiment1',
        file,
        'sample.mp3',
        expect.anything()
      );
    });
  });
  test('handles setup file upload', async () => {
    render(<CreateExperimentForm {...defaultProps} />);

    const fileInput = await screen.findByLabelText('dropzone-file-setup');
    const file = new File([JSON.stringify(mockExperimentSetup)], 'setup.json', {
      type: 'application/json'
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByLabelText('confirm-setup')).toBeInTheDocument();
    });
  });
  test('saves experiment setup', async () => {
    render(<CreateExperimentForm {...defaultProps} />);

    const saveButton = await screen.findByLabelText('save-setup');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(setUpExperimentFetch).toHaveBeenCalledWith(
        'experiment1',
        expect.any(Object),
        expect.anything()
      );
    });
  });
});
