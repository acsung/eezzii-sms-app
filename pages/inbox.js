// /pages/inbox.js
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inbox() {
  const [conversations, setConversations] = useState([])
  const [activeContact, setActiveContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [messageText, setMessageText] = useState('')

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, contacts(*)')
      .order('created_at', { ascending: true })

    if (!error) {
      const grouped = {}
      data.forEach((msg) => {
        const phone = msg.recipient || msg.sender
        if (!grouped[phone]) grouped[phone] = []
        grouped[phone].push(msg)
      })
      setConversations(grouped)
    }
  }

  const filteredContacts = Object.entries(conversations).filter(
    ([phone, messages]) => {
      const contact = messages[0].contacts || {}
      const combinedText = `${contact.name || ''} ${contact.email || ''} ${contact.notes || ''} ${phone}`.toLowerCase()
      return combinedText.includes(searchTerm.toLowerCase())
    }
  )

  const sendReply = async () => {
    if (!activeContact || !messageText.trim()) return

    const phone = activeContact
    const { data, error } = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phone, message: messageText })
    })

    if (!error) {
      setMessageText('')
      loadMessages()
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
        <input
          type="text"
          placeholder="Search name, number, tag, note..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredContacts.map(([phone, msgs]) => (
            <li
              key={phone}
              onClick={() => setActiveContact(phone)}
              style={{ padding: '0.5rem', cursor: 'pointer', background: phone === activeContact ? '#f0f0f0' : 'transparent' }}
            >
              <strong>{msgs[0].contacts?.name || phone}</strong>
              <br />
              <small>{msgs[msgs.length - 1].content}</small>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeContact && conversations[activeContact]?.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.direction === 'outbound' ? 'right' : 'left' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: msg.direction === 'outbound' ? '#dcf8c6' : '#f1f1f1',
                  borderRadius: '1rem',
                  maxWidth: '70%'
                }}
              >
                {msg.content}
              </div>
              <br />
              <small>{new Date(msg.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Type a reply..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
          />
          <button
            onClick={sendReply}
            style={{ marginLeft: '0.5rem', padding: '0.75rem 1rem', background: '#000', color: '#fff', border: 'none', borderRadius: '0.5rem' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
