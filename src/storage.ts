/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserStats, Badge, ExamResult, Question } from './types';
import { INITIAL_BADGES } from './data';
import { BANK } from './questions';

const STATS_KEY = 'phy102_stats_v1';
const BADGES_KEY = 'phy102_badges_v1';
const RESULTS_KEY = 'phy102_results_v1';

export function getStoredStats(): UserStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      const stats = JSON.parse(data) as UserStats;
      // Safeguard properties
      if (!stats.favoriteQuestions) stats.favoriteQuestions = [];
      if (!stats.recentlyAttempted) stats.recentlyAttempted = [];
      if (!stats.mistakeNotebook) stats.mistakeNotebook = [];
      if (!stats.topicStats) stats.topicStats = {};
      return stats;
    }
  } catch (e) {
    console.error("Failed to parse stats from localStorage", e);
  }

  // Generate initial empty stats
  const defaultTopicStats: Record<string, { totalQuestions: number; correct: number; attempts: number }> = {};
  BANK.forEach(q => {
    if (!defaultTopicStats[q.sec]) {
      defaultTopicStats[q.sec] = { totalQuestions: 0, correct: 0, attempts: 0 };
    }
    defaultTopicStats[q.sec].totalQuestions += 1;
  });

  return {
    totalAttempts: 0,
    totalCorrect: 0,
    totalWrong: 0,
    totalSkipped: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 100,
    timeSpent: 0,
    studyStreak: 1, // Start with a 1-day streak
    lastAttemptDate: null,
    dailyGoalProgress: 0,
    favoriteQuestions: [],
    recentlyAttempted: [],
    mistakeNotebook: [],
    topicStats: defaultTopicStats,
    completedExams: 0,
  };
}

