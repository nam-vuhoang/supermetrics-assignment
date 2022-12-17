'use client';

import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

// requires 'use client'
const DEFAULT_THEME = createTheme();

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
