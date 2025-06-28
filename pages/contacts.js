// pages/contacts.js
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setContacts(data);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Contacts</h1>
      <div className="grid grid-cols-1 gap-2">
        {contacts.map((c) => (
          <div key={c.id} className="border p-2 rounded bg-white shadow">
            <div className="font-medium">{c.name || 'Unknown'}</div>
            <div className="text-sm text-gray-500">{c.phone}</div>
            <div className="text-xs italic text-blue-600">{c.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
