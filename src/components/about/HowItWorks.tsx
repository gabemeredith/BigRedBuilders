const steps = [
  {
    number: "01",
    title: "Two profiles appear",
    description:
      "You see two Cornell students side by side — name, affiliation, experience, the works. Identities are hidden at first for dramatic effect.",
  },
  {
    number: "02",
    title: "You reveal & vote",
    description:
      "Click to reveal, then cast your vote: left wins, right wins, equal, or skip. Keyboard shortcuts (A, L, E, S) if you're speedrunning.",
  },
  {
    number: "03",
    title: "ELO updates instantly",
    description:
      "Both players' ratings adjust based on the outcome and the strength of their opponent. Beat someone ranked higher? Big gains.",
  },
  {
    number: "04",
    title: "Leaderboard shifts",
    description:
      "The leaderboard re-ranks in real time. Screenshot it. Send it to your friends. Argue about it in Duffield.",
  },
];

export function HowItWorks() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <p className="text-muted-foreground">
          Four steps. No sign-up. No commitment. Pure judgment.
        </p>
      </div>

      <div className="relative space-y-0">
        {steps.map((step, i) => (
          <div key={step.number} className="relative flex gap-6 pb-8 last:pb-0">
            {/* Vertical connector line */}
            {i < steps.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
            )}

            {/* Step number circle */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-bold tabular-nums">
              {step.number}
            </div>

            {/* Step content */}
            <div className="space-y-1 pt-1.5">
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
