/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Clock, Check, AlertTriangle, ArrowLeft, ArrowRight,
  Flag, HelpCircle, FileText, Keyboard, Award, Trash2, Calendar
} from 'lucide-react';
import { Question, ExamResult } from '../types';
import { BANK } from '../questions';
import { getStoredResults } from '../storage';
import ScientificCalculator from './ScientificCalculator';

interface CBTExamModeProps {
  onFinishExam: (result: ExamResult) => void;
  onCancel: () => void;
  onViewPastResult?: (result: ExamResult) => void;
  onExamStateChange?: (running: boolean) => void;
  onClearHistory?: () => void;
}

export default function CBTExamMode({ onFinishExam, onCancel, onViewPastResult, onExamStateChange, onClearHistory }: CBTExamModeProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<string, string[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  
  const [examDuration, setExamDuration] = useState<number>(30); // Custom time setting from 10-30 minutes
  const [questionCount, setQuestionCount] = useState<number>(20); // Custom question count setting from 20-80 questions
  const [timeLeft, setTimeLeft] = useState(1800); // dynamic seconds left
  const [isExamActive, setIsExamActive] = useState(false);
  const [showShortcutsInfo, setShowShortcutsInfo] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [pastResults, setPastResults] = useState<ExamResult[]>([]);

  // Notify parent of active exam state
  useEffect(() => {
    onExamStateChange?.(isExamActive);
  }, [isExamActive, onExamStateChange]);

  // Load past results from storage
  useEffect(() => {
    setPastResults(getStoredResults());
  }, [isExamActive]);

  // Helper to shuffle arrays
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // Launch the exam with a set of randomized questions (or max available)
  const handleStartExam = () => {
    let examSet = shuffleArray([...BANK]);
    if (examSet.length > questionCount) {
      examSet = examSet.slice(0, questionCount);
    }

    // Shuffle options for each question
    const optionsMap: Record<string, string[]> = {};
    examSet.forEach(q => {
      optionsMap[q.id] = shuffleArray(q.options);
    });

    setQuestions(examSet);
    setShuffledOptionsMap(optionsMap);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(examDuration * 60); // Use custom duration
    setIsExamActive(true);
  };

  // Timer Effect
  useEffect(() => {
    if (!isExamActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive, timeLeft]);

  // Keyboard Navigation & Answering Shortcuts
  useEffect(() => {
    if (!isExamActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      // Skip shortcuts if user is typing in some text input elsewhere (not applicable here, but safe practice)
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      const q = questions[currentIndex];
      const opts = shuffledOptionsMap[q.id] || [];

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
          if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          }
          break;
        case 'arrowright':
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
          break;
        case 'f':
          handleToggleFlag(q.id);
          break;
        case 'a':
          if (opts[0]) setSelectedAnswers(prev => ({ ...prev, [q.id]: opts[0] }));
          break;
        case 'b':
          if (opts[1]) setSelectedAnswers(prev => ({ ...prev, [q.id]: opts[1] }));
          break;
        case 'c':
          if (opts[2]) setSelectedAnswers(prev => ({ ...prev, [q.id]: opts[2] }));
          break;
        case 'd':
          if (opts[3]) setSelectedAnswers(prev => ({ ...prev, [q.id]: opts[3] }));
          break;
        case 'e':
          if (opts[4]) setSelectedAnswers(prev => ({ ...prev, [q.id]: opts[4] }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExamActive, currentIndex, questions, shuffledOptionsMap]);

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleToggleFlag = (qId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const answeredCount = useMemo(() => {
    return Object.keys(selectedAnswers).length;
  }, [selectedAnswers]);

  // Submit Exam Function
  const handleSubmitExam = () => {
    setIsExamActive(false);
    const timeUsed = (examDuration * 60) - timeLeft;

    const answersReport: Record<string, { selected: string; correct: string; isCorrect: boolean; isSkipped: boolean }> = {};
    
    let correctCount = 0;
    questions.forEach(q => {
      const selected = selectedAnswers[q.id] || '';
      const isSkipped = selected === '';
      const isCorrect = !isSkipped && selected === q.correctAnswer;
      
      if (isCorrect) correctCount++;

      answersReport[q.id] = {
        selected,
        correct: q.correctAnswer,
        isCorrect,
        isSkipped
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    
    // Grade mapping
    let grade = 'F';
    if (percentage >= 70) grade = 'A';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 45) grade = 'D';
    else if (percentage >= 40) grade = 'E';

    onFinishExam({
      id: `e-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      grade,
      timeUsed,
      mode: 'exam',
      answers: answersReport
    });
  };

  // Pre-exam instruction screen
  if (!isExamActive) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <button id="btn-back-landing" onClick={onCancel} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">CBT Exam Room</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Simulated formal university examination for PHY 102.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            <FileText className="w-8 h-8 text-indigo-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Official Exam Regulations</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{questionCount} physics questions randomized from syllabus. {examDuration} minutes total time.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Duration Configuration (10 - 30 minutes) */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Set Exam Duration:</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{examDuration} Minutes</span>
              </div>
              
              <input
                id="slider-exam-duration"
                type="range"
                min="10"
                max="30"
                step="1"
                value={examDuration}
                onChange={(e) => setExamDuration(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              
              <div className="flex gap-1.5 justify-between">
                {[10, 15, 20, 25, 30].map((preset) => (
                  <button
                    key={preset}
                    id={`btn-preset-duration-${preset}`}
                    type="button"
                    onClick={() => setExamDuration(preset)}
                    className={`flex-1 py-1 px-1.5 text-xs font-semibold rounded-md border transition-all ${
                      examDuration === preset
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Configuration (20 - 80 questions) */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Questions to Answer:</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{questionCount} Questions</span>
              </div>
              
              <input
                id="slider-question-count"
                type="range"
                min="20"
                max="80"
                step="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              
              <div className="flex gap-1.5 justify-between">
                {[20, 40, 60, 80].map((preset) => (
                  <button
                    key={preset}
                    id={`btn-preset-questions-${preset}`}
                    type="button"
                    onClick={() => setQuestionCount(preset)}
                    className={`flex-1 py-1 px-1.5 text-xs font-semibold rounded-md border transition-all ${
                      questionCount === preset
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {preset} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">Exam Specifications</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Timer auto-submits when {examDuration} minutes expire.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>No instant explanations during the test (Review is unlocked after submit).</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Question Grid lets you navigate to any question at any time.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Flag questions to quickly locate them for review before submitting.</span>
              </li>
            </ul>
          </div>

          {/* Keyboard Shortcuts Info inside instructions */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">
              <Keyboard className="w-4 h-4" />
              <span>CBT Keyboard Navigation Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 border rounded font-bold font-mono">←</kbd> Previous question</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 border rounded font-bold font-mono">→</kbd> Next question</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 border rounded font-bold font-mono">F</kbd> Toggle Flag / Alert</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 border rounded font-bold font-mono">A</kbd> / <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 border rounded font-bold font-mono">B</kbd> / <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 border rounded font-bold font-mono">C</kbd> / <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-950 border rounded font-bold font-mono">D</kbd> Select option</div>
            </div>
          </div>

          <button
            id="btn-start-official-exam"
            onClick={handleStartExam}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4 rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all"
          >
            <Award className="w-5 h-5" />
            <span>Launch Official CBT Exam</span>
          </button>
        </div>

        {/* Past Exam History Section */}
        {pastResults.length > 0 ? (
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Past CBT & Practice History</h3>
              </div>
              <button
                id="btn-clear-exam-history"
                onClick={() => {
                  if (onClearHistory) {
                    onClearHistory();
                    setPastResults([]);
                  } else {
                    if (confirm("Are you sure you want to clear your entire CBT history? This cannot be undone.")) {
                      localStorage.removeItem('phy102_results_v1');
                      setPastResults([]);
                    }
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 font-mono font-bold">
                    <th className="py-3 px-2">DATE</th>
                    <th className="py-3 px-2">MODE</th>
                    <th className="py-3 px-2 text-center">SCORE</th>
                    <th className="py-3 px-2 text-center">GRADE</th>
                    <th className="py-3 px-2 text-right">TIME USED</th>
                    <th className="py-3 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                  {pastResults.map((res, index) => (
                    <tr key={res.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 px-2 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {res.date}
                      </td>
                      <td className="py-3 px-2 font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${res.mode === 'exam' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                          {res.mode === 'exam' ? 'CBT Exam' : 'Practice'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-bold">
                        {res.score} / {res.totalQuestions} ({res.percentage}%)
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                          ['A', 'B'].includes(res.grade) ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-500' : 
                          res.grade === 'C' ? 'bg-amber-50 dark:bg-amber-950 text-amber-500' : 'bg-rose-50 dark:bg-rose-950 text-rose-500'
                        }`}>
                          {res.grade}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        {Math.floor(res.timeUsed / 60)}m {res.timeUsed % 60}s
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          id={`btn-view-past-result-${res.id}`}
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
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 p-6 text-center text-sm text-slate-500 space-y-2 shadow-sm">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No CBT Exam history yet.</p>
            <p className="text-xs text-slate-400">Your official CBT exam scores and practice session history will appear here once completed.</p>
          </div>
        )}
      </div>
    );
  }

  // Active Exam Render
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const currentOptions = shuffledOptionsMap[currentQuestion.id] || [];
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const isFlagged = flaggedQuestions[currentQuestion.id] || false;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 1. Exam Left Side (Question Interface and Navigation Controls) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Progress & Time Header */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded border border-rose-100 dark:border-rose-900/30 animate-pulse">
              EXAM LIVE
            </span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Question <span className="font-bold text-slate-800 dark:text-slate-100">{currentIndex + 1}</span> of {questions.length}
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <button
              id="btn-quit-exam"
              onClick={() => setShowQuitConfirm(true)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 underline cursor-pointer"
            >
              Quit
            </button>
          </div>

          {/* 30 mins Countdown */}
          <div className={`flex items-center gap-2 text-sm font-bold px-3.5 py-1.5 rounded-lg border ${timeLeft < 300 ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border-rose-100 dark:border-rose-900/30 animate-pulse' : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border-indigo-100 dark:border-indigo-900/30'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Panel */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-900 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          {/* Section Indicator and Flag Option */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-900">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded">
              {currentQuestion.sec}
            </span>
            <button
              id="btn-flag-question"
              onClick={() => handleToggleFlag(currentQuestion.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                isFlagged
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-white' : ''}`} />
              <span>{isFlagged ? 'Flagged' : 'Flag Question'}</span>
            </button>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
            {currentQuestion.question}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3.5 pt-2">
            {currentOptions.map((opt, oIdx) => {
              const letter = String.fromCharCode(65 + oIdx);
              const isSelected = selectedAnswer === opt;

              return (
                <button
                  key={opt}
                  id={`btn-exam-opt-${letter.toLowerCase()}`}
                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }))}
                  className={`w-full p-4.5 rounded-xl border-2 text-left font-medium text-sm sm:text-base transition-all duration-150 flex items-center gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${isSelected ? 'bg-white text-indigo-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {letter}
                  </span>
                  <span className="flex-grow">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prev / Next & Manual Submit Buttons */}
        <div className="flex justify-between items-center">
          <button
            id="btn-exam-prev"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 disabled:opacity-50 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            id="btn-exam-submit-trigger"
            onClick={() => setShowSubmitConfirm(true)}
            className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer shadow-md transition-all hover:scale-102"
          >
            <span>Submit Exam</span>
            <Check className="w-4 h-4" />
          </button>

          <button
            id="btn-exam-next"
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-sm bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer shadow-md transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Exam Right Side (Question Navigation Grid & Answered Counter) */}
      <div className="space-y-6">
        {/* Statistics panel */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Exam Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div className="text-lg font-black text-slate-800 dark:text-slate-200">{answeredCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">ANSWERED</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div className="text-lg font-black text-slate-800 dark:text-slate-200">{questions.length - answeredCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">UNANSWERED</div>
            </div>
          </div>
        </div>

        {/* Interactive Grid Card */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Question Navigation</h3>
            <button
              onClick={() => setShowShortcutsInfo(prev => !prev)}
              className="text-xs text-indigo-500 hover:underline cursor-pointer"
            >
              Shortcuts
            </button>
          </div>

          {showShortcutsInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-600 dark:text-slate-400 space-y-1.5"
            >
              <p>• Press <kbd className="px-1 border bg-white dark:bg-slate-950 rounded">A</kbd>, <kbd className="px-1 border bg-white dark:bg-slate-950 rounded">B</kbd>, <kbd className="px-1 border bg-white dark:bg-slate-950 rounded">C</kbd>, <kbd className="px-1 border bg-white dark:bg-slate-950 rounded">D</kbd> to select an answer.</p>
              <p>• Press <kbd className="px-1 border bg-white dark:bg-slate-950 rounded">←</kbd> / <kbd className="px-1 border bg-white dark:bg-slate-950 rounded">→</kbd> to navigate.</p>
              <p>• Press <kbd className="px-1 border bg-white dark:bg-slate-950 rounded">F</kbd> to Flag / Unflag.</p>
            </motion.div>
          )}

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions[q.id] || false;

              let btnStyle = 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400';
              if (isCurrent) {
                btnStyle = 'ring-2 ring-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 text-indigo-600 dark:text-indigo-400';
              } else if (isFlagged) {
                btnStyle = 'bg-amber-500 text-white border-amber-500 font-semibold';
              } else if (isAnswered) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-500 font-semibold';
              }

              return (
                <button
                  key={q.id}
                  id={`btn-grid-nav-${idx + 1}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`aspect-square rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-50 dark:border-slate-900 grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-bold font-mono">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-emerald-500 rounded" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-amber-500 rounded" />
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800" />
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      </div>
    </div>

      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 p-6 shadow-xl space-y-6 transform scale-100 opacity-100 transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-500 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quit Exam?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to quit the exam? Your current progress and answers will not be saved.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                id="btn-confirm-quit-cancel"
                onClick={() => setShowQuitConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
              >
                No, Keep Going
              </button>
              <button
                id="btn-confirm-quit-yes"
                onClick={() => {
                  setShowQuitConfirm(false);
                  setIsExamActive(false);
                  onCancel();
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-md shadow-rose-500/10 transition-all cursor-pointer"
              >
                Yes, Quit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 p-6 shadow-xl space-y-6 transform scale-100 opacity-100 transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-500 flex-shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit CBT Exam?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you absolutely sure you want to submit your CBT exam now? Once submitted, your score will be graded and you won't be able to change any answers.
                </p>
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-medium space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Answered Questions:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{answeredCount} / {questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining Unanswered:</span>
                    <span className="font-bold text-rose-500">{questions.length - answeredCount}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                id="btn-confirm-submit-cancel"
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
              >
                Go Back to Exam
              </button>
              <button
                id="btn-confirm-submit-yes"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleSubmitExam();
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
      <ScientificCalculator />
    </>
  );
}
