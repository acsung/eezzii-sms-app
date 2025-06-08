import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { subject, from, body } = req.body

  // Basic check
  if (!body) return res.status(400).send('No body provided')

  // Run extraction prompt
  const prompt = `
Extract lead info from this email and return JSON only:
- first_name
- last_name
- phone
- email
- timeframe
- own_rent
- is_agent
- source

EMAIL BODY:
${body}
  `.trim()

  const aiResponse = await openai.createChatCompletion({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Extract only valid JSON with those fields.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0
  })

  let lead = {}
  try {
    lead = JSON.parse(aiResponse.data.choices[0].message.content)
  } catch (e) {
    console.error('GPT parse failed:', aiResponse.data.choices[0].message.content)
    return res.status(500).send('Could not parse AI response')
  }

  // Create contact if we have phone or email
  if (lead.phone || lead.email) {
    await supabase.from('contacts').upsert({
      first_name: lead.first_name || null,
      last_name: lead.last_name || null,
      phone: lead.phone || null,
      email: lead.email || null,
      status: 'cold',
      source: lead.source || 'email-intake',
    }, { onConflict: ['phone'] })
  }

  // Log the email message
  await supabase.from('messages').insert([
    {
      phone_number: lead.phone || null,
      direction: 'inbound',
      content: body.slice(0, 2000),
      status: 'email-captured',
      timestamp: new Date().toISOString()
    }
  ])

  return res.status(200).json({ success: true, extracted: lead })
}
