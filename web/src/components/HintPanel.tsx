'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';

interface HintPanelProps {
  hints: string[];
}

export function HintPanel({ hints }: HintPanelProps) {
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  const revealHint = (index: number) => {
    setRevealedHints((prev) => new Set([...prev, index]));
  };

  const totalHints = hints.length;

  if (totalHints === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
          Hints ({revealedHints.size}/{totalHints} revealed)
        </h3>
      </div>

      <div className="divide-y divide-yellow-200 dark:divide-yellow-800">
        {hints.map((hint, index) => {
          const isRevealed = revealedHints.has(index);

          return (
            <div key={index}>
              {isRevealed ? (
                <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/30">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{hint}</p>
                </div>
              ) : (
                <button
                  onClick={() => revealHint(index)}
                  className="w-full p-4 flex items-center justify-between hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20 transition-colors text-left"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Hint {index + 1}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {revealedHints.size < totalHints && (
        <div className="p-3 bg-yellow-100/50 dark:bg-yellow-900/30 text-center">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Click on hints to reveal them one by one
          </p>
        </div>
      )}
    </div>
  );
}
