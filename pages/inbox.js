import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  'YOUR_ANON_KEY_HERE'
)

export default function Inbox() {
  const [threads, setThreads] = useState({})

  useEffect(() => {
    const fetchReplies = async () => {
      const { data } = await supabase
        .from('inbound_messages')
        .select('*')
        .order('created_at', { ascending: false })

      const grouped = data.reduce((acc, msg) => {
        acc[msg.sender] = acc[msg.sender] || []
        acc[msg.sender].push(msg)
        return acc
      }, {})
      setThreads(grouped)
    }

    fetchReplies()
  }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📨 EEZZZII Inbox</h1>
      {Object.entries(threads).map(([sender, messages]) => (
        <div key={sender} style={{ marginBottom: '1.5rem' }}>
          <h3>{sender}</h3>
          <ul style={{ fontSize: '0.9rem', listStyle: 'none', paddingLeft: 0 }}>
            {messages.map((msg, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>
                <span>{msg.content}</span><br />
                <small>{new Date(msg.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  )
}
