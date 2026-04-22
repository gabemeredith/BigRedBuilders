"use client";

import { useState } from "react";
import { IvySchool } from "@/types";
import { cn } from "@/lib/utils";
import { isIvyEduEmail, getIvySchoolFromEmail } from "@/lib/ivy-domains";

const IVY_SCHOOLS: IvySchool[] = ["Brown", "Columbia", "Cornell", "Dartmouth", "Harvard", "Penn", "Princeton", "Yale"];

type FormState = {
  name: string;
  school: IvySchool | "";
  profileUrl: string;
  nominator: string;
  eduEmail: string;
  descriptor: string;
  headline: string;
};

export default function NominatePage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    school: "",
    profileUrl: "",
    nominator: "",
    eduEmail: "",
    descriptor: "",
    headline: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const emailEntered = form.eduEmail.trim().length > 0;
  const emailValid = emailEntered && isIvyEduEmail(form.eduEmail);
  const emailSchool = emailEntered ? getIvySchoolFromEmail(form.eduEmail) : null;

  function handleEmailChange(email: string) {
    const school = getIvySchoolFromEmail(email);
    setForm((f) => ({
      ...f,
      eduEmail: email,
      school: school && !f.school ? school : f.school,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.school || !form.profileUrl) return;
    if (emailEntered && !emailValid) {
      setError("Please enter a valid Ivy League .edu email or leave it blank.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/nominations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          school: form.school,
          profileUrl: form.profileUrl,
          nominatorName: form.nominator || undefined,
          eduEmail: form.eduEmail || undefined,
          descriptor: form.descriptor || undefined,
          headline: form.headline || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="relative flex size-16 items-center justify-center rounded-full bg-ivy-accent-soft">
          <span className="text-3xl font-black text-ivy-accent">✓</span>
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Nomination received.</h1>
          <p className="mt-2 text-muted-foreground font-mono text-sm max-w-sm mx-auto">
            We&apos;ll verify and add them within 48 hours.
          </p>
        </div>
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

        <Field
          label="Their .edu email"
          hint={
            emailEntered
              ? emailValid
                ? `✓ Verified ${emailSchool} address`
                : "Not a recognized Ivy .edu domain"
              : "Optional — helps us verify enrollment"
          }
          hintColor={emailEntered ? (emailValid ? "green" : "red") : "muted"}
        >
          <input
            type="email"
            placeholder="jane@cornell.edu"
            value={form.eduEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={cn(
              inputCls,
              emailEntered && (emailValid
                ? "border-green-500 focus:border-green-500"
                : "border-red-400 focus:border-red-400")
            )}
          />
        </Field>

        <Field label="Year + major (optional)" hint="e.g. CS '26 · College of Engineering">
          <input
            type="text"
            placeholder="CS '26 · College of Engineering"
            value={form.descriptor}
            onChange={(e) => setForm((f) => ({ ...f, descriptor: e.target.value }))}
            className={inputCls}
          />
        </Field>

        <Field label="Most cracked thing they've done (optional)" hint="One punchy line. Include metrics if startup stuff.">
          <input
            type="text"
            placeholder="Built a compiler in Rust for fun"
            value={form.headline}
            onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
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

        {error && <p className="text-xs font-mono text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={!form.name || !form.school || !form.profileUrl || submitting}
          className="w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-bold text-background transition-colors hover:bg-foreground/85 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit nomination →"}
        </button>
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
  hint,
  hintColor = "muted",
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  hintColor?: "muted" | "green" | "red";
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground font-mono">
        {label}{required && <span className="text-ivy-accent ml-0.5">*</span>}
      </label>
      {children}
      {hint && (
        <p className={cn(
          "font-mono text-[11px]",
          hintColor === "green" ? "text-green-600"
          : hintColor === "red" ? "text-red-500"
          : "text-muted-foreground"
        )}>
          {hint}
        </p>
      )}
    </div>
  );
}
