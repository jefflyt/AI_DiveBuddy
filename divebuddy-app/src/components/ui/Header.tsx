import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold text-foreground">DovvyBuddy</Link>
          <span className="hidden text-sm text-muted md:inline">AI Dive Assistant</span>
        </div>

        <nav className="hidden items-center gap-3 md:flex">
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

        <div className="md:hidden">
          <Link href="/learn" className="inline-flex items-center rounded-md bg-muted/10 px-3 py-1 text-sm">Menu</Link>
        </div>
      </div>
    </header>
  );
}
