import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold text-foreground">DiveBuddy</Link>
          <span className="text-sm text-muted">AI Dive Assistant</span>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors border border-border bg-transparent text-foreground hover:bg-muted/10"
          >
            Learn
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors bg-foreground text-background hover:brightness-90"
          >
            Chat
          </Link>
        </nav>
      </div>
    </header>
  );
}
