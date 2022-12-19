import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.scss'

import type { AppProps } from 'next/app';
import PageLayout from '../components/page-layout';

/**
 * This specific file is used to define the application page layout.
 * @param param0 
 * @returns 
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  );
}
