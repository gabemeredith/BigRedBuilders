export default function LeaderboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      <p className="text-muted-foreground">
        The definitive Big Red hierarchy.
      </p>
      {/* PlayerLeaderboard will go here */}
      <div className="mt-8 w-full max-w-2xl rounded-xl border border-dashed border-border p-16 text-center text-sm text-muted-foreground">
        Leaderboard table placeholder
      </div>
    </div>
  );
}
