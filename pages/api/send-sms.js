// pages/api/send-sms.js
import { Twilio } from 'twilio'
import { createClient } from '@supabase/supabase-js'

// Initialize Twilio
const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Initialize Supabase
const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const { to, message } = req.body

  if (!to || !message) {
    return res.status(400).send('Missing fields')
  }

  // 🔍 Debug Logging
  console.log('🔥 Attempting to send SMS')
  console.log('To:', to)
  console.log('Message:', message)
  console.log('From:', process.env.TWILIO_PHONE_NUMBER)

  try {
    const sent = await client.messages.create({
  body: message,
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
  to: to,
})


    console.log('✅ Twilio message SID:', sent.sid)

    // Lookup contact by phone
    const { data: contact, error: lookupError } = await supabase
      .from('contacts')
      .select('id')
      .eq('phone', to)
      .single()

    let contactId = null
    if (contact) {
      contactId = contact.id
    }

    // Log to Supabase
    const { error: insertError } = await supabase.from('messages').insert([
      {
        content: message,
        recipient: to,
        direction: 'outbound',
        contact_id: contactId,
        channel: 'sms',
        status: 'sent',
        created_at: new Date(),
      },
    ])

    if (insertError) {
      console.error('❌ Failed to log outbound message:', insertError)
    } else {
      console.log('✅ Message logged to Supabase')
    }

    return res.status(200).json({ success: true, sid: sent.sid })
  } catch (err) {
    console.error('❌ SMS sending failed:', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
