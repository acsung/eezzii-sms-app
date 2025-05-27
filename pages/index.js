// eezzii-sms-app: Minimal SMS blast tool

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhd2d5eXd3c3lrZm5jb3NrampwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjEzMTMsImV4cCI6MjA2MzkzNzMxM30.nV7_dMGdVZt-Qm5g2Augq6Q-xmFsTzs1ZJx3TG58PJE'
)

export default function App() {
  const [phoneNumbers, setPhoneNumbers] = useState('')
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState([])
  const [sending, setSending] = useState(false)

  const sendSMS = async () => {
    const phones = phoneNumbers
      .split(/\n|,/)
      .map(p => p.trim())
      .filter(p => p)

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

  useEffect(() => {
    const loadLogs = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      setLogs(data)
    }
    loadLogs()
  }, [])

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📢 EEZZZII SMS Blast Tool</h1>
      <Textarea
        rows={4}
        placeholder="Paste phone numbers here (one per line or comma-separated)"
        value={phoneNumbers}
        onChange={e => setPhoneNumbers(e.target.value)}
        className="mb-4"
      />
      <Textarea
        rows={3}
        placeholder="Enter your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="mb-4"
      />
      <Button onClick={sendSMS} disabled={sending}>
        {sending ? 'Sending...' : 'Send SMS'}
      </Button>

      <h2 className="text-lg font-semibold mt-8 mb-2">Recent Messages</h2>
      <ul className="space-y-1 text-sm">
        {logs.map(log => (
          <li key={log.id}>
            ✅ {log.recipient}: "{log.content}" ({log.status})
          </li>
        ))}
      </ul>
    </main>
  )
}
