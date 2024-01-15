import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MultiPlayer from '../MultiPlayer'

describe('MultiPlayer', () => {
  it('renders a single sample player', () => {
    render(
      <MultiPlayer
        assets={
          new Map<string, string>([
            ['sample1', 'mock.mp3'],
            ['sample2', 'mock2.mp3']
          ])
        }
      />
    )

    expect(screen.queryByTestId('play-button')).toBeInTheDocument()
    expect(screen.queryByTestId('pause-button')).toBeInTheDocument()
    expect(screen.queryByTestId('stop-button')).toBeInTheDocument()

    expect(screen.getByText('sample1')).toBeInTheDocument()
    expect(screen.getByText('sample2')).toBeInTheDocument()
  })
})