export function saveStats(stats: UserStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getStoredBadges(): Badge[] {
  try {
    const data = localStorage.getItem(BADGES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to parse badges", e);
  }
  // Store initially
  localStorage.setItem(BADGES_KEY, JSON.stringify(INITIAL_BADGES));
  return INITIAL_BADGES;
}

export function saveBadges(badges: Badge[]) {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}

export function getStoredResults(): ExamResult[] {
  try {
    const data = localStorage.getItem(RESULTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse exam results", e);
  }
  return [];
}

export function saveResult(result: ExamResult): { updatedStats: UserStats; unlockedBadges: Badge[] } {
  const results = getStoredResults();
  results.unshift(result); // Add to beginning of array
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));

  const stats = getStoredStats();
  const badges = getStoredBadges();
  const newlyUnlockedBadges: Badge[] = [];

  // 1. Update basic numeric stats
  stats.totalAttempts += 1;
  const correctCount = Object.values(result.answers).filter(a => a.isCorrect).length;
  const wrongCount = Object.values(result.answers).filter(a => !a.isCorrect && !a.isSkipped).length;
  const skippedCount = Object.values(result.answers).filter(a => a.isSkipped).length;

  stats.totalCorrect += correctCount;
  stats.totalWrong += wrongCount;
  stats.totalSkipped += skippedCount;
  stats.timeSpent += result.timeUsed;

  if (result.mode === 'exam') {
    stats.completedExams += 1;
  }

  // 2. Update High/Low/Average Scores
  if (result.percentage > stats.highestScore) {
    stats.highestScore = result.percentage;
  }
  if (stats.lowestScore === 100 || result.percentage < stats.lowestScore) {
    stats.lowestScore = result.percentage;
  }
  
  // Calculate rolling average
  const totalCompletedQuestions = stats.totalCorrect + stats.totalWrong;
  stats.averageScore = totalCompletedQuestions > 0 
    ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong + stats.totalSkipped)) * 100) 
    : 0;

  // 3. Update Study Streak
  const todayStr = new Date().toDateString();
  if (stats.lastAttemptDate) {
    const lastAttempt = new Date(stats.lastAttemptDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastAttempt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      stats.studyStreak += 1;
    } else if (diffDays > 1) {
      stats.studyStreak = 1; // broken streak, reset
    }
  } else {
    stats.studyStreak = 1;
  }
  stats.lastAttemptDate = todayStr;

  // Daily goals progress (target: 15 questions per day)
  const dailyGoalTarget = 15;
  const currentDailyDone = correctCount + wrongCount;
  stats.dailyGoalProgress = Math.min(100, Math.round((currentDailyDone / dailyGoalTarget) * 100));

  // 4. Update Recently Attempted & Mistake Notebook
  const recentIds = Object.keys(result.answers);
  stats.recentlyAttempted = Array.from(new Set([...recentIds, ...stats.recentlyAttempted])).slice(0, 20);

  // Add mistakes to Mistake Notebook, remove corrected ones
  Object.entries(result.answers).forEach(([qId, ans]) => {
    if (!ans.isCorrect && !ans.isSkipped) {
      if (!stats.mistakeNotebook.includes(qId)) {
        stats.mistakeNotebook.push(qId);
      }
    } else if (ans.isCorrect) {
      stats.mistakeNotebook = stats.mistakeNotebook.filter(id => id !== qId);
    }
  });

  // 5. Update Topic Stats
  Object.entries(result.answers).forEach(([qId, ans]) => {
    const q = BANK.find(b => b.id === qId);
    if (q) {
      if (!stats.topicStats[q.sec]) {
        // Initialize if not present
        const topicTotal = BANK.filter(b => b.sec === q.sec).length;
        stats.topicStats[q.sec] = { totalQuestions: topicTotal, correct: 0, attempts: 0 };
      }
      stats.topicStats[q.sec].attempts += 1;
      if (ans.isCorrect) {
        stats.topicStats[q.sec].correct += 1;
      }
    }
  });

  // 6. Badge evaluation logic
  const isElectrostaticExpert = () => {
    const elecKeys = Object.keys(result.answers).filter(qId => {
      const q = BANK.find(b => b.id === qId);
      return q && q.sec === "Electrostatics";
    });
    return elecKeys.length >= 3 && elecKeys.every(qId => result.answers[qId].isCorrect);
  };

  const isMagnetismMaster = () => {
    const magKeys = Object.keys(result.answers).filter(qId => {
      const q = BANK.find(b => b.id === qId);
      return q && q.sec === "Magnetism & Electromagnetism";
    });
    return magKeys.length >= 3 && magKeys.every(qId => result.answers[qId].isCorrect);
  };

  badges.forEach(b => {
    if (!b.unlocked) {
      let shouldUnlock = false;

      switch (b.id) {
        case 'badge-1': // Phy Beginner
          shouldUnlock = true; // Completed any practice quiz
          break;
        case 'badge-2': // Electrostatics Expert
          if (isElectrostaticExpert()) shouldUnlock = true;
          break;
        case 'badge-3': // Magnetism Master
          if (isMagnetismMaster()) shouldUnlock = true;
          break;
        case 'badge-5': // 100% Club
          if (result.percentage === 100 && result.totalQuestions >= 20) shouldUnlock = true;
          break;
        case 'badge-6': // Streak Master
          if (stats.studyStreak >= 3) shouldUnlock = true;
          break;
        case 'badge-7': // Fast Finisher
          // Time limit for CBT Exam is 30 mins (1800s), for Practice it is based on question count * 60s
          const totalAllocatedTime = result.totalQuestions * 60; // 60s per question
          if (result.timeUsed < (totalAllocatedTime / 2)) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        b.unlocked = true;
        b.unlockedAt = new Date().toLocaleDateString();
        newlyUnlockedBadges.push(b);
      }
    }
  });

  saveStats(stats);
  saveBadges(badges);

  return { updatedStats: stats, unlockedBadges: newlyUnlockedBadges };
}

export function toggleFavoriteQuestion(questionId: string): boolean {
  const stats = getStoredStats();
  const isFavorite = stats.favoriteQuestions.includes(questionId);
  if (isFavorite) {
    stats.favoriteQuestions = stats.favoriteQuestions.filter(id => id !== questionId);
  } else {
    stats.favoriteQuestions.push(questionId);
  }
  saveStats(stats);
  return !isFavorite;
}

export function getWeakestAndStrongestTopic(stats: UserStats): { weakest: string; strongest: string } {
  let weakest = "N/A";
  let strongest = "N/A";
  let minAcc = 101;
  let maxAcc = -1;

  Object.entries(stats.topicStats).forEach(([topic, topicData]) => {
    if (topicData.attempts > 2) { // must have at least 3 attempts to evaluate fairly
      const accuracy = (topicData.correct / topicData.attempts) * 100;
      if (accuracy < minAcc) {
        minAcc = accuracy;
        weakest = topic;
      }
      if (accuracy > maxAcc) {
        maxAcc = accuracy;
        strongest = topic;
      }
    }
  });

  // Fallbacks if not enough attempts
  if (weakest === "N/A" || strongest === "N/A") {
    // Pick based on any attempts, or first topics
    const attemptedList = Object.entries(stats.topicStats).filter(([_, d]) => d.attempts > 0);
    if (attemptedList.length > 0) {
      attemptedList.sort((a, b) => (a[1].correct / a[1].attempts) - (b[1].correct / b[1].attempts));
      weakest = attemptedList[0][0];
      strongest = attemptedList[attemptedList.length - 1][0];
    }
  }

  return { weakest, strongest };
}
