/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Atom, Award, BookOpen, Layers, Play, CheckCircle } from 'lucide-react';
import { UserStats } from '../types';
import { BANK } from '../questions';

interface LandingPageProps {
  stats: UserStats;
  onNavigate: (view: string) => void;
  onStartExam: () => void;
}

export default function LandingPage({ stats, onNavigate, onStartExam }: LandingPageProps) {
  const totalQuestions = BANK.length;
  const uniqueTopics = useMemo(() => Array.from(new Set(BANK.map(q => q.sec))).length, []);

  // Simple floating physics simulation background (electrons, orbits, magnetic fields)
  const physicsParticles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 25 + 15,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 15,
      type: i % 3 === 0 ? 'atom' : i % 3 === 1 ? 'magnet' : 'charge'
    }));
  }, []);

  return (
    <div className="relative w-full overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20 dark:opacity-30">
        {physicsParticles.map((m) => (
          <motion.div
            key={m.id}
            className="absolute flex items-center justify-center text-indigo-400/80 dark:text-indigo-400"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.size,
              height: m.size,
            }}
            animate={{
              y: ['0px', '-50px', '50px', '0px'],
              x: ['0px', '40px', '-40px', '0px'],
              rotate: 360,
            }}
            transition={{
              duration: m.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: m.delay
            }}
          >
            {m.type === 'atom' ? (
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-1.5 opacity-60">
                <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(30 50 50)" />
                <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(150 50 50)" />
                <circle cx="50" cy="50" r="6" className="fill-current text-indigo-500" />
              </svg>
            ) : m.type === 'magnet' ? (
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-1.5 opacity-60">
                <ellipse cx="50" cy="50" rx="35" ry="18" className="stroke-dashed" />
                <ellipse cx="50" cy="50" rx="48" ry="26" className="stroke-dashed opacity-50" />
                <path d="M 25,50 Q 37.5,35 50,50 Q 62.5,65 75,50" />
                <path d="M 25,50 Q 37.5,65 50,50 Q 62.5,35 75,50" className="opacity-70" />
              </svg>
            ) : (
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-2 opacity-75">
                <circle cx="50" cy="50" r="22" />
                {m.id % 2 === 0 ? (
                  <>
                    <line x1="40" y1="50" x2="60" y2="50" />
                    <line x1="50" y1="40" x2="50" y2="60" />
                  </>
                ) : (
                  <line x1="40" y1="50" x2="60" y2="50" />
                )}
              </svg>
            )}
          </motion.div>
        ))}
        {/* Abstract physics formulas background floating decoration */}
        <div className="absolute right-[5%] top-[10%] text-[4rem] sm:text-[6rem] font-black select-none text-slate-200/40 dark:text-slate-800/20 font-mono tracking-widest pointer-events-none">
          E=mc²
        </div>
        <div className="absolute left-[8%] bottom-[15%] text-[4rem] sm:text-[5rem] font-black select-none text-slate-200/40 dark:text-slate-800/20 font-mono tracking-widest pointer-events-none">
          F=ma
        </div>
        <div className="absolute right-[12%] bottom-[8%] text-[4rem] sm:text-[6rem] font-black select-none text-slate-200/40 dark:text-slate-800/20 font-mono tracking-widest pointer-events-none">
          V=IR
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex-grow flex flex-col justify-center items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-indigo-100/80 dark:bg-indigo-950/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium text-sm mb-6"
        >
          <Atom className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>General Physics CBT Simulator</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight text-slate-900 dark:text-white leading-tight"
        >
          Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-500">PHY 102</span>
          <br />Like a Professional CBT
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed"
        >
          The complete, high-yield practice platform designed specifically for 100-level university students preparing for Introductory Physics II examinations. Complete with dynamic analysis, gamification, and full solutions.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md px-4"
        >
          <button
            id="btn-start-practice"
            onClick={() => onNavigate('practice')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-base"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Practice Mode</span>
          </button>
          <button
            id="btn-view-topics"
            onClick={() => onNavigate('topics')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-base"
          >
            <Layers className="w-5 h-5" />
            <span>View Topics</span>
          </button>
        </motion.div>
      </div>

      {/* Platform High-Yield Stats Display */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto mt-16 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 px-4"
      >
        <div className="bg-white/75 dark:bg-slate-950/75 backdrop-blur-md p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">DATABASE</span>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{totalQuestions}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Total Questions</div>
          </div>
        </div>

        <div className="bg-white/75 dark:bg-slate-950/75 backdrop-blur-md p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">CATEGORIES</span>
            <Layers className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{uniqueTopics}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Topics Covered</div>
          </div>
        </div>

        <div className="bg-white/75 dark:bg-slate-950/75 backdrop-blur-md p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">EXAMS</span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{stats.completedExams}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">CBT Exams Taken</div>
          </div>
        </div>

        <div className="bg-white/75 dark:bg-slate-950/75 backdrop-blur-md p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">PERSONAL BEST</span>
            <CheckCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{stats.highestScore}%</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Highest CBT Score</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
