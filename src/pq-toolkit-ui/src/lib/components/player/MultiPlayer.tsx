'use client'
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'
import { Howl } from 'howler'
import { PauseButton, PlayButton, StopButton } from './ControlButtons'
import { formatTime } from './utils/playerUtils'
import {max} from "@floating-ui/utils";

const MultiPlayer = ({
  assets,
  selectedPlayerState
}: {
  assets: Map<string, {url: string, footers?: JSX.Element[]}>
  selectedPlayerState?: [number, Dispatch<SetStateAction<number>>]
}): JSX.Element => {
  const playersRef = useRef<Howl[]>(
    Array.from(assets.entries()).map(
      ([_, sample]: [string, {url: string, footers?: JSX.Element[]}]) =>
        new Howl({
          src: [sample.url],
          volume: 0.0,
          loop: true,
          preload: true,
          onend: () => {
            setStatus('stopped')
          }
        })
    )
  )

  const getPlayerLength = (player: Howl): number => player.duration() ?? 0

  // This won't cause changing hooks on re-render because it's specific for each component
  const [selectedPlayer, setSelectedPlayer] =
    selectedPlayerState ?? useState<number>(0)

  useEffect(() => {
    playersRef.current.forEach((player, idx) => {
      if (idx === selectedPlayer) {
        player.volume(0.1)
      } else {
        player.volume(0.0)
      }
    })
  }, [selectedPlayer])

  const [progress, setProgress] = useState(0)
  const length = Math.round(
    Math.min(...playersRef.current.map(getPlayerLength))
  )
  const [status, setStatus] = useState<'stopped' | 'playing' | 'paused'>(
    'stopped'
  )
  const progressUpdater: React.MutableRefObject<NodeJS.Timeout | null> =
    useRef(null)

  const allFooterLevels: number[] = []
  assets.forEach((item) => allFooterLevels.push(item.footers?.length || 0))
  const footerLevels: number = max(...allFooterLevels)

  const startUpdating = (): void => {
    if (progressUpdater.current == null) {
      progressUpdater.current = setInterval(() => {
        setProgress(Math.round(playersRef.current[0].seek() ?? 0))
      }, 100)
    }
  }
  const stopUpdating = (): void => {
    if (progressUpdater.current != null) {
      clearInterval(progressUpdater.current)
      progressUpdater.current = null
    }
  }

  const seekAllPlayers = (time: number): void => {
    playersRef.current.forEach((player) => player.seek(time))
  }

  useEffect(() => {
    const allPlayers = playersRef.current
    switch (status) {
      case 'playing':
        allPlayers.forEach((player) => player.play())
        startUpdating()
        break
      case 'paused':
        allPlayers.forEach((player) => player.pause())
        stopUpdating()
        break
      case 'stopped':
        allPlayers.forEach((player) => player.stop())
        stopUpdating()
        setProgress(Math.round(allPlayers[0].seek() ?? 0))
        break
    }

    return () => {
      allPlayers.forEach((player) => player.stop())
      stopUpdating()
    }
  }, [playersRef, status])

  return (
    <div className="flex flex-col items-center min-w-[16rem]">
      <input
        type="range"
        min="0"
        max={length}
        value={progress}
        onChange={(e) => {
          seekAllPlayers(parseInt(e.target.value))
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
      <table className="mt-sm border-separate [border-spacing:0.75rem]">
        <tbody>
          <tr>
            {Array.from(assets.keys()).map((name, index) => (
              <td key={index} className="pb-sm">
                <button
                  key={`asset-selector-${index}`}
                  onClick={() => {
                    setSelectedPlayer(index)
                  }}
                  className={`h-full w-full rounded-md text-white font-semibold p-xs
                              ${selectedPlayer === index ? 'bg-blue-500' : 'bg-blue-300'}`}
                >
                  {name}
                </button>
              </td>
            ))}
          </tr>
          {
            Array.from(Array(footerLevels).keys()).map((idx) => (
              <tr key={idx} className="mt-sm gap-sm w-full">
                {Array.from(assets.keys()).map((name) => {
                  const footer: JSX.Element | undefined = assets.get(name)?.footers?.at(idx)
                  return <td key={name} className="h-1">
                    {footer}
                  </td>
                })}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default MultiPlayer
