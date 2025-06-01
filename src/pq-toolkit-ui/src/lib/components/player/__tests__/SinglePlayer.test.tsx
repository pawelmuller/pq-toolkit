import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SinglePlayer from '../SinglePlayer';

jest.mock('howler', () => {
  const original = jest.requireActual('howler');
  return {
    ...original,
    Howl: jest.fn().mockImplementation((config) => ({
      ...config,
      play: jest.fn(),
      pause: jest.fn(),
      stop: jest.fn(),
      seek: jest.fn(() => 0),
      duration: jest.fn(() => 100)
    }))
  };
});

describe('SinglePlayer', () => {
  it('renders a single sample player', () => {
    render(<SinglePlayer assetPath="mock.mp3" name="mock sample" />);

    expect(screen.getByTestId('play-pause-button')).toBeInTheDocument();
    expect(screen.getByText('mock sample')).toBeInTheDocument();
    expect(screen.getByTestId('current-time')).toHaveTextContent('0:00');
    expect(screen.getByTestId('total-time')).toHaveTextContent('1:40');
  });

  it('toggles play and pause', () => {
    render(<SinglePlayer assetPath="mock.mp3" name="mock sample" />);
    const playPauseButton = screen.getByTestId('play-pause-button');

    fireEvent.click(playPauseButton);
    expect(screen.queryByTestId('pause-icon')).toBeInTheDocument();

    fireEvent.click(playPauseButton);
    expect(screen.queryByTestId('play-icon')).toBeInTheDocument();
  });

  it('resets progress when stopped', () => {
    render(<SinglePlayer assetPath="mock.mp3" name="mock sample" />);
    const playPauseButton = screen.getByTestId('play-pause-button');

    fireEvent.click(playPauseButton);
    expect(screen.queryByTestId('pause-icon')).toBeInTheDocument();
    fireEvent.click(playPauseButton);
    expect(screen.queryByTestId('play-icon')).toBeInTheDocument();
    fireEvent.click(playPauseButton);
    fireEvent.click(playPauseButton);
    expect(screen.getByTestId('current-time')).toHaveTextContent('0:00');
  });
});
