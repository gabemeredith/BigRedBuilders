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
  const [pair, setPair] = useState<[Player, Player] | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setPair(pickPair(players));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [matchKey, setMatchKey] = useState(0);
  const [lastVote, setLastVote] = useState<VoteResult | null>(null);

  const leftExperiences = useMemo(
    () => pair ? experiences.filter((e) => e.playerId === pair[0].id) : [],
    [experiences, pair]
  );
  const rightExperiences = useMemo(
    () => pair ? experiences.filter((e) => e.playerId === pair[1].id) : [],
    [experiences, pair]
  );

  const handleVote = useCallback(
    (result: VoteResult) => {
      if (revealed || !pair) return;
      setLastVote(result);
      setRevealed(true);

      // After reveal, load next pair
      setTimeout(() => {
        setPair((prev) => prev ? pickPair(players, [prev[0].id, prev[1].id]) : pickPair(players));
        setRevealed(false);
        setLastVote(null);
        setMatchKey((k) => k + 1);
      }, 2000);
    },
    [revealed, pair, players]
  );

  const voteLabel =
    !pair ? null
    : lastVote === "left"
      ? `${pair[0].name} wins!`
      : lastVote === "right"
        ? `${pair[1].name} wins!`
        : lastVote === "equal"
          ? "It's a tie!"
          : lastVote === "skip"
            ? "Skipped"
            : null;

  if (!pair) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="flex w-full flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 shadow-sm animate-pulse">
            <div className="size-32 rounded-full bg-muted" />
            <div className="flex flex-col items-center gap-2">
              <div className="h-7 w-36 rounded-md bg-muted" />
              <div className="h-5 w-48 rounded-md bg-muted" />
            </div>
            <div className="flex w-full flex-col gap-3">
              {[1, 2].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="size-9 shrink-0 rounded-lg bg-muted" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-28 rounded bg-muted" />
                    <div className="h-3.5 w-20 rounded bg-muted" />
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
            onClick={revealed ? undefined : () => handleVote("left")}
          />
          <ProfileCard
            player={pair[1]}
            experiences={rightExperiences}
            revealed={revealed}
            side="right"
            onClick={revealed ? undefined : () => handleVote("right")}
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
              className="text-sm font-semibold text-ivy-crimson"
            >
              {voteLabel}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <VoteControls onVote={handleVote} disabled={revealed} />

    </div>
  );
}
