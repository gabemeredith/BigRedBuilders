import Link from "next/link";

export function NominateBanner() {
  return (
    <div className="w-full rounded-xl border border-border bg-muted/40 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p className="font-bold tracking-tight">Know someone who belongs on this list?</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Self-nominations and referrals welcome — Ivy undergrads and recent alumni only.
        </p>
      </div>
      <Link
        href="/nominate"
        className="shrink-0 rounded-md bg-foreground px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-foreground/85 whitespace-nowrap"
      >
        Nominate a builder →
      </Link>
    </div>
  );
}
