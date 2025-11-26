"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Msg = { role: "user" | "assistant" | "system"; text: string; time: string; pending?: boolean };

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPlaceholder() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text: text.trim(), time: timeNow() };
    setMessages((m) => [...m, userMsg]);
    setText("");

    // show pending assistant message
    const pending: Msg = { role: "assistant", text: "Thinking...", time: timeNow(), pending: true };
    setMessages((m) => [...m, pending]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();
      const reply: Msg = { role: "assistant", text: data.reply || "(no reply)", time: timeNow() };

      // replace last pending message with reply
      setMessages((m) => {
        const copy = [...m];
        const idx = copy.findIndex((x) => x.pending);
        if (idx !== -1) copy.splice(idx, 1, reply);
        else copy.push(reply);
        return copy;
      });
    } catch {
      setMessages((m) => {
        const copy = [...m];
        const idx = copy.findIndex((x) => x.pending);
        const errMsg: Msg = { role: "assistant", text: "Error: could not reach chat API.", time: timeNow() };
        if (idx !== -1) copy.splice(idx, 1, errMsg);
        else copy.push(errMsg);
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <div className="space-y-3 rounded-md border border-border bg-card p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">No messages yet — start the conversation.</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${m.role === "user" ? "bg-foreground text-background" : "bg-muted/10 text-foreground"}`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className="mt-1 text-xs text-muted text-right">{m.time}</div>
              </div>
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
        <Button onClick={send} disabled={loading || !text.trim()}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
