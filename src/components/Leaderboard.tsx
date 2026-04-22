"use client";

import { useState, useMemo } from "react";
import { Player, IvySchool } from "@/types";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const ALL_SCHOOLS: IvySchool[] = ["Brown", "Columbia", "Cornell", "Dartmouth", "Harvard", "Penn", "Princeton", "Yale"];
const ALL_TAGS = ["SWE", "Quant", "Startup", "AI", "Research"] as const;

const SCHOOL_COLORS: Record<IvySchool, string> = {
  Harvard:   "oklch(0.45 0.17 25)",
  Yale:      "oklch(0.55 0.14 260)",
  Princeton: "oklch(0.45 0.15 265)",
  Columbia:  "oklch(0.55 0.14 230)",
  Penn:      "oklch(0.55 0.14 235)",
  Brown:     "oklch(0.55 0.14 55)",
  Cornell:   "oklch(0.55 0.14 25)",
  Dartmouth: "oklch(0.50 0.12 155)",
};

type SortKey = "rating" | "wins" | "losses" | "winrate";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function winRate(p: Player) {
  const total = p.wins + p.losses + p.ties;
  return total === 0 ? 0 : p.wins / total;
}

function deltaLabel(p: Player) {
  const net = p.wins - p.losses;
  if (net > 5) return { label: `↑ +${net}`, cls: "text-ivy-accent" };
  if (net < -2) return { label: `↓ ${net}`, cls: "text-destructive" };
  return { label: "— 0", cls: "text-muted-foreground" };
}

function SchoolChip({ school }: { school: IvySchool }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
      <span className="size-[6px] rounded-[2px] shrink-0" style={{ background: SCHOOL_COLORS[school] }} />
      {school}
    </span>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-semibold border transition-all",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function Leaderboard({ players }: { players: Player[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeSchool, setActiveSchool] = useState<IvySchool | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const sorted = useMemo(() => {
    let result = players.filter((p) => p.isActive && !p.isHidden);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.descriptor.toLowerCase().includes(q) ||
          p.headline?.toLowerCase().includes(q)
      );
    }

    if (activeTag) {
      result = result.filter((p) => p.tags?.includes(activeTag));
    }

    if (activeSchool) {
      result = result.filter((p) => p.school === activeSchool);
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case "rating":   return b.rating - a.rating;
        case "wins":     return b.wins - a.wins;
        case "losses":   return b.losses - a.losses;
        case "winrate":  return winRate(b) - winRate(a);
      }
    });

    return result;
  }, [players, search, activeTag, activeSchool, sortKey]);

  // Hot = top 20% win rate (among all active), New = low exposure (<10 votes)
  const hotThreshold = useMemo(() => {
    const active = players.filter((p) => p.isActive && !p.isHidden);
    const rates = active.map(winRate).sort((a, b) => b - a);
    return rates[Math.floor(rates.length * 0.2)] ?? 0.7;
  }, [players]);

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      <Input
        placeholder="Search players..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm font-mono text-sm"
      />

      {/* School chips */}
      <div className="flex flex-wrap gap-1">
        <Chip active={activeSchool === null} onClick={() => setActiveSchool(null)}>All Ivies</Chip>
        {ALL_SCHOOLS.map((school) => (
          <Chip
            key={school}
            active={activeSchool === school}
            onClick={() => setActiveSchool(activeSchool === school ? null : school)}
          >
            {school}
          </Chip>
        ))}
      </div>

      {/* Tag + sort chips */}
      <div className="flex flex-wrap items-center gap-1">
        <Chip active={activeTag === null} onClick={() => setActiveTag(null)}>All tracks</Chip>
        {ALL_TAGS.map((tag) => (
          <Chip
            key={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </Chip>
        ))}
        <span className="ml-auto flex gap-1">
          {(["rating", "wins", "winrate"] as SortKey[]).map((key) => (
            <Chip key={key} active={sortKey === key} onClick={() => setSortKey(key)}>
              {key === "rating" ? "Elo" : key === "wins" ? "Wins" : "Win %"}
            </Chip>
          ))}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[56px_1fr_130px_90px_80px_80px] items-center gap-3 border-b border-border bg-muted/60 px-5 py-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          <div>#</div>
          <div>Contender</div>
          <div>School</div>
          <div className="text-right">Elo</div>
          <div className="text-right">Win %</div>
          <div className="text-right">Δ</div>
        </div>

        {sorted.map((player, i) => {
          const rate = winRate(player);
          const isHot = rate >= hotThreshold && (player.wins + player.losses) >= 5;
          const isNew = (player.wins + player.losses + player.ties) < 10;
          const delta = deltaLabel(player);

          return (
            <div
              key={player.id}
              className={cn(
                "grid grid-cols-[56px_1fr_130px_90px_80px_80px] items-center gap-3 border-b border-border px-5 py-3.5 last:border-0 transition-colors hover:bg-muted/30 cursor-default",
                i < 3 && "bg-muted/20"
              )}
            >
              {/* Rank */}
              <div className={cn(
                "font-mono text-base font-bold",
                i === 0 && "text-yellow-500",
                i === 1 && "text-muted-foreground/70",
                i === 2 && "text-amber-600/80",
                i > 2 && "text-muted-foreground"
              )}>
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Player */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-muted text-xs font-bold">
                    {getInitials(player.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold truncate">{player.name}</span>
                    {isHot && (
                      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-ivy-accent-soft text-ivy-accent">
                        hot
                      </span>
                    )}
                    {isNew && (
                      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-ivy-good-soft text-ivy-good">
                        new
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{player.descriptor}</div>
                </div>
              </div>

              {/* School */}
              <div><SchoolChip school={player.school} /></div>

              {/* Elo */}
              <div className="text-right font-mono text-base font-bold tracking-tight">
                {player.rating.toLocaleString()}
              </div>

              {/* Win % */}
              <div className="text-right font-mono text-sm text-muted-foreground">
                {(rate * 100).toFixed(0)}%
              </div>

              {/* Delta */}
              <div className={cn("text-right font-mono text-sm font-semibold", delta.cls)}>
                {delta.label}
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="py-12 text-center font-mono text-sm text-muted-foreground">
            No players found.
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {sorted.map((player, i) => {
          const rate = winRate(player);
          const isHot = rate >= hotThreshold && (player.wins + player.losses) >= 5;
          const isNew = (player.wins + player.losses + player.ties) < 10;
          const delta = deltaLabel(player);

          return (
            <div
              key={player.id}
              className={cn(
                "rounded-xl border border-border p-4 transition-colors",
                i < 3 && "bg-muted/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className={cn(
                    "font-mono text-sm font-bold",
                    i === 0 && "text-yellow-500",
                    i === 1 && "text-muted-foreground/70",
                    i === 2 && "text-amber-600/80",
                    i > 2 && "text-muted-foreground"
                  )}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted text-xs font-bold">
                      {getInitials(player.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold truncate text-sm">{player.name}</span>
                      {isHot && (
                        <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-ivy-accent-soft text-ivy-accent">hot</span>
                      )}
                      {isNew && (
                        <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-ivy-good-soft text-ivy-good">new</span>
                      )}
                    </div>
                    <span className={cn("font-mono text-sm font-bold shrink-0", delta.cls)}>
                      {delta.label}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <SchoolChip school={player.school} />
                    <span className="font-mono text-xs text-muted-foreground">{player.descriptor}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {player.tags?.map((tag) => (
                        <span key={tag} className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-base font-bold">{player.rating.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="py-12 text-center font-mono text-sm text-muted-foreground">No players found.</div>
        )}
      </div>
    </div>
  );
}
