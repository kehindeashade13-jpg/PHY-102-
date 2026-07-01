/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Calculator, X, Minus, Sparkles, CornerDownLeft, RotateCcw, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface CalculationHistoryItem {
  expression: string;
  result: string;
}

// Full Physics constants list for quick insertion
const PHYSICS_CONSTANTS = [
  { name: 'q_e', label: 'q_e (Electron Charge)', value: '1.6022e-19', desc: '1.6022 × 10⁻¹⁹ C' },
  { name: 'ε_0', label: 'ε_0 (Permittivity)', value: '8.8542e-12', desc: '8.8542 × 10⁻¹² F/m' },
  { name: 'μ_0', label: 'μ_0 (Permeability)', value: '1.2566e-6', desc: '1.2566 × 10⁻⁶ H/m' },
  { name: 'c', label: 'c (Speed of Light)', value: '2.9979e8', desc: '2.9979 × 10⁸ m/s' },
  { name: 'k', label: 'k (Coulomb Constant)', value: '8.9876e9', desc: '8.9876 × 10⁹ N·m²/C²' },
  { name: 'm_e', label: 'm_e (Electron Mass)', value: '9.1094e-31', desc: '9.1094 × 10⁻³¹ kg' },
  { name: 'm_p', label: 'm_p (Proton Mass)', value: '1.6726e-27', desc: '1.6726 × 10⁻²⁷ kg' },
  { name: 'h', label: 'h (Planck Constant)', value: '6.6261e-34', desc: '6.6261 × 10⁻³⁴ J·s' },
];

/**
 * Robust Recursive Descent Math Parser for Scientific Calculations
 * Avoids eval() and supports full scientific functionality
 */
