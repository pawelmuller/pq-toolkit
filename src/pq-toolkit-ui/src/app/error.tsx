'use client';

import { useEffect } from 'react';

export const Error = ({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}): JSX.Element => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center">
      <h3>Something went wrong!</h3>
      <button
        onClick={() => {
          reset();
        }}
      >
        Try again
      </button>
    </div>
  );
};

export default Error;
