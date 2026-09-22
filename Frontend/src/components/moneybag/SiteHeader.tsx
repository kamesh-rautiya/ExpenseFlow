import { Link } from "@tanstack/react-router";
import { UserPlus, UserRound } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-brand/85 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-5">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-brand-foreground/90">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "font-semibold text-brand-foreground bg-white/10" }}
              className="rounded-md px-2.5 py-1 transition-all hover:bg-white/10 hover:text-brand-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/sign-in"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-foreground transition-all hover:bg-white/10 hover:opacity-100"
          >
            <UserRound className="h-3.5 w-3.5" />
            Sign in
          </Link>
          <Link
            to="/sign-up"
            className="btn-interactive flex items-center gap-1.5 rounded-md bg-amber px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-foreground shadow-sm"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
