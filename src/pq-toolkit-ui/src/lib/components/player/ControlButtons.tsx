import { FaStop, FaPause, FaPlay } from 'react-icons/fa'

export const PlayButton = ({
  onClick
}: {
  onClick: () => void
}): JSX.Element => {
  return <ControlButton label={<FaPlay />} onClick={onClick} />
}

export const PauseButton = ({
  onClick
}: {
  onClick: () => void
}): JSX.Element => {
  return <ControlButton label={<FaPause />} onClick={onClick} />
}

export const StopButton = ({
  onClick
}: {
  onClick: () => void
}): JSX.Element => {
  return <ControlButton label={<FaStop />} onClick={onClick} />
}

const ControlButton = ({
  label,
  onClick
}: {
  label: JSX.Element
  onClick: () => void
}): JSX.Element => {
  return (
    <button
      className="bg-blue-600 text-white rounded-md h-8 w-8 p-2.5 flex items-center justify-center"
      onClick={onClick}
    >
      {label}
    </button>
  )
}
