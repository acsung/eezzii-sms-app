// pages/api/inbound-sms.js

import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai'
import twilio from 'twilio'

// Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// OpenAI
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}))

// Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { From, To, Body } = req.body
  const phone = From.trim()

  // Step 1: Log inbound message
  await supabase.from('messages').insert([
    {
      direction: 'inbound',
      phone_number: phone,
      content: Body,
      timestamp: new Date().toISOString(),
      status: 'received',
    },
  ])

  // Step 2: Check for existing contact
  const { data: contact } = await supabase
    .from('contacts')
    .select('*')
    .eq('phone', phone)
    .single()

  // Step 3: If contact is warm or cold, skip intro
  if (contact && ['warm', 'cold'].includes(contact.status)) {
    res.setHeader('Content-Type', 'text/xml')
    return res.status(200).send('<Response></Response>')
  }

  // Step 4: Lookup or start conversation state
  const { data: convo } = await supabase
    .from('conversation_state')
    .select('*')
    .eq('phone_number', phone)
    .single()

  const prompt = `
Extract any of the following fields from this user's message. Return only JSON:
- first_name
- last_name
- is_agent (true/false)
- timeframe (e.g. "this fall", "next year")
- own_rent ("own" or "rent")
- email
- source (how they found us)

Message: "${Body}"
`

  const aiResponse = await openai.createChatCompletion({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Extract fields only. Return valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0,
  })

  // TEMP: Log GPT output to Supabase (sms_logs table)
  await supabase.from('sms_logs').insert([
    {
      phone: phone,
      content: aiResponse.data.choices[0].message.content,
      direction: 'debug',
      timestamp: new Date().toISOString(),
    },
  ])

  let extracted = {}
  try {
    const gptRaw = aiResponse.data.choices[0].message.content
    const jsonStart = gptRaw.indexOf('{')
    const jsonEnd = gptRaw.lastIndexOf('}') + 1
    const jsonString = gptRaw.slice(jsonStart, jsonEnd)
    extracted = JSON.parse(jsonString)
  } catch (e) {
    console.error('Failed to parse GPT response:', aiResponse.data.choices[0].message.content)
  }

  // Step 5: Upsert contact if we have first_name
  if (extracted.first_name) {
    await supabase.from('contacts').upsert(
      {
        phone,
        first_name: extracted.first_name,
        last_name: extracted.last_name || null,
        email: extracted.email || null,
        status: 'cold',
      },
      { onConflict: ['phone'] }
    )
  }

  // Step 6: Update conversation_state
  const partial = convo?.partial_data || {}
  const updated = { ...partial, ...extracted }

  await supabase.from('conversation_state').upsert({
    phone_number: phone,
    current_step: 'awaiting_response',
    partial_data: updated,
    last_updated: new Date().toISOString(),
  })

  // Step 7: Compose follow-up
  const needs = []
  if (!updated.first_name) needs.push("What's your first name?")
  else if (updated.is_agent === undefined) needs.push('Are you a real estate professional or agent?')
  else if (!updated.timeframe) needs.push("When are you looking to move?")
  else if (!updated.own_rent) needs.push("Do you currently rent or own your home?")
  else if (!updated.email) needs.push("What’s the best email to reach you at?")
  else if (!updated.last_name) needs.push("And what’s your last name?")
  else if (!updated.source) needs.push("How did you hear about us?")

  const reply = needs.length > 0
    ? needs[0]
    : "Thanks so much! That’s all I need for now — I’ll be in touch shortly."

  // Step 8: Send reply
  await twilioClient.messages.create({
    from: To,
    to: phone,
    body: reply,
  })

  res.setHeader('Content-Type', 'text/xml')
  return res.status(200).send('<Response></Response>')
}
