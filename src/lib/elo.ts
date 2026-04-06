import type { Player, VoteResult } from "@/types";

const DEFAULT_K_FACTOR = 32;
const DEFAULT_RATING = 1200;

/**
 * Calculate the expected score for player A against player B.
 * Returns a value between 0 and 1.
 */
export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculate the new rating for a player given their current rating,
 * their actual score (1 = win, 0.5 = draw, 0 = loss), and the expected score.
 */
export function newRating(
  currentRating: number,
  actualScore: number,
  expectedScore: number,
  kFactor: number = DEFAULT_K_FACTOR
): number {
  return Math.round(currentRating + kFactor * (actualScore - expectedScore));
}

export interface RatingUpdate {
  leftRating: number;
  rightRating: number;
  leftDelta: number;
  rightDelta: number;
}

/**
 * Process a vote result and return the updated ratings for both players.
 * Skip votes produce no rating change.
 */
export function processVote(
  leftRating: number,
  rightRating: number,
  result: VoteResult,
  kFactor: number = DEFAULT_K_FACTOR
): RatingUpdate {
  if (result === "skip") {
    return {
      leftRating,
      rightRating,
      leftDelta: 0,
      rightDelta: 0,
    };
  }

  const leftExpected = expectedScore(leftRating, rightRating);
  const rightExpected = expectedScore(rightRating, leftRating);

  let leftActual: number;
  let rightActual: number;

  switch (result) {
    case "left":
      leftActual = 1;
      rightActual = 0;
      break;
    case "right":
      leftActual = 0;
      rightActual = 1;
      break;
    case "equal":
      leftActual = 0.5;
      rightActual = 0.5;
      break;
  }

  const newLeftRating = newRating(leftRating, leftActual, leftExpected, kFactor);
  const newRightRating = newRating(rightRating, rightActual, rightExpected, kFactor);

  return {
    leftRating: newLeftRating,
    rightRating: newRightRating,
    leftDelta: newLeftRating - leftRating,
    rightDelta: newRightRating - rightRating,
  };
}

/**
 * Apply a vote result to two player objects, returning updated copies.
 * Updates rating, wins/losses/ties, and exposureCount.
 */
export function applyVoteToPlayers(
  left: Player,
  right: Player,
  result: VoteResult,
  kFactor: number = DEFAULT_K_FACTOR
): { left: Player; right: Player } {
  const update = processVote(left.rating, right.rating, result, kFactor);

  const updatedLeft: Player = {
    ...left,
    rating: update.leftRating,
    exposureCount: left.exposureCount + (result === "skip" ? 0 : 1),
    wins: left.wins + (result === "left" ? 1 : 0),
    losses: left.losses + (result === "right" ? 1 : 0),
    ties: left.ties + (result === "equal" ? 1 : 0),
  };

  const updatedRight: Player = {
    ...right,
    rating: update.rightRating,
    exposureCount: right.exposureCount + (result === "skip" ? 0 : 1),
    wins: right.wins + (result === "right" ? 1 : 0),
    losses: right.losses + (result === "left" ? 1 : 0),
    ties: right.ties + (result === "equal" ? 1 : 0),
  };

  return { left: updatedLeft, right: updatedRight };
}

export { DEFAULT_K_FACTOR, DEFAULT_RATING };
