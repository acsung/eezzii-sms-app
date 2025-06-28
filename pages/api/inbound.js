import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

import OpenAI from "openai";
import stringSimilarity from "string-similarity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { Body, From } = req.body;

  // Normalize phone number (strip +, dashes, etc.)
  const phone = From.replace(/\D/g, '').replace(/^1/, '');

  // Step 1: Extract name using OpenAI
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

  // Step 2: Check for existing contact
  const { data: existingContact, error: contactError } = await supabase
    .from("contacts")
    .select("*")
    .eq("phone", phone)
    .single();

  let contact_id = null;

  if (!existingContact) {
    // Step 3: Insert new contact if phone not found
    const { data: newContact, error: insertError } = await supabase
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

    if (insertError) console.error("Contact insert error:", insertError.message);

    contact_id = newContact?.id || null;
  } else {
    // Step 4: Check for possible duplicate by comparing names
    const similarity = stringSimilarity.compareTwoStrings(
      existingContact.name?.toLowerCase() || "",
      extractedName.toLowerCase()
    );

    if (similarity < 0.5 && extractedName !== "Unknown") {
      const { data: altContact, error: altInsertError } = await supabase
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

      if (altInsertError) console.error("Alt contact insert error:", altInsertError.message);

      contact_id = altContact?.id || null;
    } else {
      contact_id = existingContact.id;
    }
  }

  // Step 5: Insert message
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
