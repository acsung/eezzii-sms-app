import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { From, Body } = req.body;

    const phoneNumber = From.replace('whatsapp:', '').replace('+', '');

    const { data, error } = await supabase.from('messages').insert([
      {
        content: Body,
        phone_number: phoneNumber,
        contact_id: phoneNumber, // TEXT, not UUID
        direction: 'inbound',
        channel: 'sms',
        status: 'received',
      },
    ]);

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ message: 'Insert failed', error });
    }

    res.status(200).json({ message: 'Message inserted', data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Unexpected error', error: err.message });
  }
}
