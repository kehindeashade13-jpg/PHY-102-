/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Play, BookOpen, CheckCircle, HelpCircle, GraduationCap } from 'lucide-react';
import { UserStats } from '../types';
import { BANK } from '../questions';

interface TopicsPageProps {
  stats: UserStats;
  onSelectTopic: (topic: string) => void;
}

export default function TopicsPage({ stats, onSelectTopic }: TopicsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique topics and gather question count per topic
  const topicsData = useMemo(() => {
    const dataMap: Record<string, { name: string; count: number; attempts: number; correct: number }> = {};
    
    BANK.forEach(q => {
      if (!dataMap[q.sec]) {
        const tStats = stats.topicStats[q.sec] || { attempts: 0, correct: 0 };
        dataMap[q.sec] = {
          name: q.sec,
          count: 0,
          attempts: tStats.attempts,
          correct: tStats.correct
        };
      }
      dataMap[q.sec].count += 1;
    });

    return Object.values(dataMap);
  }, [stats]);

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    return topicsData.filter(topic =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topicsData, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Physics Practice Topics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1">
            Focus your practice on individual PHY 102 syllabus categories. Track scores and attempts.
          </p>
        </div>
        
        {/* Live Search bar */}
        <div className="relative w-full sm:w-72">
          <input
            id="search-topics-input"
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, idx) => {
            const accuracy = topic.attempts > 0 ? Math.round((topic.correct / topic.attempts) * 100) : null;

            return (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm p-6 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-900/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-1 rounded">
                      TOPIC {idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                      <HelpCircle className="w-4 h-4" />
                      <span>{topic.count} questions</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[3.5rem]">
                    {topic.name}
                  </h3>

                  {/* Dynamic performance info */}
                  <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-900 flex items-center justify-between text-xs">
                    <div className="text-slate-500 dark:text-slate-400">
                      Attempts: <span className="font-bold text-slate-800 dark:text-slate-200">{topic.attempts}</span>
                    </div>
                    {accuracy !== null ? (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 dark:text-slate-400">Accuracy:</span>
                        <span className={`font-bold ${accuracy >= 75 ? 'text-emerald-500' : accuracy >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                          {accuracy}%
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Unattempted</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    id={`btn-start-topic-${idx}`}
                    onClick={() => onSelectTopic(topic.name)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-3 rounded-xl text-sm cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Practice Quiz</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Topics Found</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try modifying your search query to find other syllabus categories.</p>
        </div>
      )}
    </div>
  );
}
