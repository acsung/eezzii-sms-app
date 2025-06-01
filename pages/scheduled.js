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
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    const fetchScheduled = async () => {
      const { data, error } = await supabase
        .from('sms_logs')
        .select('*')
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true })

      if (error) setError('Failed to load scheduled messages.')
      else setScheduledMessages(data || [])
      setLoading(false)
    }

    const fetchTemplates = async () => {
      const { data } = await supabase.from('message_templates').select('*')
      setTemplateOptions(data || [])
    }

    const fetchContacts = async () => {
      const { data } = await supabase.from('contacts').select('*')
      if (data) {
        setAllContacts(
          data.map(contact => ({
            ...contact,
            created_at: contact.created_at || new Date().toISOString()
          }))
        )
      }
    }

    fetchScheduled()
    fetchTemplates()
    fetchContacts()
  }, [])

  useEffect(() => {
    if (selectedTemplate && (!selectedMessage || !selectedMessage.id)) {
      const template = templateOptions.find(t => t.id === selectedTemplate)
      if (template) {
        setEditContent(template.content || '')
        setMediaUrl(template.media_url || '')
      }
    }
  }, [selectedTemplate])

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
    setEditContent(selectedMessage.content || '')
    setEditTime(new Date(selectedMessage.scheduled_at).toISOString().slice(0, 16))
    setEditRecipients(selectedMessage.recipient?.split(',').map(r => r.trim()) || [])
    setSelectedTemplate(selectedMessage.template_id || '')
    setMediaUrl(selectedMessage.media_url || '')
    setMediaFile(null)
    setFieldErrors({})
    setEditing(true)
  }

  const handleNewBroadcast = () => {
    const now = new Date().toISOString()
    setSelectedMessage({ id: null, content: '', scheduled_at: now, recipient: '', template_id: '', media_url: '' })
    setEditContent('')
    setEditTime(now.slice(0, 16))
    setEditRecipients([])
    setSelectedTemplate('')
    setMediaUrl('')
    setMediaFile(null)
    setFieldErrors({})
    setEditing(true)
  }

  const saveEdit = async () => {
    const newFieldErrors = {}
    const cleanedRecipients = editRecipients.filter(Boolean).map(r => r.trim())
    if (cleanedRecipients.length === 0) newFieldErrors.recipients = true
    if (!editTime) newFieldErrors.time = true
    if (!editContent.trim()) newFieldErrors.content = true

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      alert('Please fill all required fields.')
      return
    }

    try {
      let uploadedMediaUrl = mediaUrl
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error } = await supabase.storage.from('template-uploads').upload(fileName, mediaFile, {
          cacheControl: '3600', upsert: true
        })
        if (error) throw new Error('Media upload failed.')
        const { publicURL } = supabase.storage.from('template-uploads').getPublicUrl(fileName)
        uploadedMediaUrl = publicURL
      }

      const fields = {
        content: editContent,
        scheduled_at: new Date(editTime).toISOString(),
        recipient: cleanedRecipients.join(','),
        media_url: uploadedMediaUrl,
        status: 'scheduled'
      }
      if (selectedTemplate) fields.template_id = selectedTemplate

      if (selectedMessage.id) {
        const { error } = await supabase.from('sms_logs').update(fields).eq('id', selectedMessage.id)
        if (error) throw new Error('Update failed.')
        setScheduledMessages(prev => prev.map(msg => msg.id === selectedMessage.id ? { ...msg, ...fields } : msg))
      } else {
        const { data: inserted, error } = await supabase.from('sms_logs').insert(fields).select().single()
        if (error) throw new Error('Insert failed.')
        setScheduledMessages(prev => [...prev, inserted])
        setSelectedMessage(inserted)
      }

      setEditing(false)
    } catch (err) {
      console.error(err)
      alert('Failed to save message.')
    }
  }

  const toggleRecipient = (phone) => {
    setEditRecipients(prev =>
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    )
  }

  const filteredContacts = allContacts.filter(c => {
    const tagMatch = tagFilter ? c.tag && c.tag.toLowerCase().includes(tagFilter.toLowerCase()) : true
    const dateMatch = dateFilter ? new Date(c.created_at).getTime() >= new Date(dateFilter).setHours(0, 0, 0, 0) : true
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
            <div style={{ fontWeight: 'bold' }}>{msg.recipient.split(',').map(getNameForNumber).join(', ')}</div>
            <div style={{ fontSize: '0.85em', color: '#555' }}>{new Date(msg.scheduled_at).toLocaleString()}</div>
            <div style={{ fontSize: '0.85em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 30 }}>
        {/* Details rendering happens here */}
      </div>
    </div>
  )
}
