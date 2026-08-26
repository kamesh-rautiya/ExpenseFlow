import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import { Logo } from "./Logo";
import { authStorage } from "@/lib/api";
import { useEffect, useState } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/records", label: "Records" },
  { to: "/analytic", label: "Analytic" },
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
    <header className="bg-brand">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-5">
        <Logo to="/dashboard" />
        <nav className="flex items-center gap-6 text-sm text-brand-foreground/90">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "font-semibold text-brand-foreground" }}
              className="transition-opacity hover:opacity-80"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4 text-brand-foreground">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <UserRound className="h-3.5 w-3.5" />
            {name}
          </span>
          <a
            href="#"
            onClick={handleLogout}
            aria-label="Log out"
            className="transition-opacity hover:opacity-80"
          >
            <LogOut className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

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
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
