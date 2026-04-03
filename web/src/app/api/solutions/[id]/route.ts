import { NextResponse } from 'next/server';

const GRADING_URL = process.env.GRADING_SERVICE_URL ?? 'http://localhost:8000';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${GRADING_URL}/tasks/${id}/notebook`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
  }
}
