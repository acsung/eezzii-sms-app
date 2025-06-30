import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagSelections, setTagSelections] = useState({});

  useEffect(() => {
    fetchContacts();
    fetchTags();
  }, []);

  async function fetchContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*, tags (id, label)')
      .order('created_at', { ascending: false });

    if (!error) setContacts(data);
    else console.error(error);
  }

  async function fetchTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('label', { ascending: true });

    if (!error) setAvailableTags(data);
    else console.error(error);
  }

  async function updateContactTag(contactId, tagId) {
    const { error } = await supabase
      .from('contacts')
      .update({ tag_id: tagId })
      .eq('id', contactId);

    if (error) {
      console.error('Error updating tag:', error);
    } else {
      fetchContacts(); // Refresh after update
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="border p-4 rounded shadow bg-white hover:bg-gray-50"
          >
            <div className="text-lg font-semibold">
              {contact.name || '(No Name)'}
            </div>
            <div className="text-gray-600">{contact.phone}</div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag: <span className="italic text-blue-600">{contact.tags?.label || '—'}</span>
              </label>
              <select
                value={tagSelections[contact.id] || ''}
                onChange={(e) => {
                  const newTagId = e.target.value;
                  setTagSelections({ ...tagSelections, [contact.id]: newTagId });
                  updateContactTag(contact.id, newTagId);
                }}
                className="border p-1 rounded w-full"
              >
                <option value="">— Select Tag —</option>
                {availableTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
