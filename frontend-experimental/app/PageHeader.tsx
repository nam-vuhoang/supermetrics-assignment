'use client';

import { Diversity1 } from '@mui/icons-material';
import {
  Box,
  AppBar,
  Link as MuiLink,
  Toolbar,
  IconButton,
  Button,
} from '@mui/material';
import Link from 'next/link';

export function PageHeader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref legacyBehavior>
            <IconButton color="inherit">
              <Diversity1 />
            </IconButton>
          </Link>
          <Link href="/" passHref legacyBehavior>
            <MuiLink
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, textDecoration: 'none' }}
              underline="none"
            >
              Heart Book
            </MuiLink>
          </Link>
          <Link href="/" passHref legacyBehavior>
            <Button href="/" color="inherit">
              Home
            </Button>
          </Link>
          <Link href="/dashboard" passHref legacyBehavior>
            <Button href="/dashboard" color="inherit">
              Dashboard
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
