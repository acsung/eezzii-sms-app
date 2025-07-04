"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Contact = {
  id: string;
  name: string;
  phone: string;
  tags?: { id: string; name: string }[];
};

interface InboxSidebarProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function InboxSidebar({ selectedId, onSelect }: InboxSidebarProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("id, name, phone, tags(id, name)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setContacts(data as Contact[]);
      }
    };

    fetchContacts();
  }, []);

  return (
    <aside className="w-full md:w-64 bg-white border-r h-full overflow-hidden">
      <div className="px-4 py-3 border-b font-semibold text-sm uppercase tracking-wide">
        Contacts
      </div>

      <ScrollArea className="h-full">
        <div className="p-2 space-y-1">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onSelect(contact.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all hover:bg-gray-100",
                selectedId === contact.id ? "bg-gray-100 font-semibold" : ""
              )}
            >
              <div className="text-sm">{contact.name || contact.phone}</div>
              {contact.tags && contact.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {contact.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
