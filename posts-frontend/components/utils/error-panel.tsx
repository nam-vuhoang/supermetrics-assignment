import { Alert, Typography } from '@mui/material';
import { serializeError } from 'serialize-error';
import { logger } from '../../utils/logger';

/**
 * Render an error panel
 * @param param0
 * @returns
 */
export default function ErrorPanel({ error }: { error: any }): JSX.Element {
  logger.error(JSON.stringify(serializeError(error)));
  if (error instanceof Error) {
    return (
      <Alert severity="error">
        <Typography variant="body1">Error: {error.message}</Typography>
        <Typography variant="body2">
          See error logs for details.
        </Typography>
      </Alert>
    );
  }
  return <Alert severity="error">{error}</Alert>;
}
