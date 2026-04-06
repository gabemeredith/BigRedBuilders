"use client";

import { Player, Experience } from "@/types";
import { ExperienceList } from "./ExperienceList";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  player: Player;
  experiences: Experience[];
  revealed: boolean;
  side: "left" | "right";
}

export function ProfileCard({
  player,
  experiences,
  revealed,
  side,
}: ProfileCardProps) {
  return (
    <motion.div
      layout
      className={cn(
        "relative flex w-full flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 shadow-sm",
        "overflow-hidden"
      )}
    >
      {/* Avatar */}
      <div className="relative size-32 overflow-hidden rounded-full bg-muted">
        {player.photo ? (
          <img
            src={player.photo}
            alt={revealed ? player.name : "Candidate"}
            className={cn(
              "size-full object-cover transition-all duration-500",
              !revealed && "blur-xl scale-110"
            )}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <User className="size-10 text-muted-foreground" />
          </div>
        )}
        {!revealed && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
            <span className="text-2xl font-bold text-muted-foreground">?</span>
          </div>
        )}
      </div>

      {/* Name & descriptor */}
      <div className="flex flex-col items-center gap-1 text-center">
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.h3
              key="name"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xl font-semibold"
            >
              {player.name}
            </motion.h3>
          ) : (
            <motion.div
              key="hidden-name"
              className="h-7 w-36 rounded-md bg-muted"
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.p
              key="descriptor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="text-base text-muted-foreground"
            >
              {player.descriptor}
            </motion.p>
          ) : (
            <motion.div
              key="hidden-descriptor"
              className="h-5 w-48 rounded-md bg-muted"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Experiences */}
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            key="experiences"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="w-full"
          >
            <ExperienceList experiences={experiences} />
          </motion.div>
        ) : (
          <motion.div
            key="hidden-experiences"
            className="flex w-full flex-col gap-2"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-9 shrink-0 rounded-lg bg-muted" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="h-3.5 w-20 rounded bg-muted" />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side indicator */}
      <div className="absolute top-3 right-3">
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {side === "left" ? "A" : "B"}
        </span>
      </div>
    </motion.div>
  );
}
