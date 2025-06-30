// pages/inbox.js – EEZZZII Inbox View with Sidebar, Contact Threads, and Tag Management

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inbox() {
  const router = useRouter()
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [reply, setReply] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [templates, setTemplates] = useState([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [search, setSearch] = useState('')
  const [newTag, setNewTag] = useState('')
  const [availableTags, setAvailableTags] = useState([])

  useEffect(() => {
    const fetchContacts = async () => {
      const { data } = await supabase.from('contacts').select('*')
      setContacts(data || [])
    }
    fetchContacts()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedContact) return
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('contact_id', selectedContact.id)
        .order('created_at', { ascending: true })
      setMessages(data || [])
    }
    fetchMessages()
  }, [selectedContact])

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase.from('message_templates').select('*').order('created_at', { ascending: false })
      setTemplates(data || [])
    }
    fetchTemplates()
  }, [])

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from('tags').select('id, name')
      if (error) {
        console.error('Error fetching tags:', error)
      } else {
        setAvailableTags(data || [])
      }
    }
    fetchTags()
  }, [])

  const sendMessage = async () => {
    if (!reply.trim() || !selectedContact) return
    await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: selectedContact.phone, message: reply })
    })
    setReply('')
    setMessages((prev) => [...prev, {
      contact_id: selectedContact.id,
      content: reply,
      status: 'sent',
      created_at: new Date().toISOString(),
    }])
  }

  const applyTemplate = (t) => {
    setReply(t.content)
    setShowTemplates(false)
  }

  const handleTagUpdate = async () => {
    if (!selectedContact || !newTag.trim()) return

    const { data: existingTags, error: fetchError } = await supabase
      .from('tags')
      .select('*')
      .eq('name', newTag.trim()) // ✅ FIXED

    if (fetchError) {
      console.error('Error fetching tag:', fetchError)
      return
    }

    let tagId

    if (existingTags.length > 0) {
      tagId = existingTags[0].id
    } else {
      const { data: newTagData, error: insertError } = await supabase
        .from('tags')
        .insert([{ name: newTag.trim() }]) // ✅ FIXED
        .select()

      if (insertError) {
        console.error('Error creating new tag:', insertError)
        return
      }

      tagId = newTagData[0].id
    }

    const { error: updateError } = await supabase
      .from('contacts')
      .update({ tag_id: tagId })
      .eq('id', selectedContact.id)

    if (updateError) {
      console.error('Error updating contact tag:', updateError)
    } else {
      setContacts(contacts.map(c =>
        c.id === selectedContact.id ? { ...c, tag_id: tagId } : c
      ))
      setNewTag('')
    }
  }

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ position: 'fixed', top: 20, left: 20, zIndex: 10 }}>
        📋 Menu
      </button>

      {menuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: 250, height: '100%', background: '#f4f4f4', padding: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.2)', zIndex: 9 }}>
          <h3>📁 Navigation</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><button style={{ background: 'none', border: 'none', padding: 10 }} onClick={() => router.push('/')}>📤 SMS Blaster</button></li>
            <li><button style={{ background: 'none', border: 'none', padding: 10 }} disabled>📨 Inbox</button></li>
            <li><button style={{ background: 'none', border: 'none', padding: 10 }} onClick={() => router.push('/templates')}>📋 Templates</button></li>
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', marginLeft: menuOpen ? 270 : 20, padding: 20 }}>
        <div style={{ width: 250, marginRight: 20 }}>
          <h3>📇 Contacts</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {contacts.map((c) => (
              <li key={c.id} style={{ marginBottom: 10 }}>
                <button
                  onClick={() => setSelectedContact(c)}
                  style={{ background: selectedContact?.id === c.id ? '#cce5ff' : 'white', border: '1px solid #ccc', width: '100%', textAlign: 'left', padding: 8 }}>
                  {c.name || c.phone} <small>({c.tag || 'No tag'})</small>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h3>🧾 Messages</h3>
          {selectedContact ? (
            <>
              <div style={{ marginBottom: 10 }}>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  style={{ marginRight: 10 }}>
                  <option value=''>-- Select or type tag --</option>
                  {availableTags.map((tag) => (
                    <option key={tag.id} value={tag.name}>{tag.name}</option> // ✅ FIXED
                  ))}
                </select>
                <input
                  type='text'
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder='New tag...'
                  style={{ marginRight: 10 }}
                />
                <button onClick={handleTagUpdate}>Update Tag</button>
              </div>

              <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 10, border: '1px solid #eee', padding: 10 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <b>{m.status === 'received' ? selectedContact.name || selectedContact.phone : 'You'}:</b> {m.content || m.content_text}
                    <div style={{ fontSize: '0.8em', color: '#999' }}>
                      {new Date(new Date(m.created_at).getTime() - (5 * 60 * 60 * 1000)).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                style={{ width: '100%', marginBottom: 10 }}
                placeholder='Type a reply...'
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={sendMessage} style={{ flex: 1 }}>Send</button>
                <button onClick={() => setShowTemplates(true)} style={{ flex: 1 }}>📋 Templates</button>
              </div>
            </>
          ) : <p>Select a contact to view messages</p>}
        </div>
      </div>

      {showTemplates && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 20 }}>
          <div style={{ background: 'white', maxWidth: 600, margin: '10% auto', padding: 20, borderRadius: 8 }}>
            <h3>Select Template</h3>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...' style={{ width: '100%', marginBottom: 10 }} />
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {filteredTemplates.map((t) => (
                <div key={t.id} onClick={() => applyTemplate(t)} style={{ borderBottom: '1px solid #ddd', padding: 10, cursor: 'pointer' }}>
                  <strong>{t.name}</strong>
                  <p>{t.content}</p>
                  {t.media_url && (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={t.media_url}
                        alt="Template Media"
                        style={{ maxWidth: 120, maxHeight: 120, border: '1px solid #ddd', borderRadius: 4 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setShowTemplates(false)} style={{ marginTop: 10 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
