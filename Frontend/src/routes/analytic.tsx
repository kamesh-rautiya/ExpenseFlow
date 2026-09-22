import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/moneybag/AppHeader";
import { formatDate, formatMoney } from "@/lib/moneybag";
import { api, authStorage } from "@/lib/api";

export const Route = createFileRoute("/analytic")({
  head: () => ({
    meta: [
      { title: "Analytic — ExpenseFlow" },
      {
        name: "description",
        content: "Cash flow, category split and balance evolution for your chosen interval.",
      },
      { property: "og:title", content: "Analytic — ExpenseFlow" },
      { property: "og:description", content: "Spending, categories and balance evolution." },
    ],
  }),
  component: Analytic,
});

function Row({
  label,
  value,
  currency = "EUR",
  tone,
}: {
  label: string;
  value: string;
  currency?: string;
  tone?: "in" | "out";
}) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-semibold ${tone === "in" ? "text-income" : tone === "out" ? "text-expense" : "text-foreground"}`}
      >
        {value} <span className="font-normal text-muted-foreground">{currency}</span>
      </span>
    </div>
  );
}

function Analytic() {
  const user = authStorage.getUser();
  const userId = user?.id ?? 0;

  // Date range state (defaulting to March 2023 to match seed database records)
  const [startDate, setStartDate] = useState("2023-03-01");
  const [endDate, setEndDate] = useState("2023-03-31");

  // Queries
  const { data: totalAnalytic, isLoading: totalLoading } = useQuery({
    queryKey: ["totalAnalytic", userId, startDate, endDate],
    queryFn: () => api.getTotalAnalytics(userId, startDate, endDate),
    enabled: !!userId,
  });

  const { data: categoryAnalytics = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categoryAnalytics", userId, startDate, endDate],
    queryFn: () => api.getCategoryAnalytics(userId, startDate, endDate),
    enabled: !!userId,
  });

  const { data: balanceEvolution = [], isLoading: evolutionLoading } = useQuery({
    queryKey: ["balanceEvolution", userId, startDate, endDate],
    queryFn: () => api.getBalanceEvolution(userId, startDate, endDate),
    enabled: !!userId,
  });

  // Map backend CategoryAnalyticDto to Recharts format
  const categoryBreakdown = categoryAnalytics.map((c) => ({
    name: c.category.name,
    color: c.category.color,
    value: Math.abs(c.amount),
  }));

  // Map backend TimeSeriesEntry to Recharts format
  const balanceSeries = balanceEvolution.map((entry) => ({
    date: formatDate(entry.x),
    balance: entry.y,
  }));

  const currencyCode = totalAnalytic?.currency ?? "EUR";

  return (
    <AppShell title="Analytic">
      <div className="grid gap-6 md:grid-cols-2 rounded-md border border-border bg-card p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[11px] text-muted-foreground font-semibold uppercase">
            Start Date
          </span>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-foreground border border-border rounded px-2 py-1 text-sm focus:outline-none"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[11px] text-muted-foreground font-semibold uppercase">
            End Date
          </span>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-foreground border border-border rounded px-2 py-1 text-sm focus:outline-none"
            />
          </div>
        </label>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-md border border-border bg-card p-6 shadow-sm">
          <h2 className="text-center text-xl font-medium text-foreground">Spending Summary</h2>
          {totalLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Loading summary...
            </div>
          ) : totalAnalytic ? (
            <div className="mt-6 divide-y divide-border">
              <Row
                label="Current balance:"
                value={formatMoney(totalAnalytic.balance)}
                currency={currencyCode}
              />
              <Row
                label="Total Incomes:"
                value={formatMoney(totalAnalytic.incomes)}
                currency={currencyCode}
                tone="in"
              />
              <Row
                label="Total Expenses:"
                value={formatMoney(totalAnalytic.expenses)}
                currency={currencyCode}
                tone="out"
              />
              <Row
                label="Total Cash Flow:"
                value={formatMoney(totalAnalytic.cashFlow)}
                currency={currencyCode}
                tone={totalAnalytic.cashFlow < 0 ? "out" : "in"}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No analytics available.
            </div>
          )}
        </section>

        <section className="rounded-md border border-border bg-card p-6 shadow-sm">
          <h2 className="text-center text-xl font-medium text-foreground">Categories Split</h2>
          {categoriesLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Loading categories...
            </div>
          ) : categoryBreakdown.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No record category data.
            </div>
          ) : (
            <>
              <div className="mt-2 h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={1}
                      isAnimationActive={false}
                      label={({ percent }: { percent?: number }) =>
                        `${((percent ?? 0) * 100).toFixed(1)}%`
                      }
                      labelLine={false}
                    >
                      {categoryBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${formatMoney(v)} ${currencyCode}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground max-h-[100px] overflow-y-auto">
                {categoryBreakdown.map((c) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: c.color }}
                      aria-hidden
                    />
                    {c.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-md border border-border bg-card p-6 shadow-sm">
        <h2 className="text-center text-xl font-medium text-foreground">Balance Evolution</h2>
        {evolutionLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Loading evolution...
          </div>
        ) : balanceSeries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No balance evolution data available.
          </div>
        ) : (
          <div className="mt-6 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceSeries}>
                <CartesianGrid stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--color-border)" />
                <YAxis
                  domain={["dataMin - 100", "dataMax + 100"]}
                  tick={{ fontSize: 11 }}
                  stroke="var(--color-border)"
                />
                <Tooltip formatter={(v: number) => `${formatMoney(v)} ${currencyCode}`} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-brand)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </AppShell>
  );
}
