// pages/index.js – EEZZZII SMS Blaster Page with Sidebar Navigation

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
  const [menuOpen, setMenuOpen] = useState(false)

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
            <li><button style={{ background: 'none', border: 'none', padding: 10 }} onClick={() => router.push('/inbox')}>📨 Inbox</button></li>
          </ul>
        </div>
      )}

      {/* Main content */}
      <div style={{ padding: '60px 20px 20px 20px', marginLeft: menuOpen ? 270 : 20 }}>
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
    </div>
  )
}
