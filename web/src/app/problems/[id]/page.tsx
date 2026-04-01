'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Lightbulb, Play, Send, ChevronDown, ChevronRight } from 'lucide-react';
import { CodeEditor } from '@/components/CodeEditor';
import { SubmissionResults } from '@/components/SubmissionResults';
import { ProblemDetailNav } from '@/components/ProblemDetailNav';
import { useProblemStore } from '@/store/problemStore';
import { Problem, Test, ProgressMap } from '@/lib/types';
import { cn } from '@/lib/utils';
import starters from '@/lib/starters.json';
import problemsData from '@/lib/problems.json';

const DIFFICULTY_STYLES = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ProblemDetailPage() {
  const params = useParams();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [hintRevealed, setHintRevealed] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [examplesExpanded, setExamplesExpanded] = useState(true);

  const { currentCode, setCurrentCode, submissionResult, setSubmissionResult, isSubmitting, setIsSubmitting } =
    useProblemStore();

  // Load problem data
  useEffect(() => {
    const found = problemsData.problems.find((p) => p.id === problemId);
    if (found) {
      setProblem(found as Problem);
      const starter = (starters as Record<string, string>)[problemId];
      setCurrentCode(starter || `def ${found.functionName}(...):\n    pass`);
    }
    setAllProblems(problemsData.problems as Problem[]);
    setHintRevealed(false);
    setSubmissionResult(null);
  }, [problemId, setCurrentCode, setSubmissionResult]);

  // Load progress
  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then((data) => setProgress(data.progress || {}))
      .catch(() => {});
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setHasAttempted(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: problem.id, code: currentCode }),
      });
      const result = await res.json();
      setSubmissionResult(result);
      // Refresh progress
      const progRes = await fetch('/api/progress');
      const progData = await progRes.json();
      setProgress(progData.progress || {});
    } catch (err) {
      setSubmissionResult({
        passed: 0,
        total: 0,
        allPassed: false,
        results: [],
        totalTimeMs: 0,
        error: 'Submission failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, currentCode, setIsSubmitting, setSubmissionResult]);

  const handleRun = useCallback(async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setHasAttempted(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: problem.id, code: currentCode }),
      });
      const result = await res.json();
      setSubmissionResult(result);
    } catch {
      setSubmissionResult({
        passed: 0,
        total: 0,
        allPassed: false,
        results: [],
        totalTimeMs: 0,
        error: 'Run failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, currentCode, setIsSubmitting, setSubmissionResult]);

  if (!problem) {
    return (
      <div className="flex h-screen">
        <div className="w-1/4 border-r bg-gray-50 dark:bg-gray-900" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Problem not found</p>
        </div>
        <div className="w-[35%] border-l" />
      </div>
    );
  }

  const difficulty = problem.difficulty as 'Easy' | 'Medium' | 'Hard';
  const diffKey = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left sidebar: problem list */}
      <div className="w-[25%] min-w-[220px] max-w-[320px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Problems</h2>
        </div>
        <ProblemDetailNav problems={allProblems} progress={progress} />
      </div>

      {/* Center panel: description */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{problem.title}</h1>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded text-xs font-semibold',
                  DIFFICULTY_STYLES[difficulty]
                )}
              >
                {difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
              {problem.functionName}
            </p>
          </div>

          {/* Hint */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden">
            <button
              onClick={() => hasAttempted && setHintRevealed(!hintRevealed)}
              disabled={!hasAttempted}
              className={cn(
                'w-full px-4 py-3 flex items-center gap-2 text-left transition-colors',
                hasAttempted
                  ? 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30 cursor-pointer'
                  : 'cursor-not-allowed opacity-60'
              )}
            >
              <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {hasAttempted ? (hintRevealed ? 'Hide Hint' : 'Show Hint') : 'Submit to Reveal Hint'}
              </span>
              {hasAttempted && (
                hintRevealed ? (
                  <ChevronDown className="w-4 h-4 text-yellow-600 dark:text-yellow-400 ml-auto" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-yellow-600 dark:text-yellow-400 ml-auto" />
                )
              )}
            </button>
            {hintRevealed && hasAttempted && (
              <div className="px-4 pb-4 border-t border-yellow-200 dark:border-yellow-800 pt-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {problem.hint}
                </p>
              </div>
            )}
          </div>

          {/* Examples from tests */}
          {problem.tests && problem.tests.length > 0 && (
            <div>
              <button
                onClick={() => setExamplesExpanded(!examplesExpanded)}
                className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                {examplesExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <h2 className="text-base font-semibold">Examples</h2>
              </button>
              {examplesExpanded && (
                <div className="space-y-3">
                  {problem.tests.map((test: Test, i: number) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Test {i + 1}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                          {test.name}
                        </span>
                      </div>
                      <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap break-all">
                        {test.code.trim()}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: editor + submit */}
      <div className="w-[35%] min-w-[300px] max-w-[480px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col flex-shrink-0">
        {/* Editor area */}
        <div className="flex-1 min-h-0">
          <CodeEditor
            value={currentCode}
            onChange={setCurrentCode}
            language="python"
            height="100%"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={handleRun}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 justify-center"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Submission results */}
        {submissionResult && (
          <div className="border-t border-gray-200 dark:border-gray-800 max-h-[300px] overflow-y-auto">
            <SubmissionResults
              results={submissionResult.results || []}
              totalTimeMs={submissionResult.totalTimeMs || 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