export function evaluateMathExpression(
  expression: string, 
  isDegree: boolean = true,
  ansValue: string = '0'
): { success: boolean; result: string; error?: string } {
  try {
    // 1. Sanitize & Normalize expression
    let sanitized = expression
      .replace(/\s+/g, '') // remove spaces
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/Ans/gi, ansValue);

    // Substitute physics constants values
    PHYSICS_CONSTANTS.forEach(c => {
      // Use regex to match exact word boundary or custom names
      const escapedName = c.name.replace(/_/g, '_');
      const regex = new RegExp(`\\b${escapedName}\\b`, 'g');
      sanitized = sanitized.replace(regex, `(${c.value})`);
    });

    // Replace implicit multiplication before parentheses or functions, e.g., "2(3)" -> "2*(3)" or "2pi" -> "2*pi"
    sanitized = sanitized.replace(/(\d)(\()/g, '$1*$2');
    sanitized = sanitized.replace(/(\))(\d)/g, '$1*$2');
    sanitized = sanitized.replace(/(\d)(pi|e|q_e|ε_0|μ_0|c|k|m_e|m_p)/gi, '$1*$2');
    sanitized = sanitized.replace(/(\))(pi|e|q_e|ε_0|μ_0|c|k|m_e|m_p)/gi, '$1*$2');

    // Tokenizer
    let pos = 0;
    const tokens: string[] = [];

    while (pos < sanitized.length) {
      const char = sanitized[pos];

      // 1. Operators & Parentheses
      if ('+-*/()^,'.includes(char)) {
        tokens.push(char);
        pos++;
        continue;
      }

      // 2. Numbers (including scientific notation like 1.6e-19)
      const numberRegex = /^\d*\.?\d+(?:[eE][+-]?\d+)?/;
      const matchNum = sanitized.substring(pos).match(numberRegex);
      if (matchNum) {
        tokens.push(matchNum[0]);
        pos += matchNum[0].length;
        continue;
      }

      // 3. Functions and Constants (words)
      const wordRegex = /^[a-zA-Z_]\w*/;
      const matchWord = sanitized.substring(pos).match(wordRegex);
      if (matchWord) {
        tokens.push(matchWord[0]);
        pos += matchWord[0].length;
        continue;
      }

      // Unrecognized character
      return { success: false, result: 'Error', error: `Invalid character: "${char}"` };
    }

    // Parser State
    let tIndex = 0;
    const peek = () => tokens[tIndex] || '';
    const consume = (expected?: string) => {
      const current = peek();
      if (expected && current !== expected) {
        throw new Error(`Expected "${expected}" but got "${current}"`);
      }
      tIndex++;
      return current;
    };

    // Recursive Descent Grammar
    // expr   -> term (( '+' | '-' ) term)*
    // term   -> power (( '*' | '/' ) power)*
    // power  -> factor ( '^' factor )*
    // factor -> NUMBER | CONSTANT | FUNCTION '(' expr ')' | '(' expr ')' | '+' factor | '-' factor

    function parseExpression(): number {
      let value = parseTerm();
      while (peek() === '+' || peek() === '-') {
        const op = consume();
        const nextVal = parseTerm();
        if (op === '+') value += nextVal;
        else value -= nextVal;
      }
      return value;
    }

    function parseTerm(): number {
      let value = parsePower();
      while (peek() === '*' || peek() === '/') {
        const op = consume();
        const nextVal = parsePower();
        if (op === '*') value *= nextVal;
        else {
          if (nextVal === 0) throw new Error('Division by zero');
          value /= nextVal;
        }
      }
      return value;
    }

    function parsePower(): number {
      let value = parseFactor();
      if (peek() === '^') {
        consume();
        const exponent = parsePower(); // Right-associative exponentiation
        value = Math.pow(value, exponent);
      }
      return value;
    }

    function parseFactor(): number {
      const token = peek();
      if (!token) throw new Error('Unexpected end of expression');

      // Unary operators
      if (token === '+') {
        consume();
        return parseFactor();
      }
      if (token === '-') {
        consume();
        return -parseFactor();
      }

      // Parentheses
      if (token === '(') {
        consume();
        const value = parseExpression();
        consume(')');
        return value;
      }

      // Numbers
      if (/^\d/.test(token) || token.startsWith('.')) {
        consume();
        return parseFloat(token);
      }

      // Functions & Named constants
      if (/^[a-zA-Z_]/.test(token)) {
        const name = consume();

        // Check if it is a constant
        if (name === 'pi' || name === 'PI') return Math.PI;
        if (name === 'e' || name === 'E') return Math.E;

        // Check if it's a function call
        if (peek() === '(') {
          consume('(');
          const arg = parseExpression();
          consume(')');

          const degToRad = (val: number) => (val * Math.PI) / 180;
          const radToDeg = (val: number) => (val * 180) / Math.PI;

          switch (name.toLowerCase()) {
            case 'sin':
              return Math.sin(isDegree ? degToRad(arg) : arg);
            case 'cos':
              return Math.cos(isDegree ? degToRad(arg) : arg);
            case 'tan':
              return Math.tan(isDegree ? degToRad(arg) : arg);
            case 'asin':
              return isDegree ? radToDeg(Math.asin(arg)) : Math.asin(arg);
            case 'acos':
              return isDegree ? radToDeg(Math.acos(arg)) : Math.acos(arg);
            case 'atan':
              return isDegree ? radToDeg(Math.atan(arg)) : Math.atan(arg);
            case 'sinh':
              return Math.sinh(arg);
            case 'cosh':
              return Math.cosh(arg);
            case 'tanh':
              return Math.tanh(arg);
            case 'ln':
              if (arg <= 0) throw new Error('Domain error for ln()');
              return Math.log(arg);
            case 'log':
              if (arg <= 0) throw new Error('Domain error for log()');
              return Math.log10(arg);
            case 'sqrt':
              if (arg < 0) throw new Error('Square root of negative number');
              return Math.sqrt(arg);
            case 'exp':
              return Math.exp(arg);
            case 'abs':
              return Math.abs(arg);
            default:
              throw new Error(`Unknown function: "${name}"`);
          }
        } else {
          throw new Error(`Unexpected constant or word: "${name}"`);
        }
      }

      throw new Error(`Unexpected token: "${token}"`);
    }

    const finalValue = parseExpression();

    // Check if there are unconsumed tokens
    if (tIndex < tokens.length) {
      throw new Error(`Extra token at end: "${tokens[tIndex]}"`);
    }

    if (isNaN(finalValue) || !isFinite(finalValue)) {
      return { success: false, result: 'Error', error: 'Undefined arithmetic outcome' };
    }

    // Format scientific numbers nicely if they are too small/large
    let formattedResult = finalValue.toString();
    if (Math.abs(finalValue) < 1e-4 && finalValue !== 0) {
      formattedResult = finalValue.toExponential(5);
    } else if (Math.abs(finalValue) > 1e9) {
      formattedResult = finalValue.toExponential(5);
    } else {
      // Round to 8 decimal places max to avoid floating point issues like 0.1+0.2 = 0.30000000004
      formattedResult = Number(finalValue.toFixed(8)).toString();
    }

    return { success: true, result: formattedResult };
  } catch (err: any) {
    return { success: false, result: 'Error', error: err.message || 'Syntax Error' };
  }
}

