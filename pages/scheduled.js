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
    setEditing(true)
  }

  const saveEdit = async () => {
    try {
      const cleanedRecipients = editRecipients.filter(Boolean).map(r => r.trim()).join(',')
      const isoTime = new Date(editTime).toISOString()
      if (!cleanedRecipients || !isoTime || !editContent.trim()) throw new Error('Missing required fields')

      let uploadedMediaUrl = mediaUrl
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data, error } = await supabase.storage.from('template-uploads').upload(fileName, mediaFile, {
          cacheControl: '3600',
          upsert: true
        })
        if (error) throw new Error('Media upload failed.')
        const { publicURL } = supabase.storage.from('template-uploads').getPublicUrl(fileName)
        uploadedMediaUrl = publicURL
      }

      const fields = {
        content: editContent,
        scheduled_at: isoTime,
        recipient: cleanedRecipients,
        template_id: selectedTemplate,
        media_url: uploadedMediaUrl
      }

      if (selectedMessage.id) {
        const { error } = await supabase.from('sms_logs').update(fields).eq('id', selectedMessage.id)
        if (error) throw new Error('Update failed.')
        setScheduledMessages(prev => prev.map(msg => msg.id === selectedMessage.id ? { ...msg, ...fields } : msg))
      } else {
        const { data: inserted, error } = await supabase.from('sms_logs').insert({ ...fields, status: 'scheduled' }).select().single()
        if (error) throw new Error('Failed to insert broadcast.')
        setScheduledMessages(prev => [...prev, inserted])
        setSelectedMessage(inserted)
      }

      setEditing(false)
    } catch (err) {
      console.error(err)
      alert('Failed to save message. Check required fields and try again.')
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
        {selectedMessage ? (
          <>
            <h3>📨 Message Details</h3>
            <p><strong>Status:</strong> Currently scheduled for {new Date(selectedMessage.scheduled_at).toLocaleString()}</p>

            {editing ? (
              <>
                <div style={{ marginBottom: 10 }}>
                  <label><strong>Filter by Tag:</strong></label><br />
                  <select
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    style={{ width: '100%', marginBottom: 10 }}
                  >
                    <option value="">-- All Tags --</option>
                    {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                  </select>

                  <label><strong>Filter by Created After:</strong></label><br />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{ width: '100%', marginBottom: 10 }}
                  />

                  <label><strong>Select Recipients:</strong></label><br />
                  <button onClick={() => setEditRecipients(filteredContacts.map(c => c.phone))} style={{ marginRight: 10 }}>Select All</button>
                  <button onClick={() => setEditRecipients([])}>Deselect All</button>

                  <div style={{ maxHeight: 200, overflowY: 'scroll', border: '1px solid #ccc', padding: 10, marginTop: 10 }}>
                    {filteredContacts.length > 0 ? filteredContacts.map(c => (
                      <div key={c.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={editRecipients.includes(c.phone)}
                            onChange={() => toggleRecipient(c.phone)}
                          /> {c.first_name || ''} {c.last_name || ''} ({c.phone}) <small>({c.tag})</small>
                        </label>
                      </div>
                    )) : <p>No contacts match the current filters.</p>}
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label><strong>Select Template (optional):</strong></label><br />
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">-- No Template --</option>
                    {templateOptions.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label><strong>Edit Content:</strong></label><br />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    style={{ width: '100%', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label><strong>Attachment (optional):</strong></label><br />
                  {mediaUrl && (
                    <div style={{ marginBottom: 10 }}>
                      <img src={mediaUrl} alt="Media Preview" style={{ maxHeight: 120 }} />
                      <div><button onClick={() => { setMediaUrl(''); setMediaFile(null); }}>Remove</button></div>
                    </div>
                  )}
                  <input type="file" onChange={(e) => setMediaFile(e.target.files[0])} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label><strong>Reschedule:</strong></label><br />
                  <input
                    type="datetime-local"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <button onClick={saveEdit} style={{ marginRight: 10, padding: '8px 16px' }}>Save Changes</button>
                <button onClick={() => setEditing(false)} style={{ padding: '8px 16px', background: '#eee' }}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Recipient(s):</strong> {selectedMessage.recipient.split(',').map(getNameForNumber).join(', ')}</p>
                <p><strong>Message:</strong></p>
                <div style={{ whiteSpace: 'pre-wrap', border: '1px solid #ccc', background: '#f9f9f9', padding: 15, borderRadius: 4 }}>{selectedMessage.content}</div>
                {selectedMessage.media_url && (
                  <div style={{ marginTop: 10 }}>
                    <img src={selectedMessage.media_url} alt="Attached Media" style={{ maxHeight: 150 }} />
                  </div>
                )}
                <button onClick={handleEdit} style={{ marginTop: 20, marginRight: 10, padding: '10px 20px' }}>Edit Broadcast</button>
                <button onClick={() => cancelMessage(selectedMessage.id)} style={{ marginTop: 20, background: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cancel Broadcast</button>
              </>
            )}
          </>
        ) : (
          <p>Select a scheduled message or click ➕ to create a new one.</p>
        )}
      </div>
    </div>
  )
}
