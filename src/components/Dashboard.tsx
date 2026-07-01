/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Flame, Award, Target, TrendingUp, ThumbsUp, ThumbsDown,
  BookOpen, Star, AlertTriangle, Play, HelpCircle, GraduationCap, CheckCircle, Clock, Trash2
} from 'lucide-react';
import { UserStats, Badge, ExamResult } from '../types';
import { BANK } from '../questions';
import { getWeakestAndStrongestTopic, getStoredResults } from '../storage';

interface DashboardProps {
  stats: UserStats;
  badges: Badge[];
  onNavigate: (view: string) => void;
  onSelectTopic: (topic: string) => void;
  onTriggerRandomQuestion: () => void;
  onViewPastResult?: (result: ExamResult) => void;
  onClearHistory?: () => void;
}

export default function Dashboard({ stats, badges, onNavigate, onSelectTopic, onTriggerRandomQuestion, onViewPastResult, onClearHistory }: DashboardProps) {
  const pastResults = useMemo(() => {
    return getStoredResults();
  }, [stats]);

  const answeredCount = stats.totalCorrect + stats.totalWrong;
  const accuracy = answeredCount > 0 ? Math.round((stats.totalCorrect / answeredCount) * 100) : 0;
  
  const { weakest, strongest } = useMemo(() => {
    return getWeakestAndStrongestTopic(stats);
  }, [stats]);

  const unlockedBadgesCount = useMemo(() => {
    return badges.filter(b => b.unlocked).length;
  }, [badges]);

  // Daily goal helper (target is 15 questions per day)
  const dailyDone = stats.dailyGoalProgress; // saved as percentage
  const dailyTarget = 15;
  const dailyActual = Math.round((dailyDone / 100) * dailyTarget);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GraduationCap className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-indigo-400">WELCOME STUDENT</div>
          <h1 className="text-2xl sm:text-3xl font-black">Prepare and Master Introductory Physics II</h1>
          <p className="text-slate-300 max-w-xl text-sm sm:text-base">
            Your customized dashboard tracks your progress, strengths, and weaknesses to ensure you crush PHY 102 exams.
          </p>
        </div>
        <div className="mt-6 md:mt-0 relative z-10 flex flex-wrap gap-3">
          <button
            id="btn-quick-random"
            onClick={onTriggerRandomQuestion}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Question of the Day</span>
          </button>
          <button
            id="btn-quick-notes"
            onClick={() => onNavigate('notes')}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md border border-slate-700 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Notes</span>
          </button>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Questions answered */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">QUESTIONS</span>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 dark:text-white">{answeredCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Answered ({BANK.length} total)</div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">ACCURACY</span>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 dark:text-white">{accuracy}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Correct choices</div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">AVG SCORE</span>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 dark:text-white">{stats.averageScore}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Across all sets</div>
          </div>
        </div>

        {/* Strongest Topic */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">STRONGEST</span>
            <ThumbsUp className="w-5 h-5 text-teal-500" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-800 dark:text-white truncate" title={strongest}>
              {strongest}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Topic strength</div>
          </div>
        </div>

        {/* Weakest Topic */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">WEAKEST</span>
            <ThumbsDown className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-800 dark:text-white truncate" title={weakest}>
              {weakest}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Needs focus</div>
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">STREAK</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 dark:text-white">{stats.studyStreak} Days</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily study streak</div>
          </div>
        </div>
      </div>

      {/* Gamification, Daily Goal, and Mistakes / Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Practice Goal & Quick Links */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daily Practice Progress</h2>
          <div className="flex items-center gap-6">
            {/* SVG Progress Circle */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-100 dark:stroke-slate-900" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  className="stroke-indigo-500"
                  strokeWidth="3"
                  strokeDasharray={`${dailyDone}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-800 dark:text-white">{dailyDone}%</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase font-mono">GOAL</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {dailyActual} / {dailyTarget} Questions
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Maintain your goal of {dailyTarget} physics questions answered daily to earn the Streak Master achievement.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-900 pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">Personal Study Notebooks</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                id="btn-favorite-questions"
                onClick={() => onNavigate('favorites')}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:-translate-y-0.5 transition-all cursor-pointer group text-left"
              >
                <div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{stats.favoriteQuestions.length}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Favorites</div>
                </div>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
              </button>
              <button
                id="btn-mistakes-notebook"
                onClick={() => onNavigate('mistakes')}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:-translate-y-0.5 transition-all cursor-pointer group text-left"
              >
                <div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{stats.mistakeNotebook.length}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Mistakes</div>
                </div>
                <AlertTriangle className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Badge & Achievements Display */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Unlocked Badges ({unlockedBadgesCount} / {badges.length})</h2>
            <button
              id="btn-view-badges"
              onClick={() => onNavigate('badges')}
              className="text-xs font-mono text-indigo-500 hover:underline font-semibold cursor-pointer"
            >
              See All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  b.unlocked
                    ? 'bg-gradient-to-br from-white to-indigo-50/20 dark:from-slate-950 dark:to-indigo-950/10 border-indigo-100 dark:border-indigo-900/50 shadow-sm shadow-indigo-500/5'
                    : 'bg-slate-50/50 dark:bg-slate-950/30 border-slate-100 dark:border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${b.unlocked ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  {b.unlocked ? (
                    <span className="text-[10px] font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded font-bold uppercase">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded font-bold uppercase">
                      LOCKED
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Next Topics Section */}
      <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommended Physics Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {useMemo(() => {
            const list = Array.from(new Set(BANK.map(q => q.sec))).slice(0, 3);
            return list.map((topic, index) => {
              const count = BANK.filter(q => q.sec === topic).length;
              const completed = stats.topicStats[topic]?.attempts || 0;
              const correct = stats.topicStats[topic]?.correct || 0;
              const tAccuracy = completed > 0 ? Math.round((correct / completed) * 100) : null;

              return (
                <div
                  key={index}
                  className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-900/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{topic}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{count} Exam-level questions available</p>
                    
                    {tAccuracy !== null ? (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Current Accuracy:</span>
                        <span className={`text-xs font-bold ${tAccuracy >= 75 ? 'text-emerald-500' : tAccuracy >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                          {tAccuracy}%
                        </span>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Unattempted</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    id={`btn-topic-practice-${index}`}
                    onClick={() => onSelectTopic(topic)}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Practice Quiz</span>
                  </button>
                </div>
              );
            });
          }, [stats])}
        </div>
      </div>

      {/* Past CBT & Practice History Section */}
      <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Past CBT & Practice History</h2>
          </div>
          <div className="flex items-center gap-4">
            {pastResults.length > 0 && onClearHistory && (
              <button
                id="dashboard-btn-clear-history"
                onClick={onClearHistory}
                className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
            <button
              id="dashboard-btn-go-exam"
              onClick={() => onNavigate('exam')}
              className="text-xs font-mono text-indigo-500 hover:underline font-semibold cursor-pointer"
            >
              Start New CBT
            </button>
          </div>
        </div>

        {pastResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 font-mono font-bold">
                  <th className="py-2.5 px-2">DATE</th>
                  <th className="py-2.5 px-2">MODE</th>
                  <th className="py-2.5 px-2 text-center">SCORE</th>
                  <th className="py-2.5 px-2 text-center">GRADE</th>
                  <th className="py-2.5 px-2 text-right">TIME USED</th>
                  <th className="py-2.5 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                {pastResults.slice(0, 5).map((res, index) => (
                  <tr key={res.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-2.5 px-2 font-medium">
                      {res.date}
                    </td>
                    <td className="py-2.5 px-2 font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${res.mode === 'exam' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                        {res.mode === 'exam' ? 'CBT' : 'Practice'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold">
                      {res.score} / {res.totalQuestions} ({res.percentage}%)
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-flex items-center justify-center w-5.5 h-5.5 rounded-full font-black text-[10px] ${
                        ['A', 'B'].includes(res.grade) ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-500' : 
                        res.grade === 'C' ? 'bg-amber-50 dark:bg-amber-950 text-amber-500' : 'bg-rose-50 dark:bg-rose-950 text-rose-500'
                      }`}>
                        {res.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono">
                      {Math.floor(res.timeUsed / 60)}m {res.timeUsed % 60}s
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        id={`dashboard-btn-view-${res.id}`}
                        onClick={() => onViewPastResult?.(res)}
                        className="text-xs font-bold text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 underline cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pastResults.length > 5 && (
              <p className="text-[11px] text-slate-400 text-center mt-3">
                Showing the 5 most recent attempts. Go to <strong>CBT Exam</strong> to view full history of {pastResults.length} practices.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border border-dashed border-slate-100 dark:border-slate-900 p-6 text-center text-xs text-slate-400">
            No completed sessions found. Practice topics or launch a CBT exam to populate your statistics!
          </div>
        )}
      </div>
    </div>
  );
}
