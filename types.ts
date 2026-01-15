
export interface SurveyOption {
  id: string;
  label: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: number;
  rankings: Record<number, string>; // Rank (1-5) -> Option ID
}

export type ViewMode = 'USER' | 'ADMIN';

export interface RankingData {
  optionLabel: string;
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
  totalPoints: number;
}
