'use client'
import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'

const TestPage = (): JSX.Element => {
  const testEntry = {
    id: 1,
    type: 'AB',
    samples: [
      {
        id: 'a',
        assetPath: 'samples/file_sample_5.mp3',
        name: 'Sample A'
      },
      {
        id: 'b',
        assetPath: 'samples/file_sample_700.mp3',
        name: 'Sample B'
      }
    ],
    questions: [
      {
        id: 0,
        text: 'Select better quality'
      },
      {
        id: 1,
        text: 'Select more warmth'
      }
    ]
  }

  const { id, type, samples, questions } = testEntry

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-white rounded-md p-lg flex flex-col items-center text-black">
        <div className="text-xl font-semibold">
          Test {type} #{id + 1}
        </div>
        <div className="flex gap-md mt-md">
          {samples.map((sample, idx) => (
            <SamplePlayer
              key={`sample_player_${idx}`}
              assetPath={sample.assetPath}
              name={`Sample ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-sm w-full mt-md">
          {questions.map((question, idx) => (
            <SingleSelectQuestion
              key={`question_${idx}`}
              text={question.text}
              options={samples}
            />
          ))}
        </div>
        <div className="flex justify-center mt-md">
          <button className="bg-blue-500 rounded-md p-xs font-semibold text-white">
            Submit
          </button>
        </div>
      </div>
    </main>
  )
}

const SingleSelectQuestion = ({
  text,
  options
}: {
  text: string
  options: Array<{ id: string, name: string }>
}): JSX.Element => {
  const [selectableOptions, setSelectableOptions] = useState(
    options.map((option) => ({
      ...option,
      selected: false
    }))
  )

  const onOptionSelect = (selectedId: string): void => {
    setSelectableOptions((prevState) => {
      return prevState.map((option) => ({
        ...option,
        selected: option.id === selectedId
      }))
    })
  }

  return (
    <div className="w-full">
      <div className="text-md font-semibold">{text}</div>
      <div className="flex gap-sm">
        {selectableOptions.map((option, idx) => (
          <div
            key={`option_${idx}`}
            className={`w-full min-h-[4rem] h-max max-h-[8rem] rounded-md ${
              option.selected ? 'bg-blue-500' : 'bg-blue-100'
            } flex items-center justify-center cursor-pointer`}
            onClick={() => {
              onOptionSelect(option.id)
            }}
          >
            {option.name}
          </div>
        ))}
      </div>
    </div>
  )
}

const SamplePlayer = ({
  assetPath,
  name
}: {
  assetPath: string
  name: string
}): JSX.Element => {
  const playerRef = useRef<Howl>(
    new Howl({
      src: [assetPath],
      volume: 0.1
    })
  )

  const [progress, setProgress] = useState(0)

  const length = Math.round(playerRef.current.duration() ?? 0)

  const formatTime = (time: number): string => {
    const min = Math.floor(time / 60)
    const sec = String(time % 60)
    return `${min}:${sec.padStart(2, '0')}`
  }

  const [status, setStatus] = useState<'stopped' | 'playing' | 'paused'>(
    'stopped'
  )

  useEffect(() => {
    const player = playerRef.current

    setProgress(Math.round(playerRef.current.seek() ?? 0))

    switch (status) {
      case 'playing':
        player.play()
        break
      case 'paused':
        player.pause()
        break
      case 'stopped':
        player.stop()
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
        <ControlButton
          button=">"
          onClick={() => {
            setStatus('playing')
          }}
        />
        <ControlButton
          button="||"
          onClick={() => {
            setStatus('paused')
          }}
        />
      </div>
    </div>
  )
}

const ControlButton = ({
  button,
  onClick
}: {
  button: string
  onClick: () => void
}): JSX.Element => {
  return (
    <button
      className="bg-blue-600 text-white rounded-md h-8 w-8 flex items-center justify-center"
      onClick={onClick}
    >
      {button}
    </button>
  )
}

export default TestPage
