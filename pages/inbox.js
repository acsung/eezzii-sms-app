// pages/inbox.js – EEZZZII Inbox View with Sidebar Navigation

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inbox() {
  const router = useRouter()
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [activeTag, setActiveTag] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: contactList } = await supabase.from('contacts').select('*')
    const { data: messageList } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setContacts(contactList)
    setMessages(messageList)
  }

  const filteredContacts = activeTag
    ? contacts.filter((c) => c.tag === activeTag)
    : contacts

  const messagesByPhone = (phone) =>
    messages.filter((m) => m.recipient === phone || m.sender === phone)

  const allTags = Array.from(new Set(contacts.map((c) => c.tag))).filter(Boolean)

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Sidebar toggle */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ position: 'fixed', top: 20, left: 20, zIndex: 10 }}>
        📋 Menu
      </button>

      {/* Sidebar */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 250,
          height: '100%',
          background: '#f4f4f4',
          padding: 20,
          boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
          zIndex: 9
        }}>
          <h3>📁 Navigation</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><button style={{ background: 'none', border: 'none', padding: 10 }} onClick={() => router.push('/')}>🔁 Go to SMS Blaster</button></li>
            <li><button style={{ background: 'none', border: 'none', padding: 10 }} disabled>📨 Inbox</button></li>
          </ul>
        </div>
      )}

      {/* Main content */}
      <div style={{ padding: '60px 20px 20px 20px', marginLeft: menuOpen ? 270 : 20 }}>
        <h2>📁 Contact Filters</h2>
        <select value={activeTag} onChange={(e) => setActiveTag(e.target.value)}>
          <option value=''>-- View All Tags --</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <h3>📞 Contacts</h3>
        <ul>
          {filteredContacts.map((c) => (
            <li key={c.id}>
              {c.phone} {c.tag && <span>({c.tag})</span>}
            </li>
          ))}
        </ul>

        <h3>📨 Messages</h3>
        <ul>
          {messages.map((m) => (
            <li key={m.id}>
              <strong>{m.recipient || m.sender}</strong>: {m.content}<br />
              <small>{new Date(m.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
