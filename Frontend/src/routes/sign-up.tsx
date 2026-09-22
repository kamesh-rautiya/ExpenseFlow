import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/moneybag/SiteHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Sign up — ExpenseFlow" },
      {
        name: "description",
        content: "Create your free ExpenseFlow account and start tracking income and expenses.",
      },
      { property: "og:title", content: "Sign up — ExpenseFlow" },
      { property: "og:description", content: "Create a free ExpenseFlow account." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("EUR");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const target = e.currentTarget;
    const firstName = (target.elements.namedItem("firstName") as HTMLInputElement).value;
    const lastName = (target.elements.namedItem("lastName") as HTMLInputElement).value;
    const email = (target.elements.namedItem("email") as HTMLInputElement).value;
    const password = (target.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await api.register({
        firstName,
        lastName,
        email,
        password,
        currency,
      });
      toast.success("Registered and signed in successfully!");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to register. User might already exist.";
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
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Sign up</h1>

        {error && (
          <div className="mt-4 rounded-md bg-destructive/15 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="currency">Default Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency" className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="CZK">CZK (Kč)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-amber-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign up"}
          </button>
        </form>
      </main>
    </div>
  );
}
