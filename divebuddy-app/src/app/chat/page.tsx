import ChatPlaceholder from "@/components/chat/ChatPlaceholder";

export const metadata = {
  title: "Chat — DovvyBuddy",
  description: "Chat with the DovvyBuddy AI assistant",
};

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Chat</h1>
        <p className="text-sm text-muted">Ask DovvyBuddy for trip suggestions or learning help.</p>
      </header>

      <section>
        <ChatPlaceholder />
      </section>
    </div>
  );
}
