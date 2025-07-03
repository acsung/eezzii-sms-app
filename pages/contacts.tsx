import { useState } from 'react';
import Layout from '../components/Layout';

const mockContacts = [
  { id: 1, name: 'John Doe', phone: '+1 (555) 123-4567', tags: ['prospect'] },
  { id: 2, name: 'Jane Smith', phone: '+1 (555) 987-6543', tags: ['realtor', 'hot'] },
  { id: 3, name: 'Alex Lee', phone: '+1 (555) 111-2222', tags: [] },
];

export default function Contacts() {
  const [selectedContact, setSelectedContact] = useState<any>(mockContacts[0]);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Contact List */}
        <div className="w-1/3 border-r overflow-y-auto bg-white dark:bg-gray-900">
          <h2 className="text-lg font-bold p-4 border-b">Contacts</h2>
          <ul>
            {mockContacts.map((contact) => (
              <li
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedContact?.id === contact.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
              >
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-500">{contact.phone}</div>
                <div className="text-xs mt-1 space-x-1">
                  {contact.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] dark:bg-green-800 dark:text-green-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Detail */}
        <div className="w-2/3 p-6 overflow-y-auto">
          {selectedContact ? (
            <div>
              <h2 className="text-2xl font-bold">{selectedContact.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{selectedContact.phone}</p>
              <div className="space-x-2 mb-4">
                {selectedContact.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Send Message</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Edit Contact</button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">Select a contact to view details</div>
          )}
        </div>
      </div>
    </Layout>
  );
}