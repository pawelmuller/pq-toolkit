import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import SinglePlayer from '../SinglePlayer'

describe('SinglePlayer', () => {
  it('renders a single sample player', () => {
    render(<SinglePlayer assetPath="mock.mp3" name="mock sample" />)

    expect(screen.queryByTestId('play-button')).toBeInTheDocument()
    expect(screen.queryByTestId('pause-button')).toBeInTheDocument()
    expect(screen.queryByTestId('stop-button')).toBeInTheDocument()

    expect(screen.getByText('mock sample')).toBeInTheDocument()
    expect(screen.getByText('0:00/0:00')).toBeInTheDocument()
  })
})
