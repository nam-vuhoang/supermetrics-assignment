'use client';

import { Alert, Button } from '@mui/material';
// 'use client' marks this page as a Client Component
// https://beta.nextjs.org/docs/rendering/server-and-client-components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (!(error instanceof URIError)) {
      console.error(error);
    }
  }, [error]);

  return (
    <Alert severity="error">
      <p>Something went wrong!</p>
      <Button onClick={reset}>Reset error boundary</Button>
    </Alert>
  );
}