export default function ScientificCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isDegree, setIsDegree] = useState(true);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [ans, setAns] = useState('0');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showConstantsTab, setShowConstantsTab] = useState(false);

  // Position for dragging
  const [position, setPosition] = useState({ x: 80, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const calcContainerRef = useRef<HTMLDivElement>(null);

  // Load history from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('phy102_calc_history');
      if (stored) {
        setHistory(JSON.parse(stored).slice(0, 20));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: CalculationHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('phy102_calc_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error(e);
    }
  };

  // Pointer event handlers for cross-platform desktop/mobile dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag when clicking the header and not clicking buttons on it
    if ((e.target as HTMLElement).closest('.drag-no-bubble')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    // Capture pointer
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    // Bounds check to keep calculator visible
    const newX = Math.max(0, Math.min(window.innerWidth - 300, dragRef.current.posX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - 100, dragRef.current.posY + deltaY));
    
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    dragRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Calculator button actions
  const handleKeyPress = (val: string) => {
    setErrorMessage(null);
    setExpression(prev => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setErrorMessage(null);
  };

  const handleBackspace = () => {
    setErrorMessage(null);
    setExpression(prev => {
      // Check if deleting a physics constant name
      for (const c of PHYSICS_CONSTANTS) {
        if (prev.endsWith(c.name)) {
          return prev.slice(0, -c.name.length);
        }
      }
      // Check if deleting function names
      const functions = ['asin(', 'acos(', 'atan(', 'sinh(', 'cosh(', 'tanh(', 'sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt(', 'exp(', 'abs('];
      for (const fn of functions) {
        if (prev.endsWith(fn)) {
          return prev.slice(0, -fn.length);
        }
      }
      return prev.slice(0, -1);
    });
  };

  const handleEvaluate = () => {
    if (!expression.trim()) return;
    const evalRes = evaluateMathExpression(expression, isDegree, ans);
    if (evalRes.success) {
      setResult(evalRes.result);
      setAns(evalRes.result);
      setErrorMessage(null);

      // Add to history
      const updatedHistory = [{ expression, result: evalRes.result }, ...history].slice(0, 20);
      saveHistory(updatedHistory);
    } else {
      setErrorMessage(evalRes.error || 'Syntax Error');
    }
  };

  // Keyboard support while focus is in/out of document
  useEffect(() => {
    if (isMinimized) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if typing inside any form inputs to prevent interference
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }

      const key = e.key;
      if (/\d/.test(key)) {
        handleKeyPress(key);
      } else if (['+', '-', '*', '/', '(', ')', '^', '.'].includes(key)) {
        handleKeyPress(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        setIsMinimized(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, isMinimized, isDegree, ans, history]);

  // Insert constant directly or value
  const handleInsertConstant = (name: string) => {
    setErrorMessage(null);
    setExpression(prev => prev + name);
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  return (
    <div className="fixed z-50 text-slate-800 dark:text-slate-200">
      {/* 1. CLOSED/MINIMIZED FLOAT BUTTON */}
      {isMinimized ? (
        <button
          id="btn-floating-calculator-trigger"
          onClick={() => {
            setIsMinimized(false);
            // Default center-right positioning on first load
            if (position.x === 80 && position.y === 150) {
              setPosition({
                x: window.innerWidth - 380,
                y: 120,
              });
            }
          }}
          title="Open Scientific Calculator"
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xl hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-indigo-400"
        >
          <Calculator className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black uppercase px-1 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-950">
            PHY 102
          </span>
        </button>
      ) : (
        /* 2. DRAGGABLE CALCULATOR INTERFACE */
        <div
          ref={calcContainerRef}
          id="scientific-calculator-container"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            position: 'fixed',
            left: 0,
            top: 0,
          }}
          className="w-80 md:w-[350px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl flex flex-col overflow-hidden transition-shadow"
        >
          {/* Header Drag Handle bar */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center gap-1.5 pointer-events-none">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-black tracking-wider uppercase font-mono text-indigo-600 dark:text-indigo-400">
                PHY 102 Scientifica
              </span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 drag-no-bubble">
              <button
                id="btn-calc-deg-rad-toggle"
                onClick={() => setIsDegree(!isDegree)}
                title="Toggle Radians / Degrees"
                className="px-2 py-0.5 text-[10px] font-bold font-mono rounded bg-white dark:bg-slate-850 hover:bg-slate-100 border border-slate-200 dark:border-slate-700/80 text-indigo-600 dark:text-indigo-400 mr-2 transition-colors"
              >
                {isDegree ? 'DEG' : 'RAD'}
              </button>
              <button
                id="btn-calc-minimize"
                onClick={() => setIsMinimized(true)}
                title="Minimize Calculator"
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                id="btn-calc-close"
                onClick={() => setIsMinimized(true)}
                title="Close Calculator"
                className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded text-slate-500 hover:text-rose-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SCREEN PANEL */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-900/40 space-y-1 text-right select-all">
            {/* Formula Expression Bar */}
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tracking-wide truncate h-5">
              {expression || ' '}
            </div>
            {/* Realtime / Evaluation Result Display */}
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white truncate">
              {result}
            </div>
            {/* Error Message banner */}
            {errorMessage && (
              <div className="text-[10px] font-mono font-semibold text-rose-500 text-left animate-pulse bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-900/30">
                {errorMessage}
              </div>
            )}
          </div>

          {/* TAB SWITCHER: Scientific Keys vs Constants vs History */}
          <div className="flex border-b border-slate-200 dark:border-slate-800/80 text-xs font-bold font-mono">
            <button
              onClick={() => { setShowHistory(false); setShowConstantsTab(false); }}
              className={`flex-1 py-2 border-b-2 text-center transition-all cursor-pointer ${!showHistory && !showConstantsTab ? 'border-indigo-500 text-indigo-500 bg-slate-50/40 dark:bg-slate-900/10' : 'border-transparent text-slate-400'}`}
            >
              KEYS
            </button>
            <button
              id="btn-calc-tab-constants"
              onClick={() => { setShowHistory(false); setShowConstantsTab(true); }}
              className={`flex-1 py-2 border-b-2 text-center transition-all cursor-pointer ${showConstantsTab ? 'border-indigo-500 text-indigo-500 bg-slate-50/40 dark:bg-slate-900/10' : 'border-transparent text-slate-400'}`}
            >
              CONSTANTS
            </button>
            <button
              id="btn-calc-tab-history"
              onClick={() => { setShowHistory(true); setShowConstantsTab(false); }}
              className={`flex-1 py-2 border-b-2 text-center transition-all cursor-pointer ${showHistory ? 'border-indigo-500 text-indigo-500 bg-slate-50/40 dark:bg-slate-900/10' : 'border-transparent text-slate-400'}`}
            >
              HISTORY ({history.length})
            </button>
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="p-3 bg-white dark:bg-slate-950 min-h-[220px] max-h-[300px] overflow-y-auto">
            
            {/* TAB 1: CALCULATION KEYPAD */}
            {!showHistory && !showConstantsTab && (
              <div className="space-y-3">
                {/* Scientific function group */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'sin', action: () => handleKeyPress('sin(') },
                    { label: 'cos', action: () => handleKeyPress('cos(') },
                    { label: 'tan', action: () => handleKeyPress('tan(') },
                    { label: 'π', action: () => handleKeyPress('π') },
                    
                    { label: 'asin', action: () => handleKeyPress('asin(') },
                    { label: 'acos', action: () => handleKeyPress('acos(') },
                    { label: 'atan', action: () => handleKeyPress('atan(') },
                    { label: 'e', action: () => handleKeyPress('e') },

                    { label: 'ln', action: () => handleKeyPress('ln(') },
                    { label: 'log', action: () => handleKeyPress('log(') },
                    { label: 'sqrt', action: () => handleKeyPress('sqrt(') },
                    { label: '^', action: () => handleKeyPress('^') },
                  ].map(btn => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      className="py-1.5 text-xs font-bold font-mono rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-900" />

                {/* Primary numbers and operations keypad */}
                <div className="grid grid-cols-4 gap-1.5">
                  {/* Row 1 */}
                  <button onClick={() => handleKeyPress('(')} className="py-2.5 text-sm font-bold font-mono rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/40 text-slate-600 dark:text-slate-300">(</button>
                  <button onClick={() => handleKeyPress(')')} className="py-2.5 text-sm font-bold font-mono rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/40 text-slate-600 dark:text-slate-300">)</button>
                  <button onClick={handleBackspace} className="py-2.5 text-xs font-black font-mono rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 hover:bg-amber-100">⌫</button>
                  <button onClick={handleClear} className="py-2.5 text-xs font-black font-mono rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 hover:bg-rose-100">AC</button>

                  {/* Row 2 */}
                  <button onClick={() => handleKeyPress('7')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">7</button>
                  <button onClick={() => handleKeyPress('8')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">8</button>
                  <button onClick={() => handleKeyPress('9')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">9</button>
                  <button onClick={() => handleKeyPress('/')} className="py-2.5 text-base font-bold font-mono rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/45 text-indigo-500">÷</button>

                  {/* Row 3 */}
                  <button onClick={() => handleKeyPress('4')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">4</button>
                  <button onClick={() => handleKeyPress('5')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">5</button>
                  <button onClick={() => handleKeyPress('6')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">6</button>
                  <button onClick={() => handleKeyPress('*')} className="py-2.5 text-base font-bold font-mono rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/45 text-indigo-500">×</button>

                  {/* Row 4 */}
                  <button onClick={() => handleKeyPress('1')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">1</button>
                  <button onClick={() => handleKeyPress('2')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">2</button>
                  <button onClick={() => handleKeyPress('3')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">3</button>
                  <button onClick={() => handleKeyPress('-')} className="py-2.5 text-base font-bold font-mono rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/45 text-indigo-500">-</button>

                  {/* Row 5 */}
                  <button onClick={() => handleKeyPress('0')} className="py-2.5 text-base font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80">0</button>
                  <button onClick={() => handleKeyPress('.')} className="py-2.5 text-base font-bold font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 text-slate-700 dark:text-slate-300">.</button>
                  <button onClick={() => handleKeyPress('E')} title="Scientific exponent notation (e.g. 1.6E-19)" className="py-2.5 text-xs font-bold font-mono rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 text-slate-700 dark:text-slate-300">EXP</button>
                  <button onClick={() => handleKeyPress('+')} className="py-2.5 text-base font-bold font-mono rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/45 text-indigo-500">+</button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleKeyPress('Ans')}
                    className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-xs font-bold font-mono"
                  >
                    Ans ({ans})
                  </button>
                  <button
                    onClick={handleEvaluate}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-base font-black font-mono shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>=</span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PHYSICS CONSTANTS INTEGRATION */}
            {showConstantsTab && (
              <div className="space-y-2">
                <div className="p-2 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 border border-indigo-100/50 dark:border-indigo-900/30">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>Tap any constant to insert its literal notation directly into your formula. The parser automatically substitutes correct scientific values!</span>
                </div>
                
                <div className="grid grid-cols-1 gap-1.5">
                  {PHYSICS_CONSTANTS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => handleInsertConstant(c.name)}
                      className="p-2 rounded-xl text-left border border-slate-100 dark:border-slate-900 hover:border-indigo-100 dark:hover:border-indigo-900/50 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10 transition-all flex justify-between items-center"
                    >
                      <div>
                        <div className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                          {c.name} <span className="text-slate-400 font-sans font-medium text-[10px]">({c.label.split(' ')[1]})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.desc}</div>
                      </div>
                      <span className="text-[9px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded text-indigo-500">
                        + Insert
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CALCULATION HISTORY */}
            {showHistory && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400">Recent calculations (max 20)</span>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-[10px] font-bold text-rose-500 hover:underline transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 space-y-1.5">
                    <RotateCcw className="w-5 h-5 mx-auto text-slate-300" />
                    <p>No history records yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-900 space-y-2">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="py-2 text-right space-y-1 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 px-1 rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          setExpression(item.expression);
                          setResult(item.result);
                          setErrorMessage(null);
                        }}
                        title="Reuse calculation formula"
                      >
                        <div className="text-xs font-mono text-slate-400 truncate">{item.expression}</div>
                        <div className="text-sm font-black font-mono text-slate-800 dark:text-slate-200">{item.result}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Manual Guide footer */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between text-[9px] text-slate-400 font-mono select-none">
            <span>Supports keyboard inputs & Ans key</span>
            <div className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <span>isDegree={isDegree ? 'Y' : 'N'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
