import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/moneybag/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ExpenseFlow — personal finance tracker" },
      {
        name: "description",
        content:
          "ExpenseFlow helps you track accounts, records and categories, and understand where your money goes.",
      },
      { property: "og:title", content: "About ExpenseFlow" },
      { property: "og:description", content: "Why ExpenseFlow exists and what it does for you." },
    ],
  }),
  component: About,
});

const features = [
  {
    title: "Accounts",
    text: "Keep savings, current and shared family accounts side by side with their real balance.",
  },
  {
    title: "Records",
    text: "Add income and expense records on the go, tag them with categories and filter instantly.",
  },
  {
    title: "Analytic",
    text: "See cash flow, category split and balance evolution over any date interval.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">About</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          ExpenseFlow is a personal finance manager built around three simple ideas: know your
          balances, record every transaction in seconds, and let the numbers explain your habits.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
