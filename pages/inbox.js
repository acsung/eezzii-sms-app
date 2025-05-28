// eezzii-sms-app: includes main SMS blast + /inbox reply viewer UI

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhd2d5eXd3c3lrZm5jb3NrampwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjEzMTMsImV4cCI6MjA2MzkzNzMxM30.nV7_dMGdVZt-Qm5g2Augq6Q-xmFsTzs1ZJx3TG58PJE'
)

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [grouped, setGrouped] = useState({})
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('inbound_messages')
        .select('*')
        .order('created_at', { ascending: false })

      const threads = {}
      for (const msg of data) {
        if (!threads[msg.sender]) threads[msg.sender] = []
        threads[msg.sender].push(msg)
      }
      setGrouped(threads)
      setMessages(data)
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>📥 EEZZZII Inbox</h1>
      {Object.keys(grouped).length === 0 ? (
        <p>No inbound messages yet.</p>
      ) : (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <aside style={{ minWidth: '200px', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>📱 Threads</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {Object.keys(grouped).map(sender => (
                <li
                  key={sender}
                  style={{ marginBottom: '0.5rem', cursor: 'pointer', fontWeight: sender === selected ? 'bold' : 'normal' }}
                  onClick={() => setSelected(sender)}
                >
                  {sender}
                </li>
              ))}
            </ul>
          </aside>

          <section style={{ flex: 1 }}>
            {selected ? (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>💬 Messages from {selected}</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {grouped[selected].map(msg => (
                    <li key={msg.id} style={{ marginBottom: '1rem', background: '#f5f5f5', padding: '0.5rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>{msg.content}</div>
                      <small style={{ color: '#555' }}>{new Date(msg.created_at).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Select a sender to view messages.</p>
            )}
          </section>
        </div>
      )}

      <p style={{ marginTop: '2rem' }}>
        ⬅️ <Link href="/">Back to SMS Blast</Link>
      </p>
    </main>
  )
}
