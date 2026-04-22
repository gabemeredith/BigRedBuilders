"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

type Nomination = {
  id: string;
  name: string;
  school: string;
  profile_url: string;
  edu_email: string | null;
  nominator_name: string | null;
  descriptor: string | null;
  headline: string | null;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const fetchNominations = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/nominations", {
      headers: { "x-admin-secret": secret },
    });
    if (res.status === 401) {
      setError("Wrong password.");
      setAuthed(false);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setNominations(data.nominations ?? []);
    setAuthed(true);
    setLoading(false);
  }, [secret]);

  useEffect(() => {
    if (authed) fetchNominations();
  }, [authed, fetchNominations]);

  async function handleApprove(id: string) {
    setActing(id);
    await fetch(`/api/admin/approve/${id}`, {
      method: "POST",
      headers: { "x-admin-secret": secret },
    });
    setActing(null);
    fetchNominations();
  }

  async function handleReject(id: string) {
    setActing(id);
    await fetch(`/api/admin/reject/${id}`, {
      method: "POST",
      headers: { "x-admin-secret": secret, "content-type": "application/json" },
      body: JSON.stringify({ notes: "" }),
    });
    setActing(null);
    fetchNominations();
  }

  if (!authed) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <h1 className="text-2xl font-black tracking-tight">Admin</h1>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            fetchNominations();
          }}
        >
          <input
            type="password"
            placeholder="Admin password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-bold text-background hover:bg-foreground/85"
          >
            Enter
          </button>
        </form>
        {error && <p className="text-sm text-red-500 font-mono">{error}</p>}
      </div>
    );
  }

  const pending = nominations.filter((n) => n.status === "pending");
  const reviewed = nominations.filter((n) => n.status !== "pending");

  return (
    <div className="mx-auto w-full max-w-2xl py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">
          Nominations{" "}
          {pending.length > 0 && (
            <span className="ml-2 rounded-full bg-ivy-accent px-2 py-0.5 text-sm font-bold text-white">
              {pending.length}
            </span>
          )}
        </h1>
        <button
          onClick={fetchNominations}
          className="text-xs font-mono text-muted-foreground hover:text-foreground"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground font-mono">Loading…</p>}

      {pending.length === 0 && !loading && (
        <p className="text-sm text-muted-foreground font-mono">No pending nominations.</p>
      )}

      <div className="space-y-3">
        {pending.map((nom) => (
          <NomCard
            key={nom.id}
            nom={nom}
            acting={acting === nom.id}
            onApprove={() => handleApprove(nom.id)}
            onReject={() => handleReject(nom.id)}
          />
        ))}
      </div>

      {reviewed.length > 0 && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground font-mono">
            Reviewed ({reviewed.length})
          </h2>
          <div className="space-y-2">
            {reviewed.map((nom) => (
              <div
                key={nom.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm"
              >
                <span className="font-semibold">{nom.name}</span>
                <span
                  className={cn(
                    "font-mono text-xs",
                    nom.status === "approved" ? "text-green-600" : "text-red-500"
                  )}
                >
                  {nom.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NomCard({
  nom,
  acting,
  onApprove,
  onReject,
}: {
  nom: Nomination;
  acting: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-bold">{nom.name}</p>
          <p className="text-xs font-mono text-muted-foreground">
            {nom.school}{nom.descriptor ? ` · ${nom.descriptor}` : ""}
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          {new Date(nom.submitted_at).toLocaleDateString()}
        </p>
      </div>

      {nom.headline && (
        <p className="text-sm text-muted-foreground italic">&ldquo;{nom.headline}&rdquo;</p>
      )}

      <a
        href={nom.profile_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-mono text-ivy-accent underline-offset-2 hover:underline"
      >
        {nom.profile_url}
      </a>

      {nom.edu_email && (
        <p className="text-xs font-mono text-muted-foreground">✉ {nom.edu_email}</p>
      )}
      {nom.nominator_name && (
        <p className="text-xs font-mono text-muted-foreground">Nominated by: {nom.nominator_name}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={onApprove}
          disabled={acting}
          className="flex-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {acting ? "…" : "Approve ✓"}
        </button>
        <button
          onClick={onReject}
          disabled={acting}
          className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          {acting ? "…" : "Reject ✗"}
        </button>
      </div>
    </div>
  );
}
