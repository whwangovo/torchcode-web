import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Code, BookOpen } from 'lucide-react';
import { parseNotebook, notebookToCode } from '@/lib/parseNotebook';
import { CodeEditor } from '@/components/CodeEditor';

interface SolutionPageProps {
  params: Promise<{ id: string }>;
}

async function findNotebook(id: string): Promise<string | null> {
  const paddedId = id.padStart(2, '0');
  const solutionsDir = join(process.cwd(), '..', '..', 'solutions');

  try {
    const files = await readdir(solutionsDir);
    const match = files.find(
      (f) => f.startsWith(`${paddedId}_`) && f.endsWith('_solution.ipynb')
    );
    if (match) {
      return join(solutionsDir, match);
    }
  } catch {
    return null;
  }

  return null;
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { id } = await params;

  const notebookPath = await findNotebook(id);

  if (!notebookPath) {
    notFound();
  }

  const notebookContent = await readFile(notebookPath, 'utf-8');
  const parsed = parseNotebook(notebookContent);
  const code = notebookToCode(notebookContent);

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/problems"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Code className="w-4 h-4" />
            <span>{id.padStart(2, '0')}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold">{parsed.title}</h1>
          </div>
          {parsed.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {parsed.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Reference Solution
            </h2>
            <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
              <CodeEditor
                value={code}
                onChange={() => {}}
                language="python"
                readOnly={true}
                height="500px"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Solution Walkthrough</h2>
            <div className="space-y-4">
              {parsed.cells
                .filter((cell) => cell.type === 'markdown')
                .map((cell, index) => (
                  <div
                    key={index}
                    className="prose dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: cell.source
                          .replace(/^#\s+(.+)$/gm, '<h2>$1</h2>')
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\$\$(.+?)\$\$/gs, '<div class="math">$1</div>')
                          .replace(/\$([^$]+)\$/g, '<span class="math">$1</span>')
                          .replace(/`([^`]+)`/g, '<code>$1</code>')
                          .replace(/\[([^\]]+)\]\([^)]+\)/g, '<a href="$2">$1</a>'),
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const solutionsDir = join(process.cwd(), '..', '..', 'solutions');

  try {
    const files = await readdir(solutionsDir);
    return files
      .filter((f) => f.endsWith('_solution.ipynb'))
      .map((file) => {
        const id = file.match(/^(\d+)_/)?.[1] || '';
        return { id };
      })
      .filter((params) => params.id);
  } catch {
    return [];
  }
}
