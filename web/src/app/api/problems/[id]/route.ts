import { NextResponse } from 'next/server';
import problems from '@/lib/problems.json';
import starters from '@/lib/starters.json';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const problem = problems.problems.find((p) => p.id === id);
  if (!problem) {
    return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
  }
  const startersMap = starters as Record<string, string>;
  const starter = startersMap[id] || `def ${problem.functionName}(...):\n    pass`;
  return NextResponse.json({ ...problem, starterCode: starter });
}
