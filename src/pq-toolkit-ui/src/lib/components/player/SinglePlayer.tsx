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
      volume: 0.5,
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
        player.seek(progress)
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
        setProgress(0)
        break
    }

    return () => {
      player.stop()
      stopUpdating()
    }
  }, [status])

  return (
    <div className="flex flex-col items-center min-w-[16rem]">
      <div className="text-md font-semibold">{name}</div>
      <input
        type="range"
        min="0"
        max={length}
        value={progress}
        onChange={(e) => {
          playerRef.current.seek(parseInt(e.target.value))
          setProgress(parseInt(e.target.value))
        }}
        className="w-full appearance-none bg-blue-100 rounded-full"
      />
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
