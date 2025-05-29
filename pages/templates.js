// pages/templates.js – Manage and Upload Templates

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Templates() {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [templates, setTemplates] = useState([])
  const [editingId, setEditingId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase.from('message_templates').select('*').order('created_at', { ascending: false })
      setTemplates(data || [])
    }
    fetchTemplates()
  }, [])

  const handleSave = async () => {
    let media_url = ''
    if (file) {
      const fileExt = file.name.split('.').pop()
      const filePath = `template_uploads/${uuidv4()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('template_uploads').upload(filePath, file)
      if (!uploadError) {
        const { data: publicUrl } = supabase.storage.from('template_uploads').getPublicUrl(filePath)
        media_url = publicUrl.publicUrl
      }
    }

    if (editingId) {
      await supabase.from('message_templates').update({ name, content, media_url }).eq('id', editingId)
    } else {
      await supabase.from('message_templates').insert([{ name, content, media_url }])
    }

    setName('')
    setContent('')
    setFile(null)
    setEditingId(null)

    const { data } = await supabase.from('message_templates').select('*').order('created_at', { ascending: false })
    setTemplates(data || [])
  }

  const handleEdit = (t) => {
    setName(t.name)
    setContent(t.content)
    setEditingId(t.id)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h2>📝 Manage Templates</h2>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Template name' style={{ width: '100%', marginBottom: 8 }} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder='Message content' style={{ width: '100%', marginBottom: 8 }} />
      <input type='file' onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: 8 }} />
      <button onClick={handleSave}>{editingId ? 'Update Template' : 'Save Template'}</button>

      <hr style={{ margin: '20px 0' }} />

      <h3>📂 Saved Templates</h3>
      {templates.map(t => (
        <div key={t.id} style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
          <strong>{t.name}</strong>
          <p>{t.content}</p>
          {t.media_url && (
            <a href={t.media_url} target='_blank' rel='noopener noreferrer'>📎 View Attachment</a>
          )}
          <br />
          <button onClick={() => handleEdit(t)} style={{ marginTop: 6 }}>Edit</button>
        </div>
      ))}
    </div>
  )
}
