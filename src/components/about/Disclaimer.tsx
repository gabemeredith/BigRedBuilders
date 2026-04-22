export function Disclaimer() {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-secondary/50 p-6">
      <h2 className="text-sm font-semibold">The fine print</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          Ivy Builder Rankings is a student-built social game. It is not
          affiliated with, endorsed by, or representative of any Ivy League
          university, employer, or organization listed on player profiles.
        </p>
        <p>
          Rankings are generated entirely by anonymous peer votes and reflect
          nothing other than the collective opinion of voters. They are not
          measures of intelligence, competence, character, or worth.
        </p>
        <p>
          If you want your profile removed, reach out and we&apos;ll handle it
          immediately. No hard feelings, no questions asked.
        </p>
      </div>
      <div className="pt-2">
        <a
          href="mailto:gabriel.b.meredith@gmail.com"
          className="text-sm font-medium text-ivy-accent underline-offset-4 hover:underline"
        >
          Contact us →
        </a>
      </div>
    </section>
  );
}
