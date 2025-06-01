import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteButton from '../deleteButton';
import { deleteExperimentFetch } from '@/lib/utils/fetchers';

jest.mock('@/lib/utils/fetchers', () => ({
  deleteExperimentFetch: jest.fn()
}));

describe('DeleteButton', () => {
  const mockRefreshPage = jest.fn();
  const mockSetSelectedExperiment = jest.fn();

  const defaultProps = {
    name: 'experiment1',
    refreshPage: mockRefreshPage,
    selectedExperiment: 'experiment1',
    setSelectedExperiment: mockSetSelectedExperiment
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render delete button', () => {
    render(<DeleteButton {...defaultProps} />);
    expect(screen.getByLabelText('delete-button')).toBeInTheDocument();
    expect(screen.getByLabelText('delete-button')).toHaveClass('fill-red-500');
  });

  test('should show confirm buttons when delete button is clicked', () => {
    render(<DeleteButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('delete-button'));
    expect(screen.getByLabelText('cancel-delete')).toBeInTheDocument();
    expect(screen.getByLabelText('confirm-delete')).toBeInTheDocument();
  });

  test('should cancel delete when X button is clicked', () => {
    render(<DeleteButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('delete-button'));
    fireEvent.click(screen.getByLabelText('cancel-delete'));
    expect(screen.queryByLabelText('confirm-delete')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('cancel-delete')).not.toBeInTheDocument();
  });

  test('should call delete function and refresh page when check button is clicked', async () => {
    ;(deleteExperimentFetch as jest.Mock).mockResolvedValueOnce(undefined);
    render(<DeleteButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('delete-button'));
    fireEvent.click(screen.getByLabelText('confirm-delete'));

    await waitFor(() => {
      expect(deleteExperimentFetch).toHaveBeenCalledWith(
        'experiment1',
        expect.anything()
      );
      expect(mockRefreshPage).toHaveBeenCalled();
      expect(mockSetSelectedExperiment).toHaveBeenCalledWith('');
    });
  });
});
