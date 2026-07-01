/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  sec: string; // section/topic name
  question: string;
  options: string[];
  correctAnswer: string; // must match exactly one of the options
  explanation: string;
}

export interface QuizConfig {
  questionCount: number; // 10, 20, 40, 60, or -1 for All
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timerOn: boolean;
  instantFeedback: boolean;
  selectedTopic?: string;
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  grade: string;
  timeUsed: number; // in seconds
  mode: 'practice' | 'exam';
  answers: Record<string, { selected: string; correct: string; isCorrect: boolean; isSkipped: boolean }>;
}

export interface UserStats {
  totalAttempts: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  timeSpent: number; // in seconds
  studyStreak: number;
  lastAttemptDate: string | null;
  dailyGoalProgress: number; // percentage of target questions answered today
  favoriteQuestions: string[]; // question ids
  recentlyAttempted: string[]; // question ids
  mistakeNotebook: string[]; // question ids with wrong answers
  topicStats: Record<string, { totalQuestions: number; correct: number; attempts: number }>;
  completedExams: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  iconName: string; // lucide icon identifier
  unlockedAt?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface TopicNote {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
}
