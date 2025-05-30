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
            onClick={() => setSelectedMessage(msg)}
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
              onClick={() => cancelMessage(selectedMessage.id)}
              style={{
                marginTop: 20,
                background: 'red',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Cancel Broadcast
            </button>
          </>
        ) : (
          <p>Select a scheduled message from the left panel.</p>
        )}
      </div>
    </div>
  )
}
