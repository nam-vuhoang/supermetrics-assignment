// Because approach with @next/font didn't work
// (failed to download `Roboto` from Google Fonts. Using fallback font instead).
// We have to use @fontsource/roboto for MUI.
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './theme/globals.scss';

import { PageHeader } from './PageHeader';
import { PageFooter } from './PageFooter';
import { MainSection } from './MainSection';
import { AppThemeProvider } from './theme/AppThemeProvider';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AppThemeProvider>
          <PageHeader />
          <MainSection>{children}</MainSection>
          <PageFooter />
        </AppThemeProvider>
      </body>
    </html>
  );
}
