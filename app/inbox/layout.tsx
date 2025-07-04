// app/inbox/layout.tsx

import { ReactNode } from 'react'
import '../../styles/globals.css'

export default function InboxLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  )
}
