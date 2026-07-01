/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Star, CheckCircle, XCircle, AlertCircle, HelpCircle, ArrowLeft, Filter } from 'lucide-react';
import { Question, ExamResult } from '../types';
import { BANK } from '../questions';
import { toggleFavoriteQuestion } from '../storage';

interface ReviewPageProps {
  result?: ExamResult | null; // If provided, review specific exam answers. Otherwise, review general bank.
  statsFavoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export default function ReviewPage({
  result,
  statsFavoriteIds,
  onToggleFavorite,
  onClose
}: ReviewPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  // Collect unique topics
  const uniqueTopics = useMemo(() => {
    return Array.from(new Set(BANK.map(q => q.sec)));
  }, []);

  // Filtered and searched questions
  const itemsToRender = useMemo(() => {
    // If reviewing a specific test result, map the questions from that test
    const baseList = result 
      ? BANK.filter(q => Object.keys(result.answers).includes(q.id))
      : BANK;

    return baseList.filter(q => {
      // 1. Topic Filter
      if (selectedTopic !== 'all' && q.sec !== selectedTopic) return false;

      // 2. Performance Filter (Only relevant if result is present)
      if (result) {
        const ans = result.answers[q.id];
        if (selectedFilter === 'correct' && (!ans || !ans.isCorrect)) return false;
        if (selectedFilter === 'wrong' && (!ans || ans.isCorrect || ans.isSkipped)) return false;
        if (selectedFilter === 'skipped' && (!ans || !ans.isSkipped)) return false;
      }

      // 3. Live Search Filter
      const searchLower = searchQuery.toLowerCase();
      const questionMatch = q.question.toLowerCase().includes(searchLower);
      const explanationMatch = q.explanation.toLowerCase().includes(searchLower);
      const topicMatch = q.sec.toLowerCase().includes(searchLower);
      
      return questionMatch || explanationMatch || topicMatch;
    });
  }, [result, searchQuery, selectedFilter, selectedTopic]);

  const handleToggleFavorite = (qId: string) => {
    toggleFavoriteQuestion(qId);
    onToggleFavorite(qId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <button id="btn-close-review" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {result ? 'Exam review session' : 'Comprehensive Question Bank'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {result ? `Reviewing answers from mock attempt of ${result.date}` : 'Search, filter, and study every PHY 102 syllabus question.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative md:col-span-1">
          <input
            id="review-search-input"
            type="text"
            placeholder="Search keywords, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Topic Filter Selector */}
        <div>
          <select
            id="review-topic-filter"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Topics ({uniqueTopics.length})</option>
            {uniqueTopics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {/* Performance status Filter (Only if result is passed) */}
        {result ? (
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {(['all', 'correct', 'wrong', 'skipped'] as const).map(f => (
              <button
                key={f}
                id={`btn-review-filter-${f}`}
                onClick={() => setSelectedFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedFilter === f
                    ? 'bg-white dark:bg-slate-950 text-indigo-500 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 p-3 justify-end">
            <Filter className="w-3.5 h-3.5" />
            <span>TOTAL EXplORABLE: {itemsToRender.length}</span>
          </div>
        )}
      </div>

      {/* Question Cards List */}
      <div className="space-y-6">
        {itemsToRender.length > 0 ? (
          itemsToRender.map((q, index) => {
            const isFavorite = statsFavoriteIds.includes(q.id);
            const ans = result ? result.answers[q.id] : null;

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.4) }}
                className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 p-5 sm:p-6 shadow-sm space-y-4 relative"
              >
                {/* Header info */}
                <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-900 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                      {q.sec}
                    </span>
                    {ans && (
                      <div className="flex items-center gap-1.5 mt-1">
                        {ans.isCorrect ? (
                          <div className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Correct choice</span>
                          </div>
                        ) : ans.isSkipped ? (
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-bold font-mono">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Skipped</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-rose-500 font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Wrong choice</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    id={`btn-review-bookmark-${q.id}`}
                    onClick={() => handleToggleFavorite(q.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Question */}
                <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 font-sans leading-relaxed">
                  <span className="text-slate-400 font-mono mr-1.5">{index + 1}.</span>
                  {q.question}
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  {q.options.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isCorrectOption = opt === q.correctAnswer;
                    const isSelectedByStudent = ans && ans.selected === opt;

                    let optionStyle = 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                    if (isCorrectOption) {
                      optionStyle = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-emerald-800 dark:text-emerald-200 font-semibold';
                    } else if (isSelectedByStudent) {
                      optionStyle = 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 text-rose-800 dark:text-rose-200 font-semibold';
                    }

                    return (
                      <div
                        key={opt}
                        className={`p-3 rounded-lg border flex items-center gap-2.5 ${optionStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${isCorrectOption ? 'bg-emerald-500 text-white' : isSelectedByStudent ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          {letter}
                        </span>
                        <span className="truncate">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100/50 dark:border-slate-800/80 text-xs sm:text-sm">
                  <div className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider font-mono">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Answer rationale</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {q.explanation}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No matching questions</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try resetting your topic or searching for other chemical terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
