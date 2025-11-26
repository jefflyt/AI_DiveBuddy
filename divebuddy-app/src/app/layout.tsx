import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiveBuddy",
  description: "AI-assisted dive learning and trip planning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}> 
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold">DiveBuddy</span>
              <span className="text-sm text-muted">AI Dive Assistant</span>
            </div>
            <div className="flex items-center gap-3">
              <a className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors border border-border bg-transparent text-foreground hover:bg-muted/10" href="/learn">Learn</a>
              <a className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors bg-foreground text-background hover:brightness-90" href="/chat">Chat</a>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
