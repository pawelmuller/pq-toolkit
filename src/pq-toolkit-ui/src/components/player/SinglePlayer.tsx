'use client'
import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { PauseButton, PlayButton, StopButton } from './ControlButtons'
import { formatTime } from './utils/playerUtils'

const SinglePlayer = ({
  assetPath,
  name
}: {
  assetPath: string
  name: string
}): JSX.Element => {
  const playerRef = useRef<Howl>(
    new Howl({
      src: [assetPath],
      volume: 0.1,
      loop: true
    })
  )

  const [progress, setProgress] = useState(0)

  const length = Math.round(playerRef.current.duration() ?? 0)

  const [status, setStatus] = useState<'stopped' | 'playing' | 'paused'>(
    'stopped'
  )

  const progressUpdater: React.MutableRefObject<NodeJS.Timeout | null> =
    useRef(null)

  const startUpdating = (): void => {
    if (progressUpdater.current == null) {
      progressUpdater.current = setInterval(() => {
        setProgress(Math.round(playerRef.current.seek() ?? 0))
      }, 100)
    }
  }

  const stopUpdating = (): void => {
    if (progressUpdater.current != null) {
      clearInterval(progressUpdater.current)
      progressUpdater.current = null
    }
  }

  useEffect(() => {
    const player = playerRef.current

    switch (status) {
      case 'playing':
        player.play()
        startUpdating()
        break
      case 'paused':
        player.pause()
        stopUpdating()
        break
      case 'stopped':
        player.stop()
        stopUpdating()
        setProgress(Math.round(playerRef.current.seek() ?? 0))
        break
    }
  }, [playerRef, status])

  return (
    <div className="flex flex-col items-center min-w-[16rem]">
      <div className="text-md font-semibold">{name}</div>
      <div className="w-full rounded-full h-2 bg-blue-100">
        <div
          className="h-2 rounded-xl bg-blue-600"
          style={{ width: `${((progress / length) * 100).toFixed(0)}%` }}
        />
      </div>
      <div className="w-full flex justify-end text-sm font-light">
        {formatTime(progress)}/{formatTime(length)}
      </div>
      <div className="flex gap-sm justify-center">
        <PlayButton
          onClick={() => {
            setStatus('playing')
          }}
        />
        <PauseButton
          onClick={() => {
            setStatus('paused')
          }}
        />
        <StopButton
          onClick={() => {
            setStatus('stopped')
          }}
        />
      </div>
    </div>
  )
}

export default SinglePlayer
