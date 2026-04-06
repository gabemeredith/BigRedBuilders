export function EloExplainer() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          The rating system
        </h2>
        <p className="text-muted-foreground">
          We use ELO — the same system chess uses to rank grandmasters. Except
          here it ranks Cornell students by vibes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RatingCard
          title="Starting rating"
          value="1200"
          description="Everyone starts equal. Your votes decide who climbs."
        />
        <RatingCard
          title="K-factor"
          value="32"
          description="How volatile ratings are. High enough to be exciting, low enough to stabilize."
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-secondary/50 p-6">
        <h3 className="text-sm font-semibold">How gains work</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-cornell-red">↑</span>
            <span>
              Beat someone ranked higher than you? Massive rating boost. The
              upset special.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-cornell-red">→</span>
            <span>
              Beat someone ranked similarly? Modest gain. Fair fight, fair
              reward.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-muted-foreground/50">↓</span>
            <span>
              Beat someone ranked way below you? Barely moves the needle. You
              were supposed to win.
            </span>
          </li>
        </ul>
        <p className="pt-1 text-xs text-muted-foreground/60">
          Ties split the difference. Skips don&apos;t count.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-secondary/50 p-6">
        <h3 className="text-sm font-semibold">Matchup selection</h3>
        <p className="text-sm text-muted-foreground">
          Matchups aren&apos;t random. The algorithm prefers pairing players with
          similar ratings for competitive matches, balances exposure so the same
          people don&apos;t show up constantly, and adds a recency penalty to
          avoid repeat matchups. It&apos;s designed to feel fresh every time.
        </p>
      </div>
    </section>
  );
}

function RatingCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border p-5 space-y-2">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <p className="text-3xl font-bold tabular-nums tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
