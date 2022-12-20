import { Alert } from '@mui/material';

/**
 * Render an error panel
 * @param param0 
 * @returns 
 */
export default function ErrorPanel({ error }: { error: any }): JSX.Element {
  return <Alert severity="error">{error}</Alert>;
}
