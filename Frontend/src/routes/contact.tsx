import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/moneybag/SiteHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ExpenseFlow" },
      { name: "description", content: "Questions or feedback about ExpenseFlow? Send us a message." },
      { property: "og:title", content: "Contact ExpenseFlow" },
      { property: "og:description", content: "Get in touch with the ExpenseFlow team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-5 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Contact</h1>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent. We'll get back to you soon.");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required placeholder="Jan Babák" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="jan@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" required rows={5} placeholder="How can we help?" />
          </div>
          <button
            type="submit"
            className="rounded-md bg-amber px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-amber-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Send message
          </button>
        </form>
      </main>
    </div>
  );
}
