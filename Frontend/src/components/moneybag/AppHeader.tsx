import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import { Logo } from "./Logo";
import { authStorage } from "@/lib/api";
import { useEffect, useState } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/records", label: "Records" },
  { to: "/analytic", label: "Analytics" },
] as const;

export function AppHeader() {
  const navigate = useNavigate();
  const [name, setName] = useState("Guest");

  useEffect(() => {
    const user = authStorage.getUser();
    if (user) {
      setName(`${user.firstName} ${user.lastName}`);
    } else {
      navigate({ to: "/sign-in" });
    }
  }, [navigate]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    authStorage.logout();
    navigate({ to: "/sign-in" });
  };

  return (
    <header className="sticky top-0 z-40 bg-brand shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-5">
        <Logo to="/dashboard" />
        <nav className="flex items-center gap-2 text-sm text-brand-foreground/90">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "font-semibold text-brand-foreground bg-white/15 shadow-xs" }}
              className="rounded-md px-3 py-1.5 transition-all hover:bg-white/10 hover:text-brand-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-brand-foreground">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <UserRound className="h-3.5 w-3.5" />
            {name}
          </span>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="rounded-full p-1.5 transition-all hover:bg-white/15 hover:opacity-100 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

import animeBg from "@/assets/anime-finance-bg.jpg";

export function AppShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Ambient anime money backdrop */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center opacity-10 blur-xl scale-105"
        style={{ backgroundImage: `url(${animeBg})` }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/90 via-background/95 to-background" />

      <AppHeader />
      <main className="animate-fade-in mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
