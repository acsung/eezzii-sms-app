// pages/inbox.js
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xawgyywwsykfncoskjjp.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [search, setSearch] = useState('')
  const [filteredMessages, setFilteredMessages] = useState([])

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Failed to fetch messages:', error)
      } else {
        setMessages(data)
        setFilteredMessages(data)
      }
    }

    fetchMessages()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredMessages(messages)
    } else {
      const term = search.toLowerCase()
      setFilteredMessages(
        messages.filter(msg =>
          (msg.content || '').toLowerCase().includes(term) ||
          (msg.recipient || '').toLowerCase().includes(term) ||
          (msg.status || '').toLowerCase().includes(term)
        )
      )
    }
  }, [search, messages])

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>📥 EEZZZII Inbox</h1>

      <input
        type="text"
        placeholder="🔍 Search messages, numbers, or content..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1.5rem', fontSize: '1rem' }}
      />

      {filteredMessages.length === 0 ? (
        <p style={{ color: '#888' }}>No messages found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredMessages.map(msg => (
            <li key={msg.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
              <div style={{ marginBottom: '0.25rem' }}>
                <strong>{msg.recipient || 'N/A'}</strong> ({msg.direction}) - <span style={{ color: '#666' }}>{msg.status}</span>
              </div>
              <div style={{ fontSize: '0.95rem' }}>{msg.content}</div>
              <div style={{ fontSize: '0.75rem', color: '#999' }}>{new Date(msg.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
