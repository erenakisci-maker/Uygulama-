
export interface TenseRule {
  id: string;
  category: string;
  name: string;
  description: string;
  positive: { example: string; translation: string };
  negative: { example: string; translation: string };
  question: { example: string; translation: string };
}

export interface WordData {
  word: string;
  translation?: string;
  phonetic?: string;
  partOfSpeech: string;
  definitions: string[];
  examples: string[];
  etymology?: string;
  etymologyStages?: string[];
  synonyms?: string[];
  register?: string;
  connotation?: string;
  idioms?: string[];
  // New fields for advanced features
  polyglotMirror?: PolyglotInsight[];
  chronology?: MeaningShift[];
  // SRS Fields
  srsLevel?: number;     // Spaced Repetition System level
  nextReviewDate?: string; // ISO string for next review
}

export interface PolyglotInsight {
  language: string;
  word: string;
  meaning: string;
  connotation: string;
}

export interface MeaningShift {
  era: string;
  definition: string;
  context: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  type: 'MASTER' | 'STREAK' | 'DISCOVERY';
  progress?: number; // 0-100 percentage
  goal?: number;     // The target number for the achievement
}

export type PlanTier = 'FREE' | 'PREMIUM';

export interface DailyUsage {
  searches: number;
  muse: number;
  oracle: number;
  images: number;
  analysis: number; // New: For Journal & Pronunciation
  lastReset: string; // ISO Date string to track day reset
}

export interface UserStats {
  username: string;
  avatar: string;
  bio: string;
  rank: string;
  plan: PlanTier; // New: Subscription Plan
  usage: DailyUsage; // New: Usage counters
  wordsMastered: number;
  streak: number;
  lexicalDepth: number;
  recentWords: string[];
  dailyProgress: number;
  dailyGoal: number;
  achievements: Achievement[];
  highScore: number;
}

export interface UserSettings {
  theme: 'LIGHT' | 'DARK' | 'PARCHMENT';
  dialect: 'UK' | 'US';
  notifications: boolean;
  offlineEnabled: boolean;
  complexity: 'STANDARD' | 'POLYMATH';
}

export interface SearchSuggestion {
  word: string;
  type: 'match' | 'fuzzy';
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  words: WordData[];
  isCustom?: boolean;
  themeColor?: string; // Hex code for the collection theme
  texture?: string;    // Texture type identifier
}

export interface JournalEntry {
  id: string;
  word: string;
  date: string; // ISO String
  content: string;
  analysis?: JournalAnalysis;
}

export interface JournalAnalysis {
  eloquenceScore: number; // 0-100
  tone: string;
  vocabularyRichness: string;
  critique: string;
  suggestion: string;
}

export interface PronunciationResult {
  score: number; // 0-100
  phoneticAccuracy: string; // e.g., "Good", "Close", "Needs Work"
  detectedPhonemes: string; // What the user sounded like
  tips: string[]; // Specific advice
  encouragement: string;
}

export interface CreativePrompt {
  id: string;
  targetWord: string;
  style: string; // e.g., "Gothic", "Sci-Fi", "Minimalist"
  scenario: string; // The instruction, e.g., "Describe a storm..."
  constraint: string; // e.g., "Use no more than 30 words"
}

export interface CreativeCritique {
  creativityScore: number; // 0-100
  styleMatch: string; // "Perfect", "Good", "Off-topic"
  literaryDeviceUsed: string; // e.g., "Metaphor", "Alliteration"
  feedback: string;
}

export interface LinguisticTrivia {
  title: string;
  fact: string;
  connection: string; // e.g., "Latince -> Modern İngilizce"
  iconType: 'HISTORY' | 'MAGIC' | 'SCIENCE';
}
