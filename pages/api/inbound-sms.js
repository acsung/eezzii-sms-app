// pages/api/inbound-sms.js

import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai'
import twilio from 'twilio'

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Init OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// Init Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const { From, To, Body } = req.body
  const phone = From

  // Save inbound message to Supabase
  const { error: insertError } = await supabase.from('messages').insert([
    {
      direction: 'inbound',
      phone_number: phone,
      content: Body,
      timestamp: new Date().toISOString(),
      status: 'received',
    },
  ])

  if (insertError) {
    console.error('Error saving inbound:', insertError)
    return res.status(500).send('Failed to save message.')
  }

  // Lookup contact status
  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('status')
    .eq('phone', phone)
    .single()

  if (contactError || !contact) {
    res.setHeader('Content-Type', 'text/xml')
    return res.status(200).send(`<Response><Message>Thanks! We'll be in touch.</Message></Response>`)
  }

  const status = contact.status

  // Only auto-respond if status is warm or cold
  if (status === 'warm' || status === 'cold') {
    const prompt = `Reply to this lead's message in a friendly and helpful way. Keep it short and human. Lead message: "${Body}"`

    try {
      const aiResponse = await openai.createChatCompletion({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful real estate assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      })

      const replyText = aiResponse.data.choices[0].message.content.trim()

      // Send SMS back via Twilio
      await twilioClient.messages.create({
        from: To,
        to: phone,
        body: replyText,
      })

      /
