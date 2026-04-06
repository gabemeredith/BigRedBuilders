"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Player, Experience, VoteResult } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { VoteControls } from "./VoteControls";
import { motion, AnimatePresence } from "framer-motion";

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

export function VoteArena({ players, experiences }: VoteArenaProps) {
  const [pair, setPair] = useState<[Player, Player]>(() => pickPair(players));
  const [revealed, setRevealed] = useState(false);
  const [matchKey, setMatchKey] = useState(0);
  const [lastVote, setLastVote] = useState<VoteResult | null>(null);

  const leftExperiences = useMemo(
    () => experiences.filter((e) => e.playerId === pair[0].id),
    [experiences, pair]
  );
  const rightExperiences = useMemo(
    () => experiences.filter((e) => e.playerId === pair[1].id),
    [experiences, pair]
  );

  const handleVote = useCallback(
    (result: VoteResult) => {
      if (revealed) return;
      setLastVote(result);
      setRevealed(true);

      // After reveal, load next pair
      setTimeout(() => {
        setPair((prev) => pickPair(players, [prev[0].id, prev[1].id]));
        setRevealed(false);
        setLastVote(null);
        setMatchKey((k) => k + 1);
      }, 2000);
    },
    [revealed, players]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (revealed) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      switch (e.key.toLowerCase()) {
        case "a":
          handleVote("left");
          break;
        case "l":
          handleVote("right");
          break;
        case "e":
          handleVote("equal");
          break;
        case "s":
          handleVote("skip");
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleVote, revealed]);

  const voteLabel =
    lastVote === "left"
      ? `${pair[0].name} wins!`
      : lastVote === "right"
        ? `${pair[1].name} wins!`
        : lastVote === "equal"
          ? "It's a tie!"
          : lastVote === "skip"
            ? "Skipped"
            : null;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={matchKey}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35 }}
          className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
        >
          <ProfileCard
            player={pair[0]}
            experiences={leftExperiences}
            revealed={revealed}
            side="left"
          />
          <ProfileCard
            player={pair[1]}
            experiences={rightExperiences}
            revealed={revealed}
            side="right"
          />
        </motion.div>
      </AnimatePresence>

      {/* Vote feedback */}
      <div className="h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {voteLabel && (
            <motion.p
              key={voteLabel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-semibold text-cornell-red"
            >
              {voteLabel}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <VoteControls onVote={handleVote} disabled={revealed} />

      {/* Shortcut hint */}
      <p className="text-xs text-muted-foreground">
        Keyboard: <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">A</kbd> left
        {" · "}
        <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">L</kbd> right
        {" · "}
        <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">E</kbd> equal
        {" · "}
        <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">S</kbd> skip
      </p>
    </div>
  );
}
