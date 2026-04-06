"use client";

import { useState, useMemo } from "react";
import { Player } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ALL_TAGS = ["SWE", "Quant", "Startup", "AI", "Research"] as const;

type SortKey = "rating" | "wins" | "losses" | "winrate";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function winRate(p: Player) {
  const total = p.wins + p.losses + p.ties;
  return total === 0 ? 0 : p.wins / total;
}

export function Leaderboard({ players }: { players: Player[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
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

    result.sort((a, b) => {
      switch (sortKey) {
        case "rating":
          return b.rating - a.rating;
        case "wins":
          return b.wins - a.wins;
        case "losses":
          return b.losses - a.losses;
        case "winrate":
          return winRate(b) - winRate(a);
      }
    });

    return result;
  }, [players, search, activeTag, sortKey]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={sortKey}
          onValueChange={(v) => setSortKey(v as SortKey)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="wins">Wins</SelectItem>
            <SelectItem value="losses">Losses</SelectItem>
            <SelectItem value="winrate">Win Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={activeTag === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveTag(null)}
        >
          All
        </Badge>
        {ALL_TAGS.map((tag) => (
          <Badge
            key={tag}
            variant={activeTag === tag ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-12">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Player
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Tags
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Rating
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  W / L / T
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Win %
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((player, i) => (
                <tr
                  key={player.id}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors hover:bg-muted/30",
                    i < 3 && "bg-muted/20"
                  )}
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        i === 0 && "text-yellow-500",
                        i === 1 && "text-gray-400",
                        i === 2 && "text-amber-600"
                      )}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-muted text-xs font-medium">
                          {getInitials(player.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {player.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {player.descriptor}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {player.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {player.rating}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {player.wins} / {player.losses} / {player.ties}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {(winRate(player) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No players found.
            </div>
          )}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map((player, i) => (
          <div
            key={player.id}
            className={cn(
              "rounded-xl border border-border p-4 transition-colors",
              i < 3 && "bg-muted/20"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-bold",
                    i === 0 && "text-yellow-500",
                    i === 1 && "text-gray-400",
                    i === 2 && "text-amber-600"
                  )}
                >
                  #{i + 1}
                </span>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {getInitials(player.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium truncate">{player.name}</span>
                  <span className="text-lg font-bold tabular-nums shrink-0">
                    {player.rating}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {player.descriptor}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    {player.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {player.wins}W {player.losses}L {player.ties}T ·{" "}
                    {(winRate(player) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No players found.
          </div>
        )}
      </div>
    </div>
  );
}
