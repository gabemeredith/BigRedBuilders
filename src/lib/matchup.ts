import type { Player, Match } from "@/types";

export interface MatchupCandidate {
  left: Player;
  right: Player;
  score: number;
}

interface MatchupWeights {
  ratingSimilarity: number;
  lowExposure: number;
  recency: number;
}

const DEFAULT_WEIGHTS: MatchupWeights = {
  ratingSimilarity: 0.4,
  lowExposure: 0.35,
  recency: 0.25,
};

/**
 * Score a potential matchup between two players.
 * Higher score = better matchup.
 *
 * Factors:
 * - Rating similarity: closer ratings produce better matchups
 * - Low exposure: players with fewer matches should be shown more
 * - Recency: avoid rematches by penalizing recently paired players
 */
export function scoreMatchup(
  a: Player,
  b: Player,
  recentMatchPlayerIds: Set<string>,
  weights: MatchupWeights = DEFAULT_WEIGHTS
): number {
  // Rating similarity: 1.0 when equal, decays toward 0 as gap grows
  // 400 is one standard deviation in ELO
  const ratingGap = Math.abs(a.rating - b.rating);
  const ratingScore = Math.exp(-ratingGap / 400);

  // Low exposure: prefer players who haven't been seen much
  // Use the average exposure count; lower = better
  const avgExposure = (a.exposureCount + b.exposureCount) / 2;
  const exposureScore = 1 / (1 + avgExposure * 0.1);

  // Recency penalty: if either player was in a recent match, penalize
  const aRecent = recentMatchPlayerIds.has(a.id) ? 0 : 1;
  const bRecent = recentMatchPlayerIds.has(b.id) ? 0 : 1;
  const recencyScore = (aRecent + bRecent) / 2;

  return (
    weights.ratingSimilarity * ratingScore +
    weights.lowExposure * exposureScore +
    weights.recency * recencyScore
  );
}

/**
 * Generate the next matchup from a pool of active players.
 * Uses weighted scoring to balance rating similarity, exposure, and recency.
 *
 * @param players - All players (will be filtered to active, non-hidden)
 * @param recentMatches - Recent match history (used for recency penalty)
 * @param recentMatchCount - How many recent matches to consider for recency
 * @returns The best matchup candidate, or null if fewer than 2 eligible players
 */
export function generateMatchup(
  players: Player[],
  recentMatches: Match[] = [],
  recentMatchCount: number = 10
): MatchupCandidate | null {
  const eligible = players.filter((p) => p.isActive && !p.isHidden);

  if (eligible.length < 2) {
    return null;
  }

  // Build set of player IDs from recent matches
  const recent = recentMatches.slice(-recentMatchCount);
  const recentPlayerIds = new Set<string>();
  for (const match of recent) {
    recentPlayerIds.add(match.playerLeftId);
    recentPlayerIds.add(match.playerRightId);
  }

  // Rotation guarantee: any player absent from the last N matches must appear next.
  // N = pool size * 2 ensures everyone gets a turn before anyone repeats too often.
  // recentMatches are sorted most-recent-first, so take from the front.
  const rotationWindow = eligible.length * 2;
  const recentWindow = recentMatches.slice(0, rotationWindow);
  const recentWindowIds = new Set<string>();
  for (const match of recentWindow) {
    recentWindowIds.add(match.playerLeftId);
    recentWindowIds.add(match.playerRightId);
  }
  const starvedPlayers = eligible.filter((p) => !recentWindowIds.has(p.id));

  // If any players have been starved of appearances, force one into the next matchup.
  // Pick the most-starved (lowest exposure_count) and find their best opponent.
  let forcedPlayer: Player | null = null;
  if (starvedPlayers.length > 0) {
    forcedPlayer = starvedPlayers.reduce((a, b) =>
      a.exposureCount <= b.exposureCount ? a : b
    );
  }

  // Score all possible pairs and pick the best
  let bestCandidate: MatchupCandidate | null = null;

  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      // Skip pairs that don't include the forced player (if one exists)
      if (
        forcedPlayer &&
        eligible[i].id !== forcedPlayer.id &&
        eligible[j].id !== forcedPlayer.id
      ) {
        continue;
      }
      const score = scoreMatchup(eligible[i], eligible[j], recentPlayerIds);
      if (!bestCandidate || score > bestCandidate.score) {
        bestCandidate = {
          left: eligible[i],
          right: eligible[j],
          score,
        };
      }
    }
  }

  // Randomly assign left/right to avoid positional bias
  if (bestCandidate && Math.random() < 0.5) {
    bestCandidate = {
      left: bestCandidate.right,
      right: bestCandidate.left,
      score: bestCandidate.score,
    };
  }

  return bestCandidate;
}

/**
 * Generate multiple matchups at once (for prefetching).
 * Returns up to `count` matchups, each using different player pairs.
 */
export function generateMatchups(
  players: Player[],
  recentMatches: Match[] = [],
  count: number = 5
): MatchupCandidate[] {
  const eligible = players.filter((p) => p.isActive && !p.isHidden);

  if (eligible.length < 2) {
    return [];
  }

  const recentPlayerIds = new Set<string>();
  const recent = recentMatches.slice(-10);
  for (const match of recent) {
    recentPlayerIds.add(match.playerLeftId);
    recentPlayerIds.add(match.playerRightId);
  }

  // Score all pairs
  const allPairs: MatchupCandidate[] = [];
  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const score = scoreMatchup(eligible[i], eligible[j], recentPlayerIds);
      allPairs.push({ left: eligible[i], right: eligible[j], score });
    }
  }

  // Sort by score descending
  allPairs.sort((a, b) => b.score - a.score);

  // Pick top matchups ensuring no player appears twice
  const used = new Set<string>();
  const result: MatchupCandidate[] = [];

  for (const pair of allPairs) {
    if (result.length >= count) break;
    if (used.has(pair.left.id) || used.has(pair.right.id)) continue;

    used.add(pair.left.id);
    used.add(pair.right.id);
    result.push(pair);
  }

  return result;
}
