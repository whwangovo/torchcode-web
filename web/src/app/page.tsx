import { Code, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ProblemList } from '@/components/ProblemList';
import problemsData from '@/lib/problems.json';
import { Problem } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getProgress() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/progress`, {
      cache: 'no-store',
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data.progress || {};
  } catch {
    return {};
  }
}

export default async function Home() {
  const problems = problemsData.problems as Problem[];
  const progress = await getProgress();

  const solvedCount = Object.values(progress).filter((p: any) => p.status === 'solved').length;

  return (
    <main className="container mx-auto p-0">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center py-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <Code className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">TorchCode</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          PyTorch coding challenges with automated grading
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>
            <span className="font-semibold text-gray-900 dark:text-white">{solvedCount}</span>
            <span className="mx-1">/</span>
            <span>{problems.length}</span>
            <span className="ml-1">problems solved</span>
          </span>
        </div>
        <Link
          href="/problems"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Problems
        </Link>
      </div>

      {/* Problem list */}
      <div className="py-8 px-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Problems</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="h-[600px]">
              <ProblemList problems={problems} progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
