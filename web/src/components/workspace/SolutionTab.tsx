'use client';

import { useEffect, useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { useLocale } from '@/context/LocaleContext';

interface SolutionTabProps {
  problemId: string;
}

export function SolutionTab({ problemId }: SolutionTabProps) {
  const [cells, setCells] = useState<{ type: string; source: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    fetch(`/api/solutions/${problemId}`)
      .then((r) => r.json())
      .then((data) => setCells(data.cells || []))
      .catch(() => setCells([]))
      .finally(() => setLoading(false));
  }, [problemId]);

  if (loading) {
    return <div className="p-6 text-sm text-text-tertiary">{t('loadingSolution')}</div>;
  }

  if (cells.length === 0) {
    return <div className="p-6 text-sm text-text-tertiary">{t('noSolution')}</div>;
  }

  const code = cells
    .filter((c) => c.type === 'code')
    .map((c) => c.source)
    .join('\n\n');

  return (
    <div className="h-full">
      <CodeEditor value={code} onChange={() => {}} readOnly />
    </div>
  );
}
