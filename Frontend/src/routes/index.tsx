import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { SiteHeader } from "@/components/moneybag/SiteHeader";
import heroImage from "@/assets/hero-finance.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Moneybag — Manage your personal finance like a pro" },
      {
        name: "description",
        content:
          "Ditch the spreadsheets. Track accounts, add records on the go and analyze income and expenses with Moneybag.",
      },
      { property: "og:title", content: "Moneybag — Personal finance manager" },
      {
        property: "og:description",
        content: "Track accounts, records and analytics for your personal finance.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-foreground md:text-6xl">
            Manage your personal finance like a pro.
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            Get rid of your Exel spreadsheets and start managing your personal finance like a pro.
            Add records on the go, analyze your income and expenses, and more...
          </p>
          <Link
            to="/sign-up"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-amber px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-amber-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" />
            Sign up
          </Link>
        </div>
        <img
          src={heroImage}
          alt="Person analyzing a personal finance chart"
          width={1100}
          height={900}
          className="w-full"
        />
      </main>
    </div>
  );
}
