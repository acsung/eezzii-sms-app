// app/inbox/layout.tsx

import '../globals.css'
import { ReactNode } from 'react'

export default function InboxLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      {children}
    </section>
  )
}
