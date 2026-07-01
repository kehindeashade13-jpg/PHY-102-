/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dna, Award, Star, Flame, GraduationCap, Home, BookOpen,
  Layers, Settings, Search, Sun, Moon, Eye, Contrast, Check, Zap, AlertCircle
} from 'lucide-react';

import { Question, ExamResult, UserStats, Badge } from './types';
import { BANK } from './questions';
import {
  getStoredStats,
  saveStats,
  getStoredBadges,
  saveBadges,
  saveResult,
  getWeakestAndStrongestTopic
} from './storage';

// Modular UI Views
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import TopicsPage from './components/TopicsPage';
import PracticeMode from './components/PracticeMode';
import CBTExamMode from './components/CBTExamMode';
import ResultsPage from './components/ResultsPage';
import ReviewPage from './components/ReviewPage';
import StudyTools from './components/StudyTools';

export default function App() {
  // 1. Navigation & View State
  const [currentView, setCurrentView] = useState<string>('landing');
  const [stats, setStats] = useState<UserStats>(getStoredStats());
  const [badges, setBadges] = useState<Badge[]>(getStoredBadges());
  const [activeResult, setActiveResult] = useState<ExamResult | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isExamRunning, setIsExamRunning] = useState(false);
  
  // Confetti trigger
  const [showConfetti, setShowConfetti] = useState(false);

  // 2. Theme State ('light' | 'dark' | 'contrast')
  const [theme, setTheme] = useState<'light' | 'dark' | 'contrast'>(() => {
    const saved = localStorage.getItem('phy102_theme_v1');
    return (saved as 'light' | 'dark' | 'contrast') || 'light';
  });

  // Apply theme class to document body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'contrast-theme');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'contrast') {
      root.classList.add('contrast-theme');
    }
    localStorage.setItem('phy102_theme_v1', theme);
  }, [theme]);

  // Load and refresh stats from storage
  const handleRefreshStats = () => {
    setStats(getStoredStats());
    setBadges(getStoredBadges());
  };

  // Clear all past exam results, stats and badges
  const handleClearHistory = () => {
    const confirmClear = window.confirm("Are you sure you want to clear your entire CBT exam & practice history? This will also reset your stats and achievements. This cannot be undone.");
    if (confirmClear) {
      localStorage.removeItem('phy102_results_v1');
      localStorage.removeItem('phy102_stats_v1');
      localStorage.removeItem('phy102_badges_v1');
      setStats(getStoredStats());
      setBadges(getStoredBadges());
    }
  };

  // 3. Navigation callback
  const handleNavigate = (view: string) => {
    if (isExamRunning) {
      const confirmNav = window.confirm("You have an active exam running! Navigating away will lose all your progress. Are you sure you want to quit?");
      if (!confirmNav) {
        return;
      }
      setIsExamRunning(false);
    }
    setCurrentView(view);
    setSelectedTopic(null);
  };

  const handleSelectTopicForPractice = (topic: string) => {
    if (isExamRunning) {
      const confirmNav = window.confirm("You have an active exam running! Navigating away will lose all your progress. Are you sure you want to quit?");
      if (!confirmNav) {
        return;
      }
      setIsExamRunning(false);
    }
    setSelectedTopic(topic);
    setCurrentView('practice');
  };

  // 4. Completed exam handler (updates stats, saves score, evaluates badges)
  const handleFinishExamOrPractice = (result: ExamResult) => {
    const { updatedStats, unlockedBadges } = saveResult(result);
    setStats(updatedStats);
    setBadges(getStoredBadges());
    setActiveResult(result);
    setCurrentView('results');

    // Trigger high score reward (A or B grade / >= 75%)
    if (result.percentage >= 75) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    }
  };

  // Toggle favorite helper
  const handleToggleFavoriteId = (qId: string) => {
    setStats(getStoredStats());
  };

  // Question of the Day trigger (randomizes a question and launches a quick single question review)
  const handleQuestionOfTheDay = () => {
    const randomIndex = Math.floor(Math.random() * BANK.length);
    const q = BANK[randomIndex];
    setSelectedTopic(q.sec);
    setCurrentView('practice');
  };

  // Render the selected view dynamically
  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            stats={stats}
            onNavigate={handleNavigate}
            onStartExam={() => setCurrentView('exam')}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            stats={stats}
            badges={badges}
            onNavigate={handleNavigate}
            onSelectTopic={handleSelectTopicForPractice}
            onTriggerRandomQuestion={handleQuestionOfTheDay}
            onViewPastResult={(result) => {
              setActiveResult(result);
              setCurrentView('results');
            }}
            onClearHistory={handleClearHistory}
          />
        );
      case 'topics':
        return (
          <TopicsPage
            stats={stats}
            onSelectTopic={handleSelectTopicForPractice}
          />
        );
      case 'practice':
        return (
          <PracticeMode
            selectedTopic={selectedTopic}
            statsFavoriteIds={stats.favoriteQuestions}
            onToggleFavorite={handleToggleFavoriteId}
            onFinishQuiz={handleFinishExamOrPractice}
            onCancel={() => setCurrentView('landing')}
          />
        );
      case 'exam':
        return (
          <CBTExamMode
            onFinishExam={(result) => {
              setIsExamRunning(false);
              handleFinishExamOrPractice(result);
            }}
            onCancel={() => {
              setIsExamRunning(false);
              setCurrentView('landing');
            }}
            onViewPastResult={(result) => {
              setActiveResult(result);
              setCurrentView('results');
            }}
            onExamStateChange={setIsExamRunning}
            onClearHistory={handleClearHistory}
          />
        );
      case 'results':
        return activeResult ? (
          <ResultsPage
            result={activeResult}
            unlockedBadges={badges.filter(b => b.unlocked && b.unlockedAt === new Date().toLocaleDateString())}
            onRetry={() => {
              if (activeResult.mode === 'exam') {
                setCurrentView('exam');
              } else {
                setCurrentView('practice');
              }
            }}
            onReview={() => setCurrentView('review')}
            onPracticeWeakTopic={(topic) => handleSelectTopicForPractice(topic)}
            onGoHome={() => setCurrentView('landing')}
          />
        ) : (
          <div className="text-center py-12 text-slate-400">No active test results found.</div>
        );
      case 'review':
        return (
          <ReviewPage
            result={activeResult}
            statsFavoriteIds={stats.favoriteQuestions}
            onToggleFavorite={handleToggleFavoriteId}
            onClose={() => setCurrentView('results')}
          />
        );
      case 'notes':
        return <StudyTools initialTab="notes" />;
      case 'flashcards':
        return <StudyTools initialTab="flashcards" />;
      
      // Personal Study Notebook Views
      case 'favorites': {
        const favoriteQuestions = BANK.filter(q => stats.favoriteQuestions.includes(q.id));
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 max-w-4xl mx-auto px-4 pt-6">
              <button onClick={() => setCurrentView('dashboard')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                &larr; Back to Dashboard
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Bookmarked Questions ({favoriteQuestions.length})</h2>
            </div>
            {favoriteQuestions.length > 0 ? (
              <ReviewPage
                statsFavoriteIds={stats.favoriteQuestions}
                onToggleFavorite={handleToggleFavoriteId}
                onClose={() => setCurrentView('dashboard')}
              />
            ) : (
              <div className="text-center py-16 max-w-lg mx-auto bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border">
                <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No bookmarked questions yet</h3>
                <p className="text-xs text-slate-400 mt-1">Bookmarked questions during practice or exams will appear here for structured study.</p>
              </div>
            )}
          </div>
        );
      }
      case 'mistakes': {
        const mistakeQuestions = BANK.filter(q => stats.mistakeNotebook.includes(q.id));
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 max-w-4xl mx-auto px-4 pt-6">
              <button onClick={() => setCurrentView('dashboard')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                &larr; Back to Dashboard
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Mistake Notebook ({mistakeQuestions.length})</h2>
            </div>
            {mistakeQuestions.length > 0 ? (
              <ReviewPage
                statsFavoriteIds={stats.favoriteQuestions}
                onToggleFavorite={handleToggleFavoriteId}
                onClose={() => setCurrentView('dashboard')}
              />
            ) : (
              <div className="text-center py-16 max-w-lg mx-auto bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-900">
                <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Perfect Record!</h3>
                <p className="text-xs text-slate-500 mt-1">You have zero mistakes in your notebook. Incorrect choices automatically add here to support retrieval practice.</p>
              </div>
            )}
          </div>
        );
      }

      // Badges Browser View
      case 'badges':
        return (
          <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Achievements Gallery</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Awarded based on your official quiz scores and practice streaks.</p>
              </div>
              <button onClick={() => setCurrentView('dashboard')} className="text-xs font-bold text-indigo-500 hover:underline">
                Back to Dashboard
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map(b => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                    b.unlocked
                      ? 'bg-gradient-to-br from-white to-sky-50/20 dark:from-slate-950 dark:to-sky-950/10 border-sky-100 dark:border-sky-900/40 shadow-sm'
                      : 'bg-slate-50/40 dark:bg-slate-950/30 border-slate-100 dark:border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${b.unlocked ? 'bg-sky-50 dark:bg-sky-950 text-sky-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      <Award className="w-6 h-6" />
                    </div>
                    {b.unlocked ? (
                      <span className="text-[10px] font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-bold uppercase">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full font-bold uppercase">
                        LOCKED
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{b.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{b.description}</p>
                    {b.unlockedAt && (
                      <div className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 mt-2">
                        EARNED ON {b.unlockedAt}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. CONFETTI CELEBRATION COMPONENT */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: ['#38bdf8', '#34d399', '#facc15', '#f43f5e', '#818cf8'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `-5%`
              }}
              animate={{
                y: ['0vh', '105vh'],
                x: [0, Math.random() * 80 - 40],
                rotate: [0, 360 * 3]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: 0,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* 2. NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div
            onClick={() => handleNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans font-black text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                PHY 102 <span className="text-indigo-500 font-bold">Master</span>
              </span>
              <span className="block text-[10px] font-mono text-slate-400 dark:text-slate-500 leading-none">Introductory Physics CBT</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold">
            <button
              id="nav-link-home"
              onClick={() => handleNavigate('landing')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${currentView === 'landing' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'}`}
            >
              Home
            </button>
            <button
              id="nav-link-dashboard"
              onClick={() => handleNavigate('dashboard')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${['dashboard', 'favorites', 'mistakes'].includes(currentView) ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'}`}
            >
              Dashboard
            </button>
            <button
              id="nav-link-topics"
              onClick={() => handleNavigate('topics')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${currentView === 'topics' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'}`}
            >
              Topics
            </button>
            <button
              id="nav-link-practice"
              onClick={() => handleNavigate('practice')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${currentView === 'practice' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'}`}
            >
              Practice Mode
            </button>
            <button
              id="nav-link-exam"
              onClick={() => handleNavigate('exam')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${currentView === 'exam' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'}`}
            >
              CBT Exam
            </button>
            <button
              id="nav-link-notes"
              onClick={() => handleNavigate('notes')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${['notes', 'flashcards'].includes(currentView) ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'}`}
            >
              Active Recall
            </button>
          </div>

          {/* DE^3 Tech replaced day/night mode buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/2349033006533"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-black font-mono tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3.5 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer"
              title="Chat with DE³ Tech on WhatsApp"
            >
              DE³ Tech
            </a>
          </div>
        </div>
      </nav>

      {/* 3. MAIN WORKSPACE / CONTENT PANE */}
      <main className="flex-grow pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. MOBILE NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-100 dark:border-slate-900 shadow-xl flex justify-around py-3 text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500">
        <button
          onClick={() => handleNavigate('landing')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'landing' ? 'text-indigo-500' : ''}`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => handleNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'dashboard' ? 'text-indigo-500' : ''}`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => handleNavigate('topics')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'topics' ? 'text-indigo-500' : ''}`}
        >
          <Layers className="w-4 h-4" />
          <span>Topics</span>
        </button>
        <button
          onClick={() => handleNavigate('practice')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'practice' ? 'text-indigo-500' : ''}`}
        >
          <Zap className="w-4 h-4" />
          <span>Practice</span>
        </button>
        <button
          onClick={() => handleNavigate('exam')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentView === 'exam' ? 'text-indigo-500' : ''}`}
        >
          <Award className="w-4 h-4" />
          <span>CBT</span>
        </button>
      </div>
    </div>
  );
}
