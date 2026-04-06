import { describe, it, expect } from "vitest";
import {
  scoreMatchup,
  generateMatchup,
  generateMatchups,
} from "./matchup";
import type { Player, Match } from "@/types";

function makePlayer(id: string, overrides: Partial<Player> = {}): Player {
  return {
    id,
    name: `Player ${id}`,
    descriptor: "CS '26",
    photo: "/test.jpg",
    rating: 1200,
    wins: 0,
    losses: 0,
    ties: 0,
    exposureCount: 0,
    isActive: true,
    isHidden: false,
    ...overrides,
  };
}

function makeMatch(leftId: string, rightId: string): Match {
  return {
    id: `m-${leftId}-${rightId}`,
    playerLeftId: leftId,
    playerRightId: rightId,
    createdAt: new Date().toISOString(),
  };
}

describe("scoreMatchup", () => {
  it("scores equal-rated, fresh players highest", () => {
    const a = makePlayer("a");
    const b = makePlayer("b");
    const score = scoreMatchup(a, b, new Set());
    // Equal rating (max rating score), zero exposure (max exposure score), no recency penalty
    expect(score).toBeGreaterThan(0.8);
  });

  it("penalizes large rating gaps", () => {
    const close = scoreMatchup(
      makePlayer("a", { rating: 1200 }),
      makePlayer("b", { rating: 1250 }),
      new Set()
    );
    const far = scoreMatchup(
      makePlayer("a", { rating: 1200 }),
      makePlayer("b", { rating: 1800 }),
      new Set()
    );
    expect(close).toBeGreaterThan(far);
  });

  it("prefers low-exposure players", () => {
    const lowExposure = scoreMatchup(
      makePlayer("a", { exposureCount: 0 }),
      makePlayer("b", { exposureCount: 0 }),
      new Set()
    );
    const highExposure = scoreMatchup(
      makePlayer("a", { exposureCount: 50 }),
      makePlayer("b", { exposureCount: 50 }),
      new Set()
    );
    expect(lowExposure).toBeGreaterThan(highExposure);
  });

  it("penalizes recently matched players", () => {
    const a = makePlayer("a");
    const b = makePlayer("b");
    const fresh = scoreMatchup(a, b, new Set());
    const stale = scoreMatchup(a, b, new Set(["a", "b"]));
    expect(fresh).toBeGreaterThan(stale);
  });
});

describe("generateMatchup", () => {
  it("returns null with fewer than 2 eligible players", () => {
    expect(generateMatchup([])).toBeNull();
    expect(generateMatchup([makePlayer("a")])).toBeNull();
  });

  it("returns null when all players are inactive", () => {
    const players = [
      makePlayer("a", { isActive: false }),
      makePlayer("b", { isActive: false }),
    ];
    expect(generateMatchup(players)).toBeNull();
  });

  it("returns null when all players are hidden", () => {
    const players = [
      makePlayer("a", { isHidden: true }),
      makePlayer("b", { isHidden: true }),
    ];
    expect(generateMatchup(players)).toBeNull();
  });

  it("returns a valid matchup with 2 eligible players", () => {
    const players = [makePlayer("a"), makePlayer("b")];
    const matchup = generateMatchup(players);

    expect(matchup).not.toBeNull();
    expect(matchup!.left.id).not.toBe(matchup!.right.id);
    expect(matchup!.score).toBeGreaterThan(0);
  });

  it("filters out inactive and hidden players", () => {
    const players = [
      makePlayer("a"),
      makePlayer("b", { isActive: false }),
      makePlayer("c", { isHidden: true }),
      makePlayer("d"),
    ];
    const matchup = generateMatchup(players);

    expect(matchup).not.toBeNull();
    const ids = [matchup!.left.id, matchup!.right.id];
    expect(ids).toContain("a");
    expect(ids).toContain("d");
    expect(ids).not.toContain("b");
    expect(ids).not.toContain("c");
  });

  it("prefers similarly-rated players", () => {
    const players = [
      makePlayer("a", { rating: 1200 }),
      makePlayer("b", { rating: 1210 }),
      makePlayer("c", { rating: 1800 }),
    ];

    // Run many times and check the most common matchup
    const counts: Record<string, number> = {};
    for (let i = 0; i < 100; i++) {
      const matchup = generateMatchup(players);
      const key = [matchup!.left.id, matchup!.right.id].sort().join("-");
      counts[key] = (counts[key] || 0) + 1;
    }

    // a-b should be the most common matchup (closest ratings)
    expect(counts["a-b"]).toBe(100);
  });

  it("considers recency when generating matchups", () => {
    const players = [
      makePlayer("a", { rating: 1200 }),
      makePlayer("b", { rating: 1200 }),
      makePlayer("c", { rating: 1200 }),
    ];
    // a and b were just matched
    const recentMatches = [makeMatch("a", "b")];

    const matchup = generateMatchup(players, recentMatches);
    expect(matchup).not.toBeNull();

    // Should avoid a-b rematch due to recency penalty
    const ids = [matchup!.left.id, matchup!.right.id].sort().join("-");
    expect(ids).not.toBe("a-b");
  });
});

describe("generateMatchups", () => {
  it("returns empty array with fewer than 2 players", () => {
    expect(generateMatchups([], [], 3)).toEqual([]);
    expect(generateMatchups([makePlayer("a")], [], 3)).toEqual([]);
  });

  it("returns correct number of matchups", () => {
    const players = Array.from({ length: 10 }, (_, i) =>
      makePlayer(`p${i}`)
    );
    const matchups = generateMatchups(players, [], 3);
    expect(matchups).toHaveLength(3);
  });

  it("ensures no player appears in multiple matchups", () => {
    const players = Array.from({ length: 10 }, (_, i) =>
      makePlayer(`p${i}`)
    );
    const matchups = generateMatchups(players, [], 5);

    const seenIds = new Set<string>();
    for (const m of matchups) {
      expect(seenIds.has(m.left.id)).toBe(false);
      expect(seenIds.has(m.right.id)).toBe(false);
      seenIds.add(m.left.id);
      seenIds.add(m.right.id);
    }
  });

  it("returns fewer matchups when not enough players", () => {
    const players = [makePlayer("a"), makePlayer("b"), makePlayer("c")];
    // Can only make 1 matchup without reusing players
    const matchups = generateMatchups(players, [], 5);
    expect(matchups.length).toBeLessThanOrEqual(1);
  });
});
