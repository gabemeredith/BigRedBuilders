"use client";

import { VoteArena } from "@/components/VoteArena";
import { players, experiences } from "@/data/players";

export default function VotePage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 py-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Who&apos;s more cracked?
        </h1>
        <p className="text-base text-muted-foreground">
          Compare profiles blind, then see who you picked
        </p>
      </div>
      <VoteArena players={players} experiences={experiences} />
    </div>
  );
}
