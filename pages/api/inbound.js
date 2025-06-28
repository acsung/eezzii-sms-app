import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { Body, From } = req.body;

  // Look up contact
  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('id')
    .eq('phone_number', From)
    .single();

  let contact_id = null;
  if (contact && contact.id) {
    contact_id = contact.id;
  }

  const { data, error } = await supabase.from('messages').insert([
    {
      content: Body,
      phone_number: From,
      contact_id,
      status: 'received',
      direction: 'inbound',
      channel: 'sms',
      timestamp: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).send('Error logging message');
  }

  res.status(200).send('Message logged');
}
