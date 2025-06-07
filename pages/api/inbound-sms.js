// pages/api/inbound-sms.js

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const { From, To, Body } = req.body

  // Save incoming SMS to Supabase
  const { error } = await supabase.from('messages').insert([
    {
      direction: 'inbound',
      phone_number: From,
      content: Body,
      timestamp: new Date().toISOString(),
      status: 'received'
    }
  ])

  if (error) {
    console.error('Error saving to Supabase:', error)
    return res.status(500).send('Failed to save message.')
  }

  // Optional: auto-reply to user
  const twiml = `<Response><Message>Thanks for your message! We'll get back to you shortly.</Message></Response>`

  res.setHeader('Content-Type', 'text/xml')
  res.status(200).send(twiml)
}
