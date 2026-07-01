/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Settings, Play, ArrowLeft, ArrowRight, BookMarked, Copy,
  AlertTriangle, RotateCcw, Check, Clock, Eye, Sparkles, Star
} from 'lucide-react';
import { Question, QuizConfig, ExamResult } from '../types';
import { BANK } from '../questions';
import { toggleFavoriteQuestion } from '../storage';

interface PracticeModeProps {
  selectedTopic: string | null;
  statsFavoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onFinishQuiz: (result: ExamResult) => void;
  onCancel: () => void;
}

export default function PracticeMode({
  selectedTopic,
  statsFavoriteIds,
  onToggleFavorite,
  onFinishQuiz,
  onCancel
}: PracticeModeProps) {
  // 1. Configuration State
  const [config, setConfig] = useState<QuizConfig>({
    questionCount: 10,
    shuffleQuestions: true,
    shuffleOptions: true,
    timerOn: true,
    instantFeedback: true,
    selectedTopic: selectedTopic || undefined
  });

  const [isQuizActive, setIsQuizActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<string, string[]>>({});

  // 2. Quiz Progress State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 3. Actions Feedbacks
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [reportFeedback, setReportFeedback] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Available topics for select
  const uniqueTopics = useMemo(() => {
    return Array.from(new Set(BANK.map(q => q.sec)));
  }, []);

  // Set initial topic if changed from parent
  useEffect(() => {
    if (selectedTopic) {
      setConfig(prev => ({ ...prev, selectedTopic }));
    }
  }, [selectedTopic]);

  // Helper to shuffle arrays
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // Build Quiz Questions
  const handleStartQuiz = () => {
    // Filter questions by topic
    let filtered = BANK;
    if (config.selectedTopic) {
      filtered = BANK.filter(q => q.sec === config.selectedTopic);
    }

    // Shuffle questions if requested
    let quizSet = [...filtered];
    if (config.shuffleQuestions) {
      quizSet = shuffleArray(quizSet);
    }

    // Slice to question count
    if (config.questionCount > 0 && config.questionCount < quizSet.length) {
      quizSet = quizSet.slice(0, config.questionCount);
    }

    // Shuffle options map
    const optionsMap: Record<string, string[]> = {};
    quizSet.forEach(q => {
      optionsMap[q.id] = config.shuffleOptions ? shuffleArray(q.options) : q.options;
    });

    setQuestions(quizSet);
    setShuffledOptionsMap(optionsMap);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setStartTime(Date.now());
    
    // Timer setting (e.g., 60 seconds per question)
    if (config.timerOn) {
      setTimeLeft(quizSet.length * 60);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }

    setIsQuizActive(true);
  };

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(); // auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answer: string) => {
    const qId = questions[currentIndex].id;
    // In practice mode, if instant feedback is ON and they already answered, don't let them change it to keep score authentic (or optionally let them change if feedback is off)
    if (config.instantFeedback && selectedAnswers[qId]) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: answer
    }));
  };

  // Handle bookmarks/favorites
  const handleToggleFavorite = (qId: string) => {
    toggleFavoriteQuestion(qId);
    onToggleFavorite(qId);
  };

  // Copy to clipboard
  const handleCopyQuestion = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Report mock action
  const handleReportQuestion = () => {
    setReportFeedback(true);
    setTimeout(() => setReportFeedback(false), 2000);
  };

  // Final Quiz Submission
  const handleSubmitQuiz = () => {
    setIsTimerRunning(false);
    const timeUsed = config.timerOn 
      ? (questions.length * 60) - timeLeft 
      : Math.floor((Date.now() - startTime) / 1000);

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

    onFinishQuiz({
      id: `p-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      grade,
      timeUsed,
      mode: 'practice',
      answers: answersReport
    });
  };

  // Render setup view
  if (!isQuizActive) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Setup Card Header */}
        <div className="flex items-center gap-3">
          <button id="btn-back-landing" onClick={onCancel} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Practice Mode Config</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Customize your organic chemistry study session.</p>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Topic selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Syllabus Category</label>
            <select
              id="select-quiz-topic"
              value={config.selectedTopic || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, selectedTopic: e.target.value || undefined }))}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            >
              <option value="">All Topics (Comprehensive Quiz)</option>
              {uniqueTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Question Count Selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Question Set Length</label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {[10, 20, 40, 60, -1].map((count) => {
                const isSelected = config.questionCount === count;
                const label = count === -1 ? 'All' : count.toString();
                return (
                  <button
                    key={count}
                    id={`btn-config-count-${count}`}
                    onClick={() => setConfig(prev => ({ ...prev, questionCount: count }))}
                    className={`p-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/15'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz settings toggles */}
          <div className="border-t border-slate-100 dark:border-slate-900 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">Advanced Settings</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shuffle Questions */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Shuffle Questions</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Randomize question sequence</div>
                </div>
                <button
                  id="toggle-shuffle-questions"
                  onClick={() => setConfig(prev => ({ ...prev, shuffleQuestions: !prev.shuffleQuestions }))}
                  className={`w-12 h-6.5 rounded-full p-1 transition-all flex items-center cursor-pointer ${config.shuffleQuestions ? 'bg-indigo-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                >
                  <span className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              {/* Shuffle Options */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Shuffle Options</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Randomize four options order</div>
                </div>
                <button
                  id="toggle-shuffle-options"
                  onClick={() => setConfig(prev => ({ ...prev, shuffleOptions: !prev.shuffleOptions }))}
                  className={`w-12 h-6.5 rounded-full p-1 transition-all flex items-center cursor-pointer ${config.shuffleOptions ? 'bg-indigo-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                >
                  <span className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              {/* Timer Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Timer Limit</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">60s allocated per question</div>
                </div>
                <button
                  id="toggle-timer"
                  onClick={() => setConfig(prev => ({ ...prev, timerOn: !prev.timerOn }))}
                  className={`w-12 h-6.5 rounded-full p-1 transition-all flex items-center cursor-pointer ${config.timerOn ? 'bg-indigo-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                >
                  <span className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              {/* Instant Feedback Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Instant Feedback</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Show correct/wrong and explanation on select</div>
                </div>
                <button
                  id="toggle-feedback"
                  onClick={() => setConfig(prev => ({ ...prev, instantFeedback: !prev.instantFeedback }))}
                  className={`w-12 h-6.5 rounded-full p-1 transition-all flex items-center cursor-pointer ${config.instantFeedback ? 'bg-indigo-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                >
                  <span className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            </div>
          </div>

          <button
            id="btn-start-configured-practice"
            onClick={handleStartQuiz}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4 rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Practice Session</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. QUIZ RUNNING INTERFACE
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const currentOptions = shuffledOptionsMap[currentQuestion.id] || [];
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const isAnswered = selectedAnswer !== undefined;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Quiz Progress & Timer Header */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              id="btn-quit-quiz"
              onClick={() => setShowQuitConfirm(true)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 underline cursor-pointer"
            >
              Quit
            </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            Question <span className="font-bold text-slate-800 dark:text-slate-100">{currentIndex + 1}</span> of {questions.length}
          </div>
        </div>

        {/* Timer */}
        {config.timerOn && (
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Category & Quick Actions */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-900">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded">
            {currentQuestion.sec}
          </span>
          <div className="flex items-center gap-3">
            {/* Copy button */}
            <button
              id="btn-copy-question"
              onClick={() => handleCopyQuestion(currentQuestion.question)}
              title="Copy Question to Clipboard"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer relative"
            >
              {copyFeedback ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            {/* Favorite button */}
            <button
              id="btn-bookmark-question"
              onClick={() => handleToggleFavorite(currentQuestion.id)}
              title="Bookmark Question"
              className="p-2 rounded-lg transition-colors cursor-pointer text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <Star
                className={`w-4 h-4 ${statsFavoriteIds.includes(currentQuestion.id) ? 'text-amber-400 fill-amber-400' : 'text-slate-400 hover:text-amber-400'}`}
              />
            </button>
            {/* Report button */}
            <button
              id="btn-report-question"
              onClick={handleReportQuestion}
              title="Report Incorrect/Typo in Question"
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer relative"
            >
              {reportFeedback ? <Check className="w-4 h-4 text-rose-500" /> : <AlertTriangle className="w-4 h-4" />}
            </button>
          </div>
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
            const isCorrectOption = opt === currentQuestion.correctAnswer;
            
            // Handle highlights according to config
            let optionStyle = 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700';
            let prefixStyle = 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

            if (config.instantFeedback && isAnswered) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                prefixStyle = 'bg-emerald-500 text-white';
              } else if (isSelected) {
                optionStyle = 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500 text-rose-900 dark:text-rose-200';
                prefixStyle = 'bg-rose-500 text-white';
              } else {
                optionStyle = 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/10';
              prefixStyle = 'bg-white text-indigo-600';
            }

            return (
              <button
                key={opt}
                id={`btn-opt-${letter.toLowerCase()}`}
                disabled={config.instantFeedback && isAnswered}
                onClick={() => handleSelectAnswer(opt)}
                className={`w-full p-4.5 rounded-xl border-2 text-left font-medium text-sm sm:text-base transition-all duration-150 flex items-center gap-4 cursor-pointer ${optionStyle}`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${prefixStyle}`}>
                  {letter}
                </span>
                <span className="flex-grow">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Instant Explanation Panel */}
        {config.instantFeedback && isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2 mt-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Explanation & Solution</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation Controls footer */}
      <div className="flex justify-between items-center mt-6">
        <button
          id="btn-prev-question"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300 disabled:opacity-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            id="btn-submit-practice"
            onClick={handleSubmitQuiz}
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer shadow-md transition-all"
          >
            <span>Finish Quiz</span>
            <Check className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="btn-next-question"
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-sm bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer shadow-md transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quit Practice?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to end this practice session? Your current progress in this session will be lost.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                id="btn-confirm-quit-practice-cancel"
                onClick={() => setShowQuitConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
              >
                No, Keep Practicing
              </button>
              <button
                id="btn-confirm-quit-practice-yes"
                onClick={() => {
                  setShowQuitConfirm(false);
                  setIsQuizActive(false);
                  onCancel();
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-md shadow-rose-500/10 transition-all cursor-pointer"
              >
                Yes, Quit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
