import { Leaderboard } from "@/components/Leaderboard";
import { NominateBanner } from "@/components/NominateBanner";
import { players } from "@/data/players";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight">The cracked index.</h1>
        <p className="mt-1.5 text-muted-foreground font-mono text-sm">
          Top performers across the Ivy League, sorted by Elo.
        </p>
      </div>
      <Leaderboard players={players} />
      <NominateBanner />
    </div>
  );
}
