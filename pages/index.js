// pages/index.js – EEZZZII SMS Blaster Page with Navigation Dropdown

import { useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function SMSBlaster() {
  const router = useRouter()
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const sendMessage = async () => {
    setStatus('Sending...')
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message })
    })

    if (res.ok) {
      setStatus('✅ Message sent!')
      setTo('')
      setMessage('')
    } else {
      setStatus('❌ Failed to send message.')
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <nav style={{ marginBottom: 20 }}>
        <select onChange={(e) => router.push(e.target.value)} style={{ padding: 6 }}>
          <option value='/' disabled selected>📂 Navigate</option>
          <option value='/'>🔁 Go to SMS Blaster</option>
          <option value='/inbox'>📨 Inbox</option>
        </select>
      </nav>

      <h1>📤 EEZZZII SMS Blaster</h1>
      <div style={{ maxWidth: 400 }}>
        <label>Phone Number:</label>
        <input
          type='text'
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder='+1234567890'
          style={{ width: '100%', marginBottom: 10 }}
        />
        <label>Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button onClick={sendMessage} style={{ width: '100%' }}>
          Send SMS
        </button>
        {status && <p style={{ marginTop: 10 }}>{status}</p>}
      </div>
    </div>
  )
}
