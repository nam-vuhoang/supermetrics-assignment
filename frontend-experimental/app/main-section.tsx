'use client';

import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

export function MainSection({ children }: { children: ReactNode }) {
  return (
    <main>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container fixed>{children}</Container>
      </Box>
    </main>
  );
}
