import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MultiPlayer from '../MultiPlayer'

describe('MultiPlayer', () => {
  it('renders a single sample player', () => {
    const [state, setState] = [0, jest.fn()]
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
    )

    expect(screen.queryByTestId('play-button')).toBeInTheDocument()
    expect(screen.queryByTestId('pause-button')).toBeInTheDocument()
    expect(screen.queryByTestId('stop-button')).toBeInTheDocument()

    expect(screen.getByText('sample1')).toBeInTheDocument()
    expect(screen.getByText('sample2')).toBeInTheDocument()
  })
})
