import { ProblemList } from '@/components/ProblemList';
import { Navigation } from '@/components/Navigation';
import problemsData from '@/lib/problems.json';
import { Problem, ProgressMap } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getProgress(): Promise<ProgressMap> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/progress`, { cache: 'no-store' });
    if (!res.ok) return {};
    const data = await res.json();
    return data.progress || {};
  } catch {
    return {};
  }
}

export default async function ProblemsPage() {
  const problems = problemsData.problems as Problem[];
  const progress = await getProgress();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation progress={progress} totalProblems={problems.length} />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Problems</h1>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="h-[calc(100vh-200px)] min-h-[400px]">
              <ProblemList problems={problems} progress={progress} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
