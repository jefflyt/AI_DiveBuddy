import ChatPlaceholder from "@/components/chat/ChatPlaceholder";

export const metadata = {
  title: "Chat — DiveBuddy",
  description: "Chat with the DiveBuddy AI assistant",
};

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Chat</h1>
        <p className="text-sm text-muted">Ask DiveBuddy for trip suggestions or learning help.</p>
      </header>

      <section>
        <ChatPlaceholder />
      </section>
    </div>
  );
}
