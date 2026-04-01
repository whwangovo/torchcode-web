'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import { Problem, ProgressMap } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProblemDetailNavProps {
  problems: Problem[];
  progress?: ProgressMap;
}

const difficultyStyles = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusIcons = {
  solved: CheckCircle,
  attempted: Clock,
  todo: Circle,
};

const statusStyles = {
  solved: 'text-green-600',
  attempted: 'text-yellow-500',
  todo: 'text-gray-400',
};

export function ProblemDetailNav({ problems, progress }: ProblemDetailNavProps) {
  const pathname = usePathname();
  const currentId = pathname.split('/').pop();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {['Easy', 'Medium', 'Hard'].map((difficulty) => {
          const group = problems.filter((p) => p.difficulty === difficulty);
          if (group.length === 0) return null;

          return (
            <div key={difficulty}>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {difficulty}
                </h3>
              </div>
              {group.map((problem, idx) => {
                const status = progress?.[problem.id]?.status ?? 'todo';
                const StatusIcon = statusIcons[status];
                const diffKey = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
                const isActive = problem.id === currentId;

                return (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 transition-colors text-sm',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    )}
                  >
                    <StatusIcon className={cn('w-4 h-4 flex-shrink-0', statusStyles[status])} />
                    <span
                      className={cn(
                        'flex-1 truncate',
                        isActive
                          ? 'font-medium text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                    >
                      {problem.title}
                    </span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0',
                        difficultyStyles[diffKey]
                      )}
                    >
                      {difficulty}
                    </span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
