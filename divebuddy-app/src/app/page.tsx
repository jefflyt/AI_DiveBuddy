import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Footer from "@/components/ui/Footer";
import { GraduationCap, MapPin, MessageCircle, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-6 py-24">
        <section className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <Badge className="mb-4 bg-ocean-100 text-ocean-800">
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Diving Assistant
            </Badge>

            <h1 className="text-5xl font-black leading-tight">
              DiveBuddy — Your AI Companion for <span className="text-ocean-600">Diving Adventures</span>
            </h1>

            <p className="mt-4 max-w-xl text-lg text-muted">
              Learn Open Water fundamentals, plan Malaysia & APAC dive trips, and get personalized
              recommendations from an AI-powered assistant.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link href="/learn" className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-md transition-all hover:shadow-lg">
                Get Started
              </Link>

              <Link href="/chat" className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/5">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with DiveBuddy
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <Card className="max-w-sm">
              <h3 className="text-lg font-semibold">Features</h3>
              <div className="mt-3 prose text-sm">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded bg-ocean-100 text-ocean-600"><GraduationCap /></span> Interactive learning modules for Open Water and AOW</li>
                  <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded bg-ocean-100 text-ocean-600">🧠</span> RAG-powered AI answers backed by curated content</li>
                  <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded bg-ocean-100 text-ocean-600"><MapPin /></span> Destination browser and trip planning for Malaysia & APAC</li>
                </ul>
              </div>
            </Card>
          </div>
        </section>

        {/* Decorative hero illustration */}
        <div className="mt-12 flex justify-end">
          <svg width="420" height="180" viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop stopColor="#0ea5a4" stopOpacity="0.12" offset="0" />
                <stop stopColor="#06b6d4" stopOpacity="0.08" offset="1" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="420" height="180" rx="12" fill="url(#g)" />
            <g transform="translate(20,20)" fill="#06232a" opacity="0.9">
              <circle cx="40" cy="40" r="28" fill="#0f172a" opacity="0.9" />
              <rect x="90" y="20" width="260" height="8" rx="4" fill="#0f172a" />
              <rect x="90" y="40" width="220" height="8" rx="4" fill="#0f172a" />
            </g>
          </svg>
        </div>
      </main>

      <Footer />
    </div>
  );
}
