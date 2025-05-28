// pages/api/inbound.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY // set in Vercel dashboard
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const { From, Body } = req.body

  if (!From || !Body) {
    return res.status(400).send('Missing fields')
  }

  const { error } = await supabase.from('inbound_messages').insert([
    {
      sender: From,
      content: Body,
    },
  ])

  if (error) {
    console.error('Failed to insert message:', error)
    return res.status(500).send('Failed to insert message')
  }

  res.status(200).send('Message logged')
}
