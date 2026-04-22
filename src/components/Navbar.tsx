"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links: { href: string; label: string; accent?: boolean }[] = [
  { href: "/vote", label: "Vote" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/about", label: "About" },
  { href: "/nominate", label: "Nominate", accent: true },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex size-[18px] shrink-0 items-center justify-center rounded-full bg-foreground">
            <span className="size-[7px] rounded-full bg-ivy-accent" />
          </span>
          <span className="text-sm font-black uppercase tracking-tight">
            rIVYalry
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5">
          {links.map((link) =>
            link.accent ? (
              <Link
                key={link.href}
                href={link.href}
                className="ml-1 rounded-md bg-ivy-accent px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-ivy-accent-hover"
              >
                {link.label} →
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                  pathname === link.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Live counter */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ivy-accent opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-ivy-accent" />
          </span>
          <span>847 voting now</span>
        </div>
      </div>
    </nav>
  );
}
