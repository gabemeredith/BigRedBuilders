export default function VotePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Rank Cornell Students
      </h1>
      <p className="text-muted-foreground">Who&apos;s more cracked?</p>
      {/* VoteArena will go here */}
      <div className="mt-8 rounded-xl border border-dashed border-border p-16 text-sm text-muted-foreground">
        Vote arena placeholder
      </div>
    </div>
  );
}
