// pages/inbox.js – EEZZZII Inbox View with Sidebar and Contact Threads

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inbox() {
  const router = useRouter()
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [reply, setReply] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchContacts = async () => {
      const { data } = await supabase.from('contacts').select('*')
      setContacts(data || [])
    }
    fetchContacts()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedContact) return
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient', selectedContact.phone)
        .order('created_at', { ascending: true })
      setMessages(data || [])
    }
    fetchMessages()
  }, [selectedContact])

  const sendMessage = async () => {
    if (!reply.trim() || !selectedContact) return
    await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: selectedContact.phone, message: reply })
    })
    setReply('')
    setMessages((prev) => [...prev, {
      recipient: selectedContact.phone,
      content: reply,
      status: 'sent',
      created_at: new Date().toISOString(),
    }])
  }

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
            <li><button style={{ background: 'none', border: 'none', padding: 10 }} onClick={() => router.push('/')}>📤 SMS Blaster</button></li>
            <li><button style={{ background: 'none', border: 'none', padding: 10 }} disabled>📨 Inbox</button></li>
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', marginLeft: menuOpen ? 270 : 20, padding: 20 }}>
        {/* Contact list */}
        <div style={{ width: 250, marginRight: 20 }}>
          <h3>📇 Contacts</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {contacts.map((c) => (
              <li key={c.id} style={{ marginBottom: 10 }}>
                <button
                  onClick={() => setSelectedContact(c)}
                  style={{ background: 'white', border: '1px solid #ccc', width: '100%', textAlign: 'left', padding: 8 }}>
                  {c.phone} <small>({c.tag})</small>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Message thread */}
        <div style={{ flex: 1 }}>
          <h3>🧾 Messages</h3>
          {selectedContact ? (
            <>
              <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 10, border: '1px solid #eee', padding: 10 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <b>{m.status === 'received' ? selectedContact.phone : 'You'}:</b> {m.content}
                    <div style={{ fontSize: '0.8em', color: '#999' }}>{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                style={{ width: '100%', marginBottom: 10 }}
                placeholder='Type a reply...'
              />
              <button onClick={sendMessage} style={{ width: '100%' }}>Send</button>
            </>
          ) : <p>Select a contact to view messages</p>}
        </div>
      </div>
    </div>
  )
}
