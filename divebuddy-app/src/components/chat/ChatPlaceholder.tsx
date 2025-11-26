"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ChatPlaceholder() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  function send() {
    if (!text.trim()) return;
    setMessages((m) => [...m, `You: ${text.trim()}`]);
    setText("");
    // Placeholder reply
    setTimeout(() => setMessages((m) => [...m, "DiveBuddy: (placeholder) I can help you plan dives soon."]), 600);
  }

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <div className="space-y-2 rounded-md border border-border bg-card p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">No messages yet — start the conversation.</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="text-sm">
              {m}
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[48px] flex-1 resize-y rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
          placeholder="Ask about dive sites, skills, or trip planning..."
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}
