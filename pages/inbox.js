// pages/inbox.js – EEZZZII Inbox with Tag Filters + Contact View + Import/Export

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
  const [csvTag, setCsvTag] = useState('')

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

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file || !csvTag) {
      alert('Select a tag and CSV file first.')
      return
    }
    const text = await file.text()
    const lines = text.trim().split('\n')
    const imported = lines.map(phone => ({ phone: phone.trim(), tag: csvTag }))
    const { error } = await supabase.from('contacts').upsert(imported, { onConflict: ['phone'] })
    if (error) {
      alert('Import failed')
    } else {
      alert('Contacts imported successfully')
      location.reload()
    }
  }

  const handleExport = () => {
    const filtered = selectedTag ? contacts.filter(c => c.tag === selectedTag) : contacts
    const csv = filtered.map(c => `${c.phone},${c.tag || ''}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contacts_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

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

        <hr />
        <h4>📤 Import Contacts CSV</h4>
        <input
          type='text'
          placeholder='Tag to assign'
          value={csvTag}
          onChange={(e) => setCsvTag(e.target.value)}
          style={{ width: '100%', marginBottom: 6 }}
        />
        <input type='file' accept='.csv,.txt' onChange={handleImport} style={{ width: '100%' }} />

        <h4 style={{ marginTop: 20 }}>⬇️ Export</h4>
        <button onClick={handleExport} style={{ width: '100%' }}>Export Filtered Contacts</button>
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
