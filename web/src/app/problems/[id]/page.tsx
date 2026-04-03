'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
import { Menu } from 'lucide-react';
import { SplitPane } from '@/components/ui/SplitPane';
import { TopNav } from '@/components/layout/TopNav';
import { ProblemDrawer } from '@/components/layout/ProblemDrawer';
import { DescriptionTab } from '@/components/workspace/DescriptionTab';
import { SolutionTab } from '@/components/workspace/SolutionTab';
import { CodeEditor } from '@/components/workspace/CodeEditor';
import { TestResults } from '@/components/workspace/TestResults';
import { ActionBar } from '@/components/workspace/ActionBar';
import { useProblemStore } from '@/store/problemStore';
import { useLocale } from '@/context/LocaleContext';
import { cn } from '@/lib/utils';
import type { Problem, ProgressMap, SubmissionResult } from '@/lib/types';

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { t, tProblem } = useLocale();
  const {
    currentCode, setCurrentCode,
    submissionResult, setSubmissionResult,
    isSubmitting, setIsSubmitting,
    drawerOpen, setDrawerOpen,
  } = useProblemStore();

  const [problem, setProblem] = useState<(Problem & { starterCode?: string }) | null>(null);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetch(`/api/problems/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProblem(data);
        setCurrentCode(data.starterCode || '');
        setSubmissionResult(null);
      });
    fetch('/api/problems')
      .then((r) => r.json())
      .then((d) => setAllProblems(d.problems));
    fetch('/api/progress')
      .then((r) => r.json())
      .then((d) => setProgress(d.progress || {}));
  }, [id, setCurrentCode, setSubmissionResult]);

  const handleRun = async () => {
    if (!problem || isRunning) return;
    setIsRunning(true);
    setSubmissionResult(null);
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: problem.id, code: currentCode }),
      });
      const result: SubmissionResult = await res.json();
      setSubmissionResult(result);
    } catch {
      setSubmissionResult({ passed: 0, total: 0, allPassed: false, results: [], totalTimeMs: 0, error: 'Network error' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionResult(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: problem.id, code: currentCode }),
      });
      const result: SubmissionResult = await res.json();
      setSubmissionResult(result);
      // Refresh progress
      const progRes = await fetch('/api/progress');
      const progData = await progRes.json();
      setProgress(progData.progress || {});
    } catch (e) {
      setSubmissionResult({ passed: 0, total: 0, allPassed: false, results: [], totalTimeMs: 0, error: 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-sm text-text-tertiary">{t('loading')}</p>
      </div>
    );
  }

  const hasAttempted = (progress[problem.id]?.attempts || 0) > 0 || submissionResult !== null;

  const leftPanel = (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-4 h-4 text-text-secondary" />
        </button>
        <span className="text-sm font-medium text-text-primary truncate">{tProblem(problem.id)}</span>
      </div>
      <Tabs.Root defaultValue="description" className="flex-1 flex flex-col overflow-hidden">
        <Tabs.List className="flex border-b border-border px-4">
          <Tabs.Trigger
            value="description"
            className="px-3 py-2 text-sm data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=inactive]:text-text-secondary hover:text-text-primary transition-colors -mb-px"
          >
            {t('description')}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="solution"
            className="px-3 py-2 text-sm data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=inactive]:text-text-secondary hover:text-text-primary transition-colors -mb-px"
          >
            {t('solution')}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="description" className="flex-1 overflow-auto">
          <DescriptionTab problem={problem} hasAttempted={hasAttempted} />
        </Tabs.Content>
        <Tabs.Content value="solution" className="flex-1 overflow-auto">
          <SolutionTab problemId={problem.id} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );

  const rightPanel = (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <CodeEditor value={currentCode} onChange={setCurrentCode} />
      </div>
      <TestResults result={submissionResult} />
      <ActionBar onSubmit={handleSubmit} onRun={handleRun} isSubmitting={isSubmitting} isRunning={isRunning} />
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-surface">
      <TopNav />
      <div className="flex-1 overflow-hidden">
        <SplitPane left={leftPanel} right={rightPanel} />
      </div>
      <ProblemDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        problems={allProblems}
        progress={progress}
        currentId={id}
      />
    </div>
  );
}
