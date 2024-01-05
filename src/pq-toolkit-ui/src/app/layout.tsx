import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { SWRConfigProvider } from '@/core/apiHandlers/clientApiHandler'

const inter = Inter({ subsets: ['latin-ext'] })

export const metadata: Metadata = {
  title: 'PQ Toolkit UI',
  description: 'Perceptual Qualities Toolkit Experiment UI'
}

const RootLayout = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SWRConfigProvider>
          <div>{children}</div>
        </SWRConfigProvider>
      </body>
    </html>
  )
}

export default RootLayout
