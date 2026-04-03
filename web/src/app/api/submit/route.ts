import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GRADING_SERVICE_URL } from '@/lib/constants';
import { getOrCreateUser, saveProgress } from '@/lib/db';
import { SubmissionResult } from '@/lib/types';

export async function POST(request: Request) {
  const { taskId, code } = await request.json();

  // Get or create user session
  const cookieStore = await cookies();
  let sessionToken = cookieStore.get('session_token')?.value;
  if (!sessionToken) {
    sessionToken = crypto.randomUUID();
  }
  const userId = getOrCreateUser(sessionToken);

  // Call grading service
  const gradingResponse = await fetch(`${GRADING_SERVICE_URL}/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, code }),
  });

  if (!gradingResponse.ok) {
    const errText = await gradingResponse.text();
    return NextResponse.json(
      { passed: 0, total: 0, allPassed: false, results: [], totalTimeMs: 0, error: errText },
      { status: 502 }
    );
  }

  const result: SubmissionResult = await gradingResponse.json();

  // Update progress
  const status = result.allPassed ? 'solved' : 'attempted';
  saveProgress(userId, taskId, status, result.totalTimeMs);

  // Set session cookie
  const response = NextResponse.json(result);
  response.cookies.set('session_token', sessionToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
