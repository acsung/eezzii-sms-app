import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/components/Layout'
import { Loader2, Tag as TagIcon, Users } from 'lucide-react'
import Link from 'next/link'

type Tag = {
  id: string
  name: string
  contact_count: number
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('get_tags_with_contact_counts')
    if (error) {
      console.error('Error fetching tags:', error.message)
    } else {
      setTags(data)
    }
    setLoading(false)
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TagIcon className="w-6 h-6 text-blue-600" />
          Tags
        </h1>

        {loading ? (
          <div className="flex justify-center py-10 text-gray-500">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Loading tags...
          </div>
        ) : tags.length === 0 ? (
          <div className="text-gray-500">No tags found.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="bg-white rounded-2xl shadow p-5 border hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {tag.name}
                  </h2>
                  <Link
                    href={`/tags/${tag.id}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Contacts
                  </Link>
                </div>
                <div className="mt-2 flex items-center gap-2 text-gray-600 text-sm">
                  <Users className="w-4 h-4" />
                  {tag.contact_count} contact
                  {tag.contact_count === 1 ? '' : 's'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  )
}