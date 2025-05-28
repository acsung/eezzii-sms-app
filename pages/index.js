// eezzii-sms-app: Enhanced SMS blast tool with timestamp + auto-refresh

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhd2d5eXd3c3lrZm5jb3NrampwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjEzMTMsImV4cCI6MjA2MzkzNzMxM30.nV7_dMGdVZt-Qm5g2Augq6Q-xmFsTzs1ZJx3TG58PJE'
)

export default function App() {
  const [phoneNumbers, setPhoneNumbers] = useState('')
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState([])
  const [sending, setSending] = useState(false)
  const [numberCount, setNumberCount] = useState(0)

  const parseNumbers = (raw) => {
    return raw
      .split(/\n|,/)
      .map(p => p.trim())
      .filter(p => p)
  }

  const sendSMS = async () => {
    const phones = parseNumbers(phoneNumbers)
    if (phones.length === 0 || !message.trim()) {
      alert('Please enter at least one phone number and a message.')
      return
    }

    setSending(true)
    for (const number of phones) {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: number, body: message }),
      })
      const data = await res.json()

      await supabase.from('messages').insert({
        recipient: number,
        content: message,
        status: data.status || 'sent',
      })
    }
    setSending(false)
    alert('Messages sent!')
  }

  const loadLogs = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    setLogs(data)
  }

  useEffect(() => {
    loadLogs()
    const interval = setInterval(loadLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setNumberCount(parseNumbers(phoneNumbers).length)
  }, [phoneNumbers])

  return (
    <main style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📢 EEZZZII SMS Blast Tool</h1>

      <textarea
        rows={4}
        placeholder="Paste phone numbers here (one per line or comma-separated)"
        value={phoneNumbers}
        onChange={e => setPhoneNumbers(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>📱 {numberCount} phone number(s) detected</div>

      <textarea
        rows={3}
        placeholder="Enter your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button onClick={sendSMS} disabled={sending} style={{ padding: '0.5rem 1rem' }}>
        {sending ? 'Sending...' : 'Send SMS'}
      </button>

      <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '2rem', marginBottom: '0.5rem' }}>Recent Messages</h2>
      <ul style={{ fontSize: '0.9rem', listStyle: 'none', padding: 0 }}>
        {logs.map(log => (
          <li key={log.id}>
            ✅ {log.recipient}: "{log.content}" ({log.status})<br />
            <small>{new Date(log.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </main>
  )
} 
