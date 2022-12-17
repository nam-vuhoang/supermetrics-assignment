import { ReactNode } from 'react';
import { Providers } from './providers';
import { HeadMenu } from './head-menu';
import { Footer } from './footer';
import { MainSection } from './main-section';
import { defaultFont } from './theme/defaultFont';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={defaultFont.className}>
      <head />
      <body>
        <Providers>
          <HeadMenu />
          <MainSection>{children}</MainSection>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
