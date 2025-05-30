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
      } else {
        setBroadcastHours(false)
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

  const getBroadcastStatus = () => {
    if (broadcastHours === null) return null // Still loading
    if (!broadcastHours || !broadcastHours.start || !broadcastHours.end || !broadcastHours.days) {
      return {
        allowed: false,
        message: '⚠️ Broadcast hours are not configured. Please update your settings.'
      }
    }

    const now = new Date()
    const dayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = dayAbbr[now.getDay()]
    const allowedDays = broadcastHours.days
    const [startH, startM] = broadcastHours.start.split(':').map(Number)
    const [endH, endM] = broadcastHours.end.split(':').map(Number)
    const nowH = now.getHours()
    const nowM = now.getMinutes()

    const withinDay = allowedDays.includes(today)
    const withinTime =
      (nowH > startH || (nowH === startH && nowM >= startM)) &&
      (nowH < endH || (nowH === endH && nowM <= endM))

    return {
      allowed: withinDay && withinTime,
      message: withinDay && withinTime
        ? `✅ SMS blasts allowed right now (${today}, ${broadcastHours.start}–${broadcastHours.end})`
        : `⚠️ Blasts not allowed right now (${today}). Adjust your schedule or settings.`
    }
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

      {getBroadcastStatus() && (
        <div style={{
          background: getBroadcastStatus().allowed ? '#e6ffe6' : '#fff4f4',
          color: getBroadcastStatus().allowed ? 'green' : 'red',
          padding: '10px 15px',
          marginBottom: 15,
          border: '1px solid',
          borderColor: getBroadcastStatus().allowed ? '#90ee90' : '#f5a9a9',
          borderRadius: 6
        }}>
          {getBroadcastStatus().message}
        </div>
      )}

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

      {contact
      }
