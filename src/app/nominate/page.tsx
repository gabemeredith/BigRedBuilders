"use client";

import { useState } from "react";
import { IvySchool } from "@/types";
import { cn } from "@/lib/utils";

const IVY_SCHOOLS: IvySchool[] = ["Brown", "Columbia", "Cornell", "Dartmouth", "Harvard", "Penn", "Princeton", "Yale"];

type FormState = {
  name: string;
  school: IvySchool | "";
  profileUrl: string;
  nominator: string;
};

export default function NominatePage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    school: "",
    profileUrl: "",
    nominator: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  function buildMailtoBody() {
    return [
      `Nominee: ${form.name}`,
      `School: ${form.school}`,
      `LinkedIn / GitHub: ${form.profileUrl}`,
      form.nominator ? `Nominated by: ${form.nominator}` : "",
    ].filter(Boolean).join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.school || !form.profileUrl) return;

    const subject = encodeURIComponent(`rIVYalry nomination: ${form.name}`);
    const body = encodeURIComponent(buildMailtoBody());
    window.location.href = `mailto:gabriel.b.meredith@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildMailtoBody());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="relative flex size-16 items-center justify-center rounded-full bg-ivy-accent-soft">
          <span className="text-3xl font-black text-ivy-accent">✓</span>
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Nomination sent.</h1>
          <p className="mt-2 text-muted-foreground font-mono text-sm max-w-sm mx-auto">
            We&apos;ll verify and add them within 48 hours. If your email client didn&apos;t open, copy the details below.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
        >
          {copied ? "Copied!" : "Copy nomination text"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight">Nominate a builder.</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground max-w-md mx-auto">
          Ivy undergrads and alumni within 2 years. SWE or founder track.
          Self-submissions welcome.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6"
      >
        <Field label="Their name" required>
          <input
            type="text"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className={inputCls}
          />
        </Field>

        <Field label="Their school" required>
          <select
            value={form.school}
            onChange={(e) => setForm((f) => ({ ...f, school: e.target.value as IvySchool }))}
            required
            className={cn(inputCls, "text-sm")}
          >
            <option value="" disabled>Select a school…</option>
            {IVY_SCHOOLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="LinkedIn or GitHub URL" required>
          <input
            type="url"
            placeholder="https://linkedin.com/in/janedoe"
            value={form.profileUrl}
            onChange={(e) => setForm((f) => ({ ...f, profileUrl: e.target.value }))}
            required
            className={inputCls}
          />
        </Field>

        <Field label="Your name (optional)">
          <input
            type="text"
            placeholder="Anonymous"
            value={form.nominator}
            onChange={(e) => setForm((f) => ({ ...f, nominator: e.target.value }))}
            className={inputCls}
          />
        </Field>

        <button
          type="submit"
          disabled={!form.name || !form.school || !form.profileUrl}
          className="w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-bold text-background transition-colors hover:bg-foreground/85 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit nomination →
        </button>

        <p className="text-center font-mono text-[11px] text-muted-foreground">
          Opens your email client with details pre-filled.
        </p>
      </form>

      <div className="rounded-xl border border-border bg-muted/40 px-6 py-4 max-w-md w-full space-y-2 font-mono text-[12px] text-muted-foreground">
        <div className="font-semibold text-foreground text-xs">FAQ</div>
        <p><span className="text-foreground">How do I get removed?</span> One email, no questions. Removed within 24 hours.</p>
        <p><span className="text-foreground">Is this fair?</span> No. It&apos;s a popularity contest with stats. That&apos;s the whole bit.</p>
        <p><span className="text-foreground">Who reviews nominations?</span> The team. Takes a day or two.</p>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 transition-colors placeholder:text-muted-foreground focus:border-foreground font-sans";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground font-mono">
        {label}{required && <span className="text-ivy-accent ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
