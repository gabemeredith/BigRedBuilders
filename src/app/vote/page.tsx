"use client";

import { VoteArena } from "@/components/VoteArena";
import { players, experiences } from "@/data/players";

export default function VotePage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 py-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-[44px] font-black tracking-[-0.035em] leading-none">
          Who&apos;s more <em className="not-italic text-ivy-accent">cracked?</em>
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-2">
          Compare two Ivy profiles blind. Vote your gut.
        </p>
      </div>
      <VoteArena players={players} experiences={experiences} />
    </div>
  );
}
