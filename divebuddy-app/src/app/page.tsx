import Link from "next/link";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-6 py-24">
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold">DiveBuddy</h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              AI-powered dive learning and trip planning — learn Open Water fundamentals,
              plan Malaysia & APAC dive trips, and get personalized recommendations.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/learn"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
              >
                Get Started
              </Link>

              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground"
              >
                Chat with DiveBuddy
              </Link>
            </div>
          </div>

          <div>
            <Card>
              <h3 className="text-lg font-semibold">Features</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>Interactive learning modules for Open Water and AOW</li>
                <li>RAG-powered AI answers backed by curated content</li>
                <li>Destination browser and trip planning for Malaysia & APAC</li>
              </ul>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
