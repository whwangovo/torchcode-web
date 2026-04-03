'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { SubmissionResult } from '@/lib/types';

interface TestResultsProps {
  result: SubmissionResult | null;
}

export function TestResults({ result }: TestResultsProps) {
  const [expanded, setExpanded] = useState(true);
  const { t } = useLocale();

  if (!result) return null;

  return (
    <div className="border-t border-border bg-surface">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium hover:bg-surface-secondary transition-colors"
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <span className={result.allPassed ? 'text-easy' : 'text-hard'}>
          {result.allPassed ? t('allPassed') : t('passedCount', { passed: result.passed, total: result.total })}
        </span>
        <span className="text-text-tertiary text-xs ml-auto">{result.totalTimeMs.toFixed(0)}ms</span>
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-1">
          {result.results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 text-sm">
              {r.passed
                ? <CheckCircle className="w-3.5 h-3.5 text-easy flex-shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-hard flex-shrink-0" />}
              <span className="text-text-primary">{r.name}</span>
              <span className="text-text-tertiary text-xs ml-auto">{r.execTimeMs.toFixed(1)}ms</span>
            </div>
          ))}
          {result.error && (
            <pre className="mt-2 p-3 rounded-lg bg-hard/5 text-hard text-xs overflow-x-auto">
              {result.error}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
