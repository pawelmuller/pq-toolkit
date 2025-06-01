import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MultiPlayer from '../MultiPlayer';

// Mockowanie metod Howl
jest.mock('howler', () => {
  const actualHowler = jest.requireActual('howler');
  return {
    Howl: jest.fn().mockImplementation((options) => ({
      ...options,
      play: jest.fn(),
      pause: jest.fn(),
      seek: jest.fn().mockReturnValue(0),
      stop: jest.fn(),
      volume: jest.fn(),
      duration: jest.fn().mockReturnValue(120)
    })),
    Howler: actualHowler.Howler
  };
});

describe('MultiPlayer', () => {
  it('renders a multi sample player', () => {
    const [state, setState] = [0, jest.fn()];
    render(
      <MultiPlayer
        assets={
          new Map<string, { url: string; footers?: JSX.Element[] }>([
            ['sample1', { url: 'mock.mp3' }],
            ['sample2', { url: 'mock2.mp3' }]
          ])
        }
        selectedPlayerState={[state, setState]}
      />
    );

    expect(screen.queryByTestId('play-pause-button')).toBeInTheDocument();
    expect(screen.queryByTestId('progress-slider')).toBeInTheDocument();

    expect(screen.getByText('sample1')).toBeInTheDocument();
    expect(screen.getByText('sample2')).toBeInTheDocument();
  });

  it('toggles play and pause', () => {
    const [state, setState] = [0, jest.fn()];
    render(
      <MultiPlayer
        assets={
          new Map<string, { url: string; footers?: JSX.Element[] }>([
            ['sample1', { url: 'mock.mp3' }],
            ['sample2', { url: 'mock2.mp3' }]
          ])
        }
        selectedPlayerState={[state, setState]}
      />
    );

    const playPauseButton = screen.getByTestId('play-pause-button');
    fireEvent.click(playPauseButton);
    expect(screen.queryByTestId('pause-icon')).toBeInTheDocument();

    fireEvent.click(playPauseButton);
    expect(screen.queryByTestId('play-icon')).toBeInTheDocument();
  });
});
