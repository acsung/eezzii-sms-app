import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Scheduled() {
  const [scheduledMessages, setScheduledMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editRecipients, setEditRecipients] = useState([])
  const [allContacts, setAllContacts] = useState([])
  const [templateOptions, setTemplateOptions] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaFile, setMediaFile] = useState(null)

  useEffect(() => {
    const fetchScheduled = async () => {
      const { data, error } = await supabase
        .from('sms_logs')
        .select('*')
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true })

      if (error) {
        setError('Failed to load scheduled messages.')
      } else {
        setScheduledMessages(data || [])
      }
      setLoading(false)
    }

    const fetchTemplates = async () => {
      const { data } = await supabase.from('message_templates').select('*')
      setTemplateOptions(data || [])
    }

    const fetchContacts = async () => {
      const { data } = await supabase.from('contacts').select('*')
      setAllContacts(data || [])
    }

    fetchScheduled()
    fetchTemplates()
    fetchContacts()
  }, [])

  const getNameForNumber = (phone) => {
    const contact = allContacts.find(c => c.phone === phone)
    return contact ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || phone : phone
  }

  const cancelMessage = async (id) => {
    if (!confirm('Are you sure you want to cancel this scheduled message?')) return
    await supabase.from('sms_logs').delete().eq('id', id)
    setScheduledMessages(prev => prev.filter(msg => msg.id !== id))
    setSelectedMessage(null)
  }

  const handleEdit = () => {
    setEditContent(selectedMessage.content)
    setEditTime(new Date(selectedMessage.scheduled_at).toISOString().slice(0, 16))
    setEditRecipients(selectedMessage.recipient.split(','))
    setSelectedTemplate(selectedMessage.template_id || '')
    setMediaUrl(selectedMessage.media_url || '')
    setEditing(true)
  }

  const handleNewBroadcast = () => {
    setSelectedMessage({ id: null, content: '', scheduled_at: new Date().toISOString(), recipient: '', template_id: '', media_url: '' })
    setEditContent('')
    setEditTime(new Date().toISOString().slice(0, 16))
    setEditRecipients([])
    setSelectedTemplate('')
    setMediaUrl('')
    setMediaFile(null)
    setEditing(true)
  }

  const saveEdit = async () => {
    let uploadedMediaUrl = mediaUrl

    if (mediaFile) {
      const fileExt = mediaFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data } = await supabase.storage.from('template-uploads').upload(fileName, mediaFile, {
        cacheControl: '3600',
        upsert: true
      })
      if (data) {
        const { publicURL } = supabase.storage.from('template-uploads').getPublicUrl(fileName)
        uploadedMediaUrl = publicURL
      }
    }

    const cleanedRecipients = editRecipients.filter(r => r.trim()).join(',')

    if (selectedMessage.id) {
      await supabase.from('sms_logs').update({
        content: editContent,
        scheduled_at: new Date(editTime).toISOString(),
        recipient: cleanedRecipients,
        template_id: selectedTemplate,
        media_url: uploadedMediaUrl
      }).eq('id', selectedMessage.id)

      setScheduledMessages(prev => prev.map(msg =>
        msg.id === selectedMessage.id
          ? { ...msg, content: editContent, scheduled_at: new Date(editTime).toISOString(), recipient: cleanedRecipients, template_id: selectedTemplate, media_url: uploadedMediaUrl }
          : msg
      ))
    } else {
      const { data: inserted } = await supabase.from('sms_logs').insert({
        content: editContent,
        scheduled_at: new Date(editTime).toISOString(),
        recipient: cleanedRecipients,
        status: 'scheduled',
        template_id: selectedTemplate,
        media_url: uploadedMediaUrl
      }).select().single()

      setScheduledMessages(prev => [...prev, inserted])
      setSelectedMessage(inserted)
    }

    setEditing(false)
  }

  const toggleRecipient = (phone) => {
    setEditRecipients(prev =>
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    )
  }

  const filteredContacts = allContacts.filter(c => {
    const tagMatch = tagFilter ? c.tag && c.tag.toLowerCase().includes(tagFilter.toLowerCase()) : true
    const dateMatch = dateFilter ? new Date(c.created_at) >= new Date(dateFilter) : true
    return tagMatch && dateMatch
  })

  const allTags = [...new Set(allContacts.map(c => c.tag).filter(Boolean))]

  return (
    <div style={{ display: 'flex', fontFamily: 'sans-serif', height: '100vh' }}>
      <div style={{ width: 280, background: '#f4f4f4', borderRight: '1px solid #ccc', padding: 20, overflowY: 'auto' }}>
        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          🕒 Scheduled
          <button onClick={handleNewBroadcast} style={{ fontSize: '1.2em', padding: '2px 8px' }}>＋</button>
        </h3>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && scheduledMessages.length === 0 && <p>No scheduled messages.</p>}
        {scheduledMessages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => { setSelectedMessage(msg); setEditing(false); }}
            style={{
              background: selectedMessage?.id === msg.id ? '#d0ebff' : 'white',
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: 10,
              marginBottom: 10,
              cursor: 'pointer'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{msg.recipient}</div>
            <div style={{ fontSize: '0.85em', color: '#555' }}>{new Date(msg.scheduled_at).toLocaleString()}</div>
            <div style={{ fontSize: '0.85em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 30 }}>
        {/* existing message detail logic remains unchanged */}
