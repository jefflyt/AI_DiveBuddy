import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export const metadata = {
  title: "Learn — DovvyBuddy",
  description: "Explore Open Water and Advanced Open Water topics",
};

export default function LearnPage() {
  const topics = [
    { id: "equipment", title: "Equipment Overview", badge: "Beginner" },
    { id: "buoyancy", title: "Buoyancy Control", badge: "Beginner" },
    { id: "navigation", title: "Underwater Navigation", badge: "Intermediate" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Learn</h1>
          <p className="text-sm text-muted">Structured Open Water and AOW learning modules.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {topics.map((t) => (
          <Card key={t.id} className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium">{t.title}</h3>
                <p className="text-sm text-muted">Short description about {t.title.toLowerCase()}.</p>
              </div>
              <Badge>{t.badge}</Badge>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <a href={`/learn/${t.id}`} className="text-sm text-foreground hover:underline">
                View Topic
              </a>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
