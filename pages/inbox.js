// pages/inbox.js – EEZZZII Inbox with Tag Filters + Contact View + Import/Export + CSV Deduplication + Report + Field Mapping

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [contacts, setContacts] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)
  const [csvTag, setCsvTag] = useState('')
  const [importReport, setImportReport] = useState(null)
  const [csvHeaders, setCsvHeaders] = useState([])
  const [csvRows, setCsvRows] = useState([])
  const [mapping, setMapping] = useState({ phone: '', tag: '' })

  useEffect(() => {
    const fetchData = async () => {
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: contactData } = await supabase
        .from('contacts')
        .select('*')

      setMessages(msgData || [])
      setContacts(contactData || [])
    }
    fetchData()
  }, [])

  const tags = [...new Set(contacts.map(c => c.tag).filter(Boolean))]
  const filteredContacts = selectedTag
    ? contacts.filter(c => c.tag === selectedTag)
    : contacts

  const filteredMessages = selectedContact
    ? messages.filter(m => m.recipient === selectedContact.phone || m.sender === selectedContact.phone)
    : messages

  const handleFileLoad = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const text = await file.text()
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const rows = lines.slice(1).map(line => line.split(',').map(c => c.trim()))

    setCsvHeaders(headers)
    setCsvRows(rows)
  }

  const handleCsvImport = async () => {
    const phoneIndex = csvHeaders.indexOf(mapping.phone)
    if (phoneIndex === -1) return alert('Phone field mapping is required.')
    const tagIndex = csvHeaders.indexOf(mapping.tag)

    const incoming = csvRows.map(row => {
      return {
        phone: row[phoneIndex],
        tag: tagIndex >= 0 ? row[tagIndex] : (csvTag || null)
      }
    })

    const { data: existing } = await supabase.from('contacts').select('phone')
    const existingPhones = new Set((existing || []).map(c => c.phone))

    const toInsert = []
    const skipped = []

    for (let c of incoming) {
      if (!existingPhones.has(c.phone)) {
        toInsert.push(c)
      } else {
        skipped.push(c)
      }
    }

    let inserted = []
    if (toInsert.length > 0) {
      const { data, error } = await supabase.from('contacts').insert(toInsert)
      if (error) return alert('Error importing contacts.')
      inserted = data
    }

    setImportReport({ inserted, skipped })
    const { data: contactData } = await supabase.from('contacts').select('*')
    setContacts(contactData || [])
    setCsvHeaders([])
    setCsvRows([])
  }

  const handleExport = () => {
    const filtered = selectedTag ? contacts.filter(c => c.tag === selectedTag) : contacts
    const csv = filtered.map(c => `${c.phone},${c.tag || ''}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contacts_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', padding: 20, gap: 40, fontFamily: 'sans-serif' }}>
      <div style={{ width: '30%' }}>
        <h2>📁 Contact Filters</h2>
        <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag} style={{ width: '100%', marginBottom: 10 }}>
          <option value=''>-- View All Tags --</option>
          {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>

        <h3>👤 Contacts</h3>
        <ul>
          {filteredContacts.map(contact => (
            <li key={contact.id} onClick={() => setSelectedContact(contact)} style={{ cursor: 'pointer', marginBottom: 6 }}>
              {contact.phone} {contact.tag ? `(${contact.tag})` : ''}
            </li>
          ))}
        </ul>

        <hr />
        <h4>📤 Import Contacts CSV</h4>
        <input
          type='text'
          placeholder='Optional tag to assign'
          value={csvTag}
          onChange={(e) => setCsvTag(e.target.value)}
          style={{ width: '100%', marginBottom: 6 }}
        />
        <input type='file' accept='.csv,.txt' onChange={handleFileLoad} style={{ width: '100%' }} />

        {csvHeaders.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <label>📞 Map Phone Column:</label>
            <select onChange={e => setMapping(m => ({ ...m, phone: e.target.value }))} value={mapping.phone} style={{ width: '100%' }}>
              <option value=''>-- Select Column --</option>
              {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <label>🏷️ Map Tag Column:</label>
            <select onChange={e => setMapping(m => ({ ...m, tag: e.target.value }))} value={mapping.tag} style={{ width: '100%', marginBottom: 6 }}>
              <option value=''>-- None --</option>
              {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <button onClick={handleCsvImport} style={{ width: '100%' }}>Import Mapped Contacts</button>
          </div>
        )}

        {importReport && (
          <div style={{ marginTop: 10, fontSize: '0.9rem' }}>
            <strong>✅ Imported:</strong> {importReport.inserted.length}<br />
            <strong>⛔ Skipped (already exist):</strong> {importReport.skipped.length}<br />
            {importReport.skipped.length > 0 && (
              <details style={{ marginTop: 4 }}>
                <summary>View Skipped</summary>
                <ul style={{ paddingLeft: 20 }}>
                  {importReport.skipped.map(c => (
                    <li key={c.phone}>{c.phone} {c.tag && `(${c.tag})`}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <h4 style={{ marginTop: 20 }}>⬇️ Export</h4>
        <button onClick={handleExport} style={{ width: '100%' }}>Export Filtered Contacts</button>
      </div>

      <div style={{ width: '70%' }}>
        <h2>📨 Messages {selectedContact ? `for ${selectedContact.phone}` : ''}</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredMessages.map(m => (
            <li key={m.id} style={{ marginBottom: 10 }}>
              <b>{m.direction === 'inbound' ? m.sender : m.recipient}</b>: {m.content} <br />
              <small>{new Date(m.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
