// pages/templates.js – Manage SMS Templates

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: false })
      setTemplates(data || [])
    }
    fetchTemplates()
  }, [])

  const createTemplate = async () => {
    if (!name || !content) return
    const { data, error } = await supabase.from('message_templates').insert([
      { name, content, media_url: mediaUrl }
    ])
    if (!error) {
      setTemplates([...(data || []), ...templates])
      setName('')
      setContent('')
      setMediaUrl('')
    } else {
      alert('Failed to save template.')
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h2>📋 Manage Templates</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <textarea
          placeholder="Message Content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <input
          placeholder="Optional Media URL (image or PDF)"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <button onClick={createTemplate}>Save Template</button>
      </div>

      <h3>📑 Saved Templates</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {templates.map((t) => (
          <li key={t.id} style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
            <strong>{t.name}</strong>
            <p>{t.content}</p>
            {t.media_url && (
              <>
                <p><a href={t.media_url} target="_blank" rel="noreferrer">View Media</a></p>
                {t.media_url.match(/\.(jpg|jpeg|png|gif)$/i) && (
                  <img src={t.media_url} alt="media preview" style={{ maxWidth: 200 }} />
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
