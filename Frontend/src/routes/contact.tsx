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

import animeBg from "@/assets/anime-finance-bg.jpg";

function Contact() {
  return (
    <div className="relative min-h-screen w-full flex flex-col text-foreground overflow-x-hidden">
      {/* Fullscreen anime money background with blur */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat blur-[4px] scale-105"
        style={{ backgroundImage: `url(${animeBg})` }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95 backdrop-blur-[6px]" />

      <SiteHeader />

      <main className="animate-fade-in mx-auto w-full max-w-xl px-5 py-16 text-white my-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Get in touch
        </h1>
        <p className="mt-2 text-sm text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
          Have questions or feedback about ExpenseFlow? We would love to hear from you.
        </p>
        <div className="mt-8 rounded-2xl border border-white/20 bg-slate-950/85 backdrop-blur-2xl p-7 shadow-2xl">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent! We'll get back to you soon.");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-slate-200">Name</Label>
              <Input
                id="name"
                required
                placeholder="Jan Babák"
                className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-amber"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="jan@example.com"
                className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-amber"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-slate-200">Message</Label>
              <Textarea
                id="message"
                required
                rows={5}
                placeholder="How can we help?"
                className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-amber"
              />
            </div>
            <button
              type="submit"
              className="btn-interactive inline-flex items-center justify-center rounded-lg bg-amber px-6 py-3 text-xs font-bold uppercase tracking-wider text-amber-foreground shadow-lg shadow-amber/20 cursor-pointer"
            >
              Send message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
