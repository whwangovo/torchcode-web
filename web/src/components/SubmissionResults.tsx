'use client';

import { useState } from 'react';

export interface TestResult {
  name: string;
  passed: boolean;
  execTimeMs: number;
  error?: string;
}

interface SubmissionResultsProps {
  results: TestResult[];
  totalTimeMs: number;
}

export function SubmissionResults({ results, totalTimeMs }: SubmissionResultsProps) {
  const [isCollapsed, setIsCollapsed] = useState(results.length > 5);

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Results
          </h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isCollapsed ? 'Show details' : 'Hide details'}
          </button>
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            <span className={passedCount === totalCount ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-900 dark:text-white'}>
              {passedCount}/{totalCount}
            </span>{' '}
            tests passed
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            Total: {totalTimeMs.toFixed(2)}ms
          </span>
        </div>
      </div>

      {!isCollapsed && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 flex items-start gap-3"
            >
              <span className="flex-shrink-0 text-lg">
                {result.passed ? (
                  <span className="text-green-500">&#10003;</span>
                ) : (
                  <span className="text-red-500">&#10007;</span>
                )}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {result.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {result.execTimeMs.toFixed(2)}ms
                  </span>
                </div>

                {result.error && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 break-all">
                    {result.error}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
