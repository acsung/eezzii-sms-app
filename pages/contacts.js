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
    else console.error(error);
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
            <div className="text-sm italic text-blue-500">
              {contact.tag || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
