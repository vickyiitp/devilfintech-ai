// types.ts

export type Feedback = 'thumbs_up' | 'thumbs_down' | null;

export enum PolicyStatus {
  Unspecified = 'UNSPECIFIED',
  Blocked = 'BLOCKED',
  Allowed = 'ALLOWED',
}

export enum VerificationStatus {
  Unverified = 'UNVERIFIED',
  Verified = 'VERIFIED',
  Contradictory = 'CONTRADICTORY',
}

export enum FactTopic {
  Fraud = 'FRAUD',
  Savings = 'SAVINGS',
  Taxes = 'TAXES',
  Budgeting = 'BUDGETING',
}

export interface Provenance {
  source: string;
  snippet: string;
  confidence: number;
}

export interface GroundingChunkWeb {
  uri?: string;
  title?: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  imageUrl?: string;
  provenance?: Provenance[];
  groundingChunks?: GroundingChunk[];
  verificationStatus?: VerificationStatus;
  policyStatus?: PolicyStatus;
  isThinking?: boolean;
  isError?: boolean;
  followUpSuggestions?: string[];
  sources?: GroundingChunkWeb[];
  feedback?: Feedback;
}

export type PrebuiltVoice = 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';

export interface AudioSettings {
  voice: PrebuiltVoice;
  speed: number;
}


export interface AudioPlaybackState {
  activeMessageId: string | null;
  status: 'playing' | 'paused' | 'loading' | 'idle';
  progress: number;
  duration: number;
}

export type Theme = 'dark' | 'light';

export type AgeGroup = 'under_30' | '30_45' | '46_60' | 'over_60';
export type RiskTolerance = 'low' | 'medium' | 'high';
export type FinancialGoal = 'retirement' | 'wealth_creation' | 'tax_saving' | 'major_purchase';

export interface FinancialProfile {
  ageGroup: AgeGroup;
  riskTolerance: RiskTolerance;
  financialGoals: FinancialGoal[];
}

export interface UserSettings {
  theme: Theme;
  audio: AudioSettings;
  financialProfile: FinancialProfile;
  proMode: boolean;
}

// NEW: User profile for avatars and gamification
export interface UserProfile {
  id: string; // Same as name for simplicity in this client-side app
  name: string;
  avatarId: string; // e.g., 'boy1', 'girl3'
  score: number;
  lastActive: string; // ISO Date string
}
