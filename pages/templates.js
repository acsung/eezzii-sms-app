// pages/templates.js – Template Manager Page

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TemplatesPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [templates, setTemplates] = useState([])
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    const { data } = await supabase.from('message_templates').select('*').order('created_at', { ascending: false })
    setTemplates(data || [])
  }

  const uploadFile = async (file) => {
    const path = `uploads/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('template-uploads').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })
    if (uploadError) {
      alert('Upload failed')
      return null
    }
    const { data: { publicUrl } } = supabase.storage.from('template-uploads').getPublicUrl(path)
    return publicUrl
  }

  const saveTemplate = async () => {
    let mediaUrl = ''
    if (file) {
      mediaUrl = await uploadFile(file)
    }
    if (editing) {
      await supabase.from('message_templates').update({ name, content, media_url: mediaUrl }).eq('id', editing)
    } else {
      await supabase.from('message_templates').insert([{ name, content, media_url: mediaUrl }])
    }
    setName('')
    setContent('')
    setFile(null)
    setEditing(null)
    fetchTemplates()
  }

  const handleEdit = (template) => {
    setName(template.name)
    setContent(template.content)
    setEditing(template.id)
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Sidebar toggle */}
      <button 
        onClick={() => router.push('/')} 
        style={{ position: 'fixed', top: 20, left: 20, zIndex: 10 }}>
        📋 Menu
      </button>

      <div style={{ marginLeft: 100, padding: 20 }}>
        <h2>📋 Manage Templates</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Template name' style={{ width: '100%' }} />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder='Message content' style={{ width: '100%', marginTop: 10 }} />
        <input type='file' onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: 10 }} />
        <button onClick={saveTemplate} style={{ marginTop: 10 }}>{editing ? 'Update Template' : 'Save Template'}</button>

        <h3 style={{ marginTop: 40 }}>📂 Saved Templates</h3>
        {templates.map((t) => (
          <div key={t.id} style={{ borderBottom: '1px solid #ddd', paddingBottom: 10, marginBottom: 10 }}>
            <h4>{t.name}</h4>
            <p>{t.content}</p>
            {t.media_url && <img src={t.media_url} alt='preview' style={{ maxWidth: 120, maxHeight: 120, border: '1px solid #ccc' }} />}
            <button onClick={() => handleEdit(t)} style={{ marginTop: 5 }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  )
}
