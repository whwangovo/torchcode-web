'use client';

import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import { DifficultyBadge } from '@/components/problem/DifficultyBadge';
import { PythonCode } from '@/lib/pythonHighlight';
import { useLocale } from '@/context/LocaleContext';
import type { Problem } from '@/lib/types';

interface DescriptionTabProps {
  problem: Problem;
  hasAttempted: boolean;
}

export function DescriptionTab({ problem, hasAttempted }: DescriptionTabProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const { t } = useLocale();

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {problem.title}
          </h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <p className="text-sm text-text-secondary">
          {t('implementFn', { fn: problem.functionName })}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-primary">{t('testCases')}</h3>
        {problem.tests.slice(0, 2).map((test, i) => (
          <div key={i} className="rounded-lg bg-surface-secondary border border-border/50 overflow-hidden">
            <p className="text-xs font-medium text-text-secondary px-3 pt-2 pb-1">{test.name}</p>
            <pre className="text-xs font-mono px-3 pb-3 overflow-x-auto leading-relaxed">
              <PythonCode code={test.code.replace(/\{fn\}/g, problem.functionName).split('\n').filter(l => !l.startsWith('import ') && !l.startsWith('from ')).join('\n').trim()} />
            </pre>
          </div>
        ))}
        {problem.tests.length > 2 && (
          <p className="text-xs text-text-tertiary">{t('moreTests', { n: problem.tests.length - 2 })}</p>
        )}
      </div>

      {hasAttempted && problem.hint && (
        <div>
          <button
            onClick={() => setHintOpen(!hintOpen)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{t('hint')}</span>
            {hintOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {hintOpen && (
            <p className="mt-2 p-3 rounded-lg bg-medium/5 text-sm text-text-secondary leading-relaxed">
              {problem.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
