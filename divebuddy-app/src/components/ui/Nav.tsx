import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center gap-2">
      <Link href="/destinations" className="text-sm text-foreground hover:underline">
        Destinations
      </Link>
      <Link href="/saved" className="text-sm text-foreground hover:underline">
        Saved
      </Link>
      <Link href="/history" className="text-sm text-foreground hover:underline">
        History
      </Link>
    </nav>
  );
}
