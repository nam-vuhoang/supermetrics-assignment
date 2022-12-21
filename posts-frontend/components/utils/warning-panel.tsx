import { Alert } from '@mui/material';

/**
 * Render an error panel
 * @param param0
 * @returns
 */
export default function WarningPanel({
  message,
}: {
  message: any;
}): JSX.Element {
  return <Alert severity="warning">{message}</Alert>;
}
