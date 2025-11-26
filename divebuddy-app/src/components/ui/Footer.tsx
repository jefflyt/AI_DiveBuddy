import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-muted">© {new Date().getFullYear()} DovvyBuddy — Built with ❤️ for learners</div>
          <div className="flex gap-4">
            <Link href="/learn" className="text-sm text-foreground hover:underline">Learn</Link>
            <Link href="/chat" className="text-sm text-foreground hover:underline">Chat</Link>
            <a href="#" className="text-sm text-muted">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
