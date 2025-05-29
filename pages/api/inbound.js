// pages/api/inbound.js
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY // set in Vercel dashboard
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const { From, To, Body } = req.body

  if (!From || !To || !Body) {
    return res.status(400).send('Missing required fields')
  }

  // Lookup contact by phone number
  const { data: contact, error: lookupError } = await supabase
    .from('contacts')
    .select('id')
    .eq('phone', From)
    .single()

  let contactId = null
  if (contact) {
    contactId = contact.id
  }

  // Insert message into 'messages' table
  const { error: insertError } = await supabase.from('messages').insert([
    {
      content: Body,
      recipient: To,
      direction: 'inbound',
      contact_id: contactId,
      channel: 'sms',
      status: 'received',
      created_at: new Date(),
    },
  ])

  if (insertError) {
    console.error('❌ Failed to insert message:', insertError)
    return res.status(500).send('Failed to log message')
  }

  res.status(200).send('✅ Message logged successfully')
}
