import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function SMSBlaster() {
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [tags, setTags] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [contacts, setContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState([])
  const [scheduledTime, setScheduledTime] = useState('')
  const [broadcastHours, setBroadcastHours] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase.from('message_templates').select('*').order('created_at', { ascending: false })
      setTemplates(data || [])
    }

    const fetchTags = async () => {
      const { data } = await supabase.from('contacts').select('tag').neq('tag', '').not('tag', 'is', null)
      const uniqueTags = [...new Set(data.map((d) => d.tag))]
      setTags(uniqueTags)
    }

    const fetchBroadcastHours = async () => {
      const { data } = await supabase.from('app_settings').select('*').eq('key', 'broadcast_hours').single()
      if (data?.value) {
        setBroadcastHours(JSON.parse(data.value))
      }
    }

    fetchTemplates()
    fetchTags()
    fetchBroadcastHours()
  }, [])

  useEffect(() => {
    const fetchContactsByTag = async () => {
      if (!selectedTag) return
      const { data } = await supabase.from('contacts').select('*').eq('tag', selectedTag)
      setContacts(data || [])
      setSelectedContacts(data.map(c => c.phone))
    }
    fetchContactsByTag()
  }, [selectedTag])

  const toggleContact = (phone) => {
    setSelectedContacts(prev =>
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    )
  }

  const sendMessages = async () => {
    if (!selectedTemplate || selectedContacts.length === 0) {
      alert('Select a template and at least one contact.')
      return
    }

    const template = templates.find(t => t.id === selectedTemplate)
    const scheduled = new Date(scheduledTime)

    const [startHour, endHour] = broadcastHours
      ? [broadcastHours.start, broadcastHours.end]
      : ['08:00', '20:00']
    const allowedDays = broadcastHours?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

    const [startH, startM] = startHour.split(':').map(Number)
    const [endH, endM] = endHour.split(':').map(Number)

    const scheduledH = scheduled.getHours()
    const scheduledM = scheduled.getMinutes()

    const withinTime =
      (scheduledH > startH || (scheduledH === startH && scheduledM >= startM)) &&
      (scheduledH < endH || (scheduledH === endH && scheduledM <= endM))

    const dayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const scheduledDay = dayAbbr[scheduled.getDay()]
    const withinDay = allowedDays.includes(scheduledDay)

    if (!withinDay) {
      alert(`Broadcasts are not allowed on ${scheduledDay}. Please choose another day.`)
      return
    }

    if (!withinTime) {
      alert(`Scheduled time is outside your broadcast window (${startHour}–${endHour})`)
      return
    }

    setSending(true)

    for (let phone of selectedContacts) {
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, message: template.content })
      })

      await supabase.from('sms_logs').insert({
        recipient: phone,
        content: template.content,
        status: 'scheduled',
        scheduled_at: scheduled.toISOString(),
        template_id: template.id
      })

      await new Promise(res => setTimeout(res, 500)) // Delay between sends
    }

    setMessage('Messages scheduled successfully.')
    setSending(false)
    setSelectedContacts([])
    setScheduledTime('')
    setSelectedTag('')
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h2>📨 EEZZZII SMS Blaster</h2>

      <div style={{ marginBottom: 15 }}>
        <label>Template:</label><br />
        <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} style={{ width: '100%' }}>
          <option value="">-- Select Template --</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Tag Group:</label><br />
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} style={{ width: '100%' }}>
          <option value="">-- Select Tag --</option>
          {tags.map((tag, idx) => (
            <option key={idx} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {contacts.length > 0 && (
        <div style={{ marginBottom: 15 }}>
          <h4>Recipients</h4>
          {contacts.map((c) => (
            <div key={c.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(c.phone)}
                  onChange={() => toggleContact(c.phone)}
                /> {c.phone} <small>({c.tag})</small>
              </label>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 15 }}>
        <label>Schedule Send Time:</label><br />
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <button onClick={sendMessages} disabled={sending}>
        {sending ? 'Sending...' : 'Send SMS Blast'}
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  )
}
