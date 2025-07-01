import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Inbox() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    const { data, error } = await supabase
      .from("contacts")
      .select("id, full_name, phone_number")
      .order("created_at", { ascending: false });

    if (!error) setContacts(data);
  }

  async function fetchMessages(contactId) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: true });

    if (!error) {
      setMessages(data);
      scrollToBottom();
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        contact_id: selectedContact.id,
        phone_number: selectedContact.phone_number,
        content: newMessage,
        direction: "outbound",
        status: "sent",
      },
    ]);

    if (!error) {
      setNewMessage("");
      fetchMessages(selectedContact.id);
    }
  }

  function handleSelectContact(contact) {
    setSelectedContact(contact);
    fetchMessages(contact.id);
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="flex h-screen">
      {/* Contacts List */}
      <div className="w-full sm:w-1/3 border-r border-gray-300 overflow-y-auto">
        <div className="text-xl font-bold p-4 border-b">Inbox</div>
        {contacts.map((c) => (
          <div
            key={c.id}
            onClick={() => handleSelectContact(c)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
              selectedContact?.id === c.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="font-semibold">{c.full_name || c.phone_number}</div>
            <div className="text-sm text-gray-500">{c.phone_number}</div>
          </div>
        ))}
      </div>

      {/* Message Thread */}
      <div className="w-full sm:w-2/3 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b text-lg font-bold">
              {selectedContact.full_name || selectedContact.phone_number}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.direction === "outbound" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                      msg.direction === "outbound"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 border"
                    }`}
                  >
                    {msg.content}
                    <div className="text-[10px] text-gray-400 mt-1 text-right">
                      {new Date(msg.created_at).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white flex items-center">
              <input
                className="flex-1 border rounded-full px-4 py-2 mr-2"
                placeholder="Type your message…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a contact to view messages
          </div>
        )}
      </div>
    </div>
  );
}
