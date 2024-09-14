import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { SWRConfigProvider } from '@/core/apiHandlers/clientApiHandler'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin-ext'] })

export const metadata: Metadata = {
  title: 'PQToolkit UI',
  description: 'Perceptual Qualities Toolkit Experiment UI'
}

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
        <Providers>
          <SWRConfigProvider>
            <div>{children}</div>
          </SWRConfigProvider>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
