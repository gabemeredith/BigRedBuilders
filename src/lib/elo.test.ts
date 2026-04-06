import { describe, it, expect } from "vitest";
import {
  expectedScore,
  newRating,
  processVote,
  applyVoteToPlayers,
  DEFAULT_RATING,
} from "./elo";
import type { Player } from "@/types";

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: "p1",
    name: "Test Player",
    descriptor: "CS '26",
    photo: "/test.jpg",
    rating: DEFAULT_RATING,
    wins: 0,
    losses: 0,
    ties: 0,
    exposureCount: 0,
    isActive: true,
    isHidden: false,
    ...overrides,
  };
}

describe("expectedScore", () => {
  it("returns 0.5 for equal ratings", () => {
    expect(expectedScore(1200, 1200)).toBeCloseTo(0.5);
  });

  it("returns higher value for higher-rated player", () => {
    const score = expectedScore(1600, 1200);
    expect(score).toBeGreaterThan(0.5);
    expect(score).toBeLessThan(1);
  });

  it("returns lower value for lower-rated player", () => {
    const score = expectedScore(1200, 1600);
    expect(score).toBeLessThan(0.5);
    expect(score).toBeGreaterThan(0);
  });

  it("expected scores of opponents sum to 1", () => {
    const a = expectedScore(1400, 1200);
    const b = expectedScore(1200, 1400);
    expect(a + b).toBeCloseTo(1);
  });

  it("400-point gap gives ~0.91 expected score", () => {
    const score = expectedScore(1600, 1200);
    expect(score).toBeCloseTo(0.909, 2);
  });
});

describe("newRating", () => {
  it("increases rating on a win with positive K-factor", () => {
    const rating = newRating(1200, 1, 0.5, 32);
    expect(rating).toBe(1216);
  });

  it("decreases rating on a loss", () => {
    const rating = newRating(1200, 0, 0.5, 32);
    expect(rating).toBe(1184);
  });

  it("no change on draw with equal expected score", () => {
    const rating = newRating(1200, 0.5, 0.5, 32);
    expect(rating).toBe(1200);
  });
});

describe("processVote", () => {
  it("left win: left gains, right loses", () => {
    const result = processVote(1200, 1200, "left");
    expect(result.leftDelta).toBeGreaterThan(0);
    expect(result.rightDelta).toBeLessThan(0);
    expect(result.leftDelta).toBe(-result.rightDelta);
  });

  it("right win: right gains, left loses", () => {
    const result = processVote(1200, 1200, "right");
    expect(result.rightDelta).toBeGreaterThan(0);
    expect(result.leftDelta).toBeLessThan(0);
  });

  it("equal: no change for equal ratings", () => {
    const result = processVote(1200, 1200, "equal");
    expect(result.leftDelta).toBe(0);
    expect(result.rightDelta).toBe(0);
  });

  it("skip: no rating change", () => {
    const result = processVote(1500, 1200, "skip");
    expect(result.leftDelta).toBe(0);
    expect(result.rightDelta).toBe(0);
    expect(result.leftRating).toBe(1500);
    expect(result.rightRating).toBe(1200);
  });

  it("upset win gives more points", () => {
    // Low-rated player beats high-rated player
    const upset = processVote(1000, 1400, "left");
    const expected = processVote(1200, 1200, "left");
    expect(upset.leftDelta).toBeGreaterThan(expected.leftDelta);
  });

  it("favored win gives fewer points", () => {
    const favored = processVote(1400, 1000, "left");
    const even = processVote(1200, 1200, "left");
    expect(favored.leftDelta).toBeLessThan(even.leftDelta);
  });
});

describe("applyVoteToPlayers", () => {
  it("updates wins/losses correctly for left win", () => {
    const left = makePlayer({ id: "a" });
    const right = makePlayer({ id: "b" });
    const result = applyVoteToPlayers(left, right, "left");

    expect(result.left.wins).toBe(1);
    expect(result.left.losses).toBe(0);
    expect(result.right.wins).toBe(0);
    expect(result.right.losses).toBe(1);
  });

  it("updates ties correctly for equal", () => {
    const left = makePlayer({ id: "a" });
    const right = makePlayer({ id: "b" });
    const result = applyVoteToPlayers(left, right, "equal");

    expect(result.left.ties).toBe(1);
    expect(result.right.ties).toBe(1);
    expect(result.left.wins).toBe(0);
    expect(result.right.wins).toBe(0);
  });

  it("increments exposureCount on non-skip votes", () => {
    const left = makePlayer({ id: "a", exposureCount: 5 });
    const right = makePlayer({ id: "b", exposureCount: 3 });
    const result = applyVoteToPlayers(left, right, "left");

    expect(result.left.exposureCount).toBe(6);
    expect(result.right.exposureCount).toBe(4);
  });

  it("does not increment exposureCount on skip", () => {
    const left = makePlayer({ id: "a", exposureCount: 5 });
    const right = makePlayer({ id: "b", exposureCount: 3 });
    const result = applyVoteToPlayers(left, right, "skip");

    expect(result.left.exposureCount).toBe(5);
    expect(result.right.exposureCount).toBe(3);
  });

  it("does not mutate original player objects", () => {
    const left = makePlayer({ id: "a" });
    const right = makePlayer({ id: "b" });
    applyVoteToPlayers(left, right, "left");

    expect(left.wins).toBe(0);
    expect(left.rating).toBe(DEFAULT_RATING);
  });
});
