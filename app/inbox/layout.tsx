// app/inbox/layout.tsx

import '../../styles/globals.css'
import { ReactNode } from 'react'

export default function InboxLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
