// pages/inbox.js – EEZZZII Inbox with Tag Filters + Contact View

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [contacts, setContacts] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: contactData } = await supabase
        .from('contacts')
        .select('*')

      setMessages(msgData || [])
      setContacts(contactData || [])
    }
    fetchData()
  }, [])

  const tags = [...new Set(contacts.map(c => c.tag).filter(Boolean))]
  const filteredContacts = selectedTag
    ? contacts.filter(c => c.tag === selectedTag)
    : contacts

  const filteredMessages = selectedContact
    ? messages.filter(m => m.recipient === selectedContact.phone || m.sender === selectedContact.phone)
    : messages

  return (
    <div style={{ display: 'flex', padding: 20, gap: 40, fontFamily: 'sans-serif' }}>
      {/* Left column – Filters + Contact list */}
      <div style={{ width: '30%' }}>
        <h2>📁 Contact Filters</h2>
        <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag} style={{ width: '100%', marginBottom: 10 }}>
          <option value=''>-- View All Tags --</option>
          {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>

        <h3>👤 Contacts</h3>
        <ul>
          {filteredContacts.map(contact => (
            <li key={contact.id} onClick={() => setSelectedContact(contact)} style={{ cursor: 'pointer', marginBottom: 6 }}>
              {contact.phone} {contact.tag ? `(${contact.tag})` : ''}
            </li>
          ))}
        </ul>
      </div>

      {/* Right column – Message Threads */}
      <div style={{ width: '70%' }}>
        <h2>📨 Messages {selectedContact ? `for ${selectedContact.phone}` : ''}</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredMessages.map(m => (
            <li key={m.id} style={{ marginBottom: 10 }}>
              <b>{m.direction === 'inbound' ? m.sender : m.recipient}</b>: {m.content} <br />
              <small>{new Date(m.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
