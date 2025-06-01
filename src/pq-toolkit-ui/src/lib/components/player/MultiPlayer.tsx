'use client';

import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from 'react';
import { Howl } from 'howler';
import {IconButton, Slider, Typography, Box, Button, Table, TableBody, TableCell, TableRow} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { formatTime } from './utils/playerUtils';
import { max } from '@floating-ui/utils';

const MultiPlayer = ({
  assets,
  selectedPlayerState
}: {
  assets: Map<string, { url: string; footers?: JSX.Element[] }>
  selectedPlayerState: [number, Dispatch<SetStateAction<number>>]
}): JSX.Element => {
  const playersRef = useRef<Howl[]>(
    Array.from(assets.entries()).map(
      ([_, sample]: [string, { url: string; footers?: JSX.Element[] }]) =>
        new Howl({
          src: [sample.url],
          volume: 0.0,
          preload: true,
          onend: () => {
            setStatus('stopped');
          }
        })
    )
  );

  const getPlayerLength = (player: Howl): number => player.duration() ?? 0;

  const [selectedPlayer, setSelectedPlayer] = selectedPlayerState;

  useEffect(() => {
    playersRef.current.forEach((player, idx) => {
      if (idx === selectedPlayer) {
        player.volume(0.5);
      } else {
        player.volume(0.0);
      }
    });
    setProgress(0);
  }, [selectedPlayer]);

  const [progress, setProgress] = useState(0);
  const length = Math.round(Math.min(...playersRef.current.map(getPlayerLength)));
  const [status, setStatus] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const progressUpdater: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const allFooterLevels: number[] = [];
  assets.forEach((item) => allFooterLevels.push(item.footers?.length ?? 0));
  const footerLevels: number = max(...allFooterLevels);

  const startUpdating = (): void => {
    if (progressUpdater.current == null) {
      progressUpdater.current = setInterval(() => {
        setProgress(Math.round(playersRef.current[0].seek() ?? 0));
      }, 100);
    }
  };
  const stopUpdating = (): void => {
    if (progressUpdater.current != null) {
      clearInterval(progressUpdater.current);
      progressUpdater.current = null;
    }
  };

  const seekAllPlayers = (time: number): void => {
    playersRef.current.forEach((player) => player.seek(time));
  };

  useEffect(() => {
    const allPlayers = playersRef.current;
    switch (status) {
      case 'playing':
        allPlayers.forEach((player) => player.seek(progress));
        allPlayers.forEach((player) => player.play());
        startUpdating();
        break;
      case 'paused':
        allPlayers.forEach((player) => player.pause());
        stopUpdating();
        break;
      case 'stopped':
        allPlayers.forEach((player) => player.stop());
        stopUpdating();
        setProgress(0);
        break;
    }

    return () => {
      allPlayers.forEach((player) => player.stop());
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

  const handleSampleSelect = (index: number): void => {
    setSelectedPlayer(index);
    setStatus('stopped');
    setProgress(0);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minWidth="16rem"
      sx={{ p: 2, borderRadius: 1 }}
    >
      <Slider
        min={0}
        max={length}
        value={progress}
        onChange={(e, value) => {
          seekAllPlayers(value as number);
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
        <Typography variant="body2">{formatTime(progress)}</Typography>
        <Typography variant="body2">{formatTime(length)}</Typography>
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
      <Table
        className="mt-sm border-separate"
        sx={{ borderSpacing: '0.75rem' }}
      >
        <TableBody>
          <TableRow>
            {Array.from(assets.keys()).map((name, index) => (
              <TableCell key={index} className="pb-sm">
                <Button
                  key={`asset-selector-${index}`}
                  onClick={() => {
                    handleSampleSelect(index);
                  }}
                  variant="contained"
                  sx={{
                    bgcolor: selectedPlayer === index ? '#db2777' : '#3b82f6',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#db2777'
                    }
                  }}
                  data-testid={`sample-button-${index}`}
                >
                  {name}
                </Button>
              </TableCell>
            ))}
          </TableRow>
          {Array.from(Array(footerLevels).keys()).map((idx) => (
            <TableRow key={idx} className="mt-sm gap-sm w-full">
              {Array.from(assets.keys()).map((name) => {
                const footer: JSX.Element | undefined = assets
                  .get(name)
                  ?.footers?.at(idx);
                return (
                  <TableCell key={name} className="h-1">
                    {footer}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default MultiPlayer;
