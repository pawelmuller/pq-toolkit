import { useRef, useEffect } from 'react';

const AudioPlayer = ({ assetPath }: { assetPath: string }): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const sourceElement = audioRef.current.querySelector('source');
      if (sourceElement) {
        sourceElement.src = `/api/v1/samples/stream?filename=${assetPath}`;
        audioRef.current.load();
      }
    }
  }, [assetPath]);

  return (
    <audio controls ref={audioRef} className="w-1/2">
      <source type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
