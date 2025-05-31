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

    fetchScheduled()
  }, [])

  const cancelMessage = async (id) => {
    if (!confirm('Are you sure you want to cancel this scheduled message?')) return
    await supabase.from('sms_logs').delete().eq('id', id)
    setScheduledMessages(prev => prev.filter(msg => msg.id !== id))
    setSelectedMessage(null)
  }

  const handleEdit = () => {
    setEditContent(selectedMessage.content)
    setEditTime(new Date(selectedMessage.scheduled_at).toISOString().slice(0, 16))
    setEditing(true)
  }

  const saveEdit = async () => {
    await supabase.from('sms_logs').update({
      content: editContent,
      scheduled_at: new Date(editTime).toISOString()
    }).eq('id', selectedMessage.id)

    setScheduledMessages(prev => prev.map(msg =>
      msg.id === selectedMessage.id
        ? { ...msg, content: editContent, scheduled_at: new Date(editTime).toISOString() }
        : msg
    ))
    setSelectedMessage(prev => ({ ...prev, content: editContent, scheduled_at: new Date(editTime).toISOString() }))
    setEditing(false)
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'sans-serif', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: 280,
        background: '#f4f4f4',
        borderRight: '1px solid #ccc',
        padding: 20,
        overflowY: 'auto'
      }}>
        <h3>🕒 Scheduled</h3>
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
            <div style={{ fontSize: '0.85em', color: '#555' }}>
              {new Date(msg.scheduled_at).toLocaleString()}
            </div>
            <div style={{
              fontSize: '0.85em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{msg.content}</div>
          </div>
        ))}
      </div>

      {/* Message Details */}
      <div style={{ flex: 1, padding: 30 }}>
        {selectedMessage ? (
          <>
            <h3>📨 Message Details</h3>
            <p><strong>Recipient:</strong> {selectedMessage.recipient}</p>
            <p><strong>Scheduled At:</strong> {new Date(selectedMessage.scheduled_at).toLocaleString()}</p>
            <p><strong>Template ID:</strong> {selectedMessage.template_id}</p>
            <p><strong>Status:</strong> {selectedMessage.status}</p>

            {editing ? (
              <>
                <div style={{ marginBottom: 10 }}>
                  <label><strong>Edit Content:</strong></label><br />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    style={{ width: '100%', fontFamily: 'monospace' }}
                  />
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
                <button
                  onClick={saveEdit}
                  style={{ marginRight: 10, padding: '8px 16px' }}
                >Save Changes</button>
                <button
                  onClick={() => setEditing(false)}
                  style={{ padding: '8px 16px', background: '#eee' }}
                >Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Message:</strong></p>
                <div style={{
                  whiteSpace: 'pre-wrap',
                  border: '1px solid #ccc',
                  background: '#f9f9f9',
                  padding: 15,
                  borderRadius: 4
                }}>
                  {selectedMessage.content}
                </div>
                <button
                  onClick={handleEdit}
                  style={{ marginTop: 20, marginRight: 10, padding: '10px 20px' }}
                >Edit Broadcast</button>
                <button
                  onClick={() => cancelMessage(selectedMessage.id)}
                  style={{ marginTop: 20, background: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >Cancel Broadcast</button>
              </>
            )}
          </>
        ) : (
          <p>Select a scheduled message from the left panel.</p>
        )}
      </div>
    </div>
  )
}
