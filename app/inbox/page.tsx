'use client'

import { useState } from 'react'
import InboxSidebar from '@/components/inbox/InboxSidebar'
import InboxThread from '@/components/inbox/InboxThread'
import { Contact } from '@/types'

export default function InboxPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      <InboxSidebar selectedContact={selectedContact} onSelectContact={setSelectedContact} />
      <main className="flex-1 flex flex-col">
        {selectedContact ? (
          <InboxThread contact={selectedContact} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a contact to view the conversation.
          </div>
        )}
      </main>
    </div>
  )
}
