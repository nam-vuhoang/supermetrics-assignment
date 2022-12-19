import { Alert } from '@mui/material';

export default function ErrorPanel({ error }: { error: any }): JSX.Element {
  return <Alert severity="error">{error}</Alert>;
}
