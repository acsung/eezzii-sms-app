import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/components/Layout'
import { Loader2, User, Phone, Mail, XCircle } from 'lucide-react'
import Link from 'next/link'

type Contact = {
  id: string
  first_name: string
  last_name: string
  phone: string
  email: string
  contact_tag_id: string
}

export default function TagContactsPage() {
  const router = useRouter()
  const { id } = router.query

  const [contacts, setContacts] = useState<Contact[]>([])
  const [tagName, setTagName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchTagContacts(id as string)
  }, [id])

  const fetchTagContacts = async (tagId: string) => {
    setLoading(true)

    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select('name')
      .eq('id', tagId)
      .single()

    if (tagError) {
      console.error('Error fetching tag name:', tagError.message)
    } else {
      setTagName(tagData.name)
    }

    const { data: contactsData, error } = await supabase
      .from('contact_tags')
      .select('id, contacts(id, first_name, last_name, phone, email)')
      .eq('tag_id', tagId)

    if (error) {
      console.error('Error fetching contacts:', error.message)
    } else {
      const flattened = contactsData.map((row: any) => ({
        ...row.contacts,
        contact_tag_id: row.id,
      }))
      setContacts(flattened)
    }

    setLoading(false)
  }

  const removeContactFromTag = async (contactTagId: string) => {
    const { error } = await supabase
      .from('contact_tags')
      .delete()
      .eq('id', contactTagId)

    if (error) {
      console.error('Error removing contact from tag:', error.message)
    } else {
      setContacts((prev) =>
        prev.filter((c) => c.contact_tag_id !== contactTagId)
      )
    }
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Contacts in Tag: <span className="text-blue-600">{tagName}</span>
          </h1>
          <Link href="/tags" className="text-sm text-gray-600 hover:underline">
            ← Back to Tags
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10 text-gray-500">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Loading contacts...
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-gray-500">No contacts found for this tag.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="bg-white rounded-2xl shadow p-5 border relative"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  <User className="inline-block w-5 h-5 mr-2 text-blue-600" />
                  {contact.first_name} {contact.last_name}
                </h2>
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {contact.phone || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {contact.email || 'N/A'}
                </p>
                <button
                  onClick={() => removeContactFromTag(contact.contact_tag_id)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                  title="Remove from Tag"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  )
}