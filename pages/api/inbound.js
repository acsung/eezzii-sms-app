import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import stringSimilarity from 'string-similarity'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { Body, From, Timestamp } = req.body

  const phone = From.replace(/\D/g, '').replace(/^1/, '') // normalize and strip leading 1

  if (!Body || !phone) {
    return res.status(400).json({ error: 'Missing Body or From' })
  }

  // Use provided timestamp from Twilio if available; fallback to server time
  const nowUTC = new Date().toISOString()
  const messageTimestamp = Timestamp || nowUTC

  // Extract name, avoiding your own name in results
  let extractedName = 'Unknown'
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Extract the sender's full name from this message, avoiding names being spoken *to*. For example, if the message says "Hi Alex", assume the sender is not Alex.`,
        },
        { role: 'user', content: Body },
      ],
    })

    extractedName = completion.choices[0]?.message?.content?.trim() || 'Unknown'
  } catch (err) {
    console.error('OpenAI error:', err.message)
  }

  // Check for existing contact
  const { data: existingContact } = await supabase
    .from('contacts')
    .select('*')
    .eq('phone', phone)
    .single()

  let contact_id = null

  if (!existingContact) {
    const { data: newContact, error: contactInsertError } = await supabase
      .from('contacts')
      .insert([
        {
          phone,
          name: extractedName,
          tag: 'auto_created',
          created_at: nowUTC,
        },
      ])
      .select()
      .single()

    if (contactInsertError) {
      console.error('❌ Contact insert error:', contactInsertError.message)
    }

    contact_id = newContact?.id || null
  } else {
    const similarity = stringSimilarity.compareTwoStrings(
      existingContact.name?.toLowerCase() || '',
      extractedName.toLowerCase()
    )

    if (similarity < 0.5 && extractedName !== 'Unknown') {
      const { data: altContact, error: altInsertError } = await supabase
        .from('contacts')
        .insert([
          {
            phone,
            name: extractedName,
            tag: 'possible_duplicate',
            created_at: nowUTC,
          },
        ])
        .select()
        .single()

      if (altInsertError) {
        console.error('❌ Duplicate insert error:', altInsertError.message)
      }

      contact_id = altContact?.id || null
    } else {
      contact_id = existingContact.id
    }
  }

  // Insert the message
  const { error: messageError } = await supabase.from('messages').insert([
    {
      content_text: Body,
      phone_number: phone,
      contact_id,
      status: 'received',
      direction: 'inbound',
      channel: 'sms',
      timestamp: messageTimestamp,
      created_at: nowUTC,
    },
  ])

  if (messageError) {
    console.error('❌ Message insert error:', messageError.message)
    return res.status(500).json({ error: 'Failed to log message' })
  }

  res.status(200).json({ success: true })
}
