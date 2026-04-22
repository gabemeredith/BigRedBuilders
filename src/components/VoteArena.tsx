"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Player, Experience, VoteResult } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { VoteControls } from "./VoteControls";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface VoteArenaProps {
  players: Player[];
  experiences: Experience[];
}

function pickPair(players: Player[], prevIds?: [string, string]): [Player, Player] {
  const pool = players.filter((p) => p.isActive);
  if (pool.length < 2) throw new Error("Need at least 2 active players");

  let left: Player;
  let right: Player;
  do {
    left = pool[Math.floor(Math.random() * pool.length)];
    right = pool[Math.floor(Math.random() * pool.length)];
  } while (
    left.id === right.id ||
    (prevIds && left.id === prevIds[0] && right.id === prevIds[1]) ||
    (prevIds && left.id === prevIds[1] && right.id === prevIds[0])
  );

  return [left, right];
}

function randomAgreement() {
  return Math.floor(Math.random() * 26) + 52; // 52–78
}

export function VoteArena({ players, experiences }: VoteArenaProps) {
  const [pair, setPair] = useState<[Player, Player] | null>(null);
  const [phase, setPhase] = useState<"voting" | "revealed">("voting");
  const [matchKey, setMatchKey] = useState(0);
  const [lastVote, setLastVote] = useState<VoteResult | null>(null);
  const [agreement, setAgreement] = useState(62);
  const [copied, setCopied] = useState(false);
  const nextRef = useRef<() => void>(() => {});

  // Rank lookup by rating
  const rankMap = useMemo(() => {
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    const map = new Map<string, number>();
    sorted.forEach((p, i) => map.set(p.id, i + 1));
    return map;
  }, [players]);

  useEffect(() => {
    setPair(pickPair(players));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftExperiences = useMemo(
    () => pair ? experiences.filter((e) => e.playerId === pair[0].id) : [],
    [experiences, pair]
  );
  const rightExperiences = useMemo(
    () => pair ? experiences.filter((e) => e.playerId === pair[1].id) : [],
    [experiences, pair]
  );

  const advance = useCallback(() => {
    setPair((prev) => prev ? pickPair(players, [prev[0].id, prev[1].id]) : pickPair(players));
    setPhase("voting");
    setLastVote(null);
    setMatchKey((k) => k + 1);
  }, [players]);

  // Keep ref in sync so the keydown handler always calls the latest version
  useEffect(() => { nextRef.current = advance; }, [advance]);

  const handleVote = useCallback(
    (result: VoteResult) => {
      if (phase === "revealed" || !pair) return;
      setLastVote(result);
      setAgreement(randomAgreement());
      setPhase("revealed");
    },
    [phase, pair]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phase === "voting") {
        if (e.key === "a" || e.key === "A") handleVote("left");
        if (e.key === "l" || e.key === "L") handleVote("right");
        if (e.key === "e" || e.key === "E") handleVote("equal");
        if (e.key === "s" || e.key === "S") handleVote("skip");
      }
      if (phase === "revealed" && e.key === "Enter") {
        nextRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, handleVote]);

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
    !pair || !lastVote ? null
    : lastVote === "left" ? pair[0].name
    : lastVote === "right" ? pair[1].name
    : lastVote === "equal" ? null
    : null;

  const revealHeadline =
    lastVote === "equal" ? "You called it a tie."
    : lastVote === "skip" ? "Skipped."
    : pickedName ? `You picked ${pickedName}.`
    : null;

  if (!pair) {
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
      {/* Cards */}
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
            player={pair[0]}
            experiences={leftExperiences}
            revealed={phase === "revealed"}
            side="left"
            rank={rankMap.get(pair[0].id)}
            picked={phase === "revealed" && lastVote === "left"}
            onClick={phase === "voting" ? () => handleVote("left") : undefined}
          />
          <ProfileCard
            player={pair[1]}
            experiences={rightExperiences}
            revealed={phase === "revealed"}
            side="right"
            rank={rankMap.get(pair[1].id)}
            picked={phase === "revealed" && lastVote === "right"}
            onClick={phase === "voting" ? () => handleVote("right") : undefined}
          />
        </motion.div>
      </AnimatePresence>

      {/* Controls or Reveal banner */}
      <AnimatePresence mode="wait">
        {phase === "voting" ? (
          <motion.div
            key="controls"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex w-full flex-col items-center gap-4"
          >
            <VoteControls onVote={handleVote} disabled={false} />
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex w-full flex-col items-center gap-4"
          >
            {/* Reveal banner */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-xl font-black tracking-tight">{revealHeadline}</p>
              {lastVote !== "skip" && (
                <p className="font-mono text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{agreement}%</span> of voters agreed
                  {lastVote !== "equal" && <span className="text-ivy-accent font-mono text-xs ml-2">+14 taste pts</span>}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={advance}
                className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-foreground/85"
              >
                Next match
                <kbd className="rounded bg-background/15 px-1 py-0.5 font-mono text-[10px]">↵</kbd>
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

      {/* Footer footnote */}
      <p className="font-mono text-[11px] text-muted-foreground text-center">
        listing ≠ endorsement &nbsp;·&nbsp;{" "}
        <Link href="/about" className="hover:text-foreground underline underline-offset-2">how ranking works</Link>
        &nbsp;·&nbsp;{" "}
        <Link href="/nominate" className="hover:text-foreground underline underline-offset-2">nominate someone</Link>
      </p>
    </div>
  );
}
