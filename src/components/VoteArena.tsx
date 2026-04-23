"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Player, Experience, VoteResult } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type MatchupPlayer = Player & { experiences: Experience[] };

type Matchup = {
  matchId: string;
  left: MatchupPlayer;
  right: MatchupPlayer;
};

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "rivyalry:session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function VoteArena() {
  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [phase, setPhase] = useState<"voting" | "revealed">("voting");
  const [matchKey, setMatchKey] = useState(0);
  const [lastVote, setLastVote] = useState<VoteResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const rankMap = useMemo(() => {
    // We only have two players in context, so just compare their ratings
    if (!matchup) return new Map<string, number>();
    const sorted = [matchup.left, matchup.right].sort((a, b) => b.rating - a.rating);
    const map = new Map<string, number>();
    sorted.forEach((p, i) => map.set(p.id, i + 1));
    return map;
  }, [matchup]);

  const loadMatchup = useCallback(async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/matchup");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setMatchup(data);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    loadMatchup();
  }, [loadMatchup]);

  const advance = useCallback(async () => {
    setMatchup(null);
    setPhase("voting");
    setLastVote(null);
    setMatchKey((k) => k + 1);
    await loadMatchup();
  }, [loadMatchup]);

  const handleVote = useCallback(
    async (result: VoteResult) => {
      if (phase === "revealed" || !matchup) return;
      setLastVote(result);
      setPhase("revealed");

      // Fire-and-forget — submit vote to backend
      fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          matchId: matchup.matchId,
          result,
          sessionId: getSessionId(),
        }),
      }).catch(() => {});
    },
    [phase, matchup]
  );

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + "/vote");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, []);

  const pickedName =
    !matchup || !lastVote ? null
    : lastVote === "left" ? matchup.left.name
    : lastVote === "right" ? matchup.right.name
    : null;

  const revealHeadline =
    lastVote === "equal" ? "You called it a tie."
    : lastVote === "skip" ? "Skipped."
    : pickedName ? `You picked ${pickedName}.`
    : null;

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground font-mono">Couldn&apos;t load matchup.</p>
        <button
          onClick={loadMatchup}
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!matchup) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {[0, 1].map((i) => (
          <div key={i} className="flex w-full flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 animate-pulse">
            <div className="w-full max-w-[200px] aspect-square rounded-xl bg-muted" />
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="h-[18px] w-32 rounded bg-muted" />
              <div className="h-3.5 w-44 rounded bg-muted" />
            </div>
            <div className="grid grid-cols-3 gap-0 w-full border-t border-b border-border py-3">
              {[0,1,2].map(j => <div key={j} className="flex justify-center"><div className="h-6 w-12 rounded bg-muted" /></div>)}
            </div>
            <div className="flex w-full flex-col gap-2.5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="size-7 shrink-0 rounded-[7px] bg-muted" />
                  <div className="flex flex-col gap-1">
                    <div className="h-[14px] w-28 rounded bg-muted" />
                    <div className="h-3 w-20 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={matchKey}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
        >
          <ProfileCard
            player={matchup.left}
            experiences={matchup.left.experiences}
            revealed={phase === "revealed"}
            rank={rankMap.get(matchup.left.id)}
            picked={phase === "revealed" && lastVote === "left"}
            onClick={phase === "voting" ? () => handleVote("left") : undefined}
          />
          <ProfileCard
            player={matchup.right}
            experiences={matchup.right.experiences}
            revealed={phase === "revealed"}
            rank={rankMap.get(matchup.right.id)}
            picked={phase === "revealed" && lastVote === "right"}
            onClick={phase === "voting" ? () => handleVote("right") : undefined}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === "revealed" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex w-full flex-col items-center gap-4"
          >
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-xl font-black tracking-tight">{revealHeadline}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={advance}
                className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-foreground/85"
              >
                Next match
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
              >
                {copied ? "Copied!" : "Share this"}
              </button>
              <Link
                href="/leaderboard"
                className="rounded-md px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                See leaderboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="font-mono text-[11px] text-muted-foreground text-center">
        listing ≠ endorsement &nbsp;·&nbsp;{" "}
        <Link href="/about" className="hover:text-foreground underline underline-offset-2">how ranking works</Link>
        &nbsp;·&nbsp;{" "}
        <Link href="/nominate" className="hover:text-foreground underline underline-offset-2">nominate someone</Link>
      </p>
    </div>
  );
}
