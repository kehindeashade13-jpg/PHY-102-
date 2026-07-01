/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Layers, RefreshCw, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { FLASHCARDS, TOPIC_NOTES } from '../data';

interface StudyToolsProps {
  initialTab?: 'notes' | 'flashcards';
}

export default function StudyTools({ initialTab = 'notes' }: StudyToolsProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards'>(initialTab);
  
  // Flashcards state
  const [currentFcIndex, setCurrentFcIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Notes state
  const [selectedNoteId, setSelectedNoteId] = useState(TOPIC_NOTES[0].id);

  const currentFc = FLASHCARDS[currentFcIndex];
  const currentNote = TOPIC_NOTES.find(n => n.id === selectedNoteId) || TOPIC_NOTES[0];

  const handleNextFc = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentFcIndex(prev => (prev + 1) % FLASHCARDS.length);
    }, 150);
  };

  const handlePrevFc = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentFcIndex(prev => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
    }, 150);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Tab Switcher */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Active Recall Suite</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">High-yield study tools to secure your PHY 102 exam performance.</p>
        </div>
        
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            id="btn-tab-notes"
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-slate-950 text-indigo-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Syllabus Notes
          </button>
          <button
            id="btn-tab-flashcards"
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-950 text-indigo-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Flashcards
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: SYLLABUS HIGH-YIELD NOTES */}
        {activeTab === 'notes' && (
          <motion.div
            key="notes-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Notes sidebar navigation */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Syllabus Chapters</h3>
              <div className="space-y-1.5">
                {TOPIC_NOTES.map(note => (
                  <button
                    key={note.id}
                    id={`btn-note-select-${note.id}`}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      selectedNoteId === note.id
                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-800'
                    }`}
                  >
                    {note.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Note reading pane */}
            <div className="md:col-span-2 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-6">
              <div className="space-y-1.5 border-b border-slate-50 dark:border-slate-900 pb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                  High-Yield Summary
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{currentNote.title}</h2>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {currentNote.content}
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Key takeaways for exam</span>
                </div>
                <div className="space-y-3.5">
                  {currentNote.keyPoints.map((pt, index) => (
                    <div key={index} className="flex gap-3.5 items-start">
                      <div className="w-5.5 h-5.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                        {index + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: FLASHCARDS FOR MEMORIZATION */}
        {activeTab === 'flashcards' && (
          <motion.div
            key="flashcards-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-2xl mx-auto space-y-6"
          >
            {/* Card stage */}
            <div className="relative w-full aspect-[5/3] min-h-[16rem]">
              <motion.div
                id="flashcard-element"
                onClick={() => setIsFlipped(prev => !prev)}
                className={`w-full h-full rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between items-center text-center cursor-pointer select-none transition-all duration-300 relative overflow-hidden bg-white dark:bg-slate-950 ${
                  isFlipped 
                    ? 'border-emerald-300 dark:border-emerald-900/50 shadow-emerald-500/5 shadow-lg' 
                    : 'border-slate-100 dark:border-slate-900 shadow-sm shadow-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-900/50'
                }`}
              >
                {/* Header Category and Status */}
                <div className="w-full flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                    {currentFc.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    CARD {currentFcIndex + 1} / {FLASHCARDS.length}
                  </span>
                </div>

                {/* Question or Solution Text */}
                <div className="px-4 max-w-md w-full">
                  <AnimatePresence mode="wait">
                    {!isFlipped ? (
                      <motion.div
                        key="front"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-sans"
                      >
                        {currentFc.front}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm sm:text-base text-emerald-800 dark:text-emerald-300 whitespace-pre-line font-medium leading-relaxed font-mono"
                      >
                        {currentFc.back}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Reveal Helper message */}
                <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Click to reveal {isFlipped ? 'Question' : 'Solution'}</span>
                </div>
              </motion.div>
            </div>

            {/* Navigation Slider controls */}
            <div className="flex items-center justify-between">
              <button
                id="btn-fc-prev"
                onClick={handlePrevFc}
                className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                ACTIVE MEMORIZATION PRACTICE
              </div>

              <button
                id="btn-fc-next"
                onClick={handleNextFc}
                className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
