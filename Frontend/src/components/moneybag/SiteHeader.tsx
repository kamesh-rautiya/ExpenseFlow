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
    <header className="bg-brand">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-5">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-brand-foreground/90">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "font-semibold text-brand-foreground" }}
              className="transition-opacity hover:opacity-80"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/sign-in"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-foreground transition-opacity hover:opacity-80"
          >
            <UserRound className="h-3.5 w-3.5" />
            Sign-in
          </Link>
          <Link
            to="/sign-up"
            className="flex items-center gap-1.5 rounded-md bg-amber px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Sign-up
          </Link>
        </div>
      </div>
    </header>
  );
}
