import { Link } from "@tanstack/react-router";
import { Wallet2 } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber">
        <Wallet2 className="h-4 w-4 text-amber-foreground" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-brand-foreground">ExpenseFlow</span>
    </Link>
  );
}

