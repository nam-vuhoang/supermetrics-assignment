import { PageHeader } from './PageHeader';
import { PageFooter } from './PageFooter';
import { MainSection } from './MainSection';
import { DEFAULT_FONT } from './theme/theme-definitions';
import { AppThemeProvider } from './theme/AppThemeProvider';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.error(DEFAULT_FONT.className);
  return (
    <html lang="en" className={DEFAULT_FONT.className}>
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
