export const formatTime = (time: number): string => {
  const min = Math.floor(time / 60);
  const sec = String(time % 60);
  return `${min}:${sec.padStart(2, '0')}`;
};
