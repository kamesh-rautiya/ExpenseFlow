import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/moneybag/SiteHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import animeBg from "@/assets/anime-finance-bg.jpg";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — ExpenseFlow" },
      { name: "description", content: "Sign in to your ExpenseFlow account to manage your finance." },
      { property: "og:title", content: "Sign in — ExpenseFlow" },
      { property: "og:description", content: "Access your ExpenseFlow dashboard." },
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
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden text-foreground">
      {/* Fullscreen anime money background with blur */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat blur-[4px] scale-105"
        style={{ backgroundImage: `url(${animeBg})` }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95 backdrop-blur-[6px]" />

      <SiteHeader />

      <main className="animate-fade-in mx-auto w-full max-w-sm px-5 py-16 my-auto">
        <div className="rounded-2xl border border-white/20 bg-slate-950/85 backdrop-blur-2xl p-7 shadow-2xl text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/20 text-amber border border-amber/30">
              <LogIn className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Sign in</h1>
          </div>

          <p className="mt-2 text-xs text-slate-300">
            Access your ExpenseFlow financial dashboard
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/20 border border-destructive/40 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="honza@gmail.com"
                className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-amber"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                defaultValue="12345678"
                className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-amber"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-interactive w-full rounded-lg bg-amber px-5 py-3 text-xs font-bold uppercase tracking-wider text-amber-foreground shadow-lg shadow-amber/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-300">
            Don't have an account?{" "}
            <Link to="/sign-up" className="font-semibold text-amber hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
