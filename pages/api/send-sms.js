// pages/api/send-sms.js

import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, message } = req.body

  try {
    // Send SMS
    const response = await client.messages.create({
      to,
      from: process.env.TWILIO_MESSAGING_SERVICE_SID,
      body: message
    })

    // Log to Supabase
    await supabase.from('messages').insert([
      {
        recipient: to,
        content: message,
        status: 'sent',
        direction: 'outbound'
      }
    ])

    res.status(200).json({ success: true, sid: response.sid })
  } catch (err) {
    console.error('SMS Send Error:', err.message)

    await supabase.from('messages').insert([
      {
        recipient: to,
        content: message,
        status: 'failed',
        direction: 'outbound'
      }
    ])

    res.status(500).json({ success: false, error: err.message })
  }
}
