'use client';
import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { IconButton, Slider, Typography, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { formatTime } from './utils/playerUtils';

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
  );

  const [progress, setProgress] = useState(0);

  const length = Math.round(playerRef.current.duration() ?? 0);

  const [status, setStatus] = useState<'stopped' | 'playing' | 'paused'>(
    'stopped'
  );

  const progressUpdater: React.MutableRefObject<NodeJS.Timeout | null> =
    useRef(null);

  const startUpdating = (): void => {
    if (progressUpdater.current == null) {
      progressUpdater.current = setInterval(() => {
        setProgress(Math.round(playerRef.current.seek() ?? 0));
      }, 100);
    }
  };

  const stopUpdating = (): void => {
    if (progressUpdater.current != null) {
      clearInterval(progressUpdater.current);
      progressUpdater.current = null;
    }
  };

  useEffect(() => {
    const player = playerRef.current;

    switch (status) {
      case 'playing':
        player.seek(progress);
        player.play();
        startUpdating();
        break;
      case 'paused':
        player.pause();
        stopUpdating();
        break;
      case 'stopped':
        player.stop();
        stopUpdating();
        setProgress(0);
        break;
    }

    return () => {
      player.stop();
      stopUpdating();
    };
  }, [status]);

  const togglePlayPause = (): void => {
    if (status === 'playing') {
      setStatus('paused');
    } else {
      setStatus('playing');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minWidth="16rem"
      sx={{ p: 2, borderRadius: 1 }}
    >
      <h1 className="font-semibold text-2xl md:text-xl">{name}</h1>
      <Slider
        min={0}
        max={length}
        value={progress}
        onChange={(e, value) => {
          playerRef.current.seek(value as number);
          setProgress(value as number);
        }}
        sx={{ width: '100%', color: '#3b82f6' }}
        data-testid="progress-slider"
      />
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        fontSize="0.875rem"
      >
        <Typography variant="body2" data-testid="current-time">
          {formatTime(progress)}
        </Typography>
        <Typography variant="body2" data-testid="total-time">
          {formatTime(length)}
        </Typography>
      </Box>
      <Box display="flex" gap={1} justifyContent="center">
        <IconButton
          onClick={togglePlayPause}
          sx={{ color: '#3b82f6' }}
          data-testid="play-pause-button"
        >
          {status === 'playing' ? (
            <PauseIcon data-testid="pause-icon" />
          ) : (
            <PlayArrowIcon data-testid="play-icon" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default SinglePlayer;
