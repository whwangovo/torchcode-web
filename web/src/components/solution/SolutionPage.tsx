'use client';

import { useEffect, useState } from 'react';
import { CodeEditor } from '@/components/workspace/CodeEditor';

interface SolutionPageProps {
  problemId: string;
}

interface Cell {
  type: 'code' | 'markdown';
  source: string;
}

export function SolutionPageContent({ problemId }: SolutionPageProps) {
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/solutions/${problemId}`)
      .then((r) => r.json())
      .then((data) => setCells(data.cells || []))
      .catch(() => setCells([]))
      .finally(() => setLoading(false));
  }, [problemId]);

  if (loading) {
    return <p className="text-sm text-text-tertiary p-6">Loading solution...</p>;
  }

  if (cells.length === 0) {
    return <p className="text-sm text-text-tertiary p-6">No solution available yet.</p>;
  }

  const codeCells = cells.filter((c) => c.type === 'code');
  const markdownCells = cells.filter((c) => c.type === 'markdown');
  const code = codeCells.map((c) => c.source).join('\n\n');

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      <div className="rounded-xl border border-border overflow-hidden">
        <CodeEditor value={code} onChange={() => {}} readOnly />
      </div>
      <div className="overflow-auto space-y-4">
        {markdownCells.map((cell, i) => (
          <div key={i} className="p-4 rounded-xl bg-surface-secondary border border-border/50">
            <pre className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
              {cell.source}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
