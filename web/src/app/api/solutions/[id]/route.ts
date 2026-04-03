import { NextResponse } from 'next/server';

const GRADING_URL = process.env.GRADING_SERVICE_URL ?? 'http://localhost:8000';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${GRADING_URL}/tasks/${params.id}/solution`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }
    const { solution } = await res.json();
    return NextResponse.json({
      cells: [{ type: 'code', source: solution }],
    });
  } catch {
    return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
  }
}
