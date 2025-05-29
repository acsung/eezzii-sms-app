// eezzii-sms-app: Enhanced SMS blast tool with templates + CSV + style polish

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhd2d5eXd3c3lrZm5jb3NrampwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjEzMTMsImV4cCI6MjA2MzkzNzMxM30.nV7_dMGdVZt-Qm5g2Augq6Q-xmFsTzs1ZJx3TG58PJE'
)

const templates = [
  'Hey! Just checking in — anything I can help you with this week?',
  '🏡 New inventory alert! Let me know if you’d like the latest list.',
  'Thanks again for stopping by — let me know if you’re still shopping!',
]

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
      try {
        const res = await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: number, message }),
        })

        const data = await res.json()


      } catch (err) {
        console.error('Failed to send message or log to Supabase:', err)
      }
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

  const handleFileUpload = (e) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      setPhoneNumbers(text)
    }
    reader.readAsText(e.target.files[0])
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>📢 EEZZZII SMS Blast Tool</h1>

      <textarea
        rows={4}
        placeholder="Paste phone numbers here (one per line or comma-separated)"
        value={phoneNumbers}
        onChange={e => setPhoneNumbers(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>📱 {numberCount} phone number(s) detected</div>

      <label style={{ fontSize: '0.9rem' }}>📄 Or import CSV:</label>{' '}
      <input type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ marginBottom: '1rem' }} />

      <select onChange={e => setMessage(e.target.value)} style={{ width: '100%', marginBottom: '0.5rem' }}>
        <option value="">💬 Choose a template...</option>
        {templates.map((t, i) => (
          <option key={i} value={t}>{t}</option>
        ))}
      </select>

      <textarea
        rows={3}
        placeholder="Enter your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button onClick={sendSMS} disabled={sending} style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none' }}>
        {sending ? 'Sending...' : 'Send SMS'}
      </button>

      <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '2rem', marginBottom: '0.5rem' }}>📜 Recent Messages</h2>
      <ul style={{ fontSize: '0.9rem', listStyle: 'none', padding: 0 }}>
        {logs.map(log => (
          <li key={log.id} style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>{log.recipient}</span>: "{log.content}"{' '}
            <span style={{ color: log.status === 'accepted' ? 'green' : log.status === 'failed' ? 'red' : '#666' }}>({log.status})</span>
            <br />
            <small>{new Date(log.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </main>
  )
}
