export function Disclaimer() {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-secondary/50 p-6">
      <h2 className="text-sm font-semibold">The fine print</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          Rivyalry is a student-built social game. It is not
          affiliated with, endorsed by, or representative of any Ivy League
          university, employer, or organization listed on player profiles.
        </p>
        <p>
          Rankings are generated entirely by anonymous peer votes and reflect
          nothing other than the collective opinion of voters. They are not
          measures of intelligence, competence, character, or worth.
        </p>
        <p>
          If you want your profile removed, email{" "}
          <a
            href="mailto:remove@rivyalry.com"
            className="text-foreground underline underline-offset-2"
          >
            remove@rivyalry.com
          </a>
          {" "}and we&apos;ll handle it immediately. No hard feelings, no questions asked.
        </p>
      </div>
    </section>
  );
}
