export interface Player {
  id: string;
  name: string;
  descriptor: string; // e.g. "CS '26 · College of Engineering"
  photo: string;
  headline?: string;
  rating: number;
  wins: number;
  losses: number;
  ties: number;
  exposureCount: number;
  isActive: boolean;
  isHidden: boolean;
  tags?: string[];
}

export interface Experience {
  id: string;
  playerId: string;
  companyName: string;
  companyLogo?: string;
  roleTitle: string;
  sortOrder: number;
}

export interface Match {
  id: string;
  playerLeftId: string;
  playerRightId: string;
  createdAt: string;
}

export type VoteResult = "left" | "right" | "equal" | "skip";

export interface Vote {
  id: string;
  matchId: string;
  result: VoteResult;
  createdAt: string;
}
