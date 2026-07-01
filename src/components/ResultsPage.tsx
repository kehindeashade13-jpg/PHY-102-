/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Award, RefreshCw, Eye, BookOpen, Home, Star,
  AlertTriangle, CheckCircle, Clock, ChevronRight, Zap, Target
} from 'lucide-react';
import { ExamResult, Question, Badge } from '../types';
import { BANK } from '../questions';

interface ResultsPageProps {
  result: ExamResult;
  unlockedBadges: Badge[];
  onRetry: () => void;
  onReview: () => void;
  onPracticeWeakTopic: (topic: string) => void;
  onGoHome: () => void;
}

export default function ResultsPage({
  result,
  unlockedBadges,
  onRetry,
  onReview,
  onPracticeWeakTopic,
  onGoHome
}: ResultsPageProps) {
  const correctCount = useMemo(() => {
    return Object.values(result.answers).filter(a => a.isCorrect).length;
  }, [result]);

  const wrongCount = useMemo(() => {
    return Object.values(result.answers).filter(a => !a.isCorrect && !a.isSkipped).length;
  }, [result]);

  const skippedCount = useMemo(() => {
    return Object.values(result.answers).filter(a => a.isSkipped).length;
  }, [result]);

  // Format time used
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}m ${remaining}s`;
  };

  // Evaluate Topic Performance
  const topicBreakdown = useMemo(() => {
    const map: Record<string, { total: number; correct: number }> = {};
    Object.entries(result.answers).forEach(([qId, ans]) => {
      const q = BANK.find(b => b.id === qId);
      if (q) {
        if (!map[q.sec]) map[q.sec] = { total: 0, correct: 0 };
        map[q.sec].total += 1;
        if (ans.isCorrect) map[q.sec].correct += 1;
      }
    });
    return Object.entries(map).map(([topic, data]) => ({
      topic,
      percentage: Math.round((data.correct / data.total) * 100),
      ...data
    }));
  }, [result]);

  // Weak and Strong topics from this specific exam
  const { weakTopics, strongTopics } = useMemo(() => {
    const weak = topicBreakdown.filter(t => t.percentage < 60).map(t => t.topic);
    const strong = topicBreakdown.filter(t => t.percentage >= 80).map(t => t.topic);
    return { weakTopics: weak, strongTopics: strong };
  }, [topicBreakdown]);

  // Percentile calculation
  const simulatedPercentile = useMemo(() => {
    if (result.percentage >= 95) return "Top 1% (Master Candidate)";
    if (result.percentage >= 85) return "Top 5% (Excellent)";
    if (result.percentage >= 70) return "Top 12% (Highly competitive)";
    if (result.percentage >= 50) return "Top 35% (Good pass)";
    return "Top 65% (Needs revision)";
  }, [result]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Grade Badge & Main Title Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
        {/* Confetti decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-10 font-mono text-[10rem] font-bold select-none text-slate-100 flex items-center justify-center">
          {result.grade}
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mx-auto w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-indigo-400"
        >
          <span className="text-4xl font-black text-indigo-300">{result.grade}</span>
        </motion.div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Exam Completed Successfully</h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            You achieved an overall score of <span className="font-bold text-indigo-400">{result.percentage}%</span> on this PHY 102 simulation.
          </p>
        </div>

        {/* High score encouragement */}
        {result.percentage >= 75 && (
          <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>High-Score Confetti! Outstanding achievement!</span>
          </div>
        )}
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase">Score</div>
          <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">
            {result.score} / {result.totalQuestions}
          </div>
          <div className="text-[11px] text-slate-500">Correct answers</div>
        </div>

        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase">Time Used</div>
          <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">
            {formatTime(result.timeUsed)}
          </div>
          <div className="text-[11px] text-slate-500">Duration spent</div>
        </div>

        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase">Estimated Rank</div>
          <div className="text-sm font-black text-slate-800 dark:text-white mt-2 truncate">
            {simulatedPercentile}
          </div>
          <div className="text-[11px] text-slate-500">Peer standing</div>
        </div>

        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase">Unlocks</div>
          <div className="text-2xl font-black text-indigo-500 mt-1">
            {unlockedBadges.length} Badges
          </div>
          <div className="text-[11px] text-slate-500">Earned this run</div>
        </div>
      </div>

      {/* 3. Performance Chart and Topic Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pure CSS/SVG Performance Pie Chart Representation */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Performance breakdown</h3>
          
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Skipped */}
              <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-100 dark:stroke-slate-900" strokeWidth="4" />
              
              {/* Correct */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                className="stroke-emerald-500"
                strokeWidth="4"
                strokeDasharray={`${(correctCount / result.totalQuestions) * 100}, 100`}
                strokeDashoffset={0}
              />
              
              {/* Wrong */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                className="stroke-rose-500"
                strokeWidth="4"
                strokeDasharray={`${(wrongCount / result.totalQuestions) * 100}, 100`}
                strokeDashoffset={-((correctCount / result.totalQuestions) * 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{result.percentage}%</span>
              <span className="text-[10px] text-slate-400 font-bold font-mono">ACCURACY</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-500 rounded" />
                <span>Correct</span>
              </div>
              <span>{correctCount} ({Math.round((correctCount / result.totalQuestions) * 100)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-rose-500 rounded" />
                <span>Wrong</span>
              </div>
              <span>{wrongCount} ({Math.round((wrongCount / result.totalQuestions) * 100)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-slate-100 dark:bg-slate-900 rounded" />
                <span>Skipped</span>
              </div>
              <span>{skippedCount} ({Math.round((skippedCount / result.totalQuestions) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Topic Breakdown & Weakest/Strongest indicators */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-4 md:col-span-2 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Topic analysis</h3>

          <div className="space-y-4 max-h-[16rem] overflow-y-auto pr-2">
            {topicBreakdown.map((t) => (
              <div key={t.topic} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{t.topic}</span>
                  <span className={`font-mono font-bold ${t.percentage >= 80 ? 'text-emerald-500' : t.percentage >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {t.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${t.percentage >= 80 ? 'bg-emerald-500' : t.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strong/Weak Recommendations */}
          <div className="border-t border-slate-50 dark:border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center gap-1 text-emerald-500 font-bold mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Strong categories</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal font-medium">
                {strongTopics.length > 0 ? strongTopics.join(', ') : 'None identified yet.'}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-rose-500 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Weak categories</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal font-medium">
                {weakTopics.length > 0 ? weakTopics.join(', ') : 'None identified! Excellent consistency.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Newly Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Newly unlocked badges!</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unlockedBadges.map(b => (
              <div key={b.id} className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/20 flex gap-3.5 items-center">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-500 rounded-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{b.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Custom Recommendations Card */}
      <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-2.5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider text-indigo-500">
          Preparation recommendations
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {useMemo(() => {
            if (result.percentage >= 85) {
              return "Incredible score! You have a solid grasp of 100-level organic chemistry. Keep maintaining this level of mastery by reviewing the mistake notebook periodically and completing a 30-minute exam weekly.";
            } else if (result.percentage >= 60) {
              return `Decent effort! You show proficiency in multiple topics, but you need to consolidate. Focus your next custom study session specifically on ${weakTopics.length > 0 ? weakTopics[0] : 'organic reactions and mechanisms'} to bridge the gap and secure an A.`;
            } else {
              return `You need to reinforce the basics. Review the study cards or notes for key topics such as ${weakTopics.length > 0 ? weakTopics[0] : 'nomenclature or purification'}, and start practice sets of 10 questions with instant feedback turned on to learn from explanations in real-time.`;
            }
          }, [result, weakTopics])}
        </p>
      </div>

      {/* 6. Action Buttons Grid */}
      <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
        <button
          id="btn-results-review-answers"
          onClick={onReview}
          className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Review Answers</span>
        </button>

        {weakTopics.length > 0 && (
          <button
            id="btn-results-practice-weak"
            onClick={() => onPracticeWeakTopic(weakTopics[0])}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>Practice Weak Topic ({weakTopics[0]})</span>
          </button>
        )}

        <button
          id="btn-results-retry"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 py-3 px-6 rounded-xl text-sm font-bold cursor-pointer transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Exam</span>
        </button>

        <button
          id="btn-results-home"
          onClick={onGoHome}
          className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 py-3 px-6 rounded-xl text-sm font-bold cursor-pointer transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
}
