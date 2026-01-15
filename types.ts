
export interface SurveyOption {
  id: string;
  label: string;
}

export interface User {
  id: string; // Employee ID or Name
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface SurveyResponse {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  rankings: Record<number, string>; // Rank (1-5) -> Option ID
}

export type ViewMode = 'LOGIN' | 'USER' | 'ADMIN';

export interface RankingData {
  optionLabel: string;
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
  totalPoints: number;
}
