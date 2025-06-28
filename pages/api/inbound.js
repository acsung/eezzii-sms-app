import { supabase } from '../../lib/supabase';
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

  // Step 1: Extract name from message via OpenAI
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

  // Step 2: Check if contact already exists for this number
  const { data: existingContact, error: contactError } = await supabase
    .from("contacts")
    .select("*")
    .eq("phone", From)
    .single();

  let contact_id = null;

  if (!existingContact) {
    // Step 3: Create contact if phone is not in system
    const { data: newContact } = await supabase
      .from("contacts")
      .insert([{ phone: From, name: extractedName, tag: "auto_created" }])
      .select()
      .single();

    contact_id = newContact?.id || null;
  } else {
    // Step 4: Compare names — if different, create new contact
    const similarity = stringSimilarity.compareTwoStrings(
      existingContact.name?.toLowerCase() || "",
      extractedName.toLowerCase()
    );

    if (similarity < 0.5 && extractedName !== "Unknown") {
      // Create new contact even though number exists
      const { data: altContact } = await supabase
        .from("contacts")
        .insert([{ phone: From, name: extractedName, tag: "possible_duplicate" }])
        .select()
        .single();

      contact_id = altContact?.id || null;
    } else {
      // Use existing contact
      contact_id = existingContact.id;
    }
  }

  // Step 5: Insert the message
  await supabase.from("messages").insert([
    {
      content: Body,
      phone_number: From,
      contact_id,
      status: "received",
      direction: "inbound",
      channel: "sms",
      timestamp: new Date().toISOString(),
    },
  ]);

  res.status(200).json({ success: true });
}
