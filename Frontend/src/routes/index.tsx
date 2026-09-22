import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/moneybag/SiteHeader";
import animeBg from "@/assets/anime-finance-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExpenseFlow — Manage your personal finance like a pro" },
      {
        name: "description",
        content:
          "Ditch the spreadsheets. Track accounts, add records on the go and analyze income and expenses with ExpenseFlow.",
      },
      { property: "og:title", content: "ExpenseFlow — Personal finance manager" },
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
    <div className="relative min-h-screen w-full text-foreground overflow-x-hidden">
      {/* Fullscreen anime money background with soft blur for maximum readability */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat blur-[3px] scale-105"
        style={{
          backgroundImage: `url(${animeBg})`,
        }}
      />
      {/* Sleek deep dark gradient overlay with frosted blur */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95 backdrop-blur-[5px]" />

      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-12">
          {/* Left Column: Hero Content in high-contrast protective glass card */}
          <div className="animate-fade-in md:col-span-7 rounded-3xl border border-white/15 bg-slate-950/55 backdrop-blur-xl p-7 sm:p-10 shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/20 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-violet-200 shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-amber" />
              <span>Next-Gen Personal Finance Experience</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Manage your personal finance{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                like a pro.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              Ditch the clunky spreadsheets. Track multi-currency accounts, record transactions in seconds,
              and unlock real-time financial freedom with crystal-clear visual analytics.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/sign-up"
                className="btn-interactive inline-flex items-center gap-2.5 rounded-lg bg-amber px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-amber-foreground shadow-lg shadow-amber/25 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                Get Started Free
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-white/20"
              >
                Explore Features
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-income/25 text-income border border-income/40">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">100%</p>
                  <p className="text-xs text-slate-300 font-medium">Private & Safe</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/25 text-violet-300 border border-violet-400/40">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Real-time</p>
                  <p className="text-xs text-slate-300 font-medium">Sync & Insights</p>
                </div>
              </div>
              <div>
                <p className="text-base font-bold text-white">Zero</p>
                <p className="text-xs text-slate-300 font-medium">Spreadsheet Stress</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating High-Contrast Glass Finance Dashboard Preview */}
          <div className="animate-float md:col-span-5 space-y-4">
            {/* Live Portfolio Glass Card */}
            <div className="card-hover rounded-2xl border border-white/25 bg-slate-950/75 backdrop-blur-2xl p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Live Total Balance
                  </span>
                </div>
                <span className="rounded-full bg-violet-500/30 px-2.5 py-0.5 text-[11px] font-bold text-violet-200 border border-violet-400/40">
                  EUR (€)
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                €53,250.00
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                  <span className="text-slate-300 font-medium">Monthly Inflow</span>
                  <p className="mt-1 font-bold text-income text-sm drop-shadow-sm">+€3,400.00</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                  <span className="text-slate-300 font-medium">Monthly Outflow</span>
                  <p className="mt-1 font-bold text-rose-400 text-sm drop-shadow-sm">-€1,280.00</p>
                </div>
              </div>
            </div>

            {/* Quick Record Cards in Glass */}
            <div className="card-hover rounded-2xl border border-white/20 bg-slate-950/70 backdrop-blur-2xl p-5 shadow-2xl text-white space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-200 pb-1">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Recent Activity</span>
                <span className="text-emerald-400 font-semibold">Synced just now</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 border border-white/10 px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber" />
                  <span className="font-semibold text-white">Freelance Client Pay</span>
                </div>
                <span className="font-bold text-income">+€1,850.00</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 border border-white/10 px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  <span className="font-semibold text-white">Tech Equipment & Cloud</span>
                </div>
                <span className="font-bold text-rose-400">-€320.00</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 border border-white/10 px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="font-semibold text-white">Grocery & Dining</span>
                </div>
                <span className="font-bold text-rose-400">-€85.50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="card-hover rounded-2xl border border-white/20 bg-slate-950/70 backdrop-blur-xl p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white">Multi-Account Sync</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Track savings, checking, credit, and digital wallets side-by-side with real balances.
            </p>
          </div>
          <div className="card-hover rounded-2xl border border-white/20 bg-slate-950/70 backdrop-blur-xl p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white">Instant Recording</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Add transactions in seconds with smart category tags and instant balance adjustments.
            </p>
          </div>
          <div className="card-hover rounded-2xl border border-white/20 bg-slate-950/70 backdrop-blur-xl p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white">Visual Analytics</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Understand where your money goes with dynamic interactive pie charts and balance evolution curves.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
