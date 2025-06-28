import { createClient } from '@supabase/supabase-js';
import OpenAI from "openai";
import stringSimilarity from "string-similarity";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { Body, From } = req.body;
  const phone = From?.replace(/\D/g, '').replace(/^1/, '');

  // Log every request to debug table
  await supabase.from("webhook_debug").insert([
    {
      raw_payload: JSON.stringify(req.body),
      received_at: new Date().toISOString()
    }
  ]);

  if (!Body || !From) {
    return res.status(400).json({ error: "Missing From or Body" });
  }

  let extractedName = "Unknown";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Extract only the sender's full name from this message. Return just the name — no extra words.",
        },
        { role: "user", content: Body },
      ],
    });

    extractedName = completion.choices[0]?.message?.content?.trim() || "Unknown";
  } catch (err) {
    console.error("OpenAI error:", err.message);
  }

  const { data: existingContact } = await supabase
    .from("contacts")
    .select("*")
    .eq("phone", phone)
    .single();

  let contact_id = null;

  if (!existingContact) {
    const { data: newContact } = await supabase
      .from("contacts")
      .insert([
        {
          phone: phone,
          name: extractedName,
          tag: "auto_created",
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    contact_id = newContact?.id || null;
  } else {
    const similarity = stringSimilarity.compareTwoStrings(
      existingContact.name?.toLowerCase() || "",
      extractedName.toLowerCase()
    );

    if (similarity < 0.5 && extractedName !== "Unknown") {
      const { data: altContact } = await supabase
        .from("contacts")
        .insert([
          {
            phone: phone,
            name: extractedName,
            tag: "possible_duplicate",
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      contact_id = altContact?.id || null;
    } else {
      contact_id = existingContact.id;
    }
  }

  const { error: messageError } = await supabase.from("messages").insert([
    {
      content: Body,
      phone_number: phone,
      contact_id,
      status: "received",
      direction: "inbound",
      channel: "sms",
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ]);

  if (messageError) {
    console.error("Message insert error:", messageError.message);
    return res.status(500).json({ error: "Failed to log message" });
  }

  res.status(200).json({ success: true });
}
