import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Scheduled() {
  // [Full component logic as in last update...]
  // [Skipping re-inclusion of all logic for brevity...]

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
            <p><strong>Recipients:</strong> {selectedMessage.recipient.split(',').map(getNameForNumber).join(', ')}</p>
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
        ) : (
          <p>Select a scheduled message or click ➕ to create a new one.</p>
        )}
      </div>
    </div>
  )
}
