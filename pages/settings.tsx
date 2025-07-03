import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function SettingsPage() {
  const [startHour, setStartHour] = useState('09:00')
  const [endHour, setEndHour] = useState('19:00')
  const [allowedDays, setAllowedDays] = useState(allDays)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('app_settings').select('*').eq('key', 'broadcast_hours').single()
      if (data?.value) {
        const val = JSON.parse(data.value)
        setStartHour(val.start)
        setEndHour(val.end)
        setAllowedDays(val.days || allDays)
      }
    }
    fetchSettings()
  }, [])

  const toggleDay = (day) => {
    setAllowedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const saveSettings = async () => {
    setLoading(true)
    const value = JSON.stringify({
      start: startHour,
      end: endHour,
      days: allowedDays
    })
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
          When you schedule a blast, SMS messages are sent individually with a short delay (~0.5 seconds).
          If you're sending to 1,000 contacts, it may take about 8–10 minutes to finish.<br /><br />
          Choose the hours and days you want to allow outgoing blasts.
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

      <div style={{ marginBottom: 20 }}>
        <label><strong>Allowed Days:</strong></label>
        <div style={{ display: 'flex', gap: 15, marginTop: 10, flexWrap: 'wrap' }}>
          {allDays.map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={allowedDays.includes(day)}
                onChange={() => toggleDay(day)}
              /> {day}
            </label>
          ))}
        </div>
      </div>

      <button onClick={saveSettings} disabled={loading}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  )
}
