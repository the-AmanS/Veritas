export enum VerdictType {
  VERIFIED = 'VERIFIED',
  FALSE = 'FALSE',
  MISLEADING = 'MISLEADING',
  UNVERIFIED = 'UNVERIFIED',
}

export interface Source {
  title: string;
  url: string;
  domain: string;
  sentiment: 'SUPPORT' | 'DISPUTE' | 'NEUTRAL';
}

export interface FactCheckResult {
  verdict: VerdictType;
  confidenceScore: number; // 0 to 100
  summary: string;
  keyFacts: string[]; // Bullet points for simpler explanation
  isDeveloping: boolean;
  sources: Source[];
  logicExplanation: string; // "3 Sources Confirm, 1 Source Disputes" logic
}