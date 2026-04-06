export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <p className="max-w-lg text-center text-muted-foreground">
        Big Red Rankings is a playful social game where Cornell students vote on
        who&apos;s more cracked. It&apos;s for fun — not a serious ranking.
      </p>
      {/* AboutSections will go here */}
      <div className="mt-8 w-full max-w-2xl rounded-xl border border-dashed border-border p-16 text-center text-sm text-muted-foreground">
        About sections placeholder
      </div>
    </div>
  );
}
