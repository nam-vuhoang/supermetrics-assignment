import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {Typography, Link as MaterialLink } from '@mui/material';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Diversity1 } from '@mui/icons-material';
import Head from 'next/head';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      {/* <Link color="inherit" href="https://supermetrics.com/">
        SuperMetrics
      </Link>{' '} */}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function PageLayout(props: { children: any }) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Link href="/" shallow passHref legacyBehavior>
                <IconButton color="inherit">
                  <Diversity1 />
                </IconButton>
              </Link>
              <Link href="/" passHref shallow legacyBehavior>
                <MaterialLink
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
                  underline="none"
                >
                  Heart Book
                </MaterialLink>
              </Link>
              <Link href="/" shallow passHref legacyBehavior>
                <Button href="/" color="inherit">
                  Home
                </Button>
              </Link>
              <Link href="/dashboard" shallow passHref legacyBehavior>
                <Button href="/dashboard" color="inherit">
                  Dashboard
                </Button>
              </Link>
            </Toolbar>
          </AppBar>
        </Box>
        {/* Main */}

        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container fixed>{props.children}</Container>
          </Box>
        </main>
        {/* Footer */}
        <footer>
          <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              component="p"
            >
              Powered by Nam Vu Hoang
            </Typography>
            <Copyright />
          </Box>
        </footer>
        {/* End footer */}
      </ThemeProvider>
    </>
  );
}
