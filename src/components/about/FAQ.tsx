const faqs = [
  {
    question: "Is this serious?",
    answer:
      "No. This is a social game for fun. It's not an objective measure of anything. Please don't use it to make hiring decisions, romantic choices, or existential judgments about your self-worth.",
  },
  {
    question: "How do I get on the leaderboard?",
    answer:
      "You get nominated or submit yourself. We curate profiles to keep the pool interesting and balanced — not everyone who applies will be added immediately.",
  },
  {
    question: "Can I get removed?",
    answer:
      "Yes, instantly. No questions asked. Just reach out and we'll take your profile down. Opt-out is always available.",
  },
  {
    question: "Can I see who voted for me?",
    answer:
      "No. Votes are anonymous. You can see your rating and record, but not individual votes. Democracy is sacred.",
  },
  {
    question: "What does \"cracked\" mean?",
    answer:
      "It's intentionally vague. Could mean technical skill, hustle, resume strength, general aura, or some ineffable combination. You decide what it means when you vote.",
  },
  {
    question: "Can I vote multiple times?",
    answer:
      "You can vote in as many matchups as you want — that's the point. But you can't vote on the same matchup repeatedly. We have anti-abuse measures.",
  },
  {
    question: "Why ELO and not just total votes?",
    answer:
      "Total votes reward popularity, not quality. ELO rewards consistency against strong opponents. It's the difference between being famous and being good.",
  },
  {
    question: "Is this just for CS majors?",
    answer:
      "No. Any builder at an Ivy League school can be ranked. CS, quant, startup founders, researchers — crackedness transcends majors and schools.",
  },
];

export function FAQ() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
        <p className="text-muted-foreground">
          Questions we&apos;ve been asked, and some we made up.
        </p>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border">
        {faqs.map((faq) => (
          <div key={faq.question} className="px-5 py-4 space-y-1.5">
            <h3 className="text-sm font-semibold">{faq.question}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
