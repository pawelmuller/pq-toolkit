import { FaStop, FaPause, FaPlay } from 'react-icons/fa';

export const PlayButton = ({
  onClick
}: {
  onClick: () => void
}): JSX.Element => {
  return (
    <div data-testid="play-button">
      <ControlButton label={<FaPlay />} onClick={onClick} />
    </div>
  );
};

export const PauseButton = ({
  onClick
}: {
  onClick: () => void
}): JSX.Element => {
  return (
    <div data-testid="pause-button">
      <ControlButton label={<FaPause />} onClick={onClick} />
    </div>
  );
};

export const StopButton = ({
  onClick
}: {
  onClick: () => void
}): JSX.Element => {
  return (
    <div data-testid="stop-button">
      <ControlButton label={<FaStop />} onClick={onClick} />
    </div>
  );
};

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
  );
};
