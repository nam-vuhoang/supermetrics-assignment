import { Alert } from "@mui/material";

/**
 * Render a simple loading info panel.
 */
export default function LoadingInfoPanel(): JSX.Element {
  return <Alert severity="info">Loading data...</Alert>;
}