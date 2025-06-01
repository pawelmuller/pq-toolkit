import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { SWRConfigProvider } from '@/core/apiHandlers/clientApiHandler';
import { Providers } from './providers';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import ToastContainer from '@/lib/components/shared/ToastContainer';

const inter = Inter({ subsets: ['latin-ext'] });

export const metadata: Metadata = {
  title: 'PQToolkit UI',
  description: 'Perceptual Qualities Toolkit Experiment UI'
};

const RootLayout = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <Providers>
            <SWRConfigProvider>
              <div>{children}</div>
            </SWRConfigProvider>
          </Providers>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
};

export default RootLayout;
