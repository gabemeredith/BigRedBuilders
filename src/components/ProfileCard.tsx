"use client";

import { Player, Experience, IvySchool } from "@/types";
import { ExperienceList } from "./ExperienceList";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

interface ProfileCardProps {
  player: Player;
  experiences: Experience[];
  revealed: boolean;
  side: "left" | "right";
  rank?: number;
  picked?: boolean;
  onClick?: () => void;
}

function winRate(player: Player) {
  const total = player.wins + player.losses + player.ties;
  return total === 0 ? 0 : Math.round((player.wins / total) * 100);
}

export function ProfileCard({
  player,
  experiences,
  revealed,
  side,
  rank,
  picked = false,
  onClick,
}: ProfileCardProps) {
  const initial = player.name.charAt(0).toUpperCase();

  return (
    <motion.div
      layout
      onClick={onClick}
      style={picked ? { boxShadow: "0 0 0 3px var(--color-ivy-accent-soft)" } : undefined}
      className={cn(
        "relative flex w-full flex-col items-center gap-0 rounded-xl border bg-card overflow-hidden",
        "transition-all duration-150",
        picked && "border-ivy-accent",
        !picked && "border-border",
        onClick && "cursor-pointer hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-lg"
      )}
    >
      {/* School chip */}
      <div className="absolute top-3 left-3">
        <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
          <span
            className="size-[7px] rounded-[2px] shrink-0"
            style={{ background: SCHOOL_COLORS[player.school] }}
          />
          {player.school}
        </span>
      </div>

      {/* Side key-cap */}
      <div className="absolute top-3 right-3">
        <span className="grid size-6 place-items-center rounded-md border border-border font-mono text-xs text-muted-foreground">
          {side === "left" ? "A" : "B"}
        </span>
      </div>

      {/* Portrait */}
      <div className="px-6 pt-12 pb-4 w-full flex justify-center">
        <div className="relative w-full max-w-[200px] aspect-square rounded-xl bg-muted overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.span
                key="question"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[64px] font-black leading-none text-muted-foreground/35 select-none"
              >
                ?
              </motion.span>
            ) : player.photo ? (
              <motion.img
                key="photo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={player.photo}
                alt={player.name}
                className="size-full object-cover"
              />
            ) : (
              <motion.span
                key="initial"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-[88px] font-black leading-none text-foreground select-none"
              >
                {initial}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Name & descriptor */}
      <div className="flex flex-col items-center gap-0.5 text-center px-6 pb-4 min-h-[52px] justify-center">
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.h3
              key="name"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="text-[15px] font-bold tracking-tight leading-tight"
            >
              {player.name}
            </motion.h3>
          ) : (
            <motion.div key="hidden-name" className="h-[18px] w-36 rounded bg-muted" />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.p
              key="descriptor"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="text-xs text-muted-foreground"
            >
              {player.descriptor}
            </motion.p>
          ) : (
            <motion.div key="hidden-desc" className="h-3.5 w-48 rounded bg-muted mt-1" />
          )}
        </AnimatePresence>
      </div>

      {/* Stats row */}
      <div className="grid w-full grid-cols-3 border-t border-b border-border">
        {[
          { label: "Elo",   value: player.rating.toLocaleString() },
          { label: "Rank",  value: rank != null ? `#${rank}` : "—" },
          { label: "Win %", value: `${winRate(player)}%` },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center gap-0.5 py-3 ${i < 2 ? "border-r border-border" : ""}`}
          >
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">{label}</span>
            <AnimatePresence mode="wait">
              {revealed ? (
                <motion.span
                  key="value"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 * i }}
                  className="font-mono text-base font-bold tracking-tight"
                >
                  {value}
                </motion.span>
              ) : (
                <motion.div
                  key="hidden"
                  className="mt-0.5 h-5 w-10 rounded bg-muted"
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Experiences */}
      <div className="w-full px-5 py-4">
        <ExperienceList experiences={experiences} />
      </div>
    </motion.div>
  );
}
