import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/moneybag/SiteHeader";
import { Wallet, Receipt, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ExpenseFlow — Personal Finance Tracker" },
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
    icon: Wallet,
    title: "Accounts",
    text: "Keep savings, checking, and shared family accounts side by side with real-time balances.",
  },
  {
    icon: Receipt,
    title: "Records",
    text: "Add income and expense records on the go, tag them with categories, and filter instantly.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    text: "See cash flow, category split, and balance evolution over any date interval.",
  },
];

import animeBg from "@/assets/anime-finance-bg.jpg";

function About() {
  return (
    <div className="relative min-h-screen w-full text-foreground overflow-x-hidden">
      {/* Fullscreen anime money background with blur */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat blur-[4px] scale-105"
        style={{ backgroundImage: `url(${animeBg})` }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95 backdrop-blur-[6px]" />

      <SiteHeader />

      <main className="animate-fade-in mx-auto max-w-6xl px-5 py-16 text-white">
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          About ExpenseFlow
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-200 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
          ExpenseFlow is a personal finance manager built around three simple ideas: know your
          balances, record every transaction in seconds, and let the numbers explain your habits.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="card-hover rounded-2xl border border-white/20 bg-slate-950/80 backdrop-blur-2xl p-6 shadow-2xl cursor-default text-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/20 text-amber border border-amber/30">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{f.title}</h2>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{f.text}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
