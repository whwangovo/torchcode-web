import { NextResponse } from 'next/server';
import problems from '@/lib/problems.json';
import starters from '@/lib/starters.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const problem = problems.problems.find((p) => p.id === params.id);
  if (!problem) {
    return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
  }
  const startersMap = starters as Record<string, string>;
  const starter = startersMap[params.id] || `def ${problem.functionName}(...):\n    pass`;
  return NextResponse.json({ ...problem, starterCode: starter });
}
