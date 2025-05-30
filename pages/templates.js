// pages/templates.js

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState('')
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editName, setEditName] = useState('')

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

  const deleteTemplate = async (id) => {
    if (confirm('Delete this template?')) {
      await supabase.from('message_templates').delete().eq('id', id)
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h2>📋 Message Templates</h2>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search templates..."
        style={{ width: '100%', marginBottom: 20 }}
      />

      <div style={{ maxHeight: 500, overflowY: 'auto' }}>
        {filteredTemplates.map((t) => (
          <div key={t.id} style={{ borderBottom: '1px solid #ddd', padding: 10 }}>
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

            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => {
                  setEditingTemplate(t)
                  setEditName(t.name)
                  setEditContent(t.content)
                }}
                style={{ marginRight: 10 }}
              >
                Edit
              </button>
              <button onClick={() => deleteTemplate(t.id)} style={{ color: 'red' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTemplate && (
        <div style={{ marginTop: 30, padding: 20, border: '1px solid #ccc', borderRadius: 6, background: '#fafafa' }}>
          <h4>Edit Template</h4>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Template Name"
            style={{ width: '100%', marginBottom: 10 }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={async () => {
                await supabase
                  .from('message_templates')
                  .update({ name: editName, content: editContent })
                  .eq('id', editingTemplate.id)

                setTemplates((prev) =>
                  prev.map((t) =>
                    t.id === editingTemplate.id
                      ? { ...t, name: editName, content: editContent }
                      : t
                  )
                )
                setEditingTemplate(null)
              }}
            >
              Save
            </button>
            <button onClick={() => setEditingTemplate(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
