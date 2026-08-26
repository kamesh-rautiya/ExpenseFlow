import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/moneybag/SiteHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — Moneybag" },
      { name: "description", content: "Sign in to your Moneybag account to manage your finance." },
      { property: "og:title", content: "Sign in — Moneybag" },
      { property: "og:description", content: "Access your Moneybag dashboard." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const target = e.currentTarget;
    const email = (target.elements.namedItem("email") as HTMLInputElement).value;
    const password = (target.elements.namedItem("password") as HTMLInputElement).value;
    try {
      await api.authenticate(email, password);
      toast.success("Signed in successfully!");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-sm px-5 py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Sign in</h1>

        {error && (
          <div className="mt-4 rounded-md bg-destructive/15 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required defaultValue="honza@gmail.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required defaultValue="password" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-amber-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}
