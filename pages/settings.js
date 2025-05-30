import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function SettingsPage() {
  const [startHour, setStartHour] = useState('09:00')
  const [endHour, setEndHour] = useState('19:00')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('app_settings').select('*').eq('key', 'broadcast_hours').single()
      if (data?.value) {
        const val = JSON.parse(data.value)
        setStartHour(val.start)
        setEndHour(val.end)
      }
    }
    fetchSettings()
  }, [])

  const saveSettings = async () => {
    setLoading(true)
    const value = JSON.stringify({ start: startHour, end: endHour })
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: 'broadcast_hours', value })
    if (error) {
      setMessage('Failed to save')
      console.error(error)
    } else {
      setMessage('Broadcast window saved')
    }
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h2>⚙️ Settings</h2>

      <div style={{ marginBottom: 20 }}>
        <h4>📆 Broadcast Hours</h4>
        <p style={{ fontSize: '0.9em', marginBottom: 15 }}>
          📢 <strong>How SMS Blasts Work:</strong><br />
          When you schedule a blast, SMS messages are sent individually with a short delay (about 0.5 seconds) between each message.
          This avoids carrier filtering and ensures reliable delivery. If you're sending to 1,000 contacts,
          it may take roughly 8–10 minutes to complete the full blast.<br /><br />
          Choose a broadcast window that leaves enough time for all messages to be delivered
          before the end time.
        </p>

        <label>Start Time:</label>
        <input
          type="time"
          value={startHour}
          onChange={(e) => setStartHour(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <label>End Time:</label>
        <input
          type="time"
          value={endHour}
          onChange={(e) => setEndHour(e.target.value)}
        />
      </div>

      <button onClick={saveSettings} disabled={loading}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  )
}
