"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  direction: "inbound" | "outbound";
  created_at: string;
};

interface InboxThreadProps {
  contactId: string | null;
}

export default function InboxThread({ contactId }: InboxThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!contactId) return;
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, direction, created_at")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
      }
    };

    fetchMessages();
  }, [contactId]);

  if (!contactId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a contact to view messages
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ScrollArea className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[75%] px-4 py-2 rounded-lg shadow-sm text-sm",
              msg.direction === "outbound"
                ? "bg-blue-500 text-white self-end"
                : "bg-white border self-start"
            )}
          >
            {msg.content}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
