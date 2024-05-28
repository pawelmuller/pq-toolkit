import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import SinglePlayer from '../SinglePlayer'

describe('SinglePlayer', () => {
  it('renders a single sample player', () => {
    render(<SinglePlayer assetPath="mock.mp3" name="mock sample" />)


    expect(screen.getByTestId('play-pause-button')).toBeInTheDocument()
    expect(screen.getByText('mock sample')).toBeInTheDocument()
    expect(screen.getByTestId('current-time')).toHaveTextContent('0:00')
    expect(screen.getByTestId('total-time')).toHaveTextContent('0:00')
  })

  it('toggles play and pause', () => {
    render(<SinglePlayer assetPath="mock.mp3" name="mock sample" />)
    const playPauseButton = screen.getByTestId('play-pause-button')


    fireEvent.click(playPauseButton)
    expect(screen.queryByTestId('pause-icon')).toBeInTheDocument()


    fireEvent.click(playPauseButton)
    expect(screen.queryByTestId('play-icon')).toBeInTheDocument()
  })

  it('resets progress when stopped', () => {
    render(<SinglePlayer assetPath="mock.mp3" name="mock sample" />)
    const playPauseButton = screen.getByTestId('play-pause-button')


    fireEvent.click(playPauseButton)
    expect(screen.queryByTestId('pause-icon')).toBeInTheDocument()
    fireEvent.click(playPauseButton)
    expect(screen.queryByTestId('play-icon')).toBeInTheDocument()
    fireEvent.click(playPauseButton)
    fireEvent.click(playPauseButton)
    expect(screen.getByTestId('current-time')).toHaveTextContent('0:00')
  })
})