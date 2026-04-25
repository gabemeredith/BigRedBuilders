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

type Experience = {
  id?: string;
  companyName: string;
  roleTitle: string;
  companyDomain: string;
  sortOrder: number;
};

type Player = {
  id: string;
  name: string;
  school: string;
  descriptor: string;
  headline: string | null;
  photo: string;
  rating: number;
  wins: number;
  losses: number;
  ties: number;
  exposure_count: number;
  is_active: boolean;
  is_hidden: boolean;
  tags: string[] | null;
  experiences: {
    id: string;
    company_name: string;
    role_title: string;
    company_domain: string | null;
    sort_order: number;
  }[];
};

type Tab = "nominations" | "players";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("nominations");
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
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

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/players", {
      headers: { "x-admin-secret": secret },
    });
    const data = await res.json();
    setPlayers(data.players ?? []);
    setLoading(false);
  }, [secret]);

  useEffect(() => {
    if (authed) {
      fetchNominations();
      fetchPlayers();
    }
  }, [authed, fetchNominations, fetchPlayers]);

  async function handleApprove(id: string) {
    setActing(id);
    await fetch(`/api/admin/approve/${id}`, {
      method: "POST",
      headers: { "x-admin-secret": secret },
    });
    setActing(null);
    fetchNominations();
    fetchPlayers();
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
    <div className="mx-auto w-full max-w-2xl py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border border-border p-1">
          <button
            onClick={() => setTab("nominations")}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-semibold transition-colors",
              tab === "nominations"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Nominations
            {pending.length > 0 && (
              <span className="ml-2 rounded-full bg-ivy-accent px-1.5 py-0.5 text-xs font-bold text-white">
                {pending.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("players")}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-semibold transition-colors",
              tab === "players"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Players
            <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
              {players.length}
            </span>
          </button>
        </div>
        <button
          onClick={() => {
            fetchNominations();
            fetchPlayers();
          }}
          className="text-xs font-mono text-muted-foreground hover:text-foreground"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground font-mono">Loading…</p>}

      {tab === "nominations" && (
        <div className="space-y-6">
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
      )}

      {tab === "players" && (
        <div className="space-y-3">
          {players.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground font-mono">No players yet.</p>
          )}
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              secret={secret}
              onSaved={fetchPlayers}
              acting={acting === player.id}
              setActing={setActing}
            />
          ))}
        </div>
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

const SCHOOLS = [
  "Harvard", "Yale", "Princeton", "Columbia", "Penn",
  "Brown", "Dartmouth", "Cornell", "Barnard",
];

function PlayerCard({
  player,
  secret,
  onSaved,
  acting,
  setActing,
}: {
  player: Player;
  secret: string;
  onSaved: () => void;
  acting: boolean;
  setActing: (id: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [fields, setFields] = useState({
    name: player.name,
    school: player.school,
    descriptor: player.descriptor,
    headline: player.headline ?? "",
    photo: player.photo,
    rating: player.rating,
    wins: player.wins,
    losses: player.losses,
    ties: player.ties,
    is_active: player.is_active,
    is_hidden: player.is_hidden,
  });

  const [experiences, setExperiences] = useState<Experience[]>(
    player.experiences
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((e) => ({
        id: e.id,
        companyName: e.company_name,
        roleTitle: e.role_title,
        companyDomain: e.company_domain ?? "",
        sortOrder: e.sort_order,
      }))
  );

  function field(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value;
      setFields((prev) => ({ ...prev, [key]: value }));
    };
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    const res = await fetch(`/api/admin/players/${player.id}`, {
      method: "PUT",
      headers: { "x-admin-secret": secret, "content-type": "application/json" },
      body: JSON.stringify({ ...fields, experiences }),
    });
    if (!res.ok) {
      const d = await res.json();
      setSaveError(d.error ?? "Save failed");
    } else {
      setExpanded(false);
      onSaved();
    }
    setSaving(false);
  }

  async function handleDelete() {
    setActing(player.id);
    const res = await fetch(`/api/admin/players/${player.id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });
    if (!res.ok) {
      setSaveError("Delete failed");
    } else {
      onSaved();
    }
    setActing(null);
    setConfirmDelete(false);
  }

  function addExperience() {
    setExperiences((prev) => [
      ...prev,
      { companyName: "", roleTitle: "", companyDomain: "", sortOrder: prev.length },
    ]);
  }

  function removeExperience(i: number) {
    setExperiences((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateExperience(i: number, key: keyof Experience, value: string | number) {
    setExperiences((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [key]: value } : e))
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold truncate">{player.name}</p>
            {!player.is_active && (
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-mono text-yellow-700">inactive</span>
            )}
            {player.is_hidden && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600">hidden</span>
            )}
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {player.school} · {player.descriptor}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-muted-foreground">
            {player.rating} ELO · {player.wins}W/{player.losses}L
          </span>
          <button
            onClick={() => {
              setExpanded((v) => !v);
              setConfirmDelete(false);
              setSaveError("");
            }}
            className="rounded-md border border-border px-3 py-1 text-xs font-semibold hover:bg-muted"
          >
            {expanded ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <input value={fields.name} onChange={field("name")} className={inputCls} />
            </Field>
            <Field label="School">
              <select value={fields.school} onChange={field("school")} className={inputCls}>
                {SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Descriptor">
              <input value={fields.descriptor} onChange={field("descriptor")} className={inputCls} />
            </Field>
            <Field label="Headline">
              <input value={fields.headline} onChange={field("headline")} className={inputCls} />
            </Field>
            <Field label="Photo URL">
              <input value={fields.photo} onChange={field("photo")} className={inputCls} />
            </Field>
            <Field label="Rating">
              <input type="number" value={fields.rating} onChange={field("rating")} className={inputCls} />
            </Field>
            <Field label="Wins">
              <input type="number" value={fields.wins} onChange={field("wins")} className={inputCls} />
            </Field>
            <Field label="Losses">
              <input type="number" value={fields.losses} onChange={field("losses")} className={inputCls} />
            </Field>
            <Field label="Ties">
              <input type="number" value={fields.ties} onChange={field("ties")} className={inputCls} />
            </Field>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={fields.is_active}
                onChange={field("is_active")}
                className="rounded"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={fields.is_hidden}
                onChange={field("is_hidden")}
                className="rounded"
              />
              Hidden
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground font-mono">
                Experiences
              </p>
              <button
                onClick={addExperience}
                className="text-xs font-mono text-ivy-accent hover:underline"
              >
                + Add
              </button>
            </div>
            {experiences.map((exp, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                <Field label="Company">
                  <input
                    value={exp.companyName}
                    onChange={(e) => updateExperience(i, "companyName", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Role">
                  <input
                    value={exp.roleTitle}
                    onChange={(e) => updateExperience(i, "roleTitle", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Domain">
                  <input
                    value={exp.companyDomain}
                    onChange={(e) => updateExperience(i, "companyDomain", e.target.value)}
                    className={inputCls}
                    placeholder="e.g. google.com"
                  />
                </Field>
                <button
                  onClick={() => removeExperience(i)}
                  className="mb-0.5 text-red-400 hover:text-red-600 text-lg leading-none"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {saveError && <p className="text-xs text-red-500 font-mono">{saveError}</p>}

          <div className="flex items-center justify-between pt-1">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={acting}
                className="text-xs font-mono text-red-400 hover:text-red-600"
              >
                Delete player…
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-red-500">Delete permanently?</span>
                <button
                  onClick={handleDelete}
                  disabled={acting}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {acting ? "…" : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setExpanded(false)}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-foreground px-4 py-1.5 text-xs font-bold text-background hover:bg-foreground/85 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-mono text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
