import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'

const supabase = createClient(
  'https://xawgyywwsykfncoskjjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhd2d5eXd3c3lrZm5jb3NrampwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjEzMTMsImV4cCI6MjA2MzkzNzMxM30.nV7_dMGdVZt-Qm5g2Augq6Q-xmFsTzs1ZJx3TG58PJE'
)

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

const client = twilio(accountSid, authToken)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, message } = req.body

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing "to" or "message" field.' })
  }

  try {
    const twilioRes = await client.messages.create({
      body: message,
      from: fromNumber,
      to
    })

    const { error } = await supabase.from('messages').insert([
      {
        recipient: to,
        content: message,
        status: 'sent',
        created_at: new Date().toISOString()
      }
    ])

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Message sent but logging failed' })
    }

    res.status(200).json({ success: true, sid: twilioRes.sid })
  } catch (err) {
    console.error('SMS send error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
}
