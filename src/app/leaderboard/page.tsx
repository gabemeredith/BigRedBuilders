import { Leaderboard } from "@/components/Leaderboard";
import { players } from "@/data/players";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-1 text-muted-foreground">
          The definitive Big Red hierarchy.
        </p>
      </div>
      <Leaderboard players={players} />
    </div>
  );
}
