// pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { LayoutProvider } from '@/components/LayoutContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LayoutProvider>
      <Component {...pageProps} />
    </LayoutProvider>
  )
}
