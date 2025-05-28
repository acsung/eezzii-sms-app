import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  'YOUR_ANON_KEY_HERE' // Use same anon key
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { From, Body } = req.body
    await supabase.from('inbound_messages').insert({
      sender: From,
      content: Body
    })
    res.status(200).send('OK')
  } else {
    res.status(405).send('Method Not Allowed')
  }
}
